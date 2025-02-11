import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth } from './config/firebaseConfig';

//Normal login function. Needs to pass **email** and **password** as parameters.
export async function loginAuth(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Successfully logged in with password!");

    return { success: 1, message: "Successfully logged in with password!" };
  } catch (error) {
    console.error("Password log in error: ", error);
    return { success: 0, message: error.message };
  }
}

//Google login function.
export async function googleAuth() {
  try{
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    console.log("Successfully logged in with google!");
    return {success: 1, message: "Successfully logged in with google!"}
  }catch(error){
    console.error("Google log in error: ", error);
    return {success: 0, message: error.message}
  }
}