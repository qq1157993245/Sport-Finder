import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text,
  TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import icons from '../../constants/icons.js';
import { UserContext } from '../context/userContext.jsx';
import { arrayRemove, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../(auth)/config/firebaseConfig.js';

const GroupChat = () => {

  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [join, setJoin] = useState(false);

  const {gameId, setGameId, isInGame, setIsInGame, setJoinedGameId} = useContext(UserContext);

  const scrollRef = useRef(null);

  async function handleSendMessage () {
    const currentUser = auth.currentUser;

    // Reference to groupChat
    const groupChatRef = doc(db, 'groupChats', gameId);
    const groupChatResponse = await getDoc(groupChatRef);
    const groupChatData = groupChatResponse.data();

    // Reference to user
    const userRef = doc(db, 'users', currentUser.uid);
    const userResponse = await getDoc(userRef);
    const userData = userResponse.data();

    groupChatData.users.push({
      id: currentUser.uid,
      username: userData.username,
      message: inputMessage,
    });
    await updateDoc(groupChatRef, groupChatData);

    setInputMessage('');
  }

  async function handleJoinAndLeave() {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);
    const gameRef = doc(db, 'games', gameId);
    const groupChatRef = doc(db, 'groupChats', gameId);
    const gameResponse = await getDoc(gameRef);
    const gameData = gameResponse.data();

    if (isHost) {
      if (gameData.joinedPlayers <= 1) {
        await updateDoc(userRef, {
          isInGame: false,
          joinedGameId: '',
        });
        await deleteDoc(groupChatRef);
        await deleteDoc(gameRef);
        setIsInGame(false);
        setJoinedGameId('');
        setGameId('');
        router.back();
      } else {
        Alert.alert('You are the owner of this group. ' +
             'Please transfer ownership to another member before leaving.');
      }
    } else if (!isHost && isInGame) {
      if (join) {
        Alert.alert('You are in a game already.');
      } else {
        await updateDoc(userRef, {
          isInGame: false,
          joinedGameId: '',
        });
        await updateDoc(gameRef, {
          guestsIds: arrayRemove(currentUser.uid),
          joinedPlayers: gameData.joinedPlayers - 1,
        });
        setJoinedGameId('');
        setIsInGame(false);
        setJoin(true);
      }
    } else if (!isHost && !isInGame) {
      if (gameData.joinedPlayers === gameData.numofPlayers) {
        Alert.alert('This game is full already.');
      } else {
        const newGuestsIds = [...gameData.guestsIds, currentUser.uid];
        await updateDoc(userRef, {
          isInGame: true,
          joinedGameId: gameId,
        });
        await updateDoc(gameRef, {
          guestsIds: newGuestsIds,
          joinedPlayers: gameData.joinedPlayers + 1,
        });
        setJoinedGameId(gameId);
        setIsInGame(true);
        setJoin(false);
      }
    }
  }

  async function handleEndGame () {
    const confirmed = await new Promise ((resolve) =>{
      Alert.alert('End Game', 'Are you sure you want to end the game?', [
        {text: 'Yes', onPress: ()=>resolve(true)},
        {text: 'Cancel', onPress: ()=>resolve(false)},
      ]);
    });

    if (!confirmed) return;

    try {
      const currentUser = auth.currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      const gameRef = doc(db, 'games', gameId);
      const groupChatRef = doc(db, 'groupChats', gameId);
      const gameResponse = await getDoc(gameRef);
      const gameData = gameResponse.data();
  
      await updateDoc(userRef, {
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
      await deleteDoc(groupChatRef);
      await deleteDoc(gameRef);
      
      setJoinedGameId('');
      setIsInGame(false);
      setGameId('');
      router.replace('/map');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    let unsubscribe1;
    let unsubscribe2;

    const getData = async () =>{
      // Reference to users
      const currentUser = auth.currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      const userResponse = await getDoc(userRef);
      const userData = userResponse.data();
      setIsInGame(userData.isInGame);

      // Reference to groupChats
      const groupChatRef = doc(db, 'groupChats', gameId);
      unsubscribe1 = onSnapshot(groupChatRef, (docSnapShot)=>{
        if (docSnapShot.exists()) {
          setUsers([...docSnapShot.data().users]);
        } else {
          Alert.alert(
            'Game Ended',
            'The game has ended.',
            [
              {
                text: 'OK',
                onPress: () => {
                  unsubscribe1();
                  setGameId('');
                  router.replace('/map');
                },
              },
            ],
          );
        }
      });

      // Reference to games
      const gameRef = doc(db, 'games', gameId);
      unsubscribe2 = onSnapshot(gameRef, async (docSnapShot)=>{
        if (docSnapShot.exists()) {

          const gameResponse = await getDoc(gameRef);
          const gameData = gameResponse.data();
          if (currentUser.uid === gameData.hostId) {
            setJoin(false);
            setIsHost(true);
          } else {
            if (!isHost && userData.isInGame) {
              setJoin(false);
            } else if (!isHost && !userData.isInGame) {
              setJoin(true);
            }
            setIsHost(false);
          }
        }
      });

      // Clean up function: avoid memory leak
    };
    getData();
    return () => {
      if (unsubscribe1) {
        unsubscribe1();
      }
      if (unsubscribe2) {
        unsubscribe2();
      }
      setUsers(null);
    };
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-black'
      >

        <View className='flex-row justify-between'>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={45} color="white" onPress={()=>{
              setGameId('');
              router.back();
            }}/>
          </TouchableOpacity>

          {isHost && 
          <TouchableOpacity 
            onPress={handleEndGame}
            className={'border-2 border-white rounded-xl ' +
           'justify-center items-center w-24 bg-purple-600'}>
            <Text className='text-white'>End Game</Text>
          </TouchableOpacity>}

          <TouchableOpacity 
            onPress={handleJoinAndLeave}
            className={'border-2 border-white rounded-xl ' +  
              `${join ? 'bg-green-600 ' : 'bg-red-600 '}` + 
            'justify-center items-center w-24'}>
            <Text className='text-white text-lg'>{join ? 'Join' : 'Leave'}</Text>
          </TouchableOpacity>

          {isHost && 
          <TouchableOpacity onPress={()=>router.push('/groupChatDetails')}>
            <Image source={icons.ellipsis}/>
          </TouchableOpacity>}
          
        </View>

        <ScrollView
          ref={scrollRef}
          onContentSizeChange={()=>{
            if (scrollRef.current) {
              scrollRef.current.scrollToEnd({ animated: false });
            }
          }}
          className='bg-white'
        >
          {users && users.map((user, index)=>(
            <View key={index} className='mb-4'>
              <Text className='text-purple-800 font-bold text-xl'>{user.username}</Text>
              <Text>{user.message}</Text>
            </View>
          ))}
        </ScrollView>
      
        <View className='flex-row w-full'>
          <TextInput
            onContentSizeChange={()=>{
              if (scrollRef.current) {
                scrollRef.current.scrollToEnd({ animated: false });
              }
            }}
            value={inputMessage}
            onChangeText={(text)=>setInputMessage(text)}
            className='border-2 border-white text-white rounded-md h-12 flex-1'
          />
          <TouchableOpacity onPress={handleSendMessage} disabled={inputMessage ? false : true}>
            <Image source={icons.send} className='w-12 h-12'/>
          </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default GroupChat;
