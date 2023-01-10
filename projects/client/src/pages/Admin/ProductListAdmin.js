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
import { MoreHoriz, Search, SportsSoccerOutlined, AddBox, Ballot, SortTwoTone } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import '../../assets/styles/ProductListAdmin.css';

class ProductListAdmin extends React.Component {
  state = {
    productList: [],
    categoryList: [],
    page: 0,
    pages: 0,
    sort: '',
    search: '',
    isSearch: false,
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

  // PRODUCT LIST SETUP

  // SETUP RENDER LIST PRODUCT

  fetchProducts = (page, sort, search) => {
    Axios.get(
      `http://localhost:3300/api/product/get-product?page=${page}&sort=${sort ? sort : this.state.sort}&search=${
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
      })
      .catch(() => {
        alert('Terjadi kesalahan di server');
      });
  };

  fetchCategories = () => {
    Axios.get('http://localhost:3300/api/product/get-category')
      .then((result) => {
        this.setState({ ...this.state, categoryList: result.data });
      })
      .catch((err) => {
        alert('Terjadi kesalahan di server');
      });
  };

  // DELETE BUTTON HANDLER
  deleteBtnHandler = (id) => {
    const confirmDelete = window.confirm('Delete Product?');
    if (confirmDelete) {
      Axios.delete(`http://localhost:3300/api/product/${id}`)
        .then(() => {
          this.fetchProducts(0);
        })
        .catch(() => {
          alert('Server Error!');
        });
    } else {
      alert('Cancel Delete Product');
    }
  };

  // EDIT BUTTON HANDLER
  detailBtnHandler = (id) => {
    this.props.history.push(`/products-management-detail/${id}`);
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

  renderProduct = () => {
    return this.state.productList.map((val, index) => {
      return (
        <div className="plc-main">
          <div className="plc-image">
            <img src={val.picture} className="plc-product" alt="Product Image" />
          </div>
          <div className="plc-detail">
            <div className="plc-detail-name">{val.name}</div>
            <div className="plc-detail-subname-2">Product ID: {val.id}</div>
            <div className="plc-detail-subname">
              <div className="plc-detail-subname-1">
                <img src={val.category.picture} />
              </div>
              <div className="plc-detail-subname-2">{val.category.name}</div>
            </div>
            <div className="plc-detail-bottom">
              <Button
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgb(255,153,153,0.9)',
                  fontSize: '8px',
                  fontFamily: 'Lora',
                  color: 'black',
                }}
                variant="contained"
                onClick={() => this.deleteBtnHandler(val.id)}
                className="plc-detail-bottom-delete">
                Delete
              </Button>
              <Button
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgb(153,255,153,0.9)',
                  fontSize: '8px',
                  fontFamily: 'Lora',
                  color: 'black',
                }}
                variant="contained"
                className="plc-detail-bottom-detail"
                onClick={() => this.detailBtnHandler(val.id)}>
                Detail
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <>
        <Container maxWidth="xs" sx={{ backgroundColor: 'white' }} classname="mobile">
          <div className="pladmin-main">
            <div className="pladmin-banner">
              <div className="pladmin-banner-logo">
                <IconButton disabled>
                  <Ballot />
                </IconButton>
              </div>
              {this.state.isSearch ? (
                <>
                  <ClickAwayListener onClickAway={this.isSearchHandleClose}>
                    <InputBase
                      sx={{ ml: 1, flex: 1, fontFamily: 'Lora' }}
                      placeholder="Search"
                      inputProps={{ 'aria-label': 'Search' }}
                      className="pladmin-search"
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
                  <div className="pladmin-banner-text">Product List</div>
                  <div className="pladmin-banner-search">
                    <IconButton onClick={this.isSearchHandle}>
                      <Search />
                    </IconButton>
                  </div>
                </>
              )}

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
                        ID
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>

              <div className="pladmin-banner-add">
                <Link to="/products-management-add">
                  <IconButton>
                    <AddBox />
                  </IconButton>
                </Link>
              </div>
              <div className="pladmin-banner-menu">{this.menuHandler()}</div>
            </div>
            <div className="pladmin-content">{this.renderProduct()}</div>
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

export default ProductListAdmin;
