import "../../../assets/styles/passwordChange.css";
import { useState, useEffect, useRef } from "react";
import { ArrowBack, Email } from "@mui/icons-material";
import { Link, Redirect } from "react-router-dom";
import { Container } from "@mui/material";
import { firebaseAuthentication } from "../../../config/firebase";
import {useHistory} from "react-router-dom"
import {useFormik} from "formik"
import * as Yup from "yup"
import YupPassword from "yup-password"
import axios from 'axios'
import { useSelector } from "react-redux";


export default function ChangePassword() {
  let history = useHistory()

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));

  // Minimum eight characters, at least one letter, one number and one special character
  const passwordRules = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" 

  YupPassword(Yup)
  const formik = useFormik({
    initialValues:{
      email:""
    },
    validationSchema : Yup.object().shape({
      email : Yup.string().required("Invalid Email").email("Invalid Email Format"),

    }),
    validateOnChange:false,
    onSubmit:async(values)=>{
      if(values.email == user.email){
        firebaseAuthentication.sendPasswordResetEmail(values.email)
        .then(()=>{
          alert('Check Email to Change Password')
          history.push('/')
        })
        .catch(err=>{
          alert(err.message)
        })
      } else{
        alert('Logged In as Social Account, Cannot Change Password')
      }
    }
  })

  return (
    <div className="password-wrap">
      <Container maxWidth="xs" className="password-container">
        {user?.social_login==true ? <Redirect to="/"/> : null}
        <div className="changepass-wrapper">
          <div className="changepass-topside">
            <div className="changepass-title">
              <div>
                <Link to="/">
                <button className="arrowback">
                  <ArrowBack />
                </button>
                </Link>
              </div>
              <div className="changepass-text">Change Password</div>
            </div>
            <div className="changepass-img-container">
              <img
                className="changepass-img"
                src="http://cdn.onlinewebfonts.com/svg/img_398183.png"
              />
            </div>
          </div>
          <div className="changepass-botside">
            <div className="changepass-email-text">
              Please Enter Your Email Below
            </div>
            <div className="password-input">
              <Email style={{ fill: "gray", marginLeft: "5px" }} />
              <input
                placeholder="Email"
                className="reset-input"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
              />
            </div>
            <div className="changepass-button">
              <Link to="/reset-password">
                <button className="changepass-continue" 
                  onClick={formik.handleSubmit}
                >
                  Send
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
