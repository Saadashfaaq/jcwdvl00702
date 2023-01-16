import Axios from "axios";
import React, { useEffect, useState } from "react";
import { MoreHoriz, Sell } from "@mui/icons-material";
import { useHistory, Link } from "react-router-dom";
import {
  IconButton,
  InputBase,
  Container,
  Menu,
  MenuItem,
  Button,
  Modal,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useSelector } from "react-redux";

import "../../assets/styles/ProductCategory.css";

export default function ProductCategory() {
  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;

  const history = useHistory();

  useEffect(() => {
    fetchCategories();
  }, []);

  const [setIcon, setSetIcon] = useState(0);
  const [picture, setPicture] = useState("");
  const [setAdd, setSetAdd] = useState(false);
  const [editedIndex, setEditedIndex] = useState("");
  const [delIndex, setDelIndex] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [editName, setEditName] = useState("");

  const [openDel, setOpenDel] = useState(false, "");

  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
  };

  const isEditHandle = (index) => {
    setEditedIndex(index);
  };

  const handleIconChange = (event) => {
    setSetIcon(event.target.value);
  };

  const isDel = (index) => {
    setDelIndex(index);
    setOpenDel(true);
  };

  const deleteBtnHandler = (id) => {
    Axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/product/delete-category/${id}`
    )
      .then(() => {
        setOpenDel(false);
        fetchCategories();
      })
      .catch(() => {
        alert("Server Error!");
      });
  };

  const saveBtnHandler = (id, ifempty) => {
    if (editName === "") {
      setEditName(ifempty);
      Axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/product/edit-category/${id}`,
        {
          name: ifempty,
        }
      )
        .then(() => {
          setEditedIndex("");
          fetchCategories();
        })
        .catch(() => {
          alert("Nama sudah terpakai");
        });
    } else {
      Axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/product/edit-category/${id}`,
        {
          name: editName,
        }
      )
        .then(() => {
          setEditedIndex("");
          fetchCategories();
        })
        .catch(() => {
          alert("Nama sudah terpakai");
        });
    }
  };

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(2, "Too Short!").max(20, "Too Long!"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const data = new FormData();

      data.append("name", values.name);
      data.append("image", picture);

      Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/product/add-category`,
        data
      )
        .then(() => {
          alert("Category Added!");
          setSetAdd(false);
          fetchCategories();
        })
        .catch((error) => {
          alert("Nama sudah terpakai!");
        });
    },
  });

  const fetchCategories = () => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/get-category`)
      .then((result) => {
        setCategoryList(result.data);
      })
      .catch((err) => {
        alert("Terjadi kesalahan di server");
      });
  };

  const menuHandler = () => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <button
              className="account-button"
              variant="contained"
              {...bindTrigger(popupState)}
            >
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem>
                <Link to="/dashboard" className="pladmin-banner-menu-link">
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/user-list" className="pladmin-banner-menu-link">
                  User List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/warehouse-management"
                  className="pladmin-banner-menu-link"
                >
                  Warehouse Mng.
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-list"
                  className="pladmin-banner-menu-link"
                >
                  Product List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/products-management-category"
                  className="pladmin-banner-menu-link"
                >
                  Product Category
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-mutation" className="pladmin-banner-menu-link">
                  Stock Mutation
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/order-list" className="pladmin-banner-menu-link">
                  Order List
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/sales-report" className="pladmin-banner-menu-link">
                  Sales Report
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/stock-history" className="pladmin-banner-menu-link">
                  Stock History
                </Link>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  };

  const categoryCard = () => {
    return categoryList.map((val, index) => {
      return (
        <>
          <div className="apc-card">
            {editedIndex === index ? (
              <>
                <img className="apc-card-icon" src={val.picture} alt="icon" />
                <InputBase
                  sx={{ ml: 1, width: "250px", border: "1px solid grey" }}
                  placeholder={val.name}
                  inputProps={{ "aria-label": "Search" }}
                  className="apc-card-input"
                  onChange={(e) => {
                    setEditName(e.target.value);
                  }}
                />
                <Button
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "rgb(153,255,255,0.9)",
                    fontSize: "8px",
                    fontFamily: "Lora",
                    color: "black",
                    marginLeft: "5px",
                  }}
                  variant="contained"
                  className="apc-card-edit"
                  // onClick={() => {
                  //   console.log('edit', editName);
                  //   if (editName === '') {
                  //     setEditName(val.name);
                  //     saveBtnHandler(val.id);
                  //   } else {
                  //     saveBtnHandler(val.id);
                  //   }
                  // }}>
                  onClick={() => saveBtnHandler(val.id, val.name)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <img className="apc-card-icon" src={val.picture} alt="icon" />
                <div className="apc-card-text">{val.name}</div>
                <Button
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "rgb(255,153,153,0.9)",
                    fontSize: "8px",
                    fontFamily: "Lora",
                    color: "black",
                  }}
                  onClick={() => isDel(index)}
                  variant="contained"
                  className="apc-card-delete"
                  disabled={user?.approle?.role !== "superadmin"}
                >
                  Delete
                </Button>
                <Dialog
                  open={openDel}
                  onClose={() => setOpenDel(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Delete this Category"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure ?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDel(false)}>No</Button>
                    <Button
                      onClick={() =>
                        deleteBtnHandler(categoryList[delIndex].id)
                      }
                      autoFocus
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>

                <Button
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "rgb(255,204,153,0.9)",
                    fontSize: "8px",
                    fontFamily: "Lora",
                    color: "black",
                    marginLeft: "5px",
                  }}
                  variant="contained"
                  className="apc-card-edit"
                  onClick={() => isEditHandle(index)}
                  disabled={user?.approle?.role !== "superadmin"}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </>
      );
    });
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
      <div className="apc-main">
        <div className="apc-banner">
          <IconButton disabled>
            <Sell />
          </IconButton>
          <div className="apc-banner-text">Product Category</div>
          <div className="apc-banner-menu">{menuHandler()}</div>
        </div>
        <div className="apc-content">{categoryCard()}</div>

        <button className="apc-add" disabled={user?.approle?.role !== "superadmin"} onClick={() => setSetAdd(true)}>
          Add New Category
        </button>
        <Modal
          open={setAdd}
          onClose={() => setSetAdd(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Button
              variant="contained"
              component="label"
              sx={{ marginLeft: "130px", marginTop: "100px " }}
            >
              Upload (24px)
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                id="uploadImg"
                onChange={loadPicture}
              />
            </Button>
            <InputBase
              sx={{
                ml: 1,
                border: "1px solid grey",
                backgroundColor: "white",
                width: "220px",
              }}
              placeholder="Category Name"
              inputProps={{ "aria-label": "Search" }}
              className="apc-card-input"
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
            />
            {formik.errors.name ? (
              <div className="alert alert-danger">{formik.errors.name}</div>
            ) : null}

            <Button
              sx={{
                borderRadius: "20px",
                backgroundColor: "rgb(153,255,255,0.9)",
                fontSize: "8px",
                fontFamily: "Lora",
                color: "black",
                marginLeft: "5px",
              }}
              variant="contained"
              className="apc-card-edit"
              onClick={formik.handleSubmit}
            >
              Add
            </Button>
          </Box>
        </Modal>
      </div>
    </Container>
  );
}
