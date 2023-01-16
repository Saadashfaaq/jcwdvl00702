import { useState, Fragment, useEffect } from "react";
import { ArrowBack } from "@mui/icons-material";
import {
  Container,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/styles/OrderDetailAdmin.css";
import Axios from "axios";

export default function MyOrderDetail() {
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  const { isLoggedIn, user } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }));
  const userUID = user?.customer_uid;
  console.log(user);
  const userData = user?.role;
  console.log(userData);

  const [activeStep, setActiveStep] = useState();
  const [paymentIsDone, setPaymentIsDone] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [orderitemDet, setOrderitemDet] = useState();

  const getOrderList = async () => {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/order/get-order-cart-product/${userUID}`
    );
    console.log(response?.data);
    console.log(response?.data.orderitems, "ini orderitems");
    setOrderDetails(response?.data);
    setOrderitemDet(response?.data.orderitems);
    setActiveStep(response?.data.status_detail)
  };

  useEffect(() => {
    getOrderList();
  }, []);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const receivedHandler = () => {
    const data = {
      status_detail: 4
    }
    Axios.put(`${process.env.REACT_APP_API_BASE_URL}/order/received/${user.customer_uid}`, data)
    .then(() => {
      alert("received!");
      getOrderList()
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  const steps = [
    {
      label: "Waiting For Payment",
      description: `Waiting for User to upload Proof of Payment. Automatic cancel on 11-12-2022 at 11:34.`,
    },
    {
      label: "Payment Confirmation",
      description: "Waiting Admin Approve Your Payment Proof",
    },
    {
      label: "In Process",
      description: `Waiting Admin send Your Order`,
    },
    {
      label: "In Delivery",
      description: `Wait for shipping update from provider. Track number: 0000123456789. Wait for user confirmation.`,
    },
    {
      label: "Received",
      description: `Order is received. Process is finished.`,
    },
    // {
    //   label: 'Cancelled',
    //   description: `Order is cancelled`,
    // },
  ];

  const orderDetailCard = () => {
    return (
      <div>
        {orderitemDet?.map((orderitem) => (
          <div className="od-card-main">
            <>
              <div className="od-card-image">
                <img
                  src={orderitem?.product.picture}
                  className="od-card-product"
                  alt="Product Image"
                />
              </div>

              <div className="od-card-detail">
                <div className="od-card-detail-name">
                  {orderitem?.product.product_detail}
                </div>
                <div className="od-card-detail-subname">
                  {orderitem?.product.name} | {orderitem?.product.category}
                </div>
                <div className="od-card-detail-bottom">
                  <div className="od-card-detail-bottom-price">
                    Rp {orderitem?.product.price}
                  </div>
                </div>
                <Button
                  disabled
                  className="od-card-button-list"
                  sx={{
                    width: "50px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    backgroundColor: "gray",
                    border: "none",
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  {orderitem.quantity}
                </Button>
              </div>
            </>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "white" }}>
      <div className="oda-main">
        <div className="oda-banner">
          <IconButton onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <div className="oda-banner-text">Order ID: {orderDetails?.id}</div>
        </div>
        <div className="oda-user">
          <div className="oda-user-left">Order Date</div>
          <div className="oda-user-right">
            {orderDetails?.orderitems[0].createdAt}
          </div>
          <div className="oda-user-left">Customer Name</div>
          <div className="oda-user-right">
            {orderDetails?.fullname}
            <div className="oda-user-left">Customer ID</div>
            <div className="oda-user-right">{orderDetails?.customer_uid}</div>
            <div className="oda-user-left">Shipping Address</div>
            <div className="oda-user-right">
              {orderDetails?.shipping_address}
            </div>
          </div>
        </div>
        <div className="oda-step">
          <div className="oda-step-text">Order Status</div>
          <Box sx={{ mb: 2, fontFamily: "Lora" }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel sx={{ fontFamily: "Lora" }}>
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography sx={{ fontFamily: "Lora", fontSize: "11px" }}>
                      {step.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        {index === 0 ? (
                          <Button
                            disabled
                            sx={{
                              mt: 1,
                              mr: 1,
                              fontFamily: "Lora",
                              fontSize: "12px",
                            }}
                          >
                            Waiting...
                          </Button>
                        ) : null}
                        {index === 1 ? (
                          <>
                            {/* <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Reject
                            </Button> */}
                          </>
                        ) : null}
                        {index === 2 ? (
                          <>
                            {/* <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Done
                            </Button> */}
                          </>
                        ) : null}
                        {index === 3 ? (
                          <>
                            <Button
                              variant="contained"
                              onClick={receivedHandler}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Received
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "Lora",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  Order is complete !
                </Typography>
              </Paper>
            )}
          </Box>

        </div>

        <div className="oda-payment">
          <div className="oda-payment-text">Proof of Payment</div>
          <div className="oda-payment-detail">
            <div className="oda-payment-wrapper">
              <div className="oda-payment-left">Total</div>
              <div className="oda-payment-right">
                Rp {orderDetails?.total_price}
              </div>
            </div>
            <div className="oda-payment-wrapper">
              <div className="oda-payment-left">Payment Method</div>
              <div className="oda-payment-right">Bank Transfer</div>
            </div>
          </div>
          <img
            src={orderDetails?.payment_picture}
            alt="Payment Proof"
            className="oda-payment-img"
          />
        </div>

        <div className="oda-list">
          <div className="oda-list-text">Items</div>
          <div className="oda-list-card">{orderDetailCard()}</div>
        </div>
      </div>
    </Container>
  );
}
