import { TouchableOpacity, Text, StyleSheet} from 'react-native'
import React from 'react'

const SignInButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={"bg-white rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles}"} >
      <Text className = {"text-primary font-psemibold text-lg ${textStyles}"}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'lightblue', // Background color of the TouchableOpacity
      padding: 10,
      borderRadius: 5,
      alignItems: 'center', // Center the text horizontally
    },
    buttonText: {
      color: 'darkblue', // Text color
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default SignInButton