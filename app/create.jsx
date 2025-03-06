import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';
import Dropdownmenu from '../components/dropdownmenu';
import { db, auth } from './(auth)/config/firebaseConfig';
import { collection, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];

  const sportTypes = [
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Soccer', value: 'Soccer' },
    { label: 'Tennis', value: 'Tennis' },
    { label: 'Volleyball', value: 'Volleyball' }
  ];

  const hours = Array.from({ length: 5 }, (_, i) => ({ label: `${i+1}`, value: i+1 }));

  // Function to create game and set isInGame to true
  const handleCreateGame = async () => {
    if (!numPlayers || !skillLevel || !sportType || !hour) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const userId = currentUser.uid;
      const coordCollection = collection(db, 'coordinates');
      const coordinateRef = doc(coordCollection, userId);
      const userRef = doc(db, "users", userId);

      // Create game data
      await setDoc(coordinateRef, {
        latitude,
        longitude,
        numPlayers,
        skillLevel,
        sportType,
        timeCreated: new Date(),
        hour,
        currentPlayers: 1
      });

      // Update user status to indicate they are in a game
      await setDoc(userRef, { isInGame: true }, { merge: true });

      router.push('/map');
    } catch (error) {
      console.error('Game creation failed:', error.message);
      setErrorMessage("Failed to create game. Please try again.");
    }
  };

  // Function to leave game and set isInGame to false
  const handleLeaveGame = async () => {
    try {
      const currentUser = auth.currentUser;
      const userId = currentUser.uid;
      const coordinateRef = doc(db, 'coordinates', userId);
      const userRef = doc(db, "users", userId);

      // Remove game from database
      await deleteDoc(coordinateRef);

      // Update user status to indicate they are no longer in a game
      await updateDoc(userRef, { isInGame: false });

      router.push('/map');
    } catch (error) {
      console.error('Failed to leave game:', error.message);
      setErrorMessage("Failed to leave game. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <TouchableOpacity onPress={handleLeaveGame}>
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
        <CustomButton
          title="Leave Game"
          handlePress={handleLeaveGame}
          containerStyles="bg-red-500 text-white mt-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
