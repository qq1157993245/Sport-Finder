import { useState, useContext, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text} from 'react-native';
import CustomButton from '../components/custombutton';
import FormField from '../components/formfield';
import {signUp} from './(auth)/signUpFuncs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { AuthContext } from "./(auth)/config/firebaseConfig";
import { Redirect } from 'expo-router';
import { UserContext } from './context/userContext';

const SignUp = () => {

  const { currentUser, pending} = useContext(UserContext);
  const [isLoggedIn , setisLoggedIn] = useState(false);

  useEffect(() => {
    console.log('CHECKING USER ' + currentUser);
    if (!pending && currentUser) {
      // Redirect to map if already logged in
      setisLoggedIn(true);
      console.log('PUSHING MAP');
    }
  }, [pending, currentUser]);

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
  if (isLoggedIn){
    return <Redirect href="/map" />;
  }
  return (
    <SafeAreaView className="bg-black h-full">
      <KeyboardAwareScrollView>
        <View className="w-full flex justify-center h-full px-4 my-4">
          <Text className={'text-center text-4xl justify-center ' + 
            'font-semibold text-white font-psemibold'}>
            SportsFinder
          </Text>
          <Text className={'text-left text-2xl justify-center ' + 
            'font-semibold text-white mt-10 font-psemibold'}>
            Sign Up
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

          <FormField
            title="Confirm Password"
            value={confirmPassword}
            handleChangeText={(text) => setConfirmPassword(text)}
            otherStyles="mt-7"
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

          <CustomButton
            title="Sign Up"
            handlePress={()=>handleSignUp()}
            containerStyles="mt-7"
            // isLoading={loading}
          />

          <View className="justify-center pt-5 flex-row gap-2 items-center">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className='text-white font-psemibold mt-50'>
              Sign In!
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;