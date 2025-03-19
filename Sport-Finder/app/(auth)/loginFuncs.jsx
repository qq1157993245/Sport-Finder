import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import { auth } from './config/firebaseConfig';

//Normal login function. Needs to pass **email** and **password** as parameters.
export const loginAuth = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return { success: 1, message: 'Successfully logged in with password!' };
  } catch (error) {
    let errorMessage;

    switch (error.code) {
    case 'auth/invalid-credential':
      errorMessage = 'Incorrect email or password. Please try again.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email format.';
      break;
    case 'auth/user-disabled':
      errorMessage = 'This account has been disabled.';
      break;
    case 'auth/user-not-found':
      errorMessage = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password. Please try again.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many failed attempts. Try again later.';
      break;
    default:
      errorMessage = 'Something went wrong. Please try again.';
      break;
    }
    return { success: 0, message: errorMessage };
  }
};

//Google login function.
export const googleAuth = async () => {
  try{
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    return {success: 1, message: 'Successfully logged in with google!'};
  }catch(error){
    return {success: 0, message: error.message};
  }
};