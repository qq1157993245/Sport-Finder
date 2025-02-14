import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/formfield';
import CustomButton from '../../components/custombutton';
import { Link, router } from 'expo-router'
import { loginAuth } from './loginFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignIn = () => {

  async function handleSignIn() {
    const response = await loginAuth(email, password);
    if (response.success) {
      router.push('/map');
    } else {
      setError(response.message);
    }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <SafeAreaView className="bg-black h-full">
      <KeyboardAwareScrollView>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6">
          <Image source={images.sflogo2}
            resizeMode='contain' className="w-[115px] h-[35px]"
          />
          <Text className="text-3xl text-white text-semibold mt-10 ml-1 font-psemibold" >
          Login
          </Text>

          <FormField
            title="Email"
            value={email}
            handleChangeText={(text) => setEmail(text)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={(text) => setPassword(text)}
            otherStyles="mt-7"
          />
          
          <CustomButton
            title="Sign In"
            handlePress={()=>handleSignIn()}
            containerStyles="mt-7"
          />

          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

          <View className="justify-center pt-5 flex-row gap-2 items-center">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/"
              className='text-white font-psemibold mt-50'>
              Sign up!
            </Link>
          </View>

          <View className="items-center mt-3">
            <Link href="/forgotPassword" className="text-blue-400 text-sm font-psemibold">
              Forgot Password?
            </Link>
          </View>
          
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SignIn