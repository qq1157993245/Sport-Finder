import { Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../../components/custombutton';

const NumofPlayers = () => {
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
          className={' text-white font-psemibold text-base border-2 ' + 
          'border-white rounded-md h-14 mt-5 w-10/12 ml-auto mr-auto'}
        />
        <CustomButton 
          title={'Confirm'}
          containerStyles={'mt-10'}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NumofPlayers;