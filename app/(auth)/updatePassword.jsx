import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formfield';
import CustomButton from '../../components/custombutton';
import { router } from 'expo-router';
import { resetPassword } from './signUpFuncs';
import { Ionicons } from '@expo/vector-icons';

const UpdatePassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await resetPassword(email);
      if (response.success) {
        setError('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setEmail('');
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons
            name="close"
            size={30}
            color="white"
            style={{ marginLeft: 10, marginTop: 5 }}
          />
        </TouchableOpacity>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6">

          <Text className="text-3xl text-white text-semibold mt-10 font-psemibold text-center">
            Update Password
          </Text>

          <Text className="text-gray-300 text-md text-center mt-2">
            Enter your email and we'll send you a reset link.
          </Text>

          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          {error && <Text style={{color: 'red'}}>{error}</Text>}

          <CustomButton
            title="Reset Password"
            handlePress={handleResetPassword}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="items-center mt-5">
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text className="text-blue-400 text-sm font-psemibold">Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdatePassword;