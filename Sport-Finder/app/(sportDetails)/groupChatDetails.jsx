import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';
import { db } from '../(auth)/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const GroupChatDetails = () => {
  const [users, setUsers] = useState([]);

  const {gameId} = useContext(UserContext);
  useEffect(()=>{
    const setData = async () =>{
      const members = [];

      const gameRef = doc(db, 'games', gameId);
      const gameResponse = await getDoc(gameRef);
      const gameData = gameResponse.data();

      // Get the host's info using hostId
      const hostRef = doc(db, 'users', gameData.hostId);
      const hostResponse = await getDoc(hostRef);
      const hostData = hostResponse.data();
      members.push(hostData);

      // Get the guests' info using guestsIds
      if (gameData.guestsIds) {
        for (let i = 0; i < gameData.guestsIds; i++) {
          const guestRef = doc(db, 'users', gameData.guestsIds[i]);
          const guestResponse = await getDoc(guestRef);
          const guestData = guestResponse.data();
          members.push(guestData);
        }
      }

      setUsers(members);
    };
    setData();
  }, []);

  return (
    <SafeAreaView className='bg-black flex-1'>
      <TouchableOpacity>
        <Ionicons name="arrow-back" size={45} color="white" onPress={()=>router.back()}/>
      </TouchableOpacity>

      {users && users.map((user, index)=>(
        <TouchableOpacity key={index} className='mt-6'>
          <Text className='text-white text-2xl font-bold'>{user.username}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default GroupChatDetails;