import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import "../assets/styles/AddressList.css";
import { Container } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function AddressList() {
  let history = useHistory();
  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;

  const [AddressDetails, setAddressDetails] = useState();
  const [addressFinal, setAddressFinal] = useState([])

  useEffect(() => {
    getAddressById(userUID);
  }, [userUID]);

  const getAddressById = async (userUID) => {
    console.log(userUID, "test");
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/address/address-list/${userUID}`
    );
    //  console.log(response.data)
    setAddressDetails(response.data);
  };

  const activeSelect=()=>{
    console.log(addressFinal)
    if(addressFinal.length==0){
      alert('Choose Address!')
    } else{
      const data = {
        shipping_address: addressFinal.address_name
      }
      Axios.put(`${process.env.REACT_APP_API_BASE_URL}/order/edit-address/${userUID}`, data)
      .then(() => {
        history.push({
          pathname: '/choose-shipping',
          state: addressFinal.city_id
        })
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  const deleteAddress = (id) => {
    Axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/address/delete-address/${userUID}/${id}`
    )
      .then(() => {
        alert("Address Deleted");
        getAddressById(userUID);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <Container maxWidth="xs" className="mobile">
        <div className="address-page">
          {console.log(addressFinal, "selected address")}
          <div className="address-arrow-detail">
            <Link to="/">
              <button className="back-btn">
                <ArrowBackIcon />
              </button>
            </Link>
            <div>Select address</div>
          </div>
          <div className="address-list">
            {AddressDetails?.map((addressDetail) => (
              <div className="address">
                <input
                  type="radio"
                  name="locradio"
                  className="loc-radio"
                  onChange={() => setAddressFinal(addressDetail)}
                />
                <LocationOnOutlinedIcon />
                <div className="address-info">
                  <div className="address-type">
                    {addressDetail.address_name}
                  </div>
                  <div className="address-detail">
                    {addressDetail.address}, {addressDetail.city},{" "}
                    {addressDetail.province}, {addressDetail.postal_code}
                  </div>
                </div>
                <Link to={`/edit-address/${userUID}/${addressDetail.id}`}>
                  <ModeEditOutlineOutlinedIcon className="radio-css" />
                </Link>
                <DeleteForeverOutlinedIcon
                  onClick={() => deleteAddress(addressDetail.id)}
                />
              </div>
            ))}
          </div>
          <Link to={`/add-address/${userUID}`}>
            <button className="button-new-address">Add New Address</button>
          </Link>
          <button className="button-confirm" onClick={activeSelect}>
            Confirm
          </button>
        </div>
      </Container>
    </>
  );
}

export default AddressList;