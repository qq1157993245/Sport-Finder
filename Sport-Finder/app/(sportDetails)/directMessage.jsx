import { View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import icons from '../../constants/icons.js';
import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot,
  updateDoc } from 'firebase/firestore';
import { auth, db } from '../(auth)/config/firebaseConfig.js';
import { UserContext } from '../context/userContext.jsx';

const directMessage = () => {
  const scrollRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState('');
  const [DMId, setDMId] = useState('');
  const [person, setPerson] = useState('');

  const {personId} = useContext(UserContext);

  async function handleSendMessage () {
    const currentUser = auth.currentUser;

    // Reference to groupChat
    const directMessageRef = doc(db, 'directMessages', DMId);
    const directMessageResponse = await getDoc(directMessageRef);
    const directMessageData = directMessageResponse.data();

    // Reference to user
    const userRef = doc(db, 'users', currentUser.uid);
    const userResponse = await getDoc(userRef);
    const userData = userResponse.data();

    if (directMessageData.users.length === 0) {
      const personRef = doc(db, 'users', personId);
      await updateDoc(personRef, {
        privateChats: arrayUnion({
          directMessageId: DMId,
          personId: currentUser.uid,
        }),
      });
    }

    directMessageData.users.push({
      id: currentUser.uid,
      username: userData.username,
      message: inputMessage,
    });
    await updateDoc(directMessageRef, directMessageData);

    setInputMessage('');
  }

  useEffect(()=>{
    let unsubscribe = null;

    const setData = async () =>{
      const personRef = doc(db, 'users', personId);
      const personResponse = await getDoc(personRef);
      const personData = personResponse.data();
      setPerson(personData);

      const currentUser = auth.currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      const userResponse = await getDoc(userRef);
      const userData = userResponse.data();

      let directMessageId = null;
      for (let i = 0; i < userData.privateChats.length; i++) {
        if (personId === userData.privateChats[i].personId) {
          directMessageId = userData.privateChats[i].directMessageId;
          break;
        }
      }
      
      const directMessagesCollectionRef = collection(db, 'directMessages');
      if (!directMessageId) {
        const directMessageRef = await addDoc(directMessagesCollectionRef, {users: []});
        setDMId(directMessageRef.id);
        await updateDoc(userRef, {
          privateChats: arrayUnion({
            directMessageId: directMessageRef.id,
            personId: personId,
          }),
        });
      } else {
        setDMId(directMessageId);
        const directMessageRef = doc(db, 'directMessages', directMessageId);
        unsubscribe = onSnapshot(directMessageRef, (docSnapShot) =>{
          if (docSnapShot.exists()) {
            setUsers([...docSnapShot.data().users]);
          }
        });
      }
    };

    setData();
    return () =>{
      if (unsubscribe) unsubscribe();
      setUsers(null);
    };
  }, []);

  return (
    <SafeAreaView className='bg-black flex-1'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-black'
      >

        <View className='flex-row justify-center'>
          <TouchableOpacity className='absolute left-0'>
            <Ionicons name="arrow-back" size={45} color="white" onPress={()=>{
              router.back();
            }}/>
          </TouchableOpacity>

          {person &&
            <Text className='text-white text-3xl'>{person.username}</Text>
          }
        </View>

        <ScrollView
          ref={scrollRef}
          onContentSizeChange={()=>{
            if (scrollRef.current) {
              scrollRef.current.scrollToEnd({ animated: false });
            }
          }}
        >
          {users && users.map((user, index)=>(
            <View key={index} className='mb-4'>
              {/* <TouchableOpacity onPress={()=>handleOpenSheet(user.id)}>
                <Text className='text-purple-800 font-bold text-xl'>{user.username}</Text>
              </TouchableOpacity> */}
              <Text className='text-purple-800 font-bold text-xl'>{user.username}</Text>
              <Text className='text-white'>{user.message}</Text>
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

export default directMessage;