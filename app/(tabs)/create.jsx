import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import {db,auth} from '../(auth)/config/firebaseConfig';
import { Link, router } from "expo-router";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

const Create = () => {
  const { latitude, longitude } = useLocalSearchParams(); // Get coordinates from MapScreen
  const [latitudeType, setLatitudeType] = useState('');
  const [longitudeType, setLongitudeType] = useState('');
  const [numPlayers, setNumPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');

  const router = useRouter();  // Using router to navigate

  const handleCreateGame = async (latitude, longitude) => {
    try {
      const currentUser = auth.currentUser;
      const coordCollection= collection(db, 'coordinates');
      const coordinateRef = doc(coordCollection, currentUser.uid);
      console.log(typeof latitude);
      console.log(typeof longitude);
      await setDoc(coordinateRef, {
        latitude,
        longitude,
        numPlayers,
        skillLevel,
        sportType,
        timeCreated: new Date(),
      });

      // After creating the game, navigate back to map screen with updated state
      router.push('/map'); // You may pass the event state here if needed.
    } catch (error) {
      console.error('Game creation failed: ' + error.message);
      throw error;
    }
  };

  const handleClose = () => {
    router.push('/map'); // Navigate to the map page when the close button is pressed
  };

  return (

    <SafeAreaView className="bg-black h-full px-6">
      <TouchableOpacity onPress={handleClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-3xl font-semibold mt-20">Create a Game!</Text>

      <View className="mt-10 space-y-6">
        <Text className="text-white">latitude: {latitude}</Text>
        <Text className="text-white">longitude: {longitude}</Text>
        <FormField
          title="Number of Players"
          value={numPlayers}
          placeholder="Enter number of players"
          handleChangeText={setNumPlayers}
          otherStyles="mt-2"
        />

        <FormField
          title="Skill Level"
          value={skillLevel}
          placeholder="Enter skill level"
          handleChangeText={setSkillLevel}
          otherStyles="mt-2"
        />

        <FormField
          title="Sport Type"
          value={sportType}
          placeholder="Enter sport type"
          handleChangeText={setSportType}
          otherStyles="mt-2"
        />
      </View>

      <View className="mt-10">
        <CustomButton
          title="Create"
          handlePress={() => handleCreateGame(latitude,longitude )}
          containerStyles="bg-gray-500 text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;