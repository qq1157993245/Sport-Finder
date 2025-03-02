import { View, Text, Alert, Image, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import { changePassword, deleteAccount, logOut, updateData, getData } from './profileFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../context/userContext';
import image from '../../constants/images';
import Dialog from "react-native-dialog";

const Profile = () => {
  const router = useRouter(); // Initialize router for navigation
  const {username, setUsername, age, setAge, favoriteSport, setFavoriteSport} = useContext(UserContext);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleUpdatePassword = () => {
    router.push('/updatePassword'); // Redirect to forgot password page
  };

  const handleDeleteAccount = async () => {
    // For ios
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Delete Account', 
        'Enter your password to confirm account deletion',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete', onPress: async (inputPassword) => handleProcessDelete(inputPassword)},
        ],
        'secure-text'
      );
    } else { // For android
      setDialogVisible(true);
    }
  };

  const handleProcessDelete = async (inputPassword) => {
    if (!inputPassword.trim()) {
      Alert.alert("Error", "Password is required.");
      return;
    }

    setDialogVisible(false);
    setPassword(''); 

    const response = await deleteAccount(inputPassword);
    if (response.success) {
      router.replace("/"); // Redirect to sign up page
    } else {
      Alert.alert('Error', response.message);
    }
  }

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

          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Delete Account</Dialog.Title>
            <Dialog.Description>
              Enter your password to confirm account deletion.
            </Dialog.Description>
            <Dialog.Input 
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Dialog.Button 
              label="Cancel"
              onPress={() => {
                setDialogVisible(false);
                setPassword('');
              }} />
            <Dialog.Button label="Delete" color="red" onPress={()=>handleProcessDelete(password)} />
         </Dialog.Container>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Profile;