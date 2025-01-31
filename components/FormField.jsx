import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { icons } from '../constants/icons';
const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className = 'space-y-2 mt-7'>
      <Text className ="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-200 w-full h-16 px-40 bg-slate-600 rounded-2xl focus:border-secondary items-center">
      <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
         
      />
        
        {/* {title === 'Password' && (
          <TouchableOpacity onPress = {() => setShowPassword(!showPassword) }>
            <Image source={!showPassword ? icons.eye : icons.eyehide} />
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  )
}

export default FormField