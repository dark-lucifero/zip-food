import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCn59JjNkIuV_7_3WmzbT5yakaTPu3G-FA",
  authDomain: "zipfood-e0975.firebaseapp.com",
  projectId: "zipfood-e0975",
  storageBucket: "zipfood-e0975.firebasestorage.app",
  messagingSenderId: "486354692654",
  appId: "1:486354692654:web:8eac46d2691edc7ca64dbf",
  measurementId: "G-9QYMTGS7LX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);