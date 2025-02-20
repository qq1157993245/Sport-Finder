import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';
import {signUp} from './(auth)/signUpFuncs';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const SignUp = () => {

  async function handleSignUp() {
      const response = await signUp(email, password, confirmPassword);
      if (response.success) {
        router.push('/preferences');
      }else{
        setError(response.message);
      }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <SafeAreaView className="bg-black h-full">
      <KeyboardAwareScrollView>

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
            secureTextEntry
          />

          <FormField
            title="Confirm Password"
            value={confirmPassword}
            handleChangeText={(text) => setConfirmPassword(text)}
            otherStyles="mt-7"
            secureTextEntry
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

          <CustomButton
            title="Sign Up"
            handlePress={()=>handleSignUp()}
            containerStyles="mt-7"
            // isLoading={loading}
          />

          <CustomButton
            title="Already have an account? Sign in!"
            handlePress={() => router.push('/sign-in')}
            containerStyles="mt-7"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;