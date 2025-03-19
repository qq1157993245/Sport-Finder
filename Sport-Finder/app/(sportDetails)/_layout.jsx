import React from 'react';
import { Stack } from 'expo-router';

const SportDetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name='NumofPlayers'
        options={{headerShown: false}}/>
    </Stack>
  );
};

export default SportDetailsLayout;
