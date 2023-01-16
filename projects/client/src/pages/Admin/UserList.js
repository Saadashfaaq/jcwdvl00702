import React from "react";
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
import { MoreHoriz, People, Search, PersonAdd, SortTwoTone} from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Link ,Redirect,useHistory} from 'react-router-dom';
import '../../assets/styles/UserList.css';
import { useState, useEffect, useContext } from 'react';
import { firebaseAuthentication } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { getUserData } from '../../redux/actionCreators/userDataActions';
import { getUserDetail } from '../../redux/actionCreators/userDetailActions';

export default function UserList() {
  let history = useHistory()
  const dispatch = useDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const [userBox, setUserBox] = useState([]);
  const [userPages, setUserPages] = useState([])
  const [page,setPage]=useState(1)
  // const [pages,setPages]=useState(0)
  const [maxPage,setMaxPage]=useState(0)
  const [sort,setSort]=useState('')
  const [search,setSearch]=useState('')
  const [itemsPerPage,setItemsPerPage]=useState(3)

  const { isLoggedIn, user, dataUser } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
    // dataUser: state.userData.userData,
  }));
  const adminSup = user?.approle?.role

  const processUsers = () => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/get-user`).then((res) => {
      const getRes = res.data.allUser;
      setUserBox(getRes);
      const newMaxPage = Math.ceil(getRes.length/itemsPerPage)
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

  useEffect(() => {
    processUsers();
  }, []);

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
    Axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/update/${id}`, data)
      .then(() => {
        processUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDetail = (id) => {
    history.push(`/detail-user/${id}`);
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

  const renderCard=()=>{
    const beginningIndex = (page-1)*itemsPerPage
    const slicedData = userBox.slice(beginningIndex,beginningIndex+itemsPerPage)

    return slicedData.map(val=>{
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
            <div className="ulc-detail-name">{val?.fullname}</div>
            <div className="ulc-detail-subname">{val?.email}</div>
            <div className="ulc-detail-subname">{val?.approle?.role}</div>
            {val?.is_banned === true ? (
              <div className="ulc-detail-subname" style={{ color: 'darkred' }}>
                Banned
              </div>
            ) : (
              <div className="ulc-detail-subname">Safe Account</div>
            )}
            <div className="ulc-detail-subname">{val?.createdAt}</div>
            <div className="ulc-detail-bottom">
              <Button
                onClick={() => deleteHandler(val?.customer_uid)}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgb(255,153,153,0.9)',
                  fontSize: '8px',
                  fontFamily: 'Lora',
                  color: 'black',
                }}
                variant="contained"
                className="ulc-detail-bottom-delete"
                disabled={val?.approle?.role.includes('admin')}
                >
                Delete
              </Button>
              {/* <Link to="/detail-user" className="userlist-banner-menu-link"> */}
              <div className="userlist-banner-menu-link">
                <Button
                  onClick={() => handleDetail(val.customer_uid)}
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: 'rgb(153,255,153,0.9)',
                    fontSize: '8px',
                    fontFamily: 'Lora',
                    color: 'black',
                  }}
                  variant="contained"
                  className="ulc-detail-bottom-detail"
                  // disabled={val?.approle?.role === 'user'}
                >
                  Detail
                </Button>
              </div>
              {/* </Link> */}
            </div>
          </div>
        </div>
      );
    })
  }

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      {adminSup !== 'superadmin' ? <Redirect to="/"/> : null}
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
                  sx={{ ml: 1, flex: 1, fontFamily: "Lora" }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "Search" }}
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
          {/* <Stack spacing={1} sx={{ position: 'fixed', top: '78%', width: '110%', fontFamily: 'Lora' }}>
            <Pagination count={maxPage} 
          />
          </Stack> */}
          {renderCard()}
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
      </div>
    </Container>
  );
}
