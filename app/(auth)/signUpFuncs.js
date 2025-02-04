import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail,
} from 'firebase/auth'
import {auth} from '../config/firebaseConfig.JS'
import { setDoc, doc } from "firebase/firestore";


export const signUp = async (email, password, conFirmPassword, username) => {
   try{
        //ensure both passwords match
        if (password != confirmPassword){
            throw Error('Passwords do not match');
        }

        const userRef = doc(db, 'users', username.toLowerCase());

        //See if username is taken already
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()){
            throw Error(`Username ${username} already exists`);
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // change display name to username
        await updateProfile(userCredential.user, {displayName: username})

        //todo add more fields
        const userProfile = {
            email,
            username,
            uid: userCredential.user.uid,
            first,
            last,
            pfp,
        }
        await setDoc(userRef, userProfile);

        await sendEmailVerification(userCredential.user);

        return userCredential;

   } catch (error) {
    console.error('Sign Up Failed ' + error.message);
    throw error;
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

