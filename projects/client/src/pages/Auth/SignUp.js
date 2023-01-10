import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Button,
  InputAdornment,
  Input,
  FormControl,
  IconButton,
  Container,
} from '@mui/material';
import { Email, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { firebaseAuthentication, googleProvider, facebookProvider } from '../../config/firebase.js';
import '../../assets/styles/SignIn.css';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actionCreators/authActionCreators';

function SignUp() {
  let history = useHistory();
  const dispatch = useDispatch();

  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     history.push('/');
  //   }
  // });

  const [isCheck, setIscheck] = useState(true);
  const changeIsCheck = () => {
    setIscheck(!isCheck);
  };

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      email: '',
      fullname: '',
      password: 'dummyPassword',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('your email is invalid').email('format yang dimasukan bukan email'),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      firebaseAuthentication
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          firebaseAuthentication.currentUser
            .sendEmailVerification()
            .then(() => {
              firebaseAuthentication.currentUser
                .updateProfile({
                  displayName: values.fullname,
                })
                .then((user) => {
                  console.log(user);
                  const data = {
                    user: user.user.providerData[0],
                    id: user.user.id,
                  };

                  dispatch(loginUser(data));
                })
                .catch((err) => {
                  console.log(err);
                });
              alert('Mohon verifikasi email anda');
              history.push('/create-password');
            })
            .catch((error) => {
              alert(error.message);
            });

          var user = res.user;
          console.log('cek data user', user);
          const data = {
            email: values.email,
            fullname: values.fullname,
            password: values.password,
            is_verified: user.emailVerified,
            customer_uid: user.uid,
          };
          const reduxData = {
            user: user.providerData[0],
            id: user.uid,
          };
          console.log(reduxData);
          return data;
        })
        .catch((err) => {
          // Handle Errors here.
          var errorCode = err.code;
          var errorMessage = err.message;
          // The email of the user's account used.
          var email = err.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = err.credential;
          // ...
        })
        .then((data) => {
          Axios.post('http://localhost:3300/api/customer/register', data)
            .then(() => {
              return;
            })
            .catch((error) => {
              console.log(error);
              alert(error);
            });
          // dispatch(loginUser(reduxData))
        });
    },
  });

  // masuk melalui Google//

  const handleLoginWithGoogle = async () => {
    firebaseAuthentication
      .signInWithPopup(googleProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        const data = {
          email: user.email,
          fullname: user.displayName,
          is_verified: user.emailVerified,
          customer_uid: user.uid,
        };

        return data;
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      })
      .then((data) => {
        console.log('here', data);

        Axios.post('http://localhost:3300/api/customer/register-social', data)
          .then(() => {
            history.push('/');
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      });
  };

  // masuk melaui Facebook //

  const handleLoginWithFacebook = async () => {
    firebaseAuthentication
      .signInWithPopup(facebookProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        const data = {
          email: user.email,
          fullname: user.displayName,
          is_verified: user.emailVerified,
          customer_uid: user.uid,
        };

        return data;
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      })
      .then((data) => {
        console.log('here', data);

        Axios.post('http://localhost:3300/api/customer/register-social', data)
          .then(() => {
            history.push('/');
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      });
  };

  //   Axios.post('http://localhost:3300/api/customer/register-social', data)
  //     .then(() => {
  //       history.push('/');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert(error);
  //     });
  // };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      <div className="sign-in-main">
        <div className="sign-in-label">Create Your Account</div>
        <div className="sign-up-form">
          <FormControl variant="standard" className="sign-in-form-input">
            <Input
              name="email"
              onChange={(e) => formik.setFieldValue('email', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px' }}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              placeholder="Email"
            />
          </FormControl>

          <FormControl variant="standard" className="sign-in-form-input">
            <Input
              name="fullname"
              onChange={(e) => formik.setFieldValue('fullname', e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: '7px' }}
              startAdornment={
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              }
              placeholder="Full Name"
            />
          </FormControl>

          <div className="sign-in-form-check">
            <FormControlLabel
              control={<Checkbox />}
              sx={{ marginRight: '0px' }}
              // value={this.state.isCheck}
              // onChange={(e) => {
              //   this.setState({
              //     ...this.state,
              //     isCheck: !this.state.isCheck,
              //   });
              // }}
              onClick={changeIsCheck}
            />
            <div>Agree to </div>
            <Link to="/" className="sign-in-form-check-text" style={{ marginLeft: '4px' }}>
              Terms & Conditions
            </Link>
          </div>

          <Button
            sx={{ borderRadius: '20px', backgroundColor: 'black' }}
            variant="contained"
            disabled={isCheck ? true : false}
            className="sign-in-form-button"
            onClick={formik.handleSubmit}>
            Sign up
          </Button>
        </div>
        <div className="sign-up-social">
          <div className="sign-in-social-1">or continue with</div>
          <div
            classname="sign-in-social-2"
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '82px',
            }}>
            <div classname="sign-in-social-2-fb">
              <IconButton onClick={handleLoginWithFacebook}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                  <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                </svg>
              </IconButton>
            </div>
            <div classname="sign-in-social-2-g">
              <IconButton onClick={handleLoginWithGoogle}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
              </IconButton>
            </div>
            <div classname="sign-in-social-2-a">
              <IconButton>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                  <path
                    fill="#03A9F4"
                    d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
                </svg>
              </IconButton>
            </div>
          </div>
        </div>
        <div className="sign-up-register">
          <div className="sign-in-register-1">Already have an account? </div>
          <Link to="/sign-in" className="sign-in-register-2">
            Sign in
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;
