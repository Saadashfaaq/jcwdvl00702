import React from "react";
import {
  Button,
  Input,
  FormControl,
  Container,
  InputAdornment,
} from "@mui/material";
import { firebaseAuthentication } from "../../config/firebase.js";
import firebase from "firebase";
import { Email } from "@mui/icons-material";
import "../../assets/styles/SignIn.css";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

function CreatePassword() {
  // untuk pindah page
  let history = useHistory();

  // Send Email untuk membuat Password menggunakan formik dan yup

  // konfigurasi yup
  YupPassword(Yup);
  //isinialisasi formik
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("your email is invalid")
        .email("format yang dimasukan bukan email"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const user = firebase.auth().currentUser;
      console.log("user :", user);
      if (user.emailVerified === true) {
        firebaseAuthentication
          .sendPasswordResetEmail(values.email)
          .then((res) => {
            alert('Silahkan periksa email anda untuk mengubah password');
            firebaseAuthentication.signOut();
            history.push('/sign-in')
          })
          .catch((error) => {
            alert(error.message);
          });
        // .then((data) => {
        //   Axios.put(`${process.env.REACT_APP_API_BASE_URL}/customer/verify/${user.customer_uid}`,data)
        //     .then(() => {
        //       return;
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //       alert(error);
        //     });
        // });
      } else {
        alert("mohon Verifikasi email Anda Terlebih Dahulu");
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
      <div className="sign-in-main">
        <div className="sign-in-label">Create Your Password</div>
        <div className="create-pass-form">
          <FormControl variant="standard" className="sign-in-form-input">
            <Input
              name="email"
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              id="input-with-icon-adornment"
              sx={{ padding: "7px" }}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              placeholder="Email"
            />
          </FormControl>
        </div>
        <Button
          onClick={formik.handleSubmit}
          sx={{
            borderRadius: "20px",
            backgroundColor: "black",
            marginTop: "45px",
          }}
          variant="contained"
          className="sign-in-form-button"
        >
          send Email for create password
        </Button>
      </div>
    </Container>
  );
}

export default CreatePassword;
