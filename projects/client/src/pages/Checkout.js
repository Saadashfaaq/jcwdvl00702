import React from "react";
import { Container } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../assets/styles/checkout.css";
import { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";

export default function Checkout() {
  const history = useHistory();
  const { id, orderId } = useParams();

  const [state, setState] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [order, setOrder] = useState([]);

  // mengambil cart dan product
  const cartProduct = () => {
    Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/cart/get-cart-product/${id}`
    )
      .then((result) => {
        setState(result.data);
        console.log("ini cart-product data", result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // mengambil total harga pada cart
  const getTotalPrice = () => {
    Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/cart/get-total-price/${id}`
    )
      .then((result) => {
        setTotalPrice(result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

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

  // product detail
  const shippingHandler = (id) => {
    history.push(`/address-list/${id}`);
  };

  const updateTotalPay = () => {
    const data = {
      total_price: totalPrice + order.shipping_price,
    };
    Axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/order/final-payment/${id}`,
      data
    ).then((res) => {
      console.log(res.data);
    });
  };

  // product detail
  const paymentHandler = (id) => {
    updateTotalPay();
    history.push(`/payment/${id}/${order.id}`);
  };

  useEffect(() => {
    cartProduct();
    getTotalPrice();
    getOrder();
  }, []);

  const checkoutList = () => {
    return state.map((val) => {
      return (
        <div className="card-main">
          <div className="card-image">
            <img
              src={val.product.picture}
              className="card-product"
              alt="Product Image"
            />
          </div>
          <div className="card-detail">
            <div className="card-detail-name">{val.product.name}</div>
            <div className="card-detail-subname">
              {val.product.product_detail}
            </div>
            <div className="card-detail-bottom">
              <div className="card-detail-bottom-price">
                Rp {val.product.price}
              </div>
              <div className="card-detail-bottom-qty">Qty: {val.quantity}</div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Container maxWidth="xs">
        <div className="checkoutPage">
          <div className="backPage">
            <ArrowBackIcon /> Checkout
          </div>
          <hr className="pembatas"></hr>
          <div className="shippingTitle">Shipping Address</div>
          <button className="optionBtn" onClick={() => shippingHandler(id)}>
            <LocationOnIcon />
            {order.shipping_address ? (
              <span className="optionBtnText">{order.shipping_address}</span>
            ) : (
              <span className="optionBtnText">Choose Address</span>
            )}
            <EditIcon />
          </button>
          <div className="orderTitle">Order List</div>
          <div className="orderBox">{checkoutList()}</div>
          <div className="chooseShipp">Choose Shipping Type</div>
          <button className="optionBtn">
            <LocalShippingIcon />
            {order.shipping_courier ? (
              <span className="optionBtnText">{order.shipping_courier}</span>
            ) : (
              <span className="optionBtnText">Choose Shipping</span>
            )}
            <ArrowForwardIosIcon />
          </button>
          <div className="dataBox">
            <div className="dataBox-content">
              <div className="dataBox-text">Amount</div>
              <div className="dataBox-price">Rp {totalPrice} </div>
            </div>
            <div className="dataBox-content">
              <div className="dataBox-text">Shipping</div>
              <div className="dataBox-price">Rp {order.shipping_price}</div>
            </div>
            <hr className="pembatas" />
            <div className="dataBox-content">
              <div ClassName="dataBox-text">Total</div>
              <div ClassName="dataBox-price">
                Rp {totalPrice + order.shipping_price}
              </div>
            </div>
          </div>
          <button class="btn-lp" onClick={() => paymentHandler(id)}>
            Continue Payment
          </button>
        </div>
      </Container>
    </>
  );
}
