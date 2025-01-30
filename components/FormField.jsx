import { View, Text, TextInput } from 'react-native'
import React from 'react'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  return (
    <View className = 'space-y-2 mt-7'>
      <Text className ="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-200 w-full h-16 px-40 bg-slate-600 rounded-2xl focus:border-secondary items-center">
        <TextInput
        />
      </View>
    </View>
  )
}

export default FormField