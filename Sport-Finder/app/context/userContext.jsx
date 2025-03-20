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

  const [numofPlayers, setNumofPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');
  const [hour, setHour] = useState('');
  const [address, setAddress] = useState('');

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
    <UserContext.Provider value={{username, setUsername, age, setAge, favoriteSport, 
      setFavoriteSport, currentUser, numofPlayers, setNumofPlayers, skillLevel, setSkillLevel,
      sportType, setSportType, hour, setHour, address, setAddress}}>
      {children}
    </UserContext.Provider>
  );
}