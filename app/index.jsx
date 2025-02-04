import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";


import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';


const SignUp = () => {

  const [form, setForm] = useState({
    email:'',
    password:''
  })
  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView>

        <View
          className="w-full flex justify-center h-full px-4 my-6"
        >

          <Text className="text-center text-3xl justify-center font-semibold text-white mt-10 font-psemibold">
            Sign Up to SportsFinder
          </Text>
          <Text className="text-center text-lg justify-center font-semibold text-white mt-10 font-psemibold">
            Sign Up to SportsFinder
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            containerStyles="mt-7"

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