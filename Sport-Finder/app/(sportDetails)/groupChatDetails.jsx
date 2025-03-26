import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';
import { auth, db } from '../(auth)/config/firebaseConfig';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc,
  updateDoc } from 'firebase/firestore';
import CustomButton from '../../components/custombutton';

const GroupChatDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {gameId, setGameId} = useContext(UserContext);

  async function handleConfirmSelect () {
    const currentUser = auth.currentUser;

    if (currentUser.uid === selectedId) return;

    // Get the old game's info
    const oldGameRef = doc(db, 'games', currentUser.uid);
    const oldGameResponse = await getDoc(oldGameRef);
    const oldGameData = oldGameResponse.data();

    // Get the old group chat's info
    const oldGroupChatRef = doc(db, 'groupChats', currentUser.uid);
    const oldGroupChatResponse = await getDoc(oldGroupChatRef);
    const oldGroupChatData = oldGroupChatResponse.data();

    // Transfer the ownership to the selected user
    const newGameRef = doc(db, 'games', selectedId);
    const newGroupChatRef = doc(db, 'groupChats', selectedId);

    await deleteDoc(oldGameRef);
    await deleteDoc(oldGroupChatRef);

    await setDoc(newGameRef, oldGameData);
    await setDoc(newGroupChatRef, oldGroupChatData);
    await updateDoc(newGameRef, {
      hostId: selectedId,
      guestsIds: arrayRemove(selectedId),
    });
    await updateDoc(newGameRef, {
      guestsIds: arrayUnion(currentUser.uid),
    });

    setGameId(selectedId);

    router.back();
  }

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
        for (let i = 0; i < gameData.guestsIds.length; i++) {
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
        <TouchableOpacity 
          key={index} 
          className={`mt-6 ${selectedId === user.id ? 'bg-red-500' : ''}`}
          onPress={()=>setSelectedId(user.id)}>
          <Text className='text-white text-2xl font-bold'>{user.username}</Text>
        </TouchableOpacity>
      ))}

      <CustomButton
        handlePress={handleConfirmSelect}
        title={'Confirm'}
        containerStyles={'mt-20'}
      />
    </SafeAreaView>
  );
};

export default GroupChatDetails;