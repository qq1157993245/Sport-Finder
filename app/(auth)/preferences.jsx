import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FormField from '../../components/formfield';
import { updateData } from '../(tabs)/profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("");

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-3xl font-psemibold mt-6 text-center">Preferences</Text>
        <KeyboardAwareScrollView showsVerticalScrollIndicator = {false}>
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
            <FormField
              title="Age"
              value={age}
              placeholder="Enter your age"
              handleChangeText={(text)=>{
                setAge(text);
              }}
              otherStyles="mt-2"
            />
            <FormField
              title="Favorite Sport"
              value={favoriteSport}
              placeholder="Enter your favorite sport"
              handleChangeText={(text)=>{
                setFavoriteSport(text);
              }}
              otherStyles="mt-2"
            />
          </View>

          {/* Action Buttons */}
          <View className="mt-12">
            <TouchableOpacity
                onPress={handleSaveInfo}
                activeOpacity={0.7}
                className={'rounded-xl min-h-[62px] flex flex-row ' +
                   'justify-center items-center bg-red-600 text-white mb-4 ' + 
                   ((username && age) ? 'opacity-100' : 'opacity-50')
                    }
                disabled={(username && age) ? false : true}
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

export default Preferences;