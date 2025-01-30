import { TouchableOpacity, Text, StyleSheet} from 'react-native'
import React from 'react'

const SignInButton = ({title, handlePress}) => {
  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.7}>
      <Text style={styles.buttonText}>{title}</Text>
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