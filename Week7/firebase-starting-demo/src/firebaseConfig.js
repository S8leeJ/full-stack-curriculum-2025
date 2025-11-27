// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqjwGxSoUc291welQY0LTZIRl_r6MHufc", // just to identify the project
  authDomain: "week7-demo-61345.firebaseapp.com",
  projectId: "week7-demo-61345",
  storageBucket: "week7-demo-61345.firebasestorage.app",
  messagingSenderId: "136076047744",
  appId: "1:136076047744:web:5d62cb99d85dbe012dfd65",
  measurementId: "G-4GETVBC1B2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

