import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config 
const firebaseConfig = {
    apiKey: "AIzaSyCoh1AqO8QYXs7ZibUIvLeNlzcpTvwyI7A",
    authDomain: "dayweekmonth-8b040.firebaseapp.com",
    projectId: "dayweekmonth-8b040",
    storageBucket: "dayweekmonth-8b040.firebasestorage.app",
    messagingSenderId: "784608411104",
    appId: "1:784608411104:web:f87e9f93fd365adec0ff85",
    measurementId: "G-WL63FR7KXN"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 