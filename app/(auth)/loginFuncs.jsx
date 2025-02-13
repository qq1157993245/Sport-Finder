import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth } from './config/firebaseConfig';

//Normal login function. Needs to pass **email** and **password** as parameters.
export const loginAuth = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return { success: 1, message: "Successfully logged in with password!" };
  } catch (error) {
    return { success: 0, message: error.message };
  }
}

//Google login function.
export const googleAuth = async () => {
  try{
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    return {success: 1, message: "Successfully logged in with google!"}
  }catch(error){
    return {success: 0, message: error.message}
  }
}