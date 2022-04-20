// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDdGK3eo5ycixAg6_HaxEFfJkrABSe0YUE",
    authDomain: "goalapp-86a14.firebaseapp.com",
    projectId: "goalapp-86a14",
    storageBucket: "goalapp-86a14.appspot.com",
    messagingSenderId: "1040143397761",
    appId: "1:1040143397761:web:39666b798b0ec6894b6e80",
    measurementId: "G-JWSBCBT9SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line
const analytics = getAnalytics(app);
// setup firestore db

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export default db;
