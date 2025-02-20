import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import FormField from '../../components/formfield';

const profile = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("");

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-2xl font-psemibold text-center">Profile</Text>

      {/* profile Fields using FormField Component */}
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
        <CustomButton
          title="Save"
          containerStyles="bg-gray-500 text-white mt-10"
        />
      </View>

    </SafeAreaView>
  );
};

export default profile;