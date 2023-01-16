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
import "../../assets/styles/OrderDetailAdmin.css";
import Axios from "axios";

export default function OrderDetailAdmin() {
  const history = useHistory();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState();
  const [paymentIsDone, setPaymentIsDone] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [orderitemDet, setOrderitemDet] = useState();
  const [userId, setUserId] = useState();
  const [destination, setDestination] = useState()

  const [allWH,setAllWH]=useState()
  const [homeLat,setHomeLat]=useState()
  const [homeLon,setHomeLon]=useState()
  console.log("all wh setelah dirutkan", allWH)


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

  const userCalledId = location?.state;
  console.log(userCalledId);

 

  useEffect(() => {
    getOrderList();
  }, []);


const getOrderList = async () => {
  const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/get-order-cart-product/${userCalledId}`);
  console.log("ini data order",response?.data);
  console.log(response?.data.orderitems, 'ini orderitems');
  setOrderDetails(response?.data);
  setOrderitemDet(response?.data.orderitems);
  setActiveStep(response?.data.status_detail)
  setDestination(response?.data.shipping_address)
 
  // Mengambil data WH untuk dirutkan 
  Axios.get(`${process.env.REACT_APP_API_BASE_URL}/warehouse/warehouse-list-stock`)
  .then(res=>{
    console.log("ini WH DATA", res.data)
      setAllWH(res.data)
  })
  
  // get home lat & long
  Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/address-city-id-order/${userCalledId}/${response.data.shipping_address}`)
  .then(res=>{
    console.log("ini Homeid", res.data)
        // setHomeId(res.data.city_id)
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/address-city-id/${res.data.city_id}`)
        .then(res=>{
            setHomeLat(res.data.latitude)
            setHomeLon(res.data.longitude)
        })
      })

      // mengecek jarak ke wh terdekat
      distanceCheck()
};



const getDistance=(lat1,lon1,lat2,lon2)=>{
  let R = 6371 //in km
  let dLat = toRad(lat2-lat1);
  let dLon = toRad(lon2-lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  let d = R * c;
  return d;
}
const toRad=(val)=>{
  return val * Math.PI / 180
}
const compareDist=(a,b)=>{
    if(a.totalDistance < b.totalDistance){
        return -1
    }
    if(a.totalDistance > b.totalDistance){
        return 1
    }
    return 0
}


const distanceCheck=()=>{
    let mathDist=[]
    for (let x=0; x<allWH.length; x++){
            mathDist.push(getDistance(parseInt(homeLat),parseInt(homeLon),parseInt(allWH[x].latitude),parseInt(allWH[x].longitude)))
            allWH[x].totalDistance=mathDist[x]
    }
    allWH.sort(compareDist) //now allWh are sorted from nearest to furthest
    console.log("ini wh terdekat", allWH)
}


  const handleApprove = () => {

   for(let i = 0 ; i < orderitemDet.length; i++){
    const stockData = {
      whList: allWH,
      orderitem: orderitemDet[i]
    }
     
    console.log("stock data", stockData)
    Axios.post('${process.env.REACT_APP_API_BASE_URL}/product/qty-handler', stockData)
    .then((res) => {
      console.log("ini res data stock mut", res.data)
      const stockDataHistory = {
        stockmutation_id: res.data.id,
        respond: `accept`,
      }
      Axios.post('${process.env.REACT_APP_API_BASE_URL}/product/qty-handler-history', stockDataHistory)
      .then(() => {
      })
      .catch((error) => {
      });
    })
    .catch((error) => {
    });
   }

   const data = {
    status_detail: 2
  }
  console.log("ini user:", orderDetails?.customer_uid)
  Axios.put(`${process.env.REACT_APP_API_BASE_URL}/order/approve-reject-send/${orderDetails?.customer_uid}`, data)
  .then(() => {
    alert("approved!");
    getOrderList()
  })
  .catch((error) => {
    console.log(error);
    alert(error);
  });


  };

  const handleReject = () => {
    const data = {
      status_detail: 0
    }
    Axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/order/approve-reject-send/${orderDetails?.customer_uid}`,
      data
    )
      .then(() => {
        alert("rejected!");
        getOrderList();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleSendOrder = () => {
    const data = {
      status_detail: 3
    }
    Axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/order/approve-reject-send/${orderDetails?.customer_uid}`,
      data
    )
      .then(() => {
        alert("send product!");
        getOrderList();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };



  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const steps = [
    {
      label: "Waiting For Payment",
      description: `Waiting for User to upload Proof of Payment. Automatic cancel on 11-12-2022 at 11:34.`,
    },
    {
      label: "Payment Confirmation",
      description: "See Proof of Payment first.",
    },
    {
      label: "In Process",
      description: `Click "Done" only if the order is ready for shipping.`,
    },
    {
      label: "In Delivery",
      description: `Wait for shipping update from provider. Track number: 0000123456789. Wait for user confirmation.`,
    },
    {
      label: "Received",
      description: `Order is received by User. Process is finished.`,
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

  const paymentDetail = [
    { title: "Total", value: "Rp 126.789.999 ,-" },
    { title: "Payment Method", value: "Bank Transfer" },
  ];

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
                        {index === 0 || index === 3 ? (
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
                            <Button
                              variant="contained"
                              onClick={handleApprove}
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
                              onClick={handleReject}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                        {index === 2 ? (
                          <>
                            <Button
                              variant="contained"
                              onClick={handleSendOrder}
                              sx={{
                                mt: 1,
                                mr: 1,
                                fontFamily: "Lora",
                                fontSize: "12px",
                              }}
                            >
                              Done
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