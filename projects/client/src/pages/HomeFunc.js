import "../assets/styles/HomePage.css";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link, useHistory } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "../assets/styles/ProductLists.css";
import { Tooltip, Menu, MenuItem, Button, Container } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useState, useEffect } from "react";
import { firebaseAuthentication } from "../config/firebase";
import { Login } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actionCreators/authActionCreators";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Axios from "axios";

export default function HomeFunc() {
  const [productShow, setProductShow] = useState([]);
  const [page,setPage]=useState(1)
  const [maxPage,setMaxPage]=useState(0)
  const [itemsPerPage,setItemsPerPage]=useState(2)
  const dispatch = useDispatch();
  let history = useHistory();
  const verifiedCheck = firebaseAuthentication.currentUser?.emailVerified

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;

  const verifyCheck=()=>{
    if(isLoggedIn){
      if(!verifiedCheck){
        return <div className="font-name2">Please Verify Your Account</div>
      }
    }
  }

  const handleLogout = () => {
    firebaseAuthentication
      .signOut()
      .then(() => {
        dispatch(logoutUser());
        return false;
      })
      .catch((error) => {
        alert(error);
      });
  };

  const detailHandler = (id) => {
    history.push(`/product-detail/${id}`);
  };

  const slideCarousels = [
    {
      url: "https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg",
    },
    {
      url: "https://media.timeout.com/images/105240237/image.jpg",
    },
  ];

  const showProducts = () => {
    Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/product/home-product`
    ).then((res) => {
      let homeProducts = res.data;
      setProductShow(homeProducts);
      const newMaxPage = Math.ceil(homeProducts.length/itemsPerPage)
      setMaxPage(newMaxPage)
    });
  };

  const nextPageHandler=()=>{
    if(page<maxPage){
      setPage(page+1)
    }
  }

  const prevPageHandler=()=>{
    if(page>1){
      setPage(page-1)
    }
  }

  const cartBtnHandler = (id) => {
    if (id) {
      history.push(`/cart/${id}`);
    } else {
      alert("Mohon Login Untuk Melihat Cart Anda");
    }
  };

  useEffect(() => {
    // getUser()
    showProducts()
  }, []);

  const renderProducts=()=>{
    const beginningIndex = (page-1)*itemsPerPage
    const slicedData = productShow.slice(beginningIndex,beginningIndex+itemsPerPage)

    return slicedData.map(val=>{
      return(
        <div>
          <button onClick={() => detailHandler(val.id)}>
            <div className="product-list">
              <img src={val.picture} />
              <div>{val.name}</div>
              <div>IDR {val.price}</div>
            </div>
          </button>
        </div>
      )
    })
  }

  return (
    <>
      <Container maxWidth="xs" className="mobile">
        <div className="homepage">
          <div className="homepage-top">
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <button
                    className="account-button"
                    variant="contained"
                    {...bindTrigger(popupState)}
                  >
                    <Avatar>
                      <AccountBoxIcon />
                    </Avatar>
                  </button>
                  {isLoggedIn ? (
                    <>
                      <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={popupState.close}>
                          <Link
                            to={`/profile/${userUID}`}
                            className="profile-btn"
                          >
                            <div className="profile-wrapper">
                              <div>
                                <AccountBoxIcon />
                              </div>
                              <div>Profile</div>
                            </div>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={popupState.close}>
                          <Link
                            to={`/address-list/${userUID}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <HomeOutlinedIcon />
                            Address
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={popupState.close}>
                          <Link
                            to={`/my-order/${userUID}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <ShoppingBagOutlinedIcon />
                            Order List
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={popupState.close}>
                          <button className="logout-btn" onClick={handleLogout}>
                            <div className="logout-wrapper">
                              <div>
                                <LogoutIcon />
                              </div>
                              <div>Sign Out</div>
                            </div>
                          </button>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : null}
                </React.Fragment>
              )}
            </PopupState>

            <div className="name-bar">
              <div className="font-size">Welcome</div>
              <div className="font-name">
                {isLoggedIn ? `${user?.fullname}` : "Guest"}
              </div>
              {verifyCheck()}
            </div>
            <div className="cart-icon">
              {isLoggedIn ? null : <div className="login-text">Login</div>}
              <Link
                to="/sign-in"
                onClick={isLoggedIn ? (event) => event.preventDefault() : null}
              >
                <button className="home-button-login" disabled={isLoggedIn}>
                  <Login />
                </button>
              </Link>
              <IconButton>
                <NotificationsOutlinedIcon />
              </IconButton>
              <IconButton disabled={!verifiedCheck || !user} onClick={() => cartBtnHandler(userUID)}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </div>
          </div>
          <div className="search-bar-detail">
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "Search" }}
              className="search-bar"
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </div>
          <div className="slide-container">
            <Slide>
              {slideCarousels.map((slideCarousel, index) => (
                <div className="each-slide" key={index}>
                  <img src={slideCarousel.url} className="carousel-image" />
                </div>
              ))}
            </Slide>
          </div>
          {/* <div className="button-category">
            <div className="button-category2">
              <button className="button-categories">
                <SportsSoccerOutlinedIcon />
              </button>
              <div>Sports</div>
            </div>
            <div className="button-category2">
              <button className="button-categories">
                <BusinessCenterOutlinedIcon />
              </button>
              <div>Bags</div>
            </div>
            <div className="button-category2">
              <button className="button-categories">
                <DirectionsBikeOutlinedIcon />
              </button>
              <div>Bikes</div>
            </div>
            <div className="button-category2">
              <button className="button-categories">
                <HikingOutlinedIcon />
              </button>
              <div>Sportswear</div>
            </div>
            <div className="button-category2">
              <button className="button-categories">
                <HandymanOutlinedIcon />
              </button>
              <div>Accessories</div>
            </div>
          </div> */}
          {/* <div className="app-name">LE SPORTY ! Good Gears Equal Healthy Body !</div> */}
          <div className="product-card">
            {renderProducts()}
          </div>
          <div className='pagination-wrapper'>
              <button className='button-page' onClick={prevPageHandler}>
                {"<"}
              </button>
              <div className='page-numbering'>{page} of {maxPage}</div>
              <button className='button-page' onClick={nextPageHandler}>
                {">"}
              </button>
          </div>
        </div>
      </Container>
    </>
  );
}
