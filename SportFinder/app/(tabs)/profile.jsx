import { View, Text, Alert, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import { deleteAccount, logOut, getData } from './profileFuncs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from '../context/userContext';
import Dialog from 'react-native-dialog';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();
  const { username, setUsername, age, setAge, favoriteSport,
    setFavoriteSport } = useContext(UserContext);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

  const handleUpdatePassword = () => {
    router.push('/updatePassword');
  };

  const handleDeleteAccount = async () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Delete Account',
        'Enter your password to confirm account deletion',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: async (inputPassword) => handleProcessDelete(inputPassword) },
        ],
        'secure-text',
      );
    } else {
      setDialogVisible(true);
    }
  };

  const handleProcessDelete = async (inputPassword) => {
    if (!inputPassword.trim()) {
      Alert.alert('Error', 'Password is required.');
      return;
    }

    setDialogVisible(false);
    setPassword('');

    const response = await deleteAccount(inputPassword);
    if (response.success) {
      router.replace('/');
    } else {
      Alert.alert('Error', response.message);
    }
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl font-semibold text-center mt-8">Profile</Text>

        {/* Profile Card */}
        <View className="bg-gray-900 mt-6 rounded-2xl p-6 items-center shadow-lg">
          {/* Profile Info */}
          <Text className="text-white text-3xl font-semibold mt-4">{username || 'Username'}</Text>

          {/* Info Section */}
          <View className="mt-4 space-y-3">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="calendar" size={22} color="white" />
              <Text className="text-gray-300 text-lg">{age ? `${age} years old` : 'Age'}</Text>
            </View>

            <View className="flex-row items-center space-x-2">
              <Ionicons name="football" size={22} color="white" />
              <Text className="text-gray-300 text-lg">
                {favoriteSport ? `I like ${favoriteSport}` : 'Favorite Sport'}
              </Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <CustomButton
            title="Edit Profile"
            handlePress={() => router.push('/editProfile')}
            containerStyles="bg-blue-500 text-white mt-5 min-h-[50px] w-48"
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
            handlePress={async () => {
              await logOut();
              router.replace('/sign-in');
            }}
            containerStyles="bg-gray-500 text-white mb-4"
          />
          <CustomButton
            title="Delete Account"
            handlePress={handleDeleteAccount}
            containerStyles="bg-red-600 text-white mb-4"
          />

          {/* Delete Account Dialog (For Android) */}
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
              }}
            />
            <Dialog.Button
              label="Delete"
              color="red"
              onPress={() => handleProcessDelete(password)}
            />
          </Dialog.Container>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Profile;