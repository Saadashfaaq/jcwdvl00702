import Axios from "axios";
import "../assets/styles/productDetail.css";
import { useState, useEffect, useContext } from "react";
import { ArrowBack, FavoriteBorder, StarHalf } from "@mui/icons-material";
import { Link, useParams, useHistory } from "react-router-dom";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetail() {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  console.log("ini user UID:", user?.customer_uid);

  const { id } = useParams();
  const history = useHistory();

  const [state, setState] = useState([]);
  const [cart, setCart] = useState([]);
  const [qtyProduct, setQtyProduct] = useState(0);

  // Mengambil data product berdasarkan ID dari backend
  const fetchProducts = () => {
    Axios.get(`http://localhost:3300/api/product/get-product/${id}`)
      .then((result) => {
        setState(result.data);
        console.log("ini result data", result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // setting qty product yg akan diambil

  const addQtyHandler = () => {
    setQtyProduct(qtyProduct + 1);
  };
  const minQtyHandler = () => {
    setQtyProduct(qtyProduct - 1);
  };

  // mengambil data untuk bikin kondisi add cart

  const getCart = () => {
    Axios.get(`http://localhost:3300/api/cart/get-cart/${user?.customer_uid}`)
      .then((result) => {
        setCart(result.data);
        console.log("ini result data", result.data);
      })
      .catch(() => {
        alert("Terjadi kesalahan di server");
      });
  };

  // mengirimkan data kedalam cart

  const addToCart = () => {
    // data yg akan dipakai dibackend
    const data = {
      customer_uid: user.customer_uid,
      fullname: user.fullname,
      product_id: id,
      quantity: qtyProduct,
    };

    // checkBox untuk mencari apakah product id sudah ada dalam cart
    let checkBox = false;
    // untuk mengambil data quantity product yg ada dalam cart
    let qtyProductCart = 0;

    for (let i = 0; i < cart.length; i++) {
      if (id === cart[i].product_id) {
        checkBox = true;
        qtyProductCart = cart[i].quantity;
        break;
      }
    }
    console.log("ini checkbox", checkBox);

    // kondisi untuk kirim ke backend //
    // jika kondisi checkbox false (tidak ada product ini dalam cart) maka akan membuat cart baru
    if (checkBox === false) {
      if (state.quantity < qtyProduct) {
        alert(`Maaf stock hanya tersedia ${state.quantity}`);
      } else {
        if (qtyProduct <= 0) {
          alert("Quantity tidak boleh 0 atau kurang");
        } else {
          Axios.post("http://localhost:3300/api/cart/add-to-cart", data)
            .then(() => {
              alert("Product Added!");
              history.push(`/product-list`);
            })
            .catch((error) => {
              alert("Server Error");
            });
        }
      }
      // jika kondisi checkbox true (product sudah ada dalam cart) maka hanya akan menambahkan qty saja
    } else if (checkBox === true) {
      if (state.quantity < qtyProduct + qtyProductCart) {
        alert(`Maaf stock hanya tersedia tersedia ${state.quantity}`);
      } else {
        if (qtyProduct <= 0) {
          alert("Quantity tidak boleh 0 atau kurang");
        } else {
          Axios.put(`http://localhost:3300/api/cart/edit-cart/${id}`, data)
            .then(() => {
              alert("Quantity Added");
              history.push(`/product-list`);
            })
            .catch((error) => {
              console.log(error);
              alert(error);
            });
        }
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="pd-wrap">

      {console.log(state, "render data")}

      <Container maxWidth="xs" className="container-product-detail">
        <div className="product-img">
          <Link to="/">
            <ArrowBack />
          </Link>

          <img className="detail-img" src={state.getProduct?.picture} />

        </div>
        <div className="product-spec">
          <div className="product-title">
            <div className="desc-1">
              <span className="desc-name">{state.getProduct?.name}</span>
              <span className="desc-icon">
                <FavoriteBorder />
              </span>
            </div>
            <div className="desc-2">
              <div className="desc-sold">5000 sold</div>
              <div className="desc-rating-icon">
                <StarHalf />
              </div>
              <div className="desc-score">4.7(2000 reviews)</div>
            </div>
          </div>
          <hr className="splitter" />
          <div className="product-desc">
            <div>
              <div className="desc">Description</div>
              <div className="desc-word">
                {state.getProduct?.product_detail}
              </div>
            </div>
            <div className="spec-select">
              <div className="spec-1">
                <div className="spec-size">Size</div>
                <div className="spec-selector">
                  <div>Current Stock :</div>
                  <div className="spec-size-select">
                    {state.getProduct?.quantity_total}
                  </div>
                </div>
              </div>
              <div className="spec-2">
                <div className="spec-color">Color</div>
                <div className="spec-selector">
                  <button
                    className="spec-color-select"
                    style={{ backgroundColor: "black" }}
                  ></button>
                  <button
                    className="spec-color-select"
                    style={{ backgroundColor: "gray" }}
                  ></button>
                  <button
                    className="spec-color-select"
                    style={{ backgroundColor: "brown" }}
                  ></button>
                </div>
              </div>
            </div>
            <div className="spec-qty">
              <div className="spec-qty-title">Quantity</div>
              {state.getProduct?.quantity_total == 0 ? (
                <div>Out of stock, please wait for our restock! </div>
              ) : (
                <div className="spec-qty-selector">
                  <span className="sub-qty-select" onClick={minQtyHandler}>
                    -
                  </span>
                  <span className="sub-qty">{qtyProduct}</span>
                  <span className="sub-qty-select" onClick={addQtyHandler}>
                    +
                  </span>
                </div>
              )}
            </div>
          </div>
          <hr className="splitter" />
          <div className="pay-segment">
            <div className="pricing">
              <div className="price-title">Total Price</div>
              <div className="price">{state.getProduct?.price}</div>
            </div>
            <div>
              <button
                disabled={state.getProduct?.quantity_total == 0}
                className="add-cart"
                onClick={addToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
