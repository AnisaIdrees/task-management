import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  query,
  onSnapshot,updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0TSSmvAknUoSFd-k9gf9qqiXaKbMFghE",
  authDomain: "mini-hackathon-2e2e0.firebaseapp.com",
  projectId: "mini-hackathon-2e2e0",
  storageBucket: "mini-hackathon-2e2e0.firebasestorage.app",
  messagingSenderId: "350890594739",
  appId: "1:350890594739:web:22a46b5372fa39a6a97bc6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  collection,
  addDoc,
  db,
  getDocs,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
  query,
  getDoc,
  deleteDoc,  onSnapshot,
  
};
