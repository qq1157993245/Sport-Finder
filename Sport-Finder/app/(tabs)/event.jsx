import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/custombutton';
import Dropdownmenu from '../../components/dropdownmenu'; // Import Dropdownmenu
import { collection, doc, getDoc , deleteDoc, updateDoc} from 'firebase/firestore';
import { db, auth } from '../(auth)/config/firebaseConfig';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';


const Event = () => {
  const [Players, setNumPlayers] = useState('');
  const [sLevel, setSkillLevel] = useState('');
  const [sType, setSportType] = useState('');

  const skillLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];

  const sportTypes = [
    { label: 'Basketball', value: 'basketball' },
    { label: 'Soccer', value: 'soccer' },
    { label: 'Tennis', value: 'tennis' },
    { label: 'Volleyball', value: 'volleyball' },
    { label: 'Handball', value: 'handball' },
    { label: 'Baseball', value: 'Baseball' },
    { label: 'Football', value: 'Football' },
    { label: 'Pickleball', value: 'Pickleball' },
  ];

  const router = useRouter();

  // manually delete a marker
  const currentUser = auth.currentUser;

  const handleEndGame = async () => {
    try {
      const coordCollection = collection(db, 'coordinates');
      const coordinateRef = doc(coordCollection, auth.currentUser.uid);
      const coordSnap = await getDoc(coordinateRef);
    
      if (!coordSnap.exists()) {
        Alert.alert('You have not created an event. Please create one first.');
        router.push('/map');
        return;
      }
    
      const gameData = coordSnap.data();
      const players = gameData.players || [];
      const updatePromises = players.map(async (userId) => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
          await updateDoc(userRef, { isInGame: false });
        }
      });
    
      await Promise.all(updatePromises);
    
      // Now delete the event from coordinates
      await deleteDoc(coordinateRef);
      console.log('Game event deleted successfully.');
      Alert.alert('Success', 'You have ended the game.');
    
      router.push('/map');
    } catch (error) {
      console.error('Error ending game:', error);
      Alert.alert('Error', 'Failed to end game.');
    }
  };

  const handleSave = async () => {
    try {
      const coordCollection = collection(db, 'coordinates');
      const coordinateRef = doc(coordCollection, currentUser.uid);
      const coordSnap = await getDoc(coordinateRef);

      if (coordSnap.exists()) {
        let updated = false;

        if (Players !== '') {
          await updateDoc(doc(db, 'coordinates', currentUser.uid), {
            numPlayers: Players,
          });
          setNumPlayers('');
          updated = true;
        }
        if (sLevel !== '') {
          await updateDoc(doc(db, 'coordinates', currentUser.uid), {
            skillLevel: sLevel,
          });
          setSkillLevel('');
          updated = true;
        }
        if (sType !== '') {
          await updateDoc(doc(db, 'coordinates', currentUser.uid), {
            sportType: sType,
          });
          setSportType('');
          updated = true;
        }

        if (updated) {
          Alert.alert('Success', 'Edited current event!');
        }

        router.push('/map');
      } else {
        Alert.alert('You have not created an event. Please create one first.');
        router.push('/map');
      }
    } catch (error) {
      console.error('Error editing current event', error);
    }
  };

  const handleAddTime = () => {
    // Implement add time functionality'
    router.push('/time');
    console.log('Time added');
  };



  return (
    <SafeAreaView className="bg-black h-full px-6 py-10">
      {/* Header */}
      <Text className="text-white text-3xl font-semibold text-center">My Event</Text>

      {/* Event Info Section */}
      <View className="mt-10 space-y-6">
        <Text className="text-white text-xl font-semibold">Event Info</Text>

        {/* Form fields for number of players, skill level, and sport type */}
        <Dropdownmenu
          title="Number of Players"
          items={Array.from({ length: 20 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
          value={Players}
          setValue={setNumPlayers}
          placeholder="Select number of players"
        />
        <Dropdownmenu
          title="Skill Level"
          items={skillLevels}
          value={sLevel}
          setValue={setSkillLevel}
          placeholder="Select skill level"
          zIndex={2000}
        />
        <Dropdownmenu
          title="Sport Type"
          items={sportTypes}
          value={sType}
          setValue={setSportType}
          placeholder="Select sport type"
          zIndex={1000}
        />
      </View>

      {/* Save Button */}
      <View className="mt-10">
        <CustomButton
          title="Save"
          handlePress={handleSave}
          containerStyles="bg-gray-500 text-white w-full"
        />
      </View>

      {/* Buttons: Add Time & End Game */}
      <View className="mt-6 flex-row justify-between space-x-4">
        <CustomButton
          title="Add Time"
          handlePress={handleAddTime}
          containerStyles="bg-blue-500 text-white w-40 "
        />
        <CustomButton
          title="End Game"
          handlePress={handleEndGame}
          containerStyles="bg-red-500 text-white w-40 "
        />
      </View>
    </SafeAreaView>
  );
};

export default Event;