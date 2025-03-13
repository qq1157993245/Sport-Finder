import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import Dropdownmenu from '../components/dropdownmenu'; // Import Dropdownmenu
import { doc, getDoc , updateDoc} from 'firebase/firestore';
import { db, auth } from './(auth)/config/firebaseConfig';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';


const addTime = () => {
   

  const [Hour, setHour] = useState('');
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
      
  ];

  const router = useRouter();

  // manually delete a marker
  const currentUser = auth.currentUser; 

    
  function isFloat(number) {
    return Number(number) === number && number % 1 !== 0;
  }
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'coordinates', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const endTime = docSnap.data().expiresAt.toDate();
        const currHour = docSnap.data().hour;
        if (isFloat(Hour)) {
          const num =  Math.floor(Hour);
          endTime.setHours(endTime.getHours() + num);
          endTime.setMinutes(endTime.getMinutes() + 30);
        }
        else{
          endTime.setHours(endTime.getHours() + Number(Hour));
        }
        
        if (Hour === ''){
        
          Alert.alert('Error', 'Hour wasn\'t inputted. Your current game was not extended.');
        }
        else {
          await updateDoc(doc(db, 'coordinates', currentUser.uid),{
            hour: Hour + currHour,
            expiresAt: endTime,
          });
          Alert.alert('Success', 'Added more time your current event');
        }
          
          
      }
      else{
        Alert.alert('You have not created an event. Please create one first.');
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
      <Text className="text-white text-3xl font-semibold text-center">
        Add time to your current event
      </Text>

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