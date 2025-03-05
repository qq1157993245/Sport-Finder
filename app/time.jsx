import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../components/formfield';
import CustomButton from '../components/custombutton';
import Dropdownmenu from '../components/dropdownmenu'; // Import Dropdownmenu
import { collection, setDoc, doc, getDoc , deleteDoc, updateDoc} from "firebase/firestore";
import { db, auth } from './(auth)/config/firebaseConfig';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import firestore from 'firebase/firestore';


const addTime = () => {
   

    const [Hour, setHour] = useState('');
    const hours = Array.from({ length: 5 }, (_, i) => ({ label: `${i+1}`, value: i+1 }))

    const router = useRouter();

    // manually delete a marker
    const currentUser = auth.currentUser; 

    
    const handleSave = async () => {
      try {
        const docRef = doc(db, 'coordinates', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // const currHour = docSnap.data().hour;
          // console.log("Time - ", currHour)
          
          // const h = parseInt(Number(Hour) + Number(currHour))
          if (Hour === ''){
        
              Alert.alert("Error", "Hour wasn't inputted. Your current game was not extended.");
          }
          else {
            await updateDoc(doc(db, "coordinates", currentUser.uid),{
              hour: Hour
            });
            Alert.alert('Success', 'Added more time your current event');
          }
          
          
        }
        else{
          Alert.alert("You have not created an event. Please create one first.");
        }
        
        
      } catch (error) {
        console.error('Error updating coordinate attribute:', error);
        Alert.alert('Error', 'Failed to add time to your event.');
      }
      console.log('Event saved');
      router.push('/map');

    };
   

    

    return (
      <SafeAreaView className="bg-black h-full px-6 py-10">
        {/* Header */}
        <Text className="text-white text-3xl font-semibold text-center">Add time to your current event</Text>

        {/* Event Info Section */}
        <View className="mt-8 space-y-6">
          <Text className="text-white text-xl font-semibold">Extend your event time</Text>

          {/* Form fields for number of players, skill level, and sport type */}
          
          <Dropdownmenu
          title="Hour"
          items={hours}
          value={Hour}
          setValue={setHour}
          placeholder="Select an estimated time for game"
          zIndex={2000}
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

        
        
      </SafeAreaView>
    );
  };

  export default addTime;