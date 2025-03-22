import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text,
  TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import icons from '../../constants/icons.js';
import { UserContext } from '../context/userContext.jsx';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../(auth)/config/firebaseConfig.js';

const GroupChat = () => {

  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState(null);

  const {gameId} = useContext(UserContext);

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

  useEffect(()=>{
    const getData = async () =>{
      const docRef = doc(db, 'groupChats', gameId);
      const unsubscribe = onSnapshot(docRef, (docSnapShot)=>{
        setUsers(docSnapShot.data().users);
      });

      // Clean up function: avoid memory leak
      return () => {
        unsubscribe();
      };
    };
    getData();
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-black'
      >

        <TouchableOpacity>
          <Ionicons name="arrow-back" size={30} color="white" onPress={()=>router.back()}/>
        </TouchableOpacity>

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
