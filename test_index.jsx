import { Text, View, StyleSheet, Button, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignInButton from '@/components/SignInButton';
import FormField from '@/components/FormField';
import { useState } from 'react';
export default function Index() {

  const router = useRouter();

  const [form, setForm] = useState({
    email:'',
    password:''
  })
  return (
    <SafeAreaView className="bg-[#161622] h-full">
      <ScrollView>
        <View className="w-full justify-center items-center h-full px-4">
          <Text className = "text-white text-4xl font-bold mb-4  ">SportsFinder</Text>
          {/* <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">Need people to play sports with?</Text> */}
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">Sign up to SportsFinder!</Text>
          {/* <SignInButton
            title="Already have an account? Sign in!"
            handlePress={() => router.push('/login')}
          /> */}
          <FormField
            title = "Username"
            value = {form.username} 
            handleChangeText={(e) => setForm({ ...form, 
            username: e})}
            otherStyles="mt-7"
            
          />
          <FormField
            title = "Email"
            value = {form.email} 
            handleChangeText={(e) => setForm({ ...form, 
            email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title = "Password"
            value = {form.password} 
            handleChangeText={(e) => setForm({ ...form, 
            password: e})}
            otherStyles="mt-7"  
            
          />
          <SignInButton
            title="Sign Up"
            handlePress={() => router.push('/login')}
            containerStyles ="mt-7"
          /> 
           {/* <SignInButton
            title="Already have an account? Sign in!"
            handlePress={() => router.push('/login')}
            containerStyles ="mt-7"

          />  */}
          
        </View>
        
      
      </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    color: '#fff',
  },
  safeArea: {
    backgroundColor: '#25292e',
    flex: 1, 
  },
});