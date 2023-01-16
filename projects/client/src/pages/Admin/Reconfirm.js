import React from 'react';
import Axios from 'axios'
import { Container } from "@mui/material";
import {Email,Password} from '@mui/icons-material'
import { useHistory } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { loginUser,logoutUser } from '../../redux/actionCreators/authActionCreators';
import { firebaseAuthentication } from '../../config/firebase';
import '../../assets/styles/reconfirmAdmin.css'

export default function Reconfirm(){
    let history = useHistory();
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector((state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
    }));

    const userCheck=()=>{
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/profile/${user?.customer_uid}`)
        .then(res=>{
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleLogout = () => {
        firebaseAuthentication.signOut().then(() => {
            dispatch(logoutUser());
            history.push('/sign-in')
            return false
        })
        .catch((error) => {
            alert(error);
        });
    };

    useEffect(()=>{
        userCheck()
    },[])

    YupPassword(Yup);
    const formik = useFormik({
        initialValues: {
        email: '',
        password: '',
        },
        validationSchema: Yup.object().shape({
        email: Yup.string().required('Email Invalid').email('Format is not Email'),
        password: Yup.string().required('Please Enter your password').min(6, "Password too short")
        }),
        validateOnChange: false,
        onSubmit: async (values) => {
        firebaseAuthentication
            .signInWithEmailAndPassword(values.email, values.password)
            .then((res) => {
            console.log(res);
            const data = {
                user: res.user.providerData[0],
                id: res.user.uid,
            };
            dispatch(loginUser(data));
            if (user.approle.role === 'superadmin') {
                history.push('/user-list');
            } else {
                firebaseAuthentication.signOut();
                dispatch(logoutUser());
                history.push('/')
            }
            })
            .catch((err) => {
            alert('Error Submitting Data');
            });
        },
    });


    return(
        <div className='reconfirm-wrap'>
            {/* {user?.approle.role !== "superadmin" ? handleLogout() : null} */}
            <Container maxWidth="xs" sx={{ backgroundColor: 'white' }} className='reconfirm-container'>
                <div className='top-wrapper'>
                    <div className='reconfirm-title'>
                        Admin Confirmation
                    </div>
                    <div className='img-wrapper'>
                        <img
                            className='reconfirm-img'
                            src="https://media.istockphoto.com/id/1124964231/vector/check-mark-logo-vector-or-icon.jpg?s=612x612&w=0&k=20&c=qDcZHKlPnO8Ux_1ja77xfUmcAUsZquejrSfFaJpPPYo=" 
                        />
                    </div>
                </div> 
                <div className='bot-wrapper'>
                    <div className='box-input'>
                        <Email style={{ fill: "gray", marginLeft: "5px" }} />
                        <input
                            placeholder="Email"
                            className="input-admin"
                            type="email"
                            onChange={(e) => formik.setFieldValue('email', e.target.value)}
                        />
                    </div>
                    <div className='box-input'>
                        <Password style={{ fill: "gray", marginLeft: "5px" }} />
                        <input
                            placeholder="Password"
                            className="input-admin"
                            type="password"
                            onChange={(e) => formik.setFieldValue('password', e.target.value)}
                        />
                    </div>
                </div>
                <div className='btn-wrapper'>
                    <button className='btn-confirm' onClick={formik.handleSubmit}>Confirm</button>
                </div>
            </Container>
        </div>
        
    )
}