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
import {googleAuth} from '../app/(auth)/loginFuncs';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();
const redirectUri = makeRedirectUri({
  useProxy: true,
});

const SignUp = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '768186809270-bjf9c64b2bc1cbtk7lol6pfn49l5s2d0.apps.googleusercontent.com',
    redirectUri,
  });


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

  async function handleSignUpWithGoogle() {
    const result = await promptAsync();
    console.log(result);
  
    if (result.type === 'success') {
      const idToken = result.params.id_token;
      if (idToken) {
        const response = await googleAuth(idToken);
        if (response.success) {
          console.log('Google signup success');
        } else {
          setError(response.message);
        }
      } else {
        setError('No ID Token received');
      }
    } else {
      setError('Google Sign In Cancelled');
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

          <CustomButton
            title="Sign Up With Google"
            handlePress={()=>handleSignUpWithGoogle()}
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