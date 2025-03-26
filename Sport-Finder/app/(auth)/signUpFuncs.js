import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {auth, db} from '../(auth)/config/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';


export const signUp = async (email, password, confirmPassword) => {
  try{
    //ensure both passwords match
    if (password != confirmPassword){
      return { success: 0, message: 'Passwords do not match' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Temporarily comment it out
    //await sendEmailVerification(userCredential.user);

    //todo add more fields
    const userProfile = {
      id: userCredential.user.uid,
      email:email,
      username: '',
      age:'',
      favoriteSport:'',
      isInGame: false,
    };
    const userRef = doc(db, 'users', userCredential.user.uid);

    await setDoc(userRef, userProfile);

    return {success : 1, message: 'Successfully sign up!'};

  } catch (error) {
    let errorMessage;

    switch (error.code) {
    case 'auth/email-already-in-use':
      errorMessage = 'This email is already registered.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email format.';
      break;
    case 'auth/weak-password':
      errorMessage = 'Password is too weak. Try a stronger password.';
      break;
    case 'auth/operation-not-allowed':
      errorMessage = 'Sign-up is currently disabled.';
      break;
    default:
      errorMessage = 'Something went wrong. Please try again.';
      break;
    }
    return {success : 0, message: errorMessage};
  }
};

export const resetPassword = async(email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {success: 1, message: 'Successfully reset password!'};
  } catch (error) {
    let errorMessage;

    switch (error.code) {
    case 'auth/user-not-found':
      errorMessage = 'No account found with this email.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email format.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many requests. Please try again later.';
      break;
    default:
      errorMessage = 'Something went wrong. Please try again.';
      break;
    }
    return {success: 0, message: errorMessage};
  }
};

