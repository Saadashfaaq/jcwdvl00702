import React, { useContext, useState, useEffect } from "react";
import "../assets/styles/editProfile.css";
import { InputAdornment, Input, FormControl } from "@mui/material";
import { Email, Person } from "@mui/icons-material";
import Container from "@mui/material/Container";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

function EditProfile() {
  // const { user: currentUser } = useContext(AuthContext);
  //  console.log(currentUser);
  // const userUID = currentUser?.uid;
  // console.log(userUID);

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(user);

  const [fullname, setFullname] = useState("");
  const [picture, setPicture] = useState("");
  const [preview, setPreview] = useState("");
  const history = useHistory();

  useEffect(() => {
    console.log(userUID, "useeffect check");
    if (userUID) {
      const getUserById = async (userUID) => {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/customer/profile/${userUID}`
        );
        console.log(response, "halo");
        setFullname(response.data.fullname);
        setPicture(response.data.picture);
      };
      getUserById(userUID);
    }
  }, [userUID]);

  const goBack = () => {
    history.goBack();
  };

  // const getUserById = async(userUID) => {
  //     const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/profile/${userUID}`);
  //     console.log(response)
  //     setFullname(response.data.fullname);
  //     setPicture(response.data.picture);
  // }

  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("picture", picture);
    try {
      await Axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/customer/edit-profile/${userUID}`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      alert("Berhasil");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <div className="editProfilePage">
        <div className="backPage">
          <ArrowBackIcon onClick={goBack} /> Profile
        </div>
        <div className="profilePic">
          <label for="uploadImg">
            <i>
              {/* <button className="editPicBtn"> */}
              <AddAPhotoIcon />
              {/* </button> */}
            </i>
          </label>
          <input
            type="file"
            id="uploadImg"
            onChange={loadPicture}
            style={{ display: "none", visibility: "none" }}
          />
          {console.log(picture, "here")}
          {preview ? (
            <img className="profileUserImg" src={preview} alt="" />
          ) : (
            <img className="profileUserImg" src={picture} alt="" />
          )}
        </div>
        <div className="editForm">
          <FormControl variant="standard" className="editFormInput">
            <Input
              sx={{ padding: "7px" }}
              endAdornment={
                <InputAdornment position="end">
                  <Person />
                </InputAdornment>
              }
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </FormControl>

          {/* <FormControl className="editFormInput">
                        <Input
                        sx={{ padding: '7px' }}
                        endAdornment={
                           <InputAdornment position="end">
                            <Email />
                           </InputAdornment>
                        }
                         placeholder="Email"
                        />
                    </FormControl> */}
        </div>
        <div className="saveButton">
          <button class="btn-lp" onClick={updateProfile}>
            Save Your Profile
          </button>
        </div>
      </div>
    </Container>
  );
}

export default EditProfile;
