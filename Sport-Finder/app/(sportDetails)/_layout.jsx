import React from 'react';
import { Stack } from 'expo-router';

const SportDetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name='searchAddress'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='location'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='groupChat'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='groupChatDetails'
        options={{headerShown: false}}/>
    </Stack>
  );
};

export default SportDetailsLayout;
