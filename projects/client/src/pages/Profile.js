import React, { useContext, useState, useEffect } from "react";
import "../assets/styles/profile.css";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Container from "@mui/material/Container";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

function Profile() {
  const { isLoggedIn, user } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
    }),
  );
  const userUID = user?.customer_uid
  const profileData = user

  const [fullname, setFullname] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();

  useEffect(() => {
    console.log(userUID, "useeffect check");
    if (userUID) {
      const getUserById = async (userUID) => {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/customer/profile/${userUID}`
        );
        console.log(JSON.stringify(response));
        setPicture(response.data.picture);
        setFullname(response.data.fullname);
        setEmail(response.data.email);
      };
      getUserById(userUID);
    }
  }, [userUID]);

  const btnHandler=()=>{
    history.push('/change-password')
  }

  const goBack = () => {
    history.goBack();
  };

  return (
    <Container maxWidth="xs">
      <div className="profilePage">
        <div className="backPage">
          <ArrowBackIcon onClick={goBack} /> Homepage
        </div>
        <div className="profilePic">
          <img className="profileUserImg" src={picture} alt="" />
        </div>
        <div className="profilebar">
          <div className="profileWrapper">
            <ul className="profileList">
              <li className="profileListItem">
                <PersonIcon className="profileIcon" />
                <span className="profileListItemText">{fullname}</span>
              </li>
              <li className="profileListItem">
                <EmailIcon className="profileIcon" />
                <span className="profileListItemText">{email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="profileOption">
          <Link to={`/edit-profile/${userUID}`} style={{ textDecoration: 'none' }}>
            <button className="optionBtn">
              <EditIcon />
              <span className="optionBtnText">Edit Profile</span>
              <ArrowForwardIosIcon />
            </button>
          </Link>
          
          <Link to="/change-password" style={{ textDecoration: 'none' }}>
            <button className="optionBtn" disabled={profileData?.social_login==true} onClick={btnHandler}>
              <EditIcon />
              <span className="optionBtnText">Edit Password</span>
              <ArrowForwardIosIcon />
            </button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default Profile;
