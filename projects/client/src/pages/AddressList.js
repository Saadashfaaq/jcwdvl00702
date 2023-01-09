import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import "../assets/styles/AddressList.css";
import { Container } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function AddressList() {
  let history = useHistory()
  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(user);

  const [AddressDetails, setAddressDetails] = useState();
  const [addressFinal, setAddressFinal] = useState([])
  console.log("address detail", AddressDetails)
  console.log("address final", addressFinal)

  useEffect(() => {
    if (userUID) {
      const getAddressById = async (userUID) => {
        console.log(userUID, "test");
        const response = await Axios.get(
          `http://localhost:3300/api/address/address-list/${userUID}`
        );
        //  console.log(response.data)
        setAddressDetails(response.data);
      };
      getAddressById(userUID);
    }
  }, [userUID]);

  const activeSelect=()=>{
    if(!addressFinal){
      alert('Choose Address!')
    } else{
      const data = {
        shipping_address: addressFinal.address_name
      }
      Axios.put(`http://localhost:3300/api/order/edit-address/${userUID}`, data)
      .then(() => {
      history.push({
        pathname: '/choose-shipping',
        state: addressFinal.city_id
      })
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    }
    
  }

  return (
    <>
      <Container maxWidth="xs" className="mobile">
        <div className="address-page">
          <div className="address-arrow-detail">
            <Link to ="/">
              <button className="back-btn">
                <ArrowBackIcon />
              </button>
            </Link>
            <div>Select address</div>
          </div>
          <div className="address-list">
            {AddressDetails?.map((addressDetail) => (
              <div className="address">
                <input type="radio" 
                name="locradio" className="loc-radio"
                // value={addressDetail.city_id}                
                onChange={()=>setAddressFinal(addressDetail)}
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
              </div>
            ))}
          </div>
          <Link to={`/add-address/${userUID}`}>
            <button className="button-new-address">Add New Address</button>
          </Link>
          <button 
          className="button-confirm"
          onClick={activeSelect}
          >
            Confirm
          </button>
        </div>
      </Container>
    </>
  );
}

export default AddressList;
