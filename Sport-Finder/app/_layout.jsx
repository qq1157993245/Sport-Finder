import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UserProvider from './context/userContext';
import PoppinsBlack from '../assets/fonts/Poppins-Black.ttf';
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf';
import PoppinsExtraBold from '../assets/fonts/Poppins-ExtraBold.ttf';
import PoppinsExtraLight from '../assets/fonts/Poppins-ExtraLight.ttf';
import PoppinsLight from '../assets/fonts/Poppins-Light.ttf';
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf';
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf';
import PoppinsSemiBold from '../assets/fonts/Poppins-SemiBold.ttf';
import PoppinsThin from '../assets/fonts/Poppins-Thin.ttf';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': PoppinsBlack,
    'Poppins-Bold': PoppinsBold,
    'Poppins-ExtraBold': PoppinsExtraBold,
    'Poppins-ExtraLight': PoppinsExtraLight,
    'Poppins-Light': PoppinsLight,
    'Poppins-Medium': PoppinsMedium,
    'Poppins-Regular': PoppinsRegular,
    'Poppins-SemiBold': PoppinsSemiBold,
    'Poppins-Thin': PoppinsThin,
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="create" options={{ headerShown: false }} />
            <Stack.Screen name="time" options={{ headerShown: false }} />
            <Stack.Screen name="gameDetails" options={{ headerShown: false }} />
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
          </Stack>
        </SafeAreaProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;