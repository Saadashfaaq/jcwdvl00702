import React, { useEffect, useState, useContext } from "react";
import { ArrowBack } from "@mui/icons-material";
import {
  Container,
  FormControl,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";

import Axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory} from "react-router-dom";
import "../assets/styles/payment.css";

function Payment() {
  const { id, orderId } = useParams();
  const history = useHistory();

  const [order, setOrder] = useState([]);
  const [picture, setPicture] = useState("");
  const [preview, setPreview] = useState("");
  const [bank, setBank] = useState();
  const [cartPrice, setCartPrice] = useState(0);
  const [cart, setCart] = useState([]);



  // mengambil data order
  const getOrder = () => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/get-order/${id}/`)
      .then((result) => {
        setOrder(result.data);
        console.log("ini order list:", result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // mengambil cart dan product
  const cartProduct = () => {
    Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/cart/get-cart-product/${id}`
    )
      .then((result) => {
        setCart(result.data);
        console.log("ini cart-product data", result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // mengambil total harga pada cart
  const getCartPrice = () => {
    Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/cart/get-total-price/${id}`
    )
      .then((result) => {
        setCartPrice(result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // setup picture
  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  // finish submit
  const uploadPicture = () => {
    if(!bank){
      alert("mohon pilih bank terlebih dahulu")
    } else {
      if(!picture){
        alert("mohon upload bukti pembayaran")
      } else {
        // Upload bukti pembayaran ke tabel order
    const data = new FormData();
    data.append("payment_picture", picture);

    console.log(data);
    Axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/order/payment-proof/${id}`,
      data
    )
      .then(() => {
        alert("Payment proof uploaded!");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    // Update orderitems ke tabel order items
    for (let i = 0; i < cart.length; i++) {
      const cartData = {
        order_id: order.id,
        product_id: cart[i].product_id,
        warehouse_id: order.warehouse_id,
        quantity: cart[i].quantity,
      };
      Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orderitem/add-orderitem`,
        cartData
      )
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));
    }

        // delete semua cart agar user bisa order kembali
        Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart/delete-all-cart/${id}`)
        .then(() => {
          history.push(`/`);
        })
        .catch(() => {
          alert("Server Error!");
        });
      }
    }
  };

  useEffect(() => {
    getOrder();
    getCartPrice();
    cartProduct();
  }, []);

  return (
    <Container maxWidth="xs" className="mobile">
      <div className="addwh-main">
        <div className="addwh-banner">
          <IconButton>
            <ArrowBack />
          </IconButton>
          <div className="addwh-banner-text">Payment</div>
        </div>
        <FormControl variant="standard" className="adduser-form-input">
          <TextField
            select
            label="BANK"
            id="select-city"
            helperText="Select BANK"
            onChange={(e) => setBank(e.target.value)}
            // value={}
          >
            <MenuItem key="BCA" value="BCA 014 1234567890">
              BCA
            </MenuItem>
            <MenuItem key="MANDIRI" value="MANDIRI 008 1234567890123">
              MANDIRI
            </MenuItem>
            <MenuItem key="BNI" value="BNI 009 1234567890">
              BNI
            </MenuItem>
            <MenuItem key="BRI" value="BRI 002 123456789012345">
              BRI
            </MenuItem>
          </TextField>
        </FormControl>
        <div className="addwh-avatar">
          <Button
            type="file"
            id="uploading"
            onChange=""
            variant="contained"
            component="label"
            sx={{ marginLeft: "0px", marginTop: "0px " }}
          >
            Upload
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={loadPicture}
            />
          </Button>
          {preview ? (
            <img className="addwh-avatar-photo" src={preview} alt="" />
          ) : (
            <img className="addwh-avatar-photo" src={picture} alt="" />
          )}
        </div>
        <div className="dataBox">
          <div className="dataBox-content">
            <div className="dataBox-text">Amount</div>
            <div className="dataBox-price">Rp {cartPrice} </div>
          </div>
          <div className="dataBox-content">
            <div className="dataBox-text">Shipping</div>
            <div className="dataBox-price">Rp {order.shipping_price}</div>
          </div>
          <hr className="pembatas" />
          <div className="dataBox-content">
            <div className="dataBox-text">Total</div>
            <div className="dataBox-price">Rp {order.total_price}</div>
          </div>
          <hr className="pembatas" />
          <div className="dataBox-content">
            <div className="dataBox-text-transfer">Transfer to</div>
            <div className="dataBox-bank"> {bank} an MWA </div>
          </div>
        </div>
        <div className="addwh-button">
          <button class="addwh-button-2" onClick={uploadPicture}>
            finish
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Payment;