import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import { changePassword, deleteAccount, logOut, updateData, getData } from '../(tabs)/profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../context/userContext';
import { Ionicons } from '@expo/vector-icons';

const EditProfile = () => {
  const router = useRouter(); // Initialize router for navigation

  const {username, setUsername, age, setAge, favoriteSport, setFavoriteSport} = useContext(UserContext);

  const [inputUserName, setInputUserName] = useState('');
  const [inputAge, setInputAge] = useState('');
  const [inputFavoriteSport, setInputFavoriteSport] = useState('');

  const handleSaveData = () => {
    if(inputUserName){
      updateData({'username': inputUserName, age, favoriteSport});
      setUsername(inputUserName);
    }
    if(inputAge) {
      updateData({username, 'age': inputAge, favoriteSport});
      setAge(inputAge);
    }
    if(inputFavoriteSport){
      updateData({username, age, 'favoriteSport': inputFavoriteSport});
      setFavoriteSport(inputFavoriteSport);
    }

    setInputUserName('');
    setInputAge('');
    setInputFavoriteSport('');

    router.back(); // Redirect to profile page
  };

  function handleClose() {
    setInputUserName('');
    setInputAge('');
    setInputFavoriteSport('');

    router.back();
  }

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <TouchableOpacity onPress={handleClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-3xl font-psemibold mt-6 text-center">Edit</Text>
      <KeyboardAwareScrollView showsVerticalScrollIndicator = {false}>
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
          <FormField
            title="Age"
            placeholder="Enter your age"
            handleChangeText={(text)=>{
              setInputAge(text);
            }}
            otherStyles="mt-2"
            keyboardType = "numeric"
          />
          <FormField
            title="Favorite Sport"
            placeholder="Enter your favorite sport"
            handleChangeText={(text)=>{
              setInputFavoriteSport(text);
            }}
            otherStyles="mt-2"
          />
        </View>

        {/* Action Buttons */}
        <View className="mt-12">
          <TouchableOpacity 
            onPress={handleSaveData}
            activeOpacity={0.7}
            className={'rounded-xl min-h-[62px] flex flex-row ' +
              'justify-center items-center bg-purple-600 text-white mb-4 ' + 
              ((inputUserName || inputAge || inputFavoriteSport) ? 'opacity-100' : 'opacity-50')
                }
            disabled={(inputUserName || inputAge || inputFavoriteSport) ? false : true}
          >
            <Text className={`text-primary font-psemibold text-lg`}>
                Save
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;