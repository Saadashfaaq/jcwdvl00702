import React from 'react';
import Axios from 'axios';
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
import { MoreHoriz, Search, SportsSoccerOutlined, ManageSearch, SortTwoTone } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { Link } from 'react-router-dom';

import '../../assets/styles/StockHistory.css';

class StockHistory extends React.Component {
  state = {
    isSearch: false,
    isAdmin: true,
    productList: [],
    page: 0,
    pages: 0,
    sort: '',
    search: '',
  };

  isSearchHandle = () => {
    this.setState({ ...this.state, isSearch: true });
  };

  isSearchHandleClose = () => {
    this.setState({ ...this.state, isSearch: false });
  };

  searchHandler = (event) => {
    this.setState({ ...this.state, search: event.target.value });
  };

  inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  detailBtnHandler = (id) => {
    this.props.history.push(`/product-stock-history/${id}`);
  };

  // PRODUCT LIST SETUP

  // SETUP RENDER LIST PRODUCT

  fetchProducts = (page, sort, search) => {
    Axios.get(
      `http://localhost:3300/api/product/get-stock-history?page=${page}&sort=${sort ? sort : this.state.sort}&search=${
        search ? search : this.state.search
      }`
    )
      .then((result) => {
        this.setState({
          ...this.state,
          productList: [...result.data.result],
          pages: result.data.pages,
          ...(sort && { sort: sort }),
          ...(search && { search: search }),
        });
        console.log('state', result.data.result);
      })
      .catch(() => {
        alert('Terjadi kesalahan di server');
      });
  };

  componentDidMount() {
    this.fetchProducts(0);
  }

  menuHandler = () => {
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
                <Link to="/dashboard" className="pladmin-banner-menu-link">
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/user-list" className="pladmin-banner-menu-link">
                  User List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/warehouse-management" className="pladmin-banner-menu-link">
                  Warehouse Mng.
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/products-management-list" className="pladmin-banner-menu-link">
                  Product List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/products-management-category" className="pladmin-banner-menu-link">
                  Product Category
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-mutation" className="pladmin-banner-menu-link">
                  Stock Mutation
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/order-list" className="pladmin-banner-menu-link">
                  Order List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/sales-report" className="pladmin-banner-menu-link">
                  Sales Report
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-history" className="pladmin-banner-menu-link">
                  Stock History
                </Link>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  };

  stockHistory = () => {
    return this.state.productList.map((val, index) => {
      return (
        <div className="shc-main">
          <div className="shc-image">
            <img src={val.picture} className="shc-product" alt="Product Image" />
          </div>
          <div className="shc-detail">
            <div className="shc-detail-name">{val.name}</div>
            <div className="shc-detail-subname-3">Product ID: {val.id}</div>

            <div className="shc-detail-subname">
              <div className="shc-detail-subname-1">
                <img src={val.category.picture} />
              </div>
              <div className="shc-detail-subname-2">{val.category.name}</div>
            </div>

            <div className="shc-detail-bottom">
              <Link to="/product-stock-history" className="pladmin-banner-menu-link">
                <Button
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: 'rgb(153,255,153,0.9)',
                    fontSize: '8px',
                    fontFamily: 'Lora',
                    color: 'black',
                  }}
                  variant="contained"
                  className="shc-detail-bottom-detail"
                  onClick={() => this.detailBtnHandler(val.id)}>
                  Detail
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <>
        <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
          <div className="stockhistory-main">
            <div className="stockhistory-banner">
              <div className="stockhistory-banner-logo">
                <IconButton disabled>
                  <ManageSearch />
                </IconButton>
              </div>
              {this.state.isSearch ? (
                <>
                  <ClickAwayListener onClickAway={this.isSearchHandleClose}>
                    <InputBase
                      sx={{ ml: 1, flex: 1, fontFamily: 'Lora' }}
                      placeholder="Product Name / ID"
                      inputProps={{ 'aria-label': 'Search' }}
                      className="stockhistory-search"
                      onChange={this.searchHandler}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => this.fetchProducts(0, '', this.state.search)}>
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </ClickAwayListener>
                </>
              ) : (
                <>
                  <div className="stockhistory-banner-text">Stock History</div>
                  <div className="stockhistory-banner-search">
                    <IconButton onClick={this.isSearchHandle}>
                      <Search />
                    </IconButton>
                  </div>
                </>
              )}
              <div className="stockhistory-banner-add">
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <button className="account-button" variant="contained" {...bindTrigger(popupState)}>
                        <IconButton>
                          <SortTwoTone />
                        </IconButton>
                      </button>
                      <Menu {...bindMenu(popupState)}>
                        <MenuItem
                          onClick={() => {
                            this.fetchProducts(0, 'name', '');
                            this.setState({ ...this.state, page: 0 });
                          }}
                          sx={{ fontFamily: 'Lora' }}>
                          Name
                        </MenuItem>
                        <MenuItem onClick={() => this.fetchProducts(0, 'createdAt', '')} sx={{ fontFamily: 'Lora' }}>
                          Created At
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              </div>
              <div className="stockhistory-banner-menu">{this.menuHandler()}</div>
            </div>
            <div className="stockhistory-content">{this.stockHistory()}</div>
          </div>
        </Container>

        <Container maxWidth="xs" className="mobile2">
          <Stack
            spacing={1}
            sx={{
              width: '110%',
              fontFamily: 'Lora',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Pagination
              count={this.state.pages}
              onChange={(e, value) => this.fetchProducts(value - 1, this.state.sort, '')}
            />
          </Stack>
        </Container>
      </>
    );
  }
}

export default StockHistory;
