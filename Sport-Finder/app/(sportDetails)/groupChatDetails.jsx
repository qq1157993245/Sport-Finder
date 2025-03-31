import { Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';
import { auth, db } from '../(auth)/config/firebaseConfig';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import CustomButton from '../../components/custombutton';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const GroupChatDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [user, setUser] = useState(null);

  const {gameId} = useContext(UserContext);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['60%'], []);

  async function handleConfirmSelect () {
    const currentUser = auth.currentUser;

    if (currentUser.uid === selectedId) return;

    // Update game's info
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      hostId: selectedId,
      guestsIds: arrayRemove(selectedId),
    });
    await updateDoc(gameRef, {
      guestsIds: arrayUnion(currentUser.uid),
    });

    // Update groupChat's info
    const groupChatRef = doc(db, 'groupChats', gameId);
    await updateDoc(groupChatRef, {
      lastUpdatedDate: Date.now(), // dummy value
    });

    router.back();
  }

  function handleOpenSheet (user) {
    setUser(user);
    bottomSheetRef.current?.expand();
  }

  useEffect(()=>{
    const setData = async () =>{
      const members = [];

      const currentUser = auth.currentUser;
      const gameRef = doc(db, 'games', gameId);
      const gameResponse = await getDoc(gameRef);
      const gameData = gameResponse.data();

      // Get the host's info using hostId
      const hostRef = doc(db, 'users', currentUser.uid);
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
      <View className='flex-row justify-center'>
        <TouchableOpacity className='absolute left-0'>
          <Ionicons name="arrow-back" size={45} color="white" onPress={()=>router.back()}/>
        </TouchableOpacity>
        <Text className='text-white text-3xl'>Switch Host</Text>
      </View>

      {users && users.map((user, index)=>(
        <TouchableOpacity 
          key={index} 
          className={'mt-10 border-2 border-purple-400 rounded-xl ' +
            `${selectedId === user.id ? 'bg-red-500' : ''}`}
          onPress={()=>setSelectedId(user.id)}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            handleOpenSheet(user);
          }}
        >
          <Text className='text-white text-2xl font-bold'>{user.username}</Text>
        </TouchableOpacity>
      ))}

      <CustomButton
        handlePress={handleConfirmSelect}
        title={'Confirm'}
        containerStyles={'mt-20'}
      />

      <GestureHandlerRootView className='absolute h-full w-full'>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
              opacity={0.6}
            />
          )}
        >
          <BottomSheetView style={styles.sheetContent}>
            {user &&
               <View className='h-full w-full items-center'>
                 <Text className='text-5xl mt-4'>{user.username}</Text>
                 <Text className='text-2xl mt-4'>{`Age: ${user.age}`}</Text>
                 <Text className='text-2xl mt-4'>{`Favorite sport: ${user.favoriteSport}`}</Text>
                 <View className='flex-row mt-4'>
                   <Ionicons name="ellipse" size={30} color={user.isInGame ? 'red' : 'green'}/>
                   <Text className='text-2xl'>{user.isInGame ? 'Playing' : 'Idle'}</Text>
                 </View>
               </View>}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupChatDetails;