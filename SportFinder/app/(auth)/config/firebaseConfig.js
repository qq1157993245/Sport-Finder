// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCmvTdXnH03VP5OVYmksxzYGye5yYlwDmE',
  authDomain: 'sportsfinder-8275b.firebaseapp.com',
  projectId: 'sportsfinder-8275b',
  storageBucket: 'sportsfinder-8275b.firebasestorage.app',
  messagingSenderId: '732223071182',
  appId: '1:732223071182:web:cf51fdb2246870c278419f',
  measurementId: 'G-YV6Z5C1WNZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

//Intialize database
const db = getFirestore(app);

export { auth, db};