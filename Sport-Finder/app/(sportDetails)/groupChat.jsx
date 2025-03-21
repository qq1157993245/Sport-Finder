import { Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text,
  TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import icons from '../../constants/icons.js';
import { UserContext } from '../context/userContext.jsx';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../(auth)/config/firebaseConfig.js';

const GroupChat = () => {

  const [inputMessage, setInputMessage] = useState('');
  const [hostMessages, setHostMessages] = useState(null);
  //const [guestsMessages, setGuestsMessages] = useState(null);

  const {gameId} = useContext(UserContext);

  async function handleSendMessage () {
    const currentUser = auth.currentUser;
    const groupChatRef = doc(db, 'groupChats', gameId);
    const response = await getDoc(groupChatRef);
    const data = response.data();
    if (currentUser.uid === data.host.id) {
      const messages = data.host.messages;
      messages.push(inputMessage);
      await updateDoc(groupChatRef, {
        host:{
          id: data.host.id,
          messages: messages,
        },
      });
    } else if (data.guests.length <= 0) {
      const guests = data.guests;
      const guest = {
        id: currentUser.uid,
        messages: [inputMessage],
      };
      guests.push(guest);
      await updateDoc(groupChatRef, {
        guests: guests,
      });
    } else {
      const guests = data.guests;
      for (let i = 0; i < guests.length; i++) {
        if (guests[i].id === currentUser.uid) {
          guests[i].messages.push(inputMessage);
          await updateDoc(groupChatRef, {
            guests: guests,
          });
          break;
        }
      }
    }
    setInputMessage('');
    Keyboard.dismiss();
  }

  useEffect(()=>{
    const getData = async () =>{
      const docRef = doc(db, 'groupChats', gameId);
      const unsubscribe = onSnapshot(docRef, (docSnapShot)=>{
        setHostMessages(docSnapShot.data().host.messages);
        // setGuestsMessages(docSnapShot.data().host.messages);
      });

      // Clean up function: avoid memory leak
      return () => {
        unsubscribe();
      };
    };
    getData();
  }, []);

  return (
    <SafeAreaView className='h-full bg-black'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='h-full bg-black'
      >

        <TouchableOpacity>
          <Ionicons name="arrow-back" size={30} color="white" onPress={()=>router.back()}/>
        </TouchableOpacity>

        <KeyboardAwareScrollView className='bg-white flex-1'>
          <Text>{`Host: ${hostMessages}`}</Text>
        </KeyboardAwareScrollView>
      
        <View className='flex-row w-full'>
          <TextInput
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
