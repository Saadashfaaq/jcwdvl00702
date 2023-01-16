import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { MoreHoriz, Search, AddBusiness, Warehouse } from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import "../../assets/styles/WarehouseManagement.css";

function WarehouseManagement() {
  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));

  const [WarehouseDetails, setWarehouseDetails] = useState();
  const [adminRole,setAdminRole] = useState()
  const [adminData,setAdminData] = useState()

  const userCheck=()=>{
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/profile/${user?.customer_uid}`)
    .then(res=>{
      setAdminRole(res.data.approle.role)
      setAdminData(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    userCheck()
  },[])

  useEffect(() => {
    getWarehouseList();
  }, []);

  const getWarehouseList = async () => {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/warehouse/warehouse-list`
    );
    console.log(response.data);
    setWarehouseDetails(response.data);
  };

  const deleteWarehouse = (id) => {
    Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/warehouse/delete-warehouse/${id}`)
      .then(() => {
        alert("Warehouse Deleted");
        getWarehouseList();
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
                <Link to="/" className="whmanagement-banner-menu-link">
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/user-list" className="whmanagement-banner-menu-link">
                  User List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                to="/warehouse-management"
                className="whmanagement-banner-menu-link"
                >
                  Warehouse Mng.
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-list"
                  className="whmanagement-banner-menu-link"
                >
                  Product List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-category"
                  className="whmanagement-banner-menu-link"
                >
                  Product Category
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/stock-mutation"
                  className="whmanagement-banner-menu-link"
                >
                  Stock Mutation
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/order-list"
                  className="whmanagement-banner-menu-link"
                >
                  Order List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/sales-report"
                  className="whmanagement-banner-menu-link"
                >
                  Sales Report
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/stock-history"
                  className="whmanagement-banner-menu-link"
                >
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
    <>
      {user?.approle?.role !== "user" ? (
        <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
          <div className="whmanagement-main">
            <div className="whmanagement-banner">
              <div className="whmanagement-banner-logo">
                <IconButton disabled>
                  <Warehouse />
                </IconButton>
              </div>
              {/* {this.state.isSearch ? (
              <>
                <ClickAwayListener>
                  <InputBase
                    sx={{ ml: 1, flex: 1, fontFamily: 'Lora' }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'Search' }}
                    className="whmanagement-search"
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
                <div className="whmanagement-banner-text">Warehouse List</div>
                <div className="whmanagement-banner-search">
                  <IconButton>
                    <Search />
                  </IconButton>
                </div>
              </>
            )} */}
              <div className="whmanagement-banner-text">Warehouse List</div>
              <div className="whmanagement-banner-search">
                <IconButton>
                  <Search />
                </IconButton>
              </div>

              <div className="whmanagement-banner-add">
                {adminData?.approle?.role === "superadmin" ? (
                  <Link to="/add-warehouse">
                    <IconButton>
                      <AddBusiness />
                    </IconButton>
                  </Link>
                ) : (
                  <IconButton disabled>
                    <AddBusiness />
                  </IconButton>
                )}
              </div>
              <div className="whmanagement-banner-menu">{menuHandler()}</div>
            </div>
            <div className="whmanagement-content">
              {/* {this.whManagementCard("A")}
            {this.whManagementCard("B")}
            {this.whManagementCard("C")} */}
              {WarehouseDetails?.map((WarehouseDetail) => (
                <>
                  <div className="wmc-main">
                    <div className="wmc-image">
                      <img
                        src={WarehouseDetail.picture}
                        className="wmc-product"
                        alt="Product Image"
                      />
                    </div>
                    <div className="wmc-detail">
                      <div className="wmc-detail-name">
                        {WarehouseDetail.warehouse_name}
                      </div>
                      <div className="wmc-detail-subname">
                        Admin: {WarehouseDetail.admin}
                      </div>
                      <div className="wmc-detail-subname">
                        {WarehouseDetail.warehouse_address}
                      </div>
                      <div className="wmc-detail-bottom">
                        {user?.approle?.role === 'superadmin' ? 
                          <Button
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "rgb(255,153,153,0.9)",
                            fontSize: "8px",
                            fontFamily: "Lora",
                            color: "black",
                          }}
                          onClick={() => deleteWarehouse(WarehouseDetail.id)}
                          variant="contained"
                          className="wmc-detail-bottom-delete"
                          // disabled={adminRole !== "superadmin"}
                          >
                            Delete
                          </Button>
                          :
                          <Button
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "rgb(255,153,153,0.9)",
                            fontSize: "8px",
                            fontFamily: "Lora",
                            color: "black",
                          }}
                          onClick={() => deleteWarehouse(WarehouseDetail.id)}
                          variant="contained"
                          className="wmc-detail-bottom-delete"
                          disabled
                          >
                            Delete
                          </Button>
                        }
                        {/* {adminData?.approle?.warehouse_id ===
                        WarehouseDetail.id ? ( */}
                        {user?.approle?.role === 'superadmin' ? (
                          <Link
                            to={`/detail-warehouse/${WarehouseDetail.id}`}
                            className="whmanagement-banner-menu-link"
                          >
                            <Button
                              sx={{
                                borderRadius: "20px",
                                backgroundColor: "rgb(153,255,153,0.9)",
                                fontSize: "8px",
                                fontFamily: "Lora",
                                color: "black",
                              }}
                              variant="contained"
                              className="wmc-detail-bottom-detail"
                            >
                              Detail
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            to={`/detail-warehouse/${WarehouseDetail.id}`}
                            className="whdetail-disabled"
                          >
                            <Button
                              sx={{
                                borderRadius: "20px",
                                backgroundColor: "rgb(153,255,153,0.9)",
                                fontSize: "8px",
                                fontFamily: "Lora",
                                color: "black",
                              }}
                              variant="contained"
                              className="wmc-detail-bottom-detail"
                              disabled={adminRole !== "superadmin"}
                            >
                              Detail
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))}
              {/* <Stack
                spacing={1}
                sx={{
                  position: "fixed",
                  top: "78%",
                  width: "110%",
                  fontFamily: "Lora",
                }}
              >
                <Pagination count={10} />
              </Stack> */}
            </div>
          </div>
        </Container>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default WarehouseManagement;
