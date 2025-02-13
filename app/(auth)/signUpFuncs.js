import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from 'firebase/auth'
import {auth, db} from '../(auth)/config/firebaseConfig'
import { setDoc, doc } from "firebase/firestore";


export const signUp = async (email, password, confirmPassword) => {
   try{
        //ensure both passwords match
        if (password != confirmPassword){
            return { success: 0, message: "Passwords do not match" };
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Temporarily comment it out
        //await sendEmailVerification(userCredential.user);

        //todo add more fields
        const userProfile = {
            email:email,
            username: '',
            age:'',
            favoriteSport:''
        }
        const userRef = doc(db, 'users', userCredential.user.uid);

        await setDoc(userRef, userProfile);

        return {success : 1, message: "Successfully sign up!"};

   } catch (error) {
    return {success : 0, message: error.message};
   }
}

export const resetPassword = async(email) => {
    try {
        return await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Password Reset Failed:' + error.message);
        throw error;
    }
}

