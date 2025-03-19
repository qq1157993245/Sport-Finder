import { auth, db } from '../(auth)/config/firebaseConfig';
import { updateDoc,deleteDoc, getDoc, doc } from 'firebase/firestore'; 
import { deleteUser, signOut, updatePassword, 
  reauthenticateWithCredential, EmailAuthProvider  } from 'firebase/auth';
import { setOptions } from 'expo-splash-screen';

export async function getData() {
  try {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);
    const response = await getDoc(userRef);

    if (!response.exists()) {
      return { success: 0, message: 'User data not found!' };
    }
    
    console.log('Fetching data successfully!');
    return {success: 1, data: response.data(), message: 'Fetching data successfully!'};
  } catch (error) {
    console.error('Error fetching data: ', error);
    return {success: 0, message: error.message};
  }
}

//Update user's username, favoriteSport,etc
export async function updateData(user) {
  try {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);

    await updateDoc(userRef, {
      username: user.username,
      age: user.age,
      favoriteSport: user.favoriteSport,
    }, setOptions);
    console.log('Document updated successfully!');
    return {success: 1, message: 'Document updated successfully!'};
  } catch (error) {
    console.error('Error updating document: ', error);
    return {success: 0, message: error.message};
  }
}

//Delete account with user data
export async function deleteAccount(userPassword){
  try {
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, userPassword);
    await reauthenticateWithCredential(user, credential);

    const userRef = doc(db, 'users', user.uid);

    await deleteDoc(userRef);
    await deleteUser(user);
  
    console.log('User account deleted successfully!');
    return {success: 1, message: 'User account deleted successfully!'};
  } catch (error) {
    let errorMessage;
    
    switch(error.code){
    case 'auth/invalid-credential':
      errorMessage = 'Incorrect password. Please try again.';
      break;
    case 'permission-denied':
      errorMessage = 'You do not have permission to delete this account.';
      break;
    default:
      errorMessage = 'Something went wrong. Please try again.';
      break;
    }
    return {success: 0, message: errorMessage};
  }
}

export async function logOut(){
  try {
    await signOut(auth);
    console.log('Successfully log out!');
    return {success: 1, message: 'Successfully log out!'};
  } catch (error) {
    console.error('Error loging out:', error);
    return {success: 0, message: error.message};
  }
}

//It needs user's email and currentPassword to change the password 
export async function changePassword(email, currentPassword, newPassword) {
  try {
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    console.log('User re-authenticated.');

    await updatePassword(user, newPassword);
    console.log('Password updated successfully!');
    return {success: 1, message: 'Password updated successfully!'};
  } catch (error) {
    console.error('Error changing password:', error);
    return {success: 0, message: error.message};
  }
}