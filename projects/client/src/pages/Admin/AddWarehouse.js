import React, { useEffect, useState, useContext } from "react";
import {
  ArrowBack,
  Email,
  Warehouse,
  Map,
  Work,
  LocationOn,
} from "@mui/icons-material";
import {
  Container,
  FormControl,
  Input,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import GoogleMaps from "../../components/GoogleMaps";
import Axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "../../assets/styles/AddWarehouse.css";
function AddWarehouse() {
  const [provinces, setProvinces] = useState();
  const [cities, setCities] = useState();
  const [postals, setPostals] = useState();
  // const { user: currentUser } = useContext(AuthContext);
  const [warehouse_name, setWarehouse_name] = useState();
  const [warehouse_address, setWarehouse_address] = useState();
  const [province, setProvince] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState();
  const [cityData, setCityData] = useState()
  const [city_id, setCity_id] = useState()
  const [postal_code, setPostal_code] = useState();
  const [picture, setPicture] = useState();
  const [admin, setAdmin] = useState();
  const [preview, setPreview] = useState("");
  const [dataCity, setDataCity] = useState()
  //  console.log(currentUser);
  // const userUID = currentUser?.uid;
  // console.log(userUID);

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(userUID);

  useEffect(() => {
    const provinceDetails = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:3300/api/warehouse/provinces"
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
          "http://localhost:3300/api/warehouse/cities"
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
          "http://localhost:3300/api/warehouse/postal-code"
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
          `http://localhost:3300/api/customer/user/${userUID}`
        );
        console.log(getId);
      };
      getUserById(userUID);
    }
  }, [userUID]);

  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  const cityCheck=(e)=>{
    setCityData(e)
    const splitCity = cityData.split(" ")
    let cityName = ""
    if(splitCity.length>2){
      for(let x=0;x<(splitCity.length-1);x++){
        cityName = cityName + splitCity[x] + " "
      }
      setCity(cityName)
      console.log(city)
    } else {
      setCity(splitCity[0])
    }
    setCity_id(splitCity[splitCity.length-1])
  }

  const postLatLong = async () => {
    const data = {
      city: city,
    };
    try {
      const response = await Axios.post(
        "http://localhost:3300/api/warehouse/lat-long",
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

  const addWarehouse = async (e) => {
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
    formData.append("admin", admin);
    formData.append("city_id", city_id)
    try {
      await Axios.post(
        `http://localhost:3300/api/warehouse/add-new-warehouse`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      alert("Berhasil");
    } catch (error) {
      console.log(error);
    }
  };
  // state = {
  //   setAdmin: 0,
  // };

  // handleAdminChange = (event) => {
  //   this.setState({ ...this.state, setAdmin: event.target.value });
  // };

  // goBack = () => {
  //   this.props.history.goBack();
  // };

  return (
    <Container maxWidth="xs" className="mobile">
      <div className="addwh-main">
        <div className="addwh-banner">
          <IconButton>
            <ArrowBack />
          </IconButton>
          <div className="addwh-banner-text">Add New Warehouse</div>
        </div>
        <div className="addwh-avatar">
          <Button
            type="file"
            id="uploading"
            onChange={loadPicture}
            variant="contained"
            component="label"
            sx={{ marginLeft: "0px", marginTop: "0px " }}
          >
            Upload
            <input hidden accept="image/*" multiple type="file" />
          </Button>
          {preview ? (
            <img className="addwh-avatar-photo" src={preview} alt="" />
          ) : (
            <img className="addwh-avatar-photo" src={picture} alt="" />
          )}
        </div>
        <div className="addwh-form">
          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="warehouse"
              value={warehouse_name}
              onChange={(e) => setWarehouse_name(e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <Warehouse />
                </InputAdornment>
              }
              placeholder="Warehouse Name"
            />
          </FormControl>
          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="warehouse-address"
              value={warehouse_address}
              onChange={(e) => setWarehouse_address(e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <Warehouse />
                </InputAdornment>
              }
              placeholder="Warehouse Address"
            />
          </FormControl>
          {/* <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="email"
              id="input-with-icon-adornment"
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              placeholder="Email"
            />
          </FormControl> */}
          <FormControl variant="standard" className="adduser-form-input">
            <TextField
              select
              label="Province"
              id="select-province"
              helperText="Select Province"
              onChange={(e) => setProvince(e.target.value)}
            >
              {provinces?.rajaongkir.results.map((provinceDetail) => {
                return (
                  <MenuItem
                    key={provinceDetail.province}
                    value={provinceDetail.province}
                  >
                    {provinceDetail.province}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormControl>
          <FormControl variant="standard" className="adduser-form-input">
            <TextField
              select
              label="City"
              id="select-city"
              helperText="Select City"
              onChange={(e) => cityCheck(e.target.value)}
              onClick={postLatLong}
            >
              {cities?.rajaongkir.results.map((cityDetail) => {
                return (
                  <MenuItem
                    // key={cityDetail.city_name}
                    value={cityDetail.city_name + " " + cityDetail.city_id}
                  >
                    {`${cityDetail.city_name} ${cityDetail.city_id}`}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormControl>
          {/* <FormControl variant="standard" className="adduser-form-input">
            <Input
              type=""
              name="area"
              id="input-with-icon-adornment"
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <Map />
                </InputAdornment>
              }
              placeholder="Area (Province)"
            />
          </FormControl> */}
          {/* <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="city"
              id="input-with-icon-adornment"
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              }
              placeholder="City"
            />
          </FormControl> */}

          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="district"
              id="input-with-icon-adornment"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              }
              placeholder="Latitude"
            />
          </FormControl>
          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="subdistrict"
              id="input-with-icon-adornment"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              sx={{ padding: "7px", border: "none" }}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              }
              placeholder="Longitude"
            />
          </FormControl>
          <FormControl variant="standard" className="adduser-form-input">
            <TextField
              select
              label="Postal Code"
              id="select-postal"
              helperText="Select Postal Code"
              onChange={(e) => setPostal_code(e.target.value)}
            >
              {postals?.rajaongkir.results.map((postalDetail) => {
                return (
                  <MenuItem
                    key={postalDetail.postal_code}
                    value={postalDetail.postal_code}
                  >
                    {postalDetail.postal_code}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormControl>
          {/* <FormControl variant="standard" className="adduser-form-input">
            <TextField
              sx={{ width: "100%", fontSize: "12px", padding: 0 }}
              id="filled-multiline-static"
              variant="filled"
              multiline
              rows={4}
              label="Warehouse Address"
              value={warehouse_address}
              onChange={(e) => setWarehouse_address(e.target.value)}
            />
          </FormControl> */}

          <FormControl variant="standard" className="adduser-form-input">
            <TextField
              select
              label="Admin"
              id="select-city"
              helperText="Select Admin"
              onChange={(e) => setAdmin(e.target.value)}
              value={admin}
            >
              <MenuItem key="Dean Febrius" value="Dean Febrius">
                Dean Febrius
              </MenuItem>
              <MenuItem key="Chosua Glen" value="Chosua Glen">
                Chosua Glen
              </MenuItem>
              <MenuItem key="Maria Marcelinus" value="Maria Marcelinus">
                Maria Marcelinus
              </MenuItem>
              <MenuItem key="Reynaldi Septian" value="Reynaldi Septian">
                Reynaldi Septian
              </MenuItem>
            </TextField>
          </FormControl>
        </div>

        <div className="addwh-button">
          <button class="addwh-button-2" onClick={addWarehouse}>
            Add New Warehouse
          </button>
        </div>
      </div>
    </Container>
  );
}

export default AddWarehouse;
