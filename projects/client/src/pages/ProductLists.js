import React from 'react';
import Axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../assets/styles/ProductLists.css';
import { SortTwoTone, SportsSoccerOutlined } from '@mui/icons-material';
import { Container, Stack, Pagination, IconButton, InputBase, Menu, MenuItem, Button } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { URL_API } from '../redux/API';
// import SportsSoccerOutlined from "@mui/icons-material/SportsSoccerOutlined";

class ProductLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProduct: [],
      page: 0,
      pages: 0,
      sort: '',
      search: '',
    };
  }

  componentDidMount() {
    this.getDataProduct(0);
  }

  filterHandler = () => {
    this.fetchProducts();
    this.setState({ ...this.state, keyWord: '' });
  };

  inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  pageHandler = () => {
    if (this.state.page < this.state.maxPage) {
      this.setState({ page: this.state.page + 1 });
    } else if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  // product detail
  detailBtnHandler = (id) => {
    this.props.history.push(`/product-detail/${id}`);
  };

  getDataProduct = (page, sort, search) => {
    // Axios.get(`http://localhost:3300/api/product/get-product/?searchQuery=${this.state.keyWord}`)
    //   .then((result) => {
    //     this.setState({ productList: result.data, maxPage: Math.ceil(result.data.length / this.state.itemPerPage) });
    //     console.log(this.state.productList);
    //   })
    //   .catch(() => {
    //     alert('Terjadi kesalahan di server');
    //   });

    Axios.get(
      `http://localhost:3300/api/product/get-product/?page=${page}&sort=${sort ? sort : this.state.sort}&search=${
        search ? search : this.state.search
      }`
    )
      .then((res) => {
        this.setState({
          ...this.state,
          dataProduct: [...res.data.result],
          pages: res.data.pages,
          ...(sort && { sort: sort }),
          ...(search && { search: search }),
        });
        //   sort
        //     ? this.setState({
        //         ...this.state,
        //         dataProduct: [...res.data.result],
        //         pages: res.data.pages,
        //         sort: sort,
        //       })
        //     : this.setState({
        //         ...this.state,
        //         dataProduct: [...res.data.result],
        //         pages: res.data.pages,
        //       });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  searchHandler = (event) => {
    this.setState({ ...this.state, search: event.target.value });
  };

  renderProduct = () => {
    const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;
    const currentData = this.state.productList.slice(beginningIndex, beginningIndex + this.state.itemPerPage);

    return currentData.map((val) => {
      return (
        <div className="plc-main">
          <div className="plc-image">
            <img src={val.picture} className="plc-product" alt="Product Image" />
          </div>
          <div className="plc-detail">
            <div className="plc-detail-name">{val.name}</div>
            <div className="plc-detail-subname">
              <div className="plc-detail-subname-1">
                <SportsSoccerOutlined />
              </div>
              <div className="plc-detail-subname-2">{val.category}</div>
            </div>
            <div className="plc-detail-bottom">
              <Button
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgb(153,255,153,0.9)',
                  fontSize: '8px',
                  fontFamily: 'Lora',
                  color: 'black',
                }}
                variant="contained"
                onClick={() => this.detailBtnHandler(val.id)}
                className="plc-detail-bottom-delete">
                Detail Product
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
        <Container maxWidth="xs" className="mobile">
          <div className="product-page">
            <div className="product-arrow-search">
              <ArrowBackIcon />
              <div>Result for "All"</div>
            </div>
            <div className="search-bar-detail">
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'Search' }}
                className="search-bar"
                onChange={this.searchHandler}
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={() => this.getDataProduct(0, '', this.state.search)}>
                <SearchIcon />
              </IconButton>
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
                          this.getDataProduct(0, 'name', '');
                          this.setState({ ...this.state, page: 0 });
                        }}
                        sx={{ fontFamily: 'Lora' }}>
                        {/* <img src="https://img.icons8.com/fluency-systems-filled/22/null/sort-numeric-up.png" /> */}
                        Name
                      </MenuItem>
                      <MenuItem onClick={() => this.getDataProduct(0, 'createdAt', '')} sx={{ fontFamily: 'Lora' }}>
                        {/* <img src="https://img.icons8.com/windows/24/null/sort-numeric-up-reversed.png" /> */}
                        CreatedAt
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </div>
            <div className="product-card">{this.renderProduct()}</div>
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
              onChange={(e, value) => this.getDataProduct(value - 1, this.state.sort, '')}
            />
          </Stack>
        </Container>
      </>
    );
  }
}

export default ProductLists;
