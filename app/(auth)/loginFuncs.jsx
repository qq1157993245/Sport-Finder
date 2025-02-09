import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider,
    signInWithRedirect, getRedirectResult } from "firebase/auth";

// Normal login function using email and password
export function loginAuth(email, password) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in: ', user);
      return user;
    })
    .catch((error) => {
      console.error('Error during login: ', error);
      throw error;
    });
}

// Google login function
export function googleAuth() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  return signInWithRedirect(auth, provider)
    .then(() => getRedirectResult(auth))
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('Google login successful: ', user);
      return user;
    })
    .catch((error) => {
      console.error('Google login error: ', error);
      throw error;
    });
}