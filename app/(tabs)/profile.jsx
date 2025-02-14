import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';
import { changePassword, deleteAccount, logOut, updateData } from './profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Profile = () => {
  const router = useRouter(); // Initialize router for navigation

  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("");

  const handleUpdatePassword = () => {
    router.replace('/forgotPassword'); // Redirect to forgot password page
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    router.replace("/");// Redirect to sign up page
  };

  const handleLogout = () => {
    logOut();
    router.replace("/sign-in"); // Redirect to sign-in and prevent going back
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-3xl font-psemibold mt-6">Profile</Text>
        <KeyboardAwareScrollView showsVerticalScrollIndicator = {false}>
      {/* Profile Fields using FormField Component */}
          <View className="mt-10 space-y-6">
            <FormField
              title="Username"
              value={username}
              placeholder="Enter username"
              handleChangeText={(text)=>{
                setUsername(text);
                updateData({username: text, age, favoriteSport});
              }}
              otherStyles="mt-2"
            />
            <FormField
              title="Age"
              value={age}
              placeholder="Enter your age"
              handleChangeText={(text)=>{
                setAge(text);
                updateData({username, age: text, favoriteSport});
              }}
              otherStyles="mt-2"
            />
            <FormField
              title="Favorite Sport"
              value={favoriteSport}
              placeholder="Enter your favorite sport"
              handleChangeText={(text)=>{
                setFavoriteSport(text);
                updateData({username, age, favoriteSport: text});
              }}
              otherStyles="mt-2"
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