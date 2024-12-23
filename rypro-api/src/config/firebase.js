// require("dotenv").config();

const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail

} = require("firebase/auth") ;

// import admin from 'firebase-admin';
const { initializeApp } = require("firebase-admin/app");
// import serviceAccount from "../firebaseService.json" assert { type: "json" };

// const { collection, getDocs, getFirestore, query, where } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// const admin = initializeApp(firebaseConfig);

// const firestore = getFirestore(fsapp);
// const fsapp = initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

module.exports = {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
};

