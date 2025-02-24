import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import {db} from '../(auth)/config/firebaseConfig';
import { Link, router } from "expo-router";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";


const Create = () => {
  
  const { latitude, longitude } = useLocalSearchParams(); // Get coordinates from MapScreen
  const [latitudeType, setLatitudeType] = useState('');
  const [longitudeType, setLongitudeType] = useState('');
  const [numPlayers, setNumPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');

  const handleCreateGame = async (latitude, longitude) => {
    try {
      const coordCollection= collection(db, 'coordinates')
      const coordinateRef = doc(coordCollection, "user-yag")
      const latitudeNumber = typeof latitude === 'number' ? latitude : Number(latitude); // Convert if needed.  Handle potential NaN.
      const longitudeNumber = typeof longitude === 'number' ? longitude : Number(longitude); // Convert if needed. Handle potential NaN.
      await setDoc(coordinateRef, {
        latitude: latitudeNumber,
        longitude: longitudeNumber,
      });
      router.push('/map')
    }
    catch (error) {
      console.error('Game creation failed' + error.message)
      throw error; 
      router.push('/map')
    }
    


   


    // const newGame = {
    //   id: Date.now(),
    //   latitude: parseFloat(latitude),
    //   longitude: parseFloat(longitude),
    //   numPlayers,
    //   skillLevel,
    //   sportType,
    // };

    // // Store the game in a global state or backend (for now, pass it back)
    // router.replace({ pathname: "/(tabs)/map", params: { newGame: JSON.stringify(newGame) } });
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-3xl font-semibold mt-20">Create a Game!</Text>

      <View className="mt-10 space-y-6">
        <Text className="text-white">Location: {latitude}, {longitude}</Text>

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
        <CustomButton title="Create" handlePress={handleCreateGame} containerStyles="bg-gray-500 text-white" />
      </View>
    </SafeAreaView>
  );
};

export default Create;