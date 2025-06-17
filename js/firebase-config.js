// Importante: versão modular do Firebase (v9) funciona assim:
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Se estiver fazendo tudo no browser sem bundler, pode usar os namespaces globais:
// const app = firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const database = firebase.database();

const firebaseConfig = {
  apiKey: "AIzaSyCmjd7EOQYo-kMzuji15Du0LB3TQJ7_1xw",
  authDomain: "urvivefive.firebaseapp.com",
  databaseURL: "https://urvivefive-default-rtdb.firebaseio.com",
  projectId: "urvivefive",
  storageBucket: "urvivefive.firebasestorage.app",
  messagingSenderId: "694756095455",
  appId: "1:694756095455:web:97c897e2586e8d218f006a",
  measurementId: "G-LNTYETS56R"
};

// Inicializa app
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
