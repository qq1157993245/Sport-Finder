import { Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../../components/custombutton';
import {UserContext} from '../context/userContext';

const NumofPlayers = () => {
  const [inputNumber, setInputNumber] = useState('');

  const {setNumofPlayers} = useContext(UserContext);

  function handleOnchange(text) {
    if (Number(text) > 20) {
      setInputNumber('20');
    } else if (Number(text) < 1) {
      setInputNumber('');
    } else if (!Number.isInteger(Number(text))) {
      setInputNumber('');
    } else {
      setInputNumber(text);
    }
  }
  
  function handleConfirm () {
    setNumofPlayers(inputNumber);
    router.back();
  }

  return (
    <SafeAreaView
      className='flex-col h-full bg-black'
    >
      <TouchableOpacity>
        <Ionicons name="close" size={30} color="white" onPress={()=>router.back()}/>
      </TouchableOpacity>
      <ScrollView className='flex-1'>
        <Text className='text-white text-center text-3xl'>Number of Players</Text>
        <Text className='text-white text-center text-3xl'>(max:20)</Text>
        <TextInput
          keyboardType='numeric'
          value={inputNumber}
          onChangeText={(text)=>handleOnchange(text)}
          className={' text-white font-psemibold text-base border-2 ' + 
          'border-white rounded-md h-14 mt-5 w-10/12 ml-auto mr-auto'}
        />
        <CustomButton 
          handlePress={handleConfirm}
          title={'Confirm'}
          containerStyles={'mt-10'}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NumofPlayers;