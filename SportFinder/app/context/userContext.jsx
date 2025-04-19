import React, { createContext, useEffect, useRef, useState } from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../(auth)/config/firebaseConfig';
import {Alert, Text} from 'react-native';
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
export const UserContext = createContext();

export default function UserProvider({ children }) {

  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [favoriteSport, setFavoriteSport] = useState('');

  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  const [address, setAddress] = useState('');
  const [gameId, setGameId] = useState('');
  const [joinedGameId, setJoinedGameId] = useState('');

  const [isInGame, setIsInGame] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const [personId, setPersonId] = useState('');

  const unsubscribeExpireRef = useRef(null);
  const unsubscribeEndGameRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });

    const handleDeleteDoc = async (gameData, gameRef, gameTimeRef) =>{
      const hostRef = doc(db, 'users', gameData.hostId);
      const groupChatRef = doc(db, 'groupChats', joinedGameId);

      await updateDoc(hostRef, {
        isInGame: false,
        joinedGameId: '',
      });
      for (let i = 0; i < gameData.guestsIds.length; i++) {
        const guestRef = doc(db, 'users', gameData.guestsIds[i]);
        await updateDoc(guestRef, {
          isInGame: false,
          joinedGameId: '',
        });
      }
      await deleteDoc(gameRef);
      await deleteDoc(gameTimeRef);
      await deleteDoc(groupChatRef);

      setJoinedGameId('');
      setGameId('');
      router.replace('/map');

      // Alert.alert(
      //   'Game Expired',
      //   'The game has expired.',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         setJoinedGameId('');
      //         setGameId('');
      //         router.replace('/map');
      //       },
      //     },
      //   ],
      // );
    };


    const handleExpire = async () =>{
      if (joinedGameId) {
        intervalRef.current = setInterval(async () => {
          const gameRef = doc(db, 'games', joinedGameId);
          const gameResponse = await getDoc(gameRef);
          const gameData = gameResponse.data();  

          const gameTimeRef = doc(db, 'gamesTime', joinedGameId);
          const gameTimeResponse = await getDoc(gameTimeRef);
          const gameTimeData = gameTimeResponse.data();

          if (!gameTimeResponse.exists()) {
            handleDeleteDoc(gameData, gameRef, gameTimeRef);
            clearInterval(intervalRef.current);
            return;
          };
          
          const now = new Date();
          await updateDoc(gameTimeRef, {
            timeLeft: gameTimeData.hour * 60 * 60 * 1000 - 
            (now.getTime() - new Date(gameTimeData.startTime).getTime()),
          });
          if (now.getTime() > new Date(gameTimeData.endTime).getTime()) {
            clearInterval(intervalRef.current);
            handleDeleteDoc(gameData, gameRef, gameTimeRef);
            return;
          }
        }, 1000);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current); 
      }  
    };

    const handleEndGame = () =>{
      if (joinedGameId) {
        const gameRef = doc(db, 'games', joinedGameId);
        unsubscribeEndGameRef.current = onSnapshot(gameRef, (docSnapShot)=>{
          if (!docSnapShot.exists()) {
            Alert.alert(
              'Game Ended',
              'The game has ended.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setJoinedGameId('');
                    setGameId('');
                    if(unsubscribeEndGameRef.current) unsubscribeEndGameRef.current();
                    router.replace('/map');
                  },
                },
              ],
            );
          }
        });
      }
    };

    handleExpire();
    handleEndGame();
    return () => {
      if (unsubscribeExpireRef.current) {
        unsubscribeExpireRef.current();
      }
      if (unsubscribeEndGameRef.current) {
        unsubscribeEndGameRef.current();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [joinedGameId]);

  if(pending){
    return <Text>Loading...</Text>;
  }
  
  return (
    <UserContext.Provider value={{username, setUsername, age, setAge, favoriteSport, 
      setFavoriteSport, currentUser, address, setAddress, gameId, setGameId, 
      isInGame, setIsInGame, joinedGameId, setJoinedGameId, isHost, setIsHost,
      personId, setPersonId}}>
      {children}
    </UserContext.Provider>
  );
}