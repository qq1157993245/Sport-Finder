import {Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const NavigateButton = ({text, icon, onPress, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      className='h-16 bg-black flex-row items-center justify-between border-b-white border-b-2'
    >
      <Text className='text-white text-2xl flex-1' numberOfLines={1}>
        {text}
      </Text>
      <Image source={icon} style={styles.rightArrowIcon}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rightArrowIcon: {
    height: 30,
    width: 30,
    backgroundColor: 'white',
  },
});

export default NavigateButton;