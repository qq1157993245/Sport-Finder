import { View, Text, Alert, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FormField from '../../components/formfield';
import { updateData } from '../(tabs)/profileFuncs';
import Dropdownmenu from '../../components/dropdownmenu';

const Preferences = () => {
  async function handleSaveInfo() {
    const response = await updateData({username, age, favoriteSport});
    if (response.success) {
      router.replace('/map');
    } else {
      Alert.alert('Error', 'Internal Server Error');
    }
  }

  const router = useRouter(); // Initialize router for navigation

  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [favoriteSport, setFavoriteSport] = useState('');

  const ages = Array.from({ length: 87 }, (_, i) => ({ label: `${i + 13}`, value: i + 13 }));
  const sports = [
    { label: 'Basketball', value: 'basketball' },
    { label: 'Soccer', value: 'soccer' },
    { label: 'Tennis', value: 'tennis' },
    { label: 'Volleyball', value: 'volleyball' },
    { label: 'Handball', value: 'handball' },
    { label: 'Baseball', value: 'Baseball' },
    { label: 'Football', value: 'Football' },
    { label: 'Pickleball', value: 'Pickleball' },
  ];

  return (
    <SafeAreaView className="bg-black h-full px-6" onTouchStart={Keyboard.dismiss}>
      <Text className="text-white text-3xl font-psemibold mt-6 text-center">Preferences</Text>
      {/* Profile Fields using FormField Component */}
      <View className="mt-10 space-y-6">
        <FormField
          title="Username"
          value={username}
          placeholder="Enter username"
          handleChangeText={(text)=>{
            setUsername(text);
          }}
          otherStyles="mt-2"
        />
        <Dropdownmenu
          title={'Age'}
          items={ages}
          value={age}
          setValue={setAge}
          placeholder='Select an age'
          zIndex={2000}
        />
        <Dropdownmenu
          title={'Favorite Sport'}
          items={sports}
          value={favoriteSport}
          setValue={setFavoriteSport}
          placeholder='Select a sport'
          zIndex={1000}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-12">
        <TouchableOpacity
          onPress={handleSaveInfo}
          activeOpacity={0.7}
          className={'rounded-xl min-h-[62px] flex flex-row ' +
                   'justify-center items-center bg-red-600 text-white mb-4 ' +
                   ((username && age && favoriteSport) ? 'opacity-100' : 'opacity-50')
          }
          disabled={(username && age && favoriteSport) ? false : true}
        >
          <Text className={'text-primary font-psemibold text-lg'}>
                    Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Preferences;