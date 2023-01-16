import React, { useEffect, useState, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container, FormControl, Input, Button } from "@mui/material";
import "../assets/styles/NewAddress.css";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NewAddress() {
  const [provinces, setProvinces] = useState();
  const [cities, setCities] = useState();
  const [postals, setPostals] = useState();
  const [address_name, setAddress_name] = useState();
  const [address, setAddress] = useState();
  const [province, setProvince] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState();
  const [city_id, setCity_id] = useState();
  const [cityData, setCityData] = useState();
  const [postal_code, setPostal_code] = useState();

  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(userUID);

  useEffect(() => {
    const provinceDetails = async () => {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/address/provinces`
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
          `${process.env.REACT_APP_API_BASE_URL}/address/cities`
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
          `${process.env.REACT_APP_API_BASE_URL}/address/postal-code`
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

  const cityCheck = (e) => {
    setCityData(e);
    const splitCity = cityData.split(" ");
    let cityName = "";
    if (splitCity.length > 2) {
      for (let x = 0; x < splitCity.length - 1; x++) {
        cityName = cityName + splitCity[x] + " ";
      }
      setCity(cityName)
    } else {
      setCity(splitCity[0]);
    }
    setCity_id(splitCity[splitCity.length - 1]);
  };

  const postLatLong = async () => {
    const data = {
      city: city,
    };
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/address/lat-long`,
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

  const addAddress = async (e) => {
    e.preventDefault();
    const data = {
      customer_uid: userUID,
      address_name: address_name,
      address: address,
      province: province,
      city: city,
      postal_code: postal_code,
      latitude: latitude,
      longitude: longitude,
      city_id: city_id,
    };
    console.log(data);
    try {
      await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/address/add-new-address`,
        data
      );
      alert("Berhasil");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container maxWidth="xs" className="mobile">
        <div className="new-address-page">
          <div className="new-address-detail">
            <Link to={`/address-list/${user?.customer_uid}`}>
              <ArrowBackIcon />
            </Link>
            <div>Create New Address</div>
          </div>
          <div className="margin-size">Address Label</div>
          <FormControl variant="standard" className="address-type-form-input">
            <Input
              sx={{ padding: "7px" }}
              value={address_name}
              onChange={(e) => setAddress_name(e.target.value)}
            />
          </FormControl>
          <div className="margin-size">Address Detail</div>
          <FormControl variant="standard" className="address-type-form-input">
            <Input
              sx={{ padding: "7px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          <div className="margin-size">Choose Province</div>
          <label>
            <select
              className="select-style"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {provinces?.rajaongkir.results.map((provinceDetail) => {
                return <option>{provinceDetail.province}</option>;
              })}
            </select>
          </label>
          <div className="margin-size">Choose City</div>
          <label>
            <select
              className="select-style"
              value={cityData}
              onChange={(e) => cityCheck(e.target.value)}
              onClick={postLatLong}
            >
              {cities?.rajaongkir.results.map((cityDetail, index) => {
                return (
                  <option>{`${cityDetail.city_name} ${cityDetail.city_id}`}</option>
                );
              })}
            </select>
          </label>

          <div className="margin-size">Latitude</div>
          <FormControl variant="standard" className="address-type-form-input">
            <Input
              sx={{ padding: "7px" }}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </FormControl>
          <div className="margin-size">Longitude</div>
          <FormControl variant="standard" className="address-type-form-input">
            <Input
              sx={{ padding: "7px" }}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </FormControl>
          <div className="margin-size">Choose Postal Code</div>
          <label>
            <select
              className="select-style"
              value={postal_code}
              onChange={(e) => setPostal_code(e.target.value)}
            >
              {postals?.rajaongkir.results.map((postalDetail, index) => {
                return <option>{postalDetail.postal_code}</option>;
              })}
            </select>
          </label>

          <Button
            sx={{
              borderRadius: "20px",
              backgroundColor: "black",
              marginTop: "20px",
            }}
            variant="contained"
            className="add-address-button"
            onClick={addAddress}
          >
            Add Address
          </Button>
        </div>
      </Container>
    </>
  );
}

export default NewAddress;
