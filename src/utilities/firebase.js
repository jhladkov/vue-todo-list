// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeNutNKxdANEVl9iLvG9qdkNQuQLtr0cg",
    authDomain: "todo-list-app-433b9.firebaseapp.com",
    projectId: "todo-list-app-433b9",
    storageBucket: "todo-list-app-433b9.appspot.com",
    messagingSenderId: "358895117029",
    appId: "1:358895117029:web:caf085dc9b8250657aaa0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app