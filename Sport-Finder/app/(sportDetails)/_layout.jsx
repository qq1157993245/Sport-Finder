import React from 'react';
import { Stack } from 'expo-router';

const SportDetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name='numofPlayers'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='skillLevel'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='sportType'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='hours'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='address'
        options={{headerShown: false}}/>
      <Stack.Screen 
        name='location'
        options={{headerShown: false}}/>
    </Stack>
  );
};

export default SportDetailsLayout;
