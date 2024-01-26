// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAaWOflD1Hg4VmQJSvlqtdsiIi1HcdNbnk",
    authDomain: "fir-384a7.firebaseapp.com",
    databaseURL: "https://fir-384a7-default-rtdb.firebaseio.com",
    projectId: "fir-384a7",
    storageBucket: "fir-384a7.appspot.com",
    messagingSenderId: "156594093226",
    appId: "1:156594093226:web:a369d063bb10e994a8a4d3",
    measurementId: "G-XZG47XR2V9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);
