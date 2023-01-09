import axios from "axios";
import "../../../assets/styles/passwordChange.css";
import { useState, useEffect, useRef } from "react";
import { ArrowBack, Visibility, Lock } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";

export default function ResetPassword() {
  const password = useRef();
  const passwordAgain = useRef();
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [email, setEmail] = useState("");

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePassword2 = () => {
    setPasswordShown2(!passwordShown2);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // password:password.current.value
    //passwordAgain:passwordAgain.current.value
  };

  return (
    <div className="password-wrap">
      <Container maxWidth="xs" className="password-container">
        <div className="changepass-topside">
          <div className="changepass-title">
            <div>
              <Link to="/change-password">
                <button className="arrowback">
                  <ArrowBack />
                </button>
              </Link>
            </div>
            <div className="changepass-text">Create New Password</div>
          </div>
          <div className="changepass-img-container">
            <img
              className="changepass-img"
              src="https://icons-for-free.com/iconfiles/png/512/authentication-131964735175664062.png"
            />
          </div>
        </div>
        <div className="changepass-botside">
          <div className="changepass-email-text">Create Your New Password</div>
          <div className="reset-container">
            <div className="password-input">
              <Lock style={{ fill: "gray", marginLeft: "5px" }} />
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Enter New Password"
                className="reset-input"
                required
                ref={password}
                minLength={8}
                // value={inputPassword}
              />
              <button onClick={togglePassword} className="toggle-vis">
                <Visibility style={{ fill: "gray" }} />
              </button>
            </div>
            <div className="password-input">
              <Lock style={{ fill: "gray", marginLeft: "5px" }} />
              <input
                type={passwordShown2 ? "text" : "password"}
                placeholder="Confirm New Password"
                className="reset-input"
                required
                ref={passwordAgain}
                minLength={8}
                // value={inputPassword2}
              />
              <button onClick={togglePassword2} className="toggle-vis">
                <Visibility style={{ fill: "gray" }} />
              </button>
            </div>
          </div>
          <div className="changepass-button">
            <button className="changepass-continue">Confirm</button>
          </div>
        </div>
      </Container>
    </div>
  );
}
