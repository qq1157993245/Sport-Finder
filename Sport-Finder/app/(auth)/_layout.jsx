import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="forgotPassword"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="preferences"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="editProfile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="updatePassword"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor ='#161622'
        style="light" />
    </>
  );
};

export default AuthLayout;