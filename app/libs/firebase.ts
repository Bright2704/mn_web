// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHTL3xghLlI7kNBv6Et9n5R9G-CnN3Xo0",
  authDomain: "mn-website-b2784.firebaseapp.com",
  projectId: "mn-website-b2784",
  storageBucket: "mn-website-b2784.appspot.com",
  messagingSenderId: "976573682149",
  appId: "1:976573682149:web:f22e19583cfef3d2b2df0c",
  measurementId: "G-GHKMMT20F8"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;