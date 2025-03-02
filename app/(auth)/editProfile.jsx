import { View, Text, Alert, TouchableOpacity, Keyboard } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import { changePassword, deleteAccount, logOut, updateData, getData } from '../(tabs)/profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../context/userContext';
import { Ionicons } from '@expo/vector-icons';
import Dropdownmenu from '../../components/dropdownmenu';

const EditProfile = () => {
  const router = useRouter(); // Initialize router for navigation

  const {username, setUsername, age, setAge, favoriteSport, setFavoriteSport} = useContext(UserContext);

  const [inputUserName, setInputUserName] = useState('');
  const [selectAge, setSelectAge] = useState('');
  const [selectFavoriteSport, setSelectFavoriteSport] = useState('');

  const ages = Array.from({ length: 101 }, (_, i) => ({ label: `${i}`, value: i }))
  const sports = [
    {label: 'Basketball', value: 'basketball'},
    {label: 'Volleyball', value: 'volleyball'},
    {label: 'Football', value: 'football'},
    {label: 'Baseball', value: 'baseball'},
    {label: 'Handball', value: 'handball'},
  ];

  const handleSaveData = () => {
    if(inputUserName){
      updateData({'username': inputUserName, age, favoriteSport});
      setUsername(inputUserName);
    }
    if(selectAge) {
      updateData({username, 'age': selectAge, favoriteSport});
      setAge(selectAge);
    }
    if(selectFavoriteSport){
      updateData({username, age, 'favoriteSport': selectFavoriteSport});
      setFavoriteSport(selectFavoriteSport);
    }

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
          <TouchableOpacity 
            onPress={handleSaveData}
            activeOpacity={0.7}
            className={'rounded-xl min-h-[62px] flex flex-row ' +
              'justify-center items-center bg-purple-600 text-white mb-4 ' + 
              ((inputUserName || selectAge || selectFavoriteSport) ? 'opacity-100' : 'opacity-50')
                }
            disabled={(inputUserName || selectAge || selectFavoriteSport) ? false : true}
          >
            <Text className={`text-primary font-psemibold text-lg`}>
                Save
            </Text>
          </TouchableOpacity>

        </View>
    </SafeAreaView>
  );
};

export default EditProfile;