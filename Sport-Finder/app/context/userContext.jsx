import React, { createContext, useEffect, useState } from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from '../(auth)/config/firebaseConfig';
import {Text} from 'react-native';

export const UserContext = createContext();

export default function UserProvider({ children }) {

  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [favoriteSport, setFavoriteSport] = useState('');

  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if(pending){
    return <Text>Loading...</Text>;
  }
  
  return (
    <UserContext.Provider value={{username, setUsername, age, setAge,
      favoriteSport, setFavoriteSport, currentUser}}>
      {children}
    </UserContext.Provider>
  );
}