import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3EsSB6RS_SGILzyvzrXlmse8vE9K_va4",
  authDomain: "react-todo-ts-19ae3.firebaseapp.com",
  projectId: "react-todo-ts-19ae3",
  storageBucket: "react-todo-ts-19ae3.firebasestorage.app",
  messagingSenderId: "598748799729",
  appId: "1:598748799729:web:79db676503b74bbf32bf50",
  measurementId: "G-X72YPT6Q2W",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
