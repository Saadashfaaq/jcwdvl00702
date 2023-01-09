import React from 'react';
import {
  Button,
  InputAdornment,
  IconButton,
  Container,
  Menu,
  MenuItem,
  ClickAwayListener,
  InputBase,
  Stack,
  Pagination,
} from '@mui/material';
import { MoreHoriz, People, Search, PersonAdd, SortTwoTone } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Link } from 'react-router-dom';
import '../../assets/styles/UserList.css';
import { useState, useEffect, useContext } from 'react';
import { firebaseAuthentication } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { getUserData } from '../../redux/actionCreators/userDataActions';
import { getUserDetail } from '../../redux/actionCreators/userDetailActions';

export default function UserList() {
  const [isSearch, setIsSearch] = useState(false);
  const [userBox, setUserBox] = useState([]);
  const dispatch = useDispatch();

  const processUsers = () => {
    Axios.get(`http://localhost:3300/api/admin/get-user`).then((res) => {
      const getRes = res.data.allUser;
      console.log(res.data)
      console.log(getRes);
      dispatch(getUserData(getRes));
      setUserBox(getRes);
    });
  };

  useEffect(() => {
    processUsers();
  }, []);

  const { isLoggedIn, user, dataUser } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
    dataUser: state.userData.userData,
  }));
  console.log(dataUser);

  const isSearchHandle = () => {
    setIsSearch(true);
  };

  const isSearchHandleClose = () => {
    setIsSearch(false);
  };

  const deleteHandler = (id) => {
    const data = {
      is_banned: true,
    };
    Axios.put(`http://localhost:3300/api/admin/update/${id}`, data)
      .then(() => {
        processUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDetail = (datadetail) => {
    dispatch(getUserDetail(datadetail));
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

  const userlistCard = (abc) => {
    console.log(userBox);
    return (
      <div className="ulc-main">
        <div className="ulc-image">
          <img
            src="https://i.pinimg.com/originals/6f/df/bc/6fdfbc41d6a8e26d4b9073bc1afd899f.jpg"
            className="ulc-product"
            alt="Product Image"
          />
        </div>
        <div className="ulc-detail">
          <div className="ulc-detail-name">{userBox[abc]?.fullname}</div>
          <div className="ulc-detail-subname">{userBox[abc]?.email}</div>
          <div className="ulc-detail-subname">{userBox[abc]?.role}</div>
          {userBox[abc]?.is_banned == true ? (
            <div className="ulc-detail-subname" style={{ color: 'darkred' }}>
              Banned
            </div>
          ) : (
            <div className="ulc-detail-subname">Safe User</div>
          )}
          <div className="ulc-detail-subname">{userBox[abc]?.createdAt}</div>
          <div className="ulc-detail-bottom">
            <Button
              onClick={() => deleteHandler(userBox[abc]?.customer_uid)}
              sx={{
                borderRadius: '20px',
                backgroundColor: 'rgb(255,153,153,0.9)',
                fontSize: '8px',
                fontFamily: 'Lora',
                color: 'black',
              }}
              variant="contained"
              className="ulc-detail-bottom-delete">
              Delete
            </Button>
            <Link to="/detail-user" className="userlist-banner-menu-link">
              <Button
                onClick={() => handleDetail(dataUser[abc])}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgb(153,255,153,0.9)',
                  fontSize: '8px',
                  fontFamily: 'Lora',
                  color: 'black',
                }}
                variant="contained"
                className="ulc-detail-bottom-detail">
                Detail
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      <div className="userlist-main">
        <div className="userlist-banner">
          <div className="userlist-banner-logo">
            <IconButton disabled>
              <People />
            </IconButton>
          </div>
          {isSearch ? (
            <>
              <ClickAwayListener onClickAway={isSearchHandleClose}>
                <InputBase
                  sx={{ ml: 1, flex: 1, fontFamily: 'Lora' }}
                  placeholder="Search"
                  inputProps={{ 'aria-label': 'Search' }}
                  className="userlist-search"
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
              <div className="userlist-banner-text">User List</div>
              <div className="userlist-banner-search">
                <IconButton onClick={isSearchHandle}>
                  <Search />
                </IconButton>
              </div>
            </>
          )}
          <div className="userlist-banner-add">
            <Link to="/add-user">
              <IconButton>
                <PersonAdd />
              </IconButton>
            </Link>
          </div>
          <div className="userlist-banner-menu">{menuHandler()}</div>
        </div>
        <div className="userlist-content">
          {Object.keys(userBox).map((i) => {
            return userlistCard(i);
          })}
          <Stack spacing={1} sx={{ position: 'fixed', top: '78%', width: '110%', fontFamily: 'Lora' }}>
            <Pagination count={10} />
          </Stack>
        </div>
      </div>
    </Container>
  );
}
