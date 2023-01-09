import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Tab,
  Button,
  Container,
  Menu,
  MenuItem,
  InputBase,
  InputAdornment,
  ClickAwayListener,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Search,
  SortTwoTone,
  MoreHoriz,
  ContentPaste,
} from "@mui/icons-material";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "../../assets/styles/OrderList.css";
import Axios from "axios";

function OrderList() {
  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(user);
  const userData = user?.role;
  console.log(userData);

  const [activeTab, setActiveTab] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const [isSearch, setIsSearch] = useState(false);
  const [openC, setOpenC] = useState(false);
  // state = {
  //   isOnGoing: true,
  //   isCompleted: false,
  //   value: '1',
  //   isOrderComplete: true,
  //   isOrderOg: false,
  //   status: '',
  //   isSearch: false,
  //   isAdmin: true,
  //   setOpenC: false,
  // };

  const handleChange = () => {
    setActiveTab();
  };

  useEffect(() => {
    const getOrderList = async () => {
      const response = await Axios.get(
        `http://localhost:3300/api/order/get-order-cart-product`
      );
      console.log(response.data);
      setOrderDetails(response.data);
    };
    getOrderList();
  }, []);

  const isSearchHandle = () => {
    setIsSearch(true);
  };

  const isSearchHandleClose = () => {
    setIsSearch(false);
  };

  const handleCloseCancel = () => {
    setOpenC(false);
  };

  const handleClickOpenCancel = () => {
    setOpenC(true);
  };

  // handleChange = (event, value) => {
  //   this.setState({ ...this.state, value });
  // };

  // isSearchHandle = () => {
  //   this.setState({ ...this.state, isSearch: true });
  // };

  // isSearchHandleClose = () => {
  //   this.setState({ ...this.state, isSearch: false });
  // };

  // handleCloseCancel = () => {
  //   this.setState({ ...this.state, setOpenC: false });
  // };

  // handleClickOpenCancel = () => {
  //   this.setState({ ...this.state, setOpenC: true });
  // };

  const olistcDetailStatus = (status) => {
    if (status === "1") {
      return (
        <Box
          className="moc-detail-status-1"
          sx={{ backgroundColor: "rgb(255,165,0,0.4)" }}
        >
          Waiting for payment
        </Box>
      );
    } else if (status === "2") {
      return (
        <Box
          className="moc-detail-status-2"
          sx={{ backgroundColor: "rgb(255,215,0,0.4)" }}
        >
          Payment confirmation
        </Box>
      );
    } else if (status === "3") {
      return (
        <Box
          className="moc-detail-status-3"
          sx={{ backgroundColor: "rgb(152,251,152,0.4)" }}
        >
          In process
        </Box>
      );
    } else if (status === "4") {
      return (
        <Box
          className="moc-detail-status-4"
          sx={{ backgroundColor: "rgba(127, 255, 212, 0.4)" }}
        >
          In delivery
        </Box>
      );
    } else if (status === "5") {
      return (
        <Box
          className="moc-detail-status-5"
          sx={{ backgroundColor: "rgb(72,209,204,0.4)" }}
        >
          Received
        </Box>
      );
    } else {
      return (
        <Box
          className="moc-detail-status-6"
          sx={{ backgroundColor: "rgb(220,20,60,0.4)" }}
        >
          Canceled
        </Box>
      );
    }
  };

  const menuHandler = () => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <button
              className="account-button"
              variant="contained"
              {...bindTrigger(popupState)}
            >
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem>
                <Link to="/dashboard" className="userlist-banner-menu-link">
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/user-list" className="userlist-banner-menu-link">
                  User List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/warehouse-management"
                  className="userlist-banner-menu-link"
                >
                  Warehouse Mng.
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-list"
                  className="userlist-banner-menu-link"
                >
                  Product List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-category"
                  className="userlist-banner-menu-link"
                >
                  Product Category
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/stock-mutation"
                  className="userlist-banner-menu-link"
                >
                  Stock Mutation
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/order-list" className="userlist-banner-menu-link">
                  Order List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/sales-report" className="userlist-banner-menu-link">
                  Sales Report
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-history" className="userlist-banner-menu-link">
                  Stock History
                </Link>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  };

  const orderListCard = (status) => {
    return (
      <>
        {/* {orderDetails?.map((orderDetail) => ( */}
        <>
          <div className="olistc-main">
            <div className="olistc-subdetail">
              <div className="olistc-detail-name">Order ID</div>
              <div className="olistc-detail-subname">Order Date</div>
              <div className="olistc-detail-subname">User ID</div>
              <div className="olistc-detail-subname">User</div>
              <div className="olistc-detail-subname">From</div>
              {olistcDetailStatus(status)}
            </div>
            <div className="olistc-detail">
              {/* {orderDetail.orderitems?.map((orderitem) => ( */}
              <>
                <div className="olistc-detail-name">
                  {orderDetails[0].orderitems[0].order_id}
                </div>
                <div className="olistc-detail-subname">
                  {orderDetails[0].orderitems[0].updatedAt}
                </div>
                <div className="olistc-detail-subname">
                  {orderDetails[0].customer_uid}
                </div>
                <div className="olistc-detail-subname">
                  {orderDetails[0].fullname}
                </div>
                <div className="olistc-detail-subname">
                  Warehouse {orderDetails[0].orderitems[0].warehouse_id}
                </div>
              </>
              <div className="olistc-detail-bottom">
                <Button
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "white",
                    color: "red",
                    fontSize: "8px",
                    fontFamily: "Lora",
                  }}
                  variant="contained"
                  onClick={handleClickOpenCancel}
                  className="olistc-detail-bottom-track"
                >
                  Cancel
                </Button>
                <Dialog
                  open={openC}
                  onClose={handleCloseCancel}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Cancel this order"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure ?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseCancel}>No</Button>
                    <Button onClick={handleCloseCancel} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
                <Link
                  to={{
                    pathname: `/order-detail-admin/${orderDetails[0].customer_uid}`,
                    state: orderDetails[0].customer_uid,
                  }}
                >
                  <Button
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "black",
                      fontSize: "8px",
                      fontFamily: "Lora",
                    }}
                    variant="contained"
                    className="olistc-detail-bottom-track"
                  >
                    Detail
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      </>
    );
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
      <div className="orderlist-main">
        <div className="orderlist-banner">
          <div className="orderlist-banner-logo">
            <IconButton disabled>
              <ContentPaste />
            </IconButton>
          </div>

          {isSearch ? (
            <>
              <ClickAwayListener onClickAway={isSearchHandleClose}>
                <InputBase
                  sx={{ ml: 1, flex: 1, fontFamily: "Lora" }}
                  placeholder="Order ID"
                  inputProps={{ "aria-label": "Search" }}
                  className="orderlist-search"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </ClickAwayListener>
            </>
          ) : (
            <>
              <div className="orderlist-banner-text">Order List</div>
              <div className="orderlist-banner-search">
                <IconButton onClick={isSearchHandle}>
                  <Search />
                </IconButton>
              </div>
            </>
          )}

          <div className="orderlist-banner-sort">
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <button
                    className="account-button"
                    variant="contained"
                    {...bindTrigger(popupState)}
                  >
                    <IconButton>
                      <SortTwoTone />
                    </IconButton>
                  </button>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      onClick={popupState.close}
                      sx={{ fontFamily: "Lora" }}
                    >
                      <img src="https://img.icons8.com/fluency-systems-filled/22/null/sort-numeric-up.png" />
                      Oldest
                    </MenuItem>
                    <MenuItem
                      onClick={popupState.close}
                      sx={{ fontFamily: "Lora" }}
                    >
                      <img src="https://img.icons8.com/windows/24/null/sort-numeric-up-reversed.png" />
                      Recent
                    </MenuItem>
                    {userData === "admin" ? (
                      <>
                        <MenuItem>
                          <img src="https://img.icons8.com/ios/24/null/garage-closed.png" />
                          Warehouse A
                        </MenuItem>
                        <MenuItem>
                          <img src="https://img.icons8.com/ios/24/null/garage-closed.png" />
                          Warehouse B
                        </MenuItem>
                        <MenuItem>
                          <img src="https://img.icons8.com/ios/24/null/garage-closed.png" />
                          Warehouse C
                        </MenuItem>
                        {/* <MenuItem>
                            <div>{orderDetails[0]?.status}</div>
                          </MenuItem> */}
                      </>
                    ) : null}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </div>

          <div className="orderlist-banner-menu">{menuHandler()}</div>
        </div>

        <div className="orderlist-tab">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    sx={{ marginLeft: "20px", fontFamily: "Lora" }}
                    label="On Going"
                    value="1"
                  />
                  <Tab
                    sx={{ marginLeft: "100px", fontFamily: "Lora" }}
                    label="Completed"
                    value="2"
                  />
                </TabList>
              </Box>
              <>
                {orderDetails?.map((orderDetail) => (
                  <>
                    {orderDetail.status ? (
                      <TabPanel value="1">
                        <div className="orderlist-og">
                          <img
                            src="https://i.pinimg.com/originals/6f/df/bc/6fdfbc41d6a8e26d4b9073bc1afd899f.jpg"
                            className="orderlist-og-logo"
                            alt="No Order"
                          />
                          <div className="orderlist-og-text-1">
                            You don't have an order yet
                          </div>
                          <div className="orderlist-og-text-2">
                            You don't have On Going orders at this time
                          </div>
                        </div>
                      </TabPanel>
                    ) : (
                      <TabPanel>
                        {orderListCard()}

                        <Stack
                          spacing={1}
                          sx={{
                            position: "fixed",
                            top: "78%",
                            width: "110%",
                            fontFamily: "Lora",
                          }}
                        >
                          <Pagination count={10} />
                        </Stack>
                      </TabPanel>
                    )}
                  </>
                ))}
              </>
              <>
                {orderDetails?.map((orderDetail) => (
                  <>
                    {orderDetail.status ? (
                      <TabPanel value="2">
                        {orderListCard()}

                        <Stack
                          spacing={1}
                          sx={{
                            position: "fixed",
                            top: "78%",
                            width: "110%",
                            fontFamily: "Lora",
                          }}
                        >
                          <Pagination count={10} />
                        </Stack>
                      </TabPanel>
                    ) : (
                      <TabPanel value="2">
                        <div className="orderlist-og">
                          <img
                            src="https://i.pinimg.com/originals/6f/df/bc/6fdfbc41d6a8e26d4b9073bc1afd899f.jpg"
                            className="orderlist-og-logo"
                            alt="No Order"
                          />
                          <div className="orderlist-og-text-1">
                            You don't have an order yet
                          </div>
                          <div className="orderlist-og-text-2">
                            You don't have Completed orders at this time
                          </div>
                        </div>
                      </TabPanel>
                    )}
                  </>
                ))}
              </>
            </TabContext>
          </Box>
        </div>
      </div>
    </Container>
  );
}

export default OrderList;
