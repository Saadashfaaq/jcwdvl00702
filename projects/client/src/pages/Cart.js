import React from "react";
import { Container } from "@mui/material";
import { Button, ButtonGroup } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import "../assets/styles/cart.css";
import { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const history = useHistory();
  const { id } = useParams();
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));

  const [state, setState] = useState([]);
  const [orderState, setOrderState] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/get-order/${id}`)
      .then((result) => {
        setOrderState(result.data);
        console.log("ini get order", result.data);
      })
      .catch(() => {
        // alert("Terjadi kesalahan di server");
      });
  };

  // delete button handler
  const deleteBtnHandler = (productId) => {
    const confirmDelete = window.confirm("Delete Product?");
    if (confirmDelete) {
      Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart/delete-cart-customer/${productId}`)
        .then(() => {
          cartProduct();
          getTotalPrice();
        })
        .catch(() => {
          alert("Server Error!");
        });
    } else {
      alert("Cancel Delete Product");
    }
  };

  // setting qty product yg akan diambil

  const addQtyHandler = (val) => {
    console.log("ini val", val);
    const data = {
      customer_uid: id,
      action: "add",
    };
    if (val.quantity === val.product.quantity) {
      alert(`Stock Hanya tersedia ${val.product.quantity}`);
    } else {
      Axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/cart/edit-qty/${val.id}`,
        data
      )
        .then(() => {
          cartProduct();
          getTotalPrice();
        })
        .catch((error) => {
          alert("Server Error");
        });
    }
  };
  const minQtyHandler = (val) => {
    const data = {
      customer_uid: id,
      action: "min",
    };
    if (val.quantity < 1) {
      const confirmDelete = window.confirm("Delete Product?");
      if (confirmDelete) {
        Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart/delete-cart-customer/${val.id}`)
          .then(() => {
            cartProduct();
            getTotalPrice();
          })
          .catch(() => {
            alert("Server Error!");
          });
      } else {
        alert("Cancel Delete Product");
      }
    } else {
      Axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/cart/edit-qty/${val.id}`,
        data
      )
        .then(() => {
          cartProduct();
          getTotalPrice();
        })
        .catch((error) => {
          alert("Nama Sudah Terpakai Atau Server Error");
        });
    }
  };

  // checkout
  const checkoutHandler = (id) => {
    const data = {
      customer_uid: id,
      fullname: user.fullname,
    };
    console.log("ini data", data);

    if (!orderState) {
      Axios.post(`${process.env.REACT_APP_API_BASE_URL}/order/add-order`, data)
        .then((result) => {
          console.log("ini result", result);
          setOrderId(result.data);
          history.push(`/checkout/${id}/${orderId.id}`);
        })
        .catch((error) => {
          alert(error);
        });
    } else if (orderState) {
      history.push(`/checkout/${id}/${orderState.id}`);
    }
  };

  useEffect(() => {
    cartProduct();
    getTotalPrice();
    getOrder();
  }, []);

  const cartList = () => {
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
            <div className="card-detail-title">
              <div className="card-detail-name">{val.product.name}</div>
              <IconButton onClick={() => deleteBtnHandler(val.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
            <div className="card-detail-subname">
              {val.product.product_detail}
            </div>
            <div className="card-detail-bottom">
              <div className="card-detail-bottom-price">
                Rp. {val.product.price}
              </div>
              {/* <div className="card-detail-bottom-qty">{val.quantity} pcs on Cart</div> */}
            </div>
            <ButtonGroup className="card-button">
              <Button
                onClick={() => minQtyHandler(val)}
                className="card-button-list"
                sx={{
                  borderRadius: "20px",
                  fontSize: "15px",
                  backgroundColor: "gray",
                  border: "none",
                  fontWeight: "900",
                  color: "black",
                }}
              >
                -
              </Button>
              <Button
                className="card-button-list"
                sx={{
                  borderRadius: "20px",
                  fontSize: "15px",
                  backgroundColor: "gray",
                  border: "none",
                  fontWeight: "700",
                  color: "black",
                }}
              >
                {val.quantity}
              </Button>
              <Button
                onClick={() => addQtyHandler(val)}
                className="card-button-list"
                sx={{
                  borderRadius: "20px",
                  fontSize: "15px",
                  backgroundColor: "gray",
                  border: "none",
                  fontWeight: "900",
                  color: "black",
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Container maxWidth="xs">
        <div className="cartPage">
          <div className="backPage">
            <ShoppingCart /> Cart
          </div>
          <hr className="pembatas"></hr>
          <div className="cartBox">{cartList()}</div>
          <div className="footer">
            <div className="priceContainer">
              <div className="priceTitle">Total Price</div>
              <div className="totalPrice">Rp. {totalPrice}</div>
            </div>
            <div className="checkoutBtn" onClick={() => checkoutHandler(id)}>
              Checkout
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
