import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo1C1FhDKyuNgxXYpxD1FoaI6xf17Lv9w",
  authDomain: "cast-managers.firebaseapp.com",
  projectId: "cast-managers",
  storageBucket: "cast-managers.firebasestorage.app",
  messagingSenderId: "626445881554",
  appId: "1:626445881554:web:f71feee09acc22deda9d0b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();