import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/custombutton';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';

const Hours = () => {
  const {setHour} = useContext(UserContext);

  const [hours, setHours] = useState([
    { label: '1 hour', value: 1, selected: false },
    { label: '1 hour 30 minutes', value: 1.5, selected: false },
    { label: '2 hour', value: 2, selected: false },
    { label: '2 hour 30 minutes', value: 2.5, selected: false },
    { label: '3 hour', value: 3, selected: false },
    { label: '3 hour 30 minutes', value: 3.5, selected: false},
    { label: '4 hour', value: 4, selected: false },
    { label: '4 hour 30 minutes', value: 4.5, selected: false},
    { label: '5 hour', value: 5, selected: false},
  ]);

  function handleSelect (selectedHour) {
    setHours((prevHours)=>(
      prevHours.map((hour)=>(
        selectedHour.value === hour.value ? 
          {...hour, selected: true} : {...hour, selected: false}
      ))
    ));
  }
  
  function handleConfirm () {
    for (let i = 0; i < hours.length; i++) {
      if (hours[i].selected) {
        setHour(hours[i].label);
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
        <Text className='text-white text-center text-3xl'>Hours</Text>

        {hours && hours.map((hour, index)=>(
          <TouchableOpacity 
            style={hour.selected ? styles.selectedButton : null}
            onPress={()=>handleSelect(hour)}
            key={index} 
            className='border-2 border-white rounded-lg m-2'>
            <Text className='text-white text-2xl'>{hour.label}</Text>
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

export default Hours;