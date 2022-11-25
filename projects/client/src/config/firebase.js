import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbsjClBonrYoBLtwILY3SWHoqldOd_Cxw",
    authDomain: "multi-warehouse-app.firebaseapp.com",
    projectId: "multi-warehouse-app",
    storageBucket: "multi-warehouse-app.appspot.com",
    messagingSenderId: "949864193998",
    appId: "1:949864193998:web:d9c632d468385df4bfd59f"
  };
  // Initialize Firebase
const init = firebase.initializeApp(firebaseConfig);
export const firebaseAuthentication = init.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider()