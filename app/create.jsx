import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';
import Dropdownmenu from '../components/dropdownmenu';
import { db, auth } from './(auth)/config/firebaseConfig';
import { collection, setDoc, doc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

const Create = () => {
  const { latitude, longitude } = useLocalSearchParams();
  const [numPlayers, setNumPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');
  const [hour, setHour] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const skillLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];

  const sportTypes = [
    { label: 'Basketball', value: 'basketball' },
    { label: 'Soccer', value: 'soccer' },
    { label: 'Tennis', value: 'tennis' },
    { label: 'Volleyball', value: 'volleyball' }
  ];

  const hours = Array.from({ length: 5 }, (_, i) => ({ label: `${i+1}`, value: i+1 }));

  const handleCreateGame = async () => {
    if (!numPlayers || !skillLevel || !sportType || !hour) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const coordCollection = collection(db, 'coordinates');
      const coordinateRef = doc(coordCollection, currentUser.uid);

      await setDoc(coordinateRef, {
        latitude,
        longitude,
        numPlayers,
        skillLevel,
        sportType,
        timeCreated: new Date(),
        hour
      });

      router.push('/map');
    } catch (error) {
      console.error('Game creation failed:', error.message);
      setErrorMessage("Failed to create game. Please try again.");
    }
  };

  const handleClose = () => {
    router.push('/map');
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <TouchableOpacity onPress={handleClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-3xl font-semibold mt-20">Create a Game!</Text>

      {errorMessage ? (
        <Text className="text-red-500 mt-4">{errorMessage}</Text>
      ) : null}

      <View className="mt-10 space-y-6">
        <FormField
          title="Number of Players"
          value={numPlayers}
          placeholder="Enter number of players"
          handleChangeText={setNumPlayers}
          otherStyles="mt-2"
        />
        <Dropdownmenu
          title="Skill Level"
          items={skillLevels}
          value={skillLevel}
          setValue={setSkillLevel}
          placeholder="Select skill level"
          zIndex={3000}
        />
        <Dropdownmenu
          title="Sport Type"
          items={sportTypes}
          value={sportType}
          setValue={setSportType}
          placeholder="Select sport type"
          zIndex={2000}
        />
        <Dropdownmenu
          title="Hour"
          items={hours}
          value={hour}
          setValue={setHour}
          placeholder="Select an estimated time for game"
          zIndex={1000}
        />
      </View>

      <View className="mt-10">
        <CustomButton
          title="Create"
          handlePress={handleCreateGame}
          containerStyles="bg-gray-500 text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
