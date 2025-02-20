import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';

const Settings = () => {
  const router = useRouter();

  const handleAccount = () => {
    router.push("/profile");
  };

  const handleUpdatePassword = () => {
    console.log("Update Password Clicked");
  };

  const handleDeleteAccount = () => {
    console.log("Delete Account Clicked");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-2xl font-psemibold text-center mt-10">Settings</Text>
      <View className="mt-20">
        <CustomButton
          title="Profile"
          handlePress={handleAccount}
          containerStyles="bg-gray-500 text-white mb-4"
        />
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
    </SafeAreaView>
  );
};

export default Settings;