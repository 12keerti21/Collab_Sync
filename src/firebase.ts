import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQgAgWnNkqAb21TW3Fy6uqkfYIrZ1sxQg",
  authDomain: "collabsync-27407.firebaseapp.com",
  projectId: "collabsync-27407",
  storageBucket: "collabsync-27407.firebasestorage.app",
  messagingSenderId: "21840907250",
  appId: "1:21840907250:web:792459993cce5f9246b96b",
  measurementId: "G-MG1XPST5SR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
