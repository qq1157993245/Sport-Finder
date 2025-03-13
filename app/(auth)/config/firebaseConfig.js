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
  apiKey: 'AIzaSyCfsElSve4AExvEjRz3ew3u2r5lRMiO4Eo',
  authDomain: 'sportsfinder-25b5f.firebaseapp.com',
  projectId: 'sportsfinder-25b5f',
  storageBucket: 'sportsfinder-25b5f.firebasestorage.app',
  messagingSenderId: '619560730482',
  appId: '1:619560730482:web:48b334337c0078191227eb',
  measurementId: 'G-N4ZGBBXZ6F',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// const AuthContext = React.createContext();

// const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [pending, setPending] = useState(true);

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user)
//       setPending(false)
//     });
//   }, []);

//   if(pending){
//     return <>Loading...</>
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

//Intialize database
const db = getFirestore(app);

export { auth, db};