import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import {auth} from '../app/(auth)/config/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';


const SignUp = () => {

  const [form, setForm] = useState({
    email:'',
    password:''
  })
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const [isSubmitting, setIsSubmitting] = useState(false)

  const signUp= async () => {

    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    
    else{
      setLoading(true)
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        console.log(response);
        router.push('/map')
      }
      catch (error) {
        console.log(error)
        alert('Sign Up failed: ' + error.message)
      }
      finally {
        setLoading(false)
      }
    }
    

  }
  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView>

        <View
          className="w-full flex justify-center h-full px-4 my-6"
        >

          <Text className="text-center text-3xl justify-center font-semibold text-white mt-10 font-psemibold">
            SportsFinder
          </Text>
          <Text className="text-center text-lg justify-center font-semibold text-white mt-10 font-psemibold">
            Sign Up to SportsFinder
          </Text>

          {/* <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          /> */}

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
            title="Sign Up"
            handlePress={signUp}
            containerStyles="mt-7"
            isLoading={loading}
          />

          <CustomButton
            title="Already have an account? Sign in!"
            handlePress={() => router.push('/sign-in')}
            containerStyles="mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;