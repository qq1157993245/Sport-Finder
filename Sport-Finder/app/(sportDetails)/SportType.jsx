import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/custombutton';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';

const SportType = () => {
  const {setSportType} = useContext(UserContext);

  const [sportTypes, setSportTypes] = useState([
    { label: 'Basketball', value: 'Basketball', selected: false },
    { label: 'Soccer', value: 'Soccer', selected: false },
    { label: 'Tennis', value: 'Tennis', selected: false},
    { label: 'Volleyball', value: 'Volleyball', selected: false },
    { label: 'Handball', value: 'Handball', selected: false },
    { label: 'Baseball', value: 'Baseball', selected: false },
    { label: 'Football', value: 'Football', selected: false },
    { label: 'Pickleball', value: 'Pickleball', selected: false },
  ]);

  function handleSelect (selectedType) {
    setSportTypes((prevTypes)=>(
      prevTypes.map((type)=>(
        selectedType.value === type.value ? 
          {...type, selected: true} : {...type, selected: false}
      ))
    ));
  }

  function handleConfirm () {
    for (let i = 0; i < sportTypes.length; i++) {
      if (sportTypes[i].selected) {
        setSportType(sportTypes[i].label);
        break;
      }
    }
    router.back();
  }

  return (
    <SafeAreaView
      className='flex-col h-full bg-black'
    >
      <TouchableOpacity>
        <Ionicons name="close" size={30} color="white" onPress={()=>router.back()}/>
      </TouchableOpacity>
      <ScrollView className='flex-1'>
        <Text className='text-white text-center text-3xl'>Sport Type</Text>

        {sportTypes && sportTypes.map((type, index)=>(
          <TouchableOpacity 
            style={type.selected ? styles.selectedButton : null}
            onPress={()=>handleSelect(type)}
            key={index} 
            className='border-2 border-white rounded-lg m-2'>
            <Text className='text-white text-2xl'>{type.label}</Text>
          </TouchableOpacity>
        ))}

        <CustomButton 
          handlePress={handleConfirm}
          title={'Confirm'}
          containerStyles={'mt-10'}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: 'purple',
  },
});

export default SportType;