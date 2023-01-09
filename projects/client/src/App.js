import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import CreatePassword from "./pages/Auth/CreatePassword";
import MyOrder from "./pages/MyOrder";
import MyOrderDetail from "./pages/MyOrderDetail";
import Dashboard from "./pages/Admin/Dashboard";
import UserList from "./pages/Admin/UserList";
import DetailUser from "./pages/Admin/DetailUser";
import AddUser from "./pages/Admin/AddUser";
import ProductCategory from "./pages/Admin/ProductCategory";
import ProductListAdmin from "./pages/Admin/ProductListAdmin";
import ProductDetailAdmin from "./pages/Admin/ProductDetailAdmin";
import ProductAdd from "./pages/Admin/ProductAdd";
import WarehouseManagement from "./pages/Admin/WarehouseManagement";
import AddWarehouse from "./pages/Admin/AddWarehouse";
import DetailWarehouse from "./pages/Admin/DetailWarehouse";
import StockMutation from "./pages/Admin/StockMutation";
import OrderList from "./pages/Admin/OrderList";
import StockHistory from "./pages/Admin/StockHistory";
import ProductStockHistory from "./pages/Admin/ProductStockHistory";
import SalesReport from "./pages/Admin/SalesReport";
import OrderDetailAdmin from "./pages/Admin/OrderDetailAdmin";
import ProductDetail from "./pages/ProductDetail";
import ChangePassword from "./pages/Auth/PasswordChange/ChangePassword";
import ResetPassword from "./pages/Auth/PasswordChange/ResetPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductLists from "./pages/ProductLists";
import ChooseShipping from "./pages/ChooseShipping";
import AddressList from "./pages/AddressList";
import NewAddress from "./pages/NewAddress";
import EditAddress from "./pages/EditAddress";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import EditWarehouse from "./pages/Admin/EditWarehouse";
import HomeFunc from "./pages/HomeFunc";
import Main from "./pages/Main";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { firebaseAuthentication } from "./config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginUser } from "./redux/actionCreators/authActionCreators";
import Axios from "axios";


export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    firebaseAuthentication.onAuthStateChanged((user) => {
      const data = {
        user: user.providerData[0],
        id: user.uid,
      };
      Axios.get(`http://localhost:3300/api/admin/get-user-one/${data.id}`)
        .then((res) => {
          const getRes = res.data;
          const dataPersist = {
            user: getRes.result,
            id: getRes.result.customer_uid,
          };
          dispatch(loginUser(dataPersist));
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
      dispatch(loginUser(data));
    });
  }, []);

  const user = useSelector((state) => ({
    user: state.auth.user,
  }));
  const mainUser = user.user;
  console.log(mainUser);

  return (
    <BrowserRouter>
      <Switch>
        <Route component={SignUp} path="/sign-up" />
        <Route component={SignIn} path="/sign-in" />
        <Route path="/sign-up">
          {mainUser ? <Redirect to="/" /> : <SignUp />}
        </Route>
        <Route path="/sign-in">
          {mainUser ? <Redirect to="/" /> : <SignIn />}
        </Route>
        <Route component={CreatePassword} path="/create-password" />
        <Route component={MyOrder} path="/my-order/:userUID" />
        <Route component={MyOrderDetail} path="/my-order-detail/:userUID" />
        <Route path="/dashboard">
          {mainUser?.role == "user" ? <Redirect to="/" /> : <Dashboard />}
        </Route>
        <Route component={Dashboard} path="/dashboard" />
        <Route component={UserList} path="/user-list" />
        <Route component={DetailUser} path="/detail-user" />
        <Route component={AddUser} path="/add-user" />
        <Route
          component={ProductCategory}
          path="/products-management-category"
        />
        <Route component={ProductListAdmin} path="/products-management-list" />
        <Route
          component={ProductDetailAdmin}
          path="/products-management-detail/:id"
        />
        <Route component={ProductAdd} path="/products-management-add" />
        <Route component={WarehouseManagement} path="/warehouse-management" />
        <Route component={AddWarehouse} path="/add-warehouse" />
        <Route component={DetailWarehouse} path="/detail-warehouse/:id" />
        <Route component={EditWarehouse} path="/edit-warehouse/:id" />
        <Route component={StockMutation} path="/stock-mutation" />
        <Route component={OrderList} path="/order-list" />
        <Route
          component={OrderDetailAdmin}
          path="/order-detail-admin/:userUID"
        />
        <Route component={StockHistory} path="/stock-history" />
        <Route
          component={ProductStockHistory}
          path="/product-stock-history/:id"
        />
        <Route component={SalesReport} path="/sales-report" />
        <Route component={ProductDetail} path="/product-detail/:id" />
        <Route component={ProductLists} path="/product-list" />
        <Route component={AddressList} path="/address-list/:userUID" />
        <Route component={NewAddress} path="/add-address/:userUID" />
        <Route component={EditAddress} path="/edit-address/:userUID/:id" />
        <Route component={ChangePassword} path="/change-password" />
        <Route component={ResetPassword} path="/reset-password" />
        <Route component={Profile} path="/profile/:userUID" />
        <Route component={EditProfile} path="/edit-profile/:userUID" />
        <Route component={ChooseShipping} path="/choose-shipping" />
        <Route component={Cart} path="/cart/:id" />
        <Route component={Checkout} path="/checkout/:id/:orderId" />
        <Route component={Payment} path="/payment/:id/:orderId" />
        <Route component={Main} path="/" />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
