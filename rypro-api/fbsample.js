// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs1mF8yXdrcUiXWhOD0pB6SC7iyjuSOOM",
  authDomain: "rypro-b65a3.firebaseapp.com",
  projectId: "rypro-b65a3",
  storageBucket: "rypro-b65a3.firebasestorage.app",
  messagingSenderId: "766091523900",
  appId: "1:766091523900:web:20afb1a70ebf17a5899039",
  measurementId: "G-93NEFXNJD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);