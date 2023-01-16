import React from 'react';
import { IconButton, Container, FormControl, Input, InputAdornment, Select, MenuItem } from '@mui/material';
import { ArrowBack, Person, Email, Lock, AddAPhoto, Visibility, VisibilityOff } from '@mui/icons-material';
import '../../assets/styles/AddUser.css';
import '../../assets/styles/DetailUser.css';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { firebaseAuthentication } from '../../config/firebase';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../redux/actionCreators/authActionCreators';

export default function AddUser() {
  let history = useHistory();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [roleSelect,setRoleSelect] = useState("")

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowRepassword = () => {
    setShowRepassword(!showRepassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const alertRole=()=>{
    console.log(roleSelect)
  }

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      email: '',
      fullname: '',
      password: '',
      repassword: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('No email entered').email('Not an email format'),
      fullname: Yup.string()
        .required('No fullname entered')
        .matches(/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi, 'Name can only contain Latin letters.')
        .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.'),
      password: Yup.string()
        .required('No password entered')
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
      repassword: Yup.string()
        .required('Re enter your password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      firebaseAuthentication
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          firebaseAuthentication.currentUser
            .updateProfile({
              displayName: values.fullname,
            })
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
          var user = res.user;
          console.log(`User check`, user);
          const data = {
            email: values.email,
            fullname: values.fullname,
            password: values.password,
            is_verified: true,
            customer_uid: user.uid,
          };
          return data;
        })
        .catch((err) => {
          // alert(err.message)
          var errorCode = err.code;
          var errorMessage = err.message;
          var email = err.email;
          var credential = err.credential;
        })
        .then((data) => {
          Axios.post(`${process.env.REACT_APP_API_BASE_URL}/customer/approle`,{
            customer_uid:data.customer_uid,
            role:"adminTBA"
          })
          .then(res=>{
            Axios.post(`${process.env.REACT_APP_API_BASE_URL}/customer/register`, {
              email: data.email,
              fullname: data.fullname,
              password: data.password,
              is_verified: data.is_verified,
              customer_uid: data.customer_uid,
            })
              .then(()=>{
                console.log(res,': user register response')
                alert('New admin created, please relog to continue managing dashboard')
                firebaseAuthentication.signOut()
                dispatch(logoutUser());
                history.push('/sign-in')
            })
              .catch((error) => {
              console.log(error);
            });
          })
          .catch(err=>{
            console.log(err)
          })
        });
    },
  });

  // const handleChange = (event, value) => {
  //   this.setState({ ...this.state, withPassword: true });
  // };

  const goBack = () => {
    history.goBack();
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      <div className="adduser-main">
        <div className="adduser-banner">
          <IconButton onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <div className="adduser-banner-text">Add New User</div>
        </div>
        <div className="adduser-avatar">
          <img
            className="adduser-avatar-photo"
            src="https://media.istockphoto.com/id/1309328823/photo/headshot-portrait-of-smiling-male-employee-in-office.jpg?b=1&s=170667a&w=0&k=20&c=MRMqc79PuLmQfxJ99fTfGqHL07EDHqHLWg0Tb4rPXQc="
            alt=""
          />
          {/* <button className="adduser-avatar-icon">
            <AddAPhoto />
          </button> */}
        </div>
        <div className="adduser-form">
          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="fullname"
              onChange={(e) => formik.setFieldValue('fullname', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px', border: 'none' }}
              startAdornment={
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              }
              placeholder="Fullname"
            />
          </FormControl>
          {formik.errors.fullname ? <div className="alert-danger">{formik.errors.fullname}</div> : null}

          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="email"
              onChange={(e) => formik.setFieldValue('email', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px', border: 'none' }}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              placeholder="Email"
            />
          </FormControl>
          {formik.errors.email ? <div className="alert-danger">{formik.errors.email}</div> : null}

          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="password"
              onChange={(e) => formik.setFieldValue('password', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px' }}
              type={showPassword ? 'text' : 'password'}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Password"
            />
          </FormControl>
          {formik.errors.password ? <div className="alert-danger">{formik.errors.password}</div> : null}

          <FormControl variant="standard" className="adduser-form-input">
            <Input
              name="repassword"
              onChange={(e) => formik.setFieldValue('repassword', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px' }}
              type={showRepassword ? 'text' : 'password'}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowRepassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {showRepassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Re-enter Password"
            />
          </FormControl>
          {formik.errors.repassword ? <div className="alert-danger">{formik.errors.repassword}</div> : null}
        </div>
        <div className="adduser-button">
          <button class="adduser-button-2" onClick={formik.handleSubmit}>
            Add User
          </button>
          {/* <button onClick={alertRole}>Check role</button> */}
        </div>
      </div>
    </Container>
  );
}
