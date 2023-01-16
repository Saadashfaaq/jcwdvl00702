import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Container,
  Select,
  MenuItem,
  InputBase,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  Badge,
  VerifiedUser,
  Work,
  Warehouse,
  Map,
  LocationOn,
} from "@mui/icons-material";
import GoogleMaps from "../../components/GoogleMaps";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "../../assets/styles/DetailWarehouse.css";
import Axios from "axios";
import { Link, useParams, useHistory } from "react-router-dom";

function DetailWarehouse() {
  const [warehouse_name, setWarehouse_name] = useState();
  const [warehouse_address, setWarehouse_address] = useState();
  const [province, setProvince] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState();
  const [postal_code, setPostal_code] = useState();
  const [picture, setPicture] = useState();
  const [admin, setAdmin] = useState();
  const {id} = useParams();
  const history = useHistory()

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(user);
  const userData = user?.role;
  console.log(userData);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    if (userUID) {
      const getWarehouseById = async () => {
        const getWarehouse = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/warehouse/warehouse-list/${id}`
        );
        console.log(getWarehouse);
        setWarehouse_name(getWarehouse.data.warehouse_name);
        setWarehouse_address(getWarehouse.data.warehouse_address);
        setProvince(getWarehouse.data.province);
        setCity(getWarehouse.data.city);
        setPostal_code(getWarehouse.data.postal_code);
        setLatitude(getWarehouse.data.latitude);
        setLongitude(getWarehouse.data.longitude);
        setPicture(getWarehouse.data.picture);
        setAdmin(getWarehouse.data.admin);
      };
      getWarehouseById();
    }
  }, [userUID]);

  // state = {
  //   isEdit: false,
  //   isSuperAdmin: true,
  //   statusValue: 0,
  //   adminValue: 0,
  // };

  // editHandler = () => {
  //   this.setState({ ...this.state, isEdit: true });
  // };

  // saveHandler = () => {
  //   this.setState({ ...this.state, isEdit: false });
  // };

  // handleStatusChange = (event) => {
  //   this.setState({ ...this.state, statusValue: event.target.value });
  // };

  // handleAdminChange = (event) => {
  //   this.setState({ ...this.state, adminValue: event.target.value });
  // };

  // goBack = () => {
  //   this.props.history.goBack();
  // };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
      <div className="detailwh-main">
        <div className="detailwh-banner">
          <IconButton onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <div className="detailwh-banner-text">Warehouse Detail</div>
          <Button
            sx={{
              borderRadius: "20px",
              backgroundColor: "rgb(255,153,153,0.9)",
              fontSize: "8px",
              fontFamily: "Lora",
              color: "black",
              marginRight: "5px",
            }}
            variant="contained"
            className="detailwh-banner-delete"
          >
            Delete
          </Button>
          <Link
            to={`/edit-warehouse/${id}`}
            className="whmanagement-banner-menu-link"
          >
            <Button
              sx={{
                borderRadius: "20px",
                backgroundColor: "rgb(255,204,153,0.9)",
                fontSize: "8px",
                fontFamily: "Lora",
                color: "black",
              }}
              variant="contained"
              // onClick={this.editHandler}
              className="detailwh-banner-edit"
            >
              Edit
            </Button>
          </Link>
        </div>
        <div className="detailwh-content">
          <div className="detailwh-avatar">
            <img className="detailwh-avatar-photo" src={picture} alt="" />
          </div>
          {/* <div className="detailwh-map">
                  <GoogleMaps />
                </div> */}
          <div className="detailwh-content-detail">
            <ul className="dw-c-d-data">
              <li className="dw-c-d-item">
                <Badge className="profileIcon" />
                <span className="dw-c-d-item-1">ID</span>
                <span className="dw-c-d-item-2">{id}</span>
              </li>
              <li className="dw-c-d-item">
                <Warehouse className="profileIcon" />
                <span className="dw-c-d-item-1">Name</span>
                <span className="dw-c-d-item-2">{warehouse_name}</span>
              </li>
              {/* <li className="dw-c-d-item">
                <Email className="profileIcon" />
                <span className="dw-c-d-item-1">Email</span>
                <span className="dw-c-d-item-2">wh001_tomang@commerce.com</span>
              </li> */}
              <li className="dw-c-d-item">
                <Work className="profileIcon" />
                <span className="dw-c-d-item-1">Admin</span>
                <span className="dw-c-d-item-2">{admin}</span>
              </li>
              {/* <li className="dw-c-d-item">
                <VerifiedUser className="profileIcon" />
                <span className="dw-c-d-item-1">Status</span>
                <span className="dw-c-d-item-2">Active</span>
              </li> */}
              <li className="dw-c-d-item">
                <Map className="profileIcon" />
                <span className="dw-c-d-item-1">Area (Province)</span>
                <span className="dw-c-d-item-2">{province}</span>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" />
                <span className="dw-c-d-item-1">City</span>
                <span className="dw-c-d-item-2">{city}</span>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Latitude</span>
                <span className="dw-c-d-item-2">{latitude}</span>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Longitude</span>
                <span className="dw-c-d-item-2">{longitude}</span>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Postal Code</span>
                <span className="dw-c-d-item-2">{postal_code}</span>
              </li>
              {/* <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">District</span>
                <span className="dw-c-d-item-2">Palmerah</span>
              </li> */}
              {/* <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Sub-District</span>
                <span className="dw-c-d-item-2">Jatipulo</span>
              </li> */}
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Address</span>
                <span className="dw-c-d-item-2">{warehouse_address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default DetailWarehouse;
