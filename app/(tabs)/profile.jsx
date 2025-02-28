import { View, Text, Alert, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import { changePassword, deleteAccount, logOut, updateData, getData } from './profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../context/userContext';
import image from '../../constants/images';

const Profile = () => {
  const router = useRouter(); // Initialize router for navigation
  const {username, setUsername, age, setAge, favoriteSport, setFavoriteSport} = useContext(UserContext);

  const handleUpdatePassword = () => {
    router.push('/updatePassword'); // Redirect to forgot password page
  };

  // IOS only!
  const handleDeleteAccount = async () => {
    Alert.prompt(
      'Delete Account', 
      'Enter your password to confirm account deletion',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: async (password) => {
          if (password.trim()) { 
            const response = await deleteAccount(password);
            if (response.success) {
              router.replace("/"); // Redirect to sign up page after deletion
            } else {
              Alert.alert('Error', response.message);
            }
          } else {
            Alert.alert("Error", "Password is required.");
          }
        }},
      ],
      'secure-text'
    );
  };

  const handleLogout = async () => {
    await logOut();
    router.replace("/sign-in"); // Redirect to sign-in and prevent going back
  };

  const handleEditProfile = () =>{
    router.push('/editProfile');
  }

  useEffect(()=>{
    const fetchData = async ()=>{
      const response = await getData();

      if (response.success) {
        setUsername(response.data.username);
        setAge(response.data.age);
        setFavoriteSport(response.data.favoriteSport);
      } else {
        Alert.alert('Error', response.message);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <KeyboardAwareScrollView showsVerticalScrollIndicator = {false} >
        <View className="items-center">
          <Image source={image.empty} className='w-20 h-20 bg-purple-600 rounded-full'/>
        </View>
      {/* Profile Fields using FormField Component */}
        <View className="mt-6 space-y-6 bg-gray-900">
          {username && <Text className="text-gray-200 text-3xl font-psemibold mt-6 text-center">{username}</Text>}
          {age && <Text className="text-gray-200 text-3xl font-psemibold mt-6 text-center">{`${age} years old`}</Text>}
          {favoriteSport && <Text className="text-gray-200 text-3xl font-psemibold mt-6 text-center">{`I like ${favoriteSport}`}</Text>}
          <CustomButton
            title="Edit Profile"
            handlePress={handleEditProfile}
            containerStyles="bg-blue-500 text-white mt-5 min-h-[50px] "
          />
        </View>

        {/* Action Buttons */}
        <View className="mt-12">
          
          <CustomButton
            title="Update Password"
            handlePress={handleUpdatePassword}
            containerStyles="bg-gray-500 text-white mb-4"
          />
          
          <CustomButton
            title="Logout"
            handlePress={handleLogout}
            containerStyles="bg-gray-500 text-white mb-4"
          />
          <CustomButton
            title="Delete Account"
            handlePress={handleDeleteAccount}
            containerStyles="bg-red-600 text-white mb-4"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Profile;