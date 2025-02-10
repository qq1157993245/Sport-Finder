import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/formfield';
import CustomButton from '../../components/custombutton';
import { Link, router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../(auth)/config/firebaseConfig'

const SignIn = () => {
  // const [form, setForm] = useState({
  //   email: '',
  //   password: ''
  // })
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // const submit = () => {

  // }
  const signIn = async () => {

    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    else{
      setLoading(true)
      try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        console.log(response);
        router.push('/map')
        
      }
      catch (error) {
        console.log(error)
        alert('Sign in failed: ' + error.message)
      }
      finally {
        setLoading(false)
      }
    }
    

  }

  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView>
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
            handlePress={signIn}
            containerStyles="mt-7"
            isLoading={loading}
          />

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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn