import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';

const Profile = () => {
  const router = useRouter(); // Initialize router for navigation

  const [username, setUsername] = useState("Enter Your Username");
  const [age, setAge] = useState("Enter your age");
  const [favoriteSport, setFavoriteSport] = useState("Enter your Favorite Sport");

  const handleUpdatePassword = () => {
    console.log("Update Password Clicked");
  };

  const handleDeleteAccount = () => {
    console.log("Delete Account Clicked");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.replace("/sign-in"); // Redirect to sign-in and prevent going back
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-3xl font-psemibold mt-6">Profile</Text>

      {/* Profile Fields using FormField Component */}
      <View className="mt-10 space-y-6">
        <FormField
          title="Username"
          value={username}
          placeholder="Enter username"
          handleChangeText={setUsername}
          otherStyles="mt-2"
        />
        <FormField
          title="Age"
          value={age}
          placeholder="Enter your age"
          handleChangeText={setAge}
          otherStyles="mt-2"
        />
        <FormField
          title="Favorite Sport"
          value={favoriteSport}
          placeholder="Enter your favorite sport"
          handleChangeText={setFavoriteSport}
          otherStyles="mt-2"
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-12">
        <CustomButton
          title="Update Password"
          handlePress={handleUpdatePassword}
          containerStyles="bg-gray-700 text-white mb-4"
        />
        <CustomButton
          title="Delete Account"
          handlePress={handleDeleteAccount}
          containerStyles="bg-red-600 text-white mb-4"
        />
        <CustomButton
          title="Logout"
          handlePress={handleLogout}
          containerStyles="bg-gray-500 text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;