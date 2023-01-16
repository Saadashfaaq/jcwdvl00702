import React from 'react';
import Axios from 'axios'
import { IconButton, Container, Avatar, Menu, MenuItem } from '@mui/material';
import {
  AccountBox,
  Logout,
  NotificationsOutlined,
  MoreHoriz,
  People,
  Warehouse,
  Ballot,
  Inventory,
  ContentPaste,
  ReceiptLong,
  ManageSearch,
  Sell,
} from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Link } from 'react-router-dom';
import '../../assets/styles/Dashboard.css';
import { logoutUser } from '../../redux/actionCreators/authActionCreators';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { firebaseAuthentication } from '../../config/firebase';

export default function Dashboard() {
  const dispatch = useDispatch();

  const [roleTest,setRoleTest]=useState()

  const { isLoggedIn, user } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
    }),
    shallowEqual
  );
  
  const userCheck=()=>{
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/profile/${user?.customer_uid}`)
    .then(res=>{
      console.log(res.data)
      setRoleTest(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    userCheck()
  },[])

  const handleLogout = () => {
    firebaseAuthentication
      .signOut()
      .then(() => {
        window.location.reload();
        dispatch(logoutUser());
        return false;
      })
      .catch((error) => {
        alert(error);
      });
  };

  const menuHandler = () => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <button className="account-button" variant="contained" {...bindTrigger(popupState)}>
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem>
                <Link to="/" className="userlist-banner-menu-link">
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/user-list" className="userlist-banner-menu-link">
                  User List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/warehouse-management" className="userlist-banner-menu-link">
                  Warehouse Mng.
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/products-management-list" className="userlist-banner-menu-link">
                  Product List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/products-management-category" className="userlist-banner-menu-link">
                  Product Category
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-mutation" className="userlist-banner-menu-link">
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

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      <div className="dashboard-main">
        <div className="dashboard-top">
          <div className="dashboard-top-avatar">
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <button className="account-button" variant="contained" {...bindTrigger(popupState)}>
                    <IconButton>
                      <Avatar>
                        <AccountBox />
                      </Avatar>
                    </IconButton>
                  </button>
                  <Menu {...bindMenu(popupState)}>
                    {/* <MenuItem onClick={popupState.close}>
                      <AccountBox />
                      Profile
                    </MenuItem> */}
                    <MenuItem onClick={popupState.close}>
                    <button className="logout-btn" onClick={handleLogout}>
                            <div className="logout-wrapper">
                              <div>
                                <Logout />
                              </div>
                              <div>Sign Out</div>
                            </div>
                          </button>
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </div>
          <div className="dashboard-top-text">
            {/* <div className="dashboard-top-text-1">{isLoggedIn ? user?.approle.role : 'Restricted'}</div> */}
            <div className="dashboard-top-text-1">{isLoggedIn ? roleTest?.approle?.role : 'Restricted'}</div>
            <div className="dashboard-top-text-2">{isLoggedIn ? user?.fullname : 'Access'}</div>
          </div>
          <div className="dashboard-top-icon">
            <div className="dashboard-top-icon-1">
              <IconButton>
                <NotificationsOutlined />
              </IconButton>
            </div>
            <div className="dashboard-top-icon-2"> {menuHandler()}</div>
          </div>
        </div>

        <div style={{ borderTop: '2px solid lightgray ', height: '10px' }}></div>

        <div className="dashboard-bottom">
          <div className="dashboard-bottom-text">Activities</div>
          <div
            classname="dashboard-bottom-icon"
            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/user-list">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <People />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">User List</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/warehouse-management">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <Warehouse />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Warehouse Management</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/products-management-list">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <Ballot />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Product List</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/products-management-category">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <Sell />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Product Category</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/stock-mutation">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <Inventory />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Stock Mutation</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/order-list">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <ContentPaste />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Order List</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/sales-report">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <ReceiptLong />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Sales Report</div>
            </div>
            <div classname="d-b-icon" style={{ margin: '10px' }}>
              <Link to="/stock-history">
                <IconButton className="d-b-icon-2" sx={{ backgroundColor: 'rgb(234, 234, 234)' }}>
                  <ManageSearch />
                </IconButton>
              </Link>
              <div className="d-b-icon-text">Stock History</div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
