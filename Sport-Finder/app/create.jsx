import { View, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { ScrollView } from 'react-native';
import NavigateButton from '../components/navigateButton';
import icons from '../constants/icons.js';

const Create = () => {

  const router = useRouter();

  const [numPlayers, setNumPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');
  const [hour, setHour] = useState('');

  const skillLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];

  const sportTypes = [
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Soccer', value: 'Soccer' },
    { label: 'Tennis', value: 'Tennis' },
    { label: 'Volleyball', value: 'Volleyball' },
    { label: 'Handball', value: 'Handball' },
    { label: 'Baseball', value: 'Baseball' },
    { label: 'Football', value: 'Football' },
    { label: 'Pickleball', value: 'Pickleball' },
  ];


  const hours = [
    { label: '1 hour', value: 1 },
    { label: '1 hour 30 minutes', value: 1.5 },
    { label: '2 hour', value: 2 },
    { label: '2 hour 30 minutes', value: 2.5 },
    { label: '3 hour', value: 3 },
    { label: '3 hour 30 minutes', value: 3.5},
    { label: '4 hour', value: 4 },
    { label: '4 hour 30 minutes', value: 4.5},
    { label: '5 hour', value: 5},
    { label: '6 hour', value: 6},
    { label: '6 hour', value: 7},
    { label: '6 hour', value: 8},
    { label: '6 hour', value: 9},
    { label: '6 hour', value: 10},
    { label: '6 hour', value: 11},
  ];


  // Function to create game and set isInGame to true
  const handleCreateGame = async () => {
    router.push('/map');
  };

  // Function to leave game and set isInGame to false
  const handleLeaveGame = async () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex h-full bg-black px-6">
      {/* Close Button */}
      <TouchableOpacity onPress={handleLeaveGame}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      {/* ScrollView - Ensures Vertical Scrolling */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={true}
      >
        {/* Map Section */}
        <View className="w-full h-60 rounded-lg overflow-hidden mt-10">
          <MapView className="w-full h-full" />
        </View>


        <View className="mt-10 space-y-6">
          <NavigateButton 
            text={'Number of Players'} 
            icon={icons.right_arrow} 
            onPress={()=>{
              router.push('/NumofPlayers');
            }}/>
          <NavigateButton 
            text={'Skill Level'} 
            icon={icons.right_arrow}
            onPress={()=>(router.push('/SkillLevel'))}/>
        </View>

        {/* Create Button */}
        <View className="mt-10 mb-20">
          <CustomButton
            title="Create"
            handlePress={handleCreateGame}
            containerStyles="bg-gray-500 text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;