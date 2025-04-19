import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import { updateData} from '../(tabs)/profileFuncs';
import { UserContext } from '../context/userContext';
import { Ionicons } from '@expo/vector-icons';
import Dropdownmenu from '../../components/dropdownmenu';

const EditProfile = () => {
  const router = useRouter(); // Initialize router for navigation

  const {username, setUsername, age, setAge, favoriteSport,
    setFavoriteSport} = useContext(UserContext);

  const [inputUserName, setInputUserName] = useState('');
  const [selectAge, setSelectAge] = useState('');
  const [selectFavoriteSport, setSelectFavoriteSport] = useState('');

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

  const handleSaveData = async () => {
    const updatedUser = {
      username: username,
      age: age,
      favoriteSport: favoriteSport,
    };
    if(inputUserName){
      updatedUser.username = inputUserName;
      setUsername(inputUserName);
    }
    if(selectAge) {
      updatedUser.age = selectAge;
      setAge(selectAge);
    }
    if(selectFavoriteSport){
      updatedUser.favoriteSport = selectFavoriteSport;
      setFavoriteSport(selectFavoriteSport);
    }

    await updateData(updatedUser);

    setInputUserName('');
    setSelectAge('');
    setSelectFavoriteSport('');

    router.back(); // Redirect to profile page
  };

  function handleClose() {
    setInputUserName('');
    setSelectAge('');
    setSelectFavoriteSport('');

    router.back();
  }

  return (
    <SafeAreaView className="bg-black h-full px-6" onTouchStart={Keyboard.dismiss}>
      <TouchableOpacity onPress={handleClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-3xl font-psemibold mt-6 text-center">Edit</Text>
      {/* Profile Fields using FormField Component */}
      <View className="mt-10 space-y-6">
        <FormField
          title="Username"
          placeholder="Enter username"
          handleChangeText={(text)=>{
            setInputUserName(text);
          }}
          otherStyles="mt-2"
        />
        <Dropdownmenu
          title={'Age'}
          items={ages}
          value={selectAge}
          setValue={setSelectAge}
          placeholder='Select an age'
          zIndex={2000}
        />
        <Dropdownmenu
          title={'Favorite Sport'}
          items={sports}
          value={selectFavoriteSport}
          setValue={setSelectFavoriteSport}
          placeholder='Select a sport'
          zIndex={1000}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-12">
        <CustomButton
          title="Save"
          handlePress={handleSaveData}
          containerStyles={`bg-gray-500 text-white mb-4 ${
            (inputUserName || selectAge || selectFavoriteSport) ? 'opacity-100' : 'opacity-50'
          }`}
          textStyles="text-lg"
          isLoading={false}
          disabled={!(inputUserName || selectAge || selectFavoriteSport)}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;