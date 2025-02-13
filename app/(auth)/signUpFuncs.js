import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail,
} from 'firebase/auth'
import {auth} from '../(auth)/config/firebaseConfig'
import { setDoc, doc } from "firebase/firestore";


export const signUp = async (email, password, confirmPassword) => {
   try{
        //ensure both passwords match
        if (password != confirmPassword){
            throw Error('Passwords do not match');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(userCredential.user);

        // change display name to username
        // await updateProfile(userCredential.user, {displayName: username})

        //todo add more fields
        const userProfile = {
            email:email,
            userName: '',
            age:'',
            favoriteSport:''
        }
        const userRef = doc(db, 'users', auth.currentUser.uid);
        console.log(auth.currentUser.uid);

        await setDoc(userRef, userProfile);

        console.log("Successfully sign up!");
        return {success : 1, message: "Successfully sign up!"};

   } catch (error) {
    console.log("Fail to sign up");
    return {success : 0, message: "Fail to sign up"};
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

