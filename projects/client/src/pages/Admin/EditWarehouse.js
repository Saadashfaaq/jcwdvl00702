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
import Axios from "axios";
import "../../assets/styles/DetailWarehouse.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function DetailWarehouse() {
  const [provinces, setProvinces] = useState();
  const [cities, setCities] = useState();
  const [postals, setPostals] = useState();
  const [warehouse_name, setWarehouse_name] = useState();
  const [warehouse_address, setWarehouse_address] = useState();
  const [province, setProvince] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState();
  const [postal_code, setPostal_code] = useState();
  const [picture, setPicture] = useState();
  const [preview, setPreview] = useState();
  // const [admin, setAdmin] = useState();
  const [cityId,setCityId] = useState()
  const [cityData,setCityData] = useState()
  const { id } = useParams();

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid

  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  useEffect(() => {
    const provinceDetails = async () => {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/warehouse/provinces`
        );
        let provincesArr = JSON.parse(response.data);
        setProvinces(provincesArr);
      } catch (error) {}
    };

    // call the function
    provinceDetails();
  }, []);

  useEffect(() => {
    const locationDetail = async () => {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/warehouse/cities`
        );
        let citiesArr = JSON.parse(response.data);
        setCities(citiesArr);
      } catch (error) {}
    };

    // call the function
    locationDetail();
  }, []);

  useEffect(() => {
    const postalsDetail = async () => {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/warehouse/postal-code`
        );
        let postalsArr = JSON.parse(response.data);
        setPostals(postalsArr);
      } catch (error) {}
    };

    // call the function
    postalsDetail();
  }, []);

  useEffect(() => {
    if (userUID) {
      const getUserById = async (userUID) => {
        const getId = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/customer/user/${userUID}`
        );
        console.log(getId);
      };
      getUserById(userUID);
    }
  }, [userUID]);

  useEffect(() => {
    if (userUID) {
      const getWarehouseById = async () => {
        const getWarehouse = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/warehouse/warehouse-list/${id}`
        );
        console.log(getWarehouse.data ,'data warehouse');
        setWarehouse_name(getWarehouse.data.warehouse_name);
        setWarehouse_address(getWarehouse.data.warehouse_address);
        setProvince(getWarehouse.data.province);
        setCity(getWarehouse.data.city);
        setPostal_code(getWarehouse.data.postal_code);
        setLatitude(getWarehouse.data.latitude);
        setLongitude(getWarehouse.data.longitude);
        setPicture(getWarehouse.data.picture);
        setCityId(getWarehouse.data.cityId)
      };
      getWarehouseById();
    }
  }, [userUID]);

  const cityCheck=(e)=>{
    setCityData(e)
    const splitCity = cityData.split(" ")
    let cityName = ""
    if(splitCity.length>2){
      for(let x=0;x<(splitCity.length-1);x++){
        cityName = cityName + splitCity[x] + " "
      }
      setCity(cityName)
    } else {
      setCity(splitCity[0])
    }
    setCityId(splitCity[splitCity.length-1])
  }

  const postLatLong = async () => {
    const data = {
      city: city,
    };
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/warehouse/lat-long`,
        data
      );
      console.log(response, "latlong");
      console.log(response.data.results[0].geometry.lat, "test");
      setLatitude(response.data.results[0].geometry.lat);
      setLongitude(response.data.results[0].geometry.lng);
    } catch (error) {
      console.log(error);
    }
  };

  const updateWarehouse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("warehouse_name", warehouse_name);
    formData.append("warehouse_address", warehouse_address);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("postal_code", postal_code);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("picture", picture);
    formData.append("city_id", cityId)
    // formData.append("admin", admin);

    try {
      await Axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/warehouse/edit-warehouse/${id}`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      alert("Berhasil");
      console.log(formData)
    } catch (error) {
      console.log(error);
    }
  };

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
          <IconButton>
            {/* onClick={this.goBack} */}
            <ArrowBack />
          </IconButton>
          <div className="detailwh-banner-text">Warehouse Detail</div>
          <Button
            disabled
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
          <Button
            sx={{
              borderRadius: "20px",
              backgroundColor: "rgb(153,255,255,0.9)",
              fontSize: "8px",
              fontFamily: "Lora",
              color: "black",
            }}
            onClick={updateWarehouse}
            variant="contained"
            className="detailwh-banner-edit"
          >
            Save
          </Button>
        </div>
        <div className="detailwh-content">
          <div className="detailwh-avatar">
            <Button
              variant="contained"
              component="label"
              onChange={loadPicture}
              sx={{ marginLeft: "2px", marginTop: "0px ", width: "300px" }}
            >
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
            {preview ? (
              <img className="detailwh-avatar-photo" src={preview} alt="" />
            ) : (
              <img className="detailwh-avatar-photo" src={picture} alt="" />
            )}
          </div>
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
                <InputBase
                  sx={{ fontFamily: "Lora", fontSize: "12px" }}
                  placeholder="WH Tomang 45"
                  value={warehouse_name}
                  onChange={(e) => setWarehouse_name(e.target.value)}
                  className="dw-c-d-item-2-input"
                />
              </li>
              {/* <li className="dw-c-d-item">
                    <Email className="profileIcon" />
                    <span className="dw-c-d-item-1">Email</span>
                    <InputBase
                      sx={{ fontFamily: "Lora", fontSize: "12px" }}
                      placeholder="wh001_tomang@commerce.com"
                      className="dw-c-d-item-2-input"
                    />
                  </li> */}
              {/* <li className="dw-c-d-item">
                <Work className="profileIcon" />
                <span className="dw-c-d-item-1">Admin</span>
                <label>
                  <select
                    sx={{ fontSize: "10px", width: "150px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={admin}
                    onChange={(e) => setAdmin(e.target.value)}
                    className="dw-c-d-item-2-select"
                  >
                    <option key="Dean Febrius" value="Dean Febrius">
                      Dean Febrius
                    </option>
                    <option key="Chosua Glen" value="Chosua Glen">
                      Chosua Glen
                    </option>
                    <option key="Maria Marcelinus" value="Maria Marcelinus">
                      Maria Marcelinus
                    </option>
                    <option key="Reynaldi Septian" value="Reynaldi Septian">
                      Reynaldi Septian
                    </option>
                  </select>
                </label>
              </li> */}

              {/* <li className="dw-c-d-item">
                <VerifiedUser className="profileIcon" />
                <span className="dw-c-d-item-1">Status</span>
                <Select
                  sx={{ fontSize: "10px", width: "150px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  className="dw-c-d-item-2-select"
                >
                  <MenuItem value={0}>
                    <em>Status</em>
                  </MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={2}>Non-Active</MenuItem>
                </Select>
              </li> */}

              <li className="dw-c-d-item">
                <Map className="profileIcon" />
                <span className="dw-c-d-item-1">Province</span>
                <label>
                  <select
                    sx={{ fontSize: "10px", width: "150px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="dw-c-d-item-2-select"
                  >
                    {provinces?.rajaongkir.results.map((provinceDetail) => {
                      return (
                        <option
                          key={provinceDetail.province}
                          value={provinceDetail.province}
                        >
                          {provinceDetail.province}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" />
                <span className="dw-c-d-item-1">City</span>
                <label>
                  <select
                    sx={{ fontSize: "10px", width: "150px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cityData}
                    onChange={(e) => cityCheck(e.target.value)}
                    onClick={postLatLong}
                    className="dw-c-d-item-2-select"
                  >
                    {console.log(cityData)}
                    {cities?.rajaongkir.results.map((cityDetail) => {
                      return (
                        <option>{`${cityDetail.city_name} ${cityDetail.city_id}`}</option>
                      );
                    })}
                  </select>
                </label>
              </li>

              {/* <li className="dw-c-d-item">
                <LocationOn className="profileIcon" />
                <span className="dw-c-d-item-1">City ID</span>
                <label>
                <select
                  sx={{ fontSize: "10px", width: "150px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="dw-c-d-item-2-select"
                >
                  {cities?.rajaongkir.results.map((cityDetail) => {
                    return (
                      <option
                        key={cityDetail.city_id}
                        value={cityDetail.city_id}
                      >
                        {cityDetail.city_id}
                      </option>
                    );
                  })}
                </select>
                </label>
              </li> */}

              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Latitude</span>
                <InputBase
                  sx={{ fontFamily: "Lora", fontSize: "12px" }}
                  placeholder="WH Tomang 45"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="dw-c-d-item-2-input"
                />
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Longitude</span>
                <InputBase
                  sx={{ fontFamily: "Lora", fontSize: "12px" }}
                  placeholder="WH Tomang 45"
                  value={longitude}
                  onChange={(e) => longitude(e.target.value)}
                  className="dw-c-d-item-2-input"
                />
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Postal Code</span>
                <label>
                  <select
                    sx={{ fontSize: "10px", width: "150px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={postal_code}
                    onChange={(e) => setPostal_code(e.target.value)}
                    className="dw-c-d-item-2-select"
                  >
                    {postals?.rajaongkir.results.map((postalDetail) => {
                      return (
                        <option
                          key={postalDetail.postal_code}
                          value={postalDetail.postal_code}
                        >
                          {postalDetail.postal_code}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </li>
              <li className="dw-c-d-item">
                <LocationOn className="profileIcon" sx={{ color: "white" }} />
                <span className="dw-c-d-item-1">Address</span>
                <InputBase
                  sx={{ fontFamily: "Lora", fontSize: "12px" }}
                  placeholder="WH Tomang 45"
                  value={warehouse_address}
                  onChange={(e) => setWarehouse_address(e.target.value)}
                  className="dw-c-d-item-2-input"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default DetailWarehouse;
