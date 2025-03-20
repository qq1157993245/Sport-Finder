import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/custombutton';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';

const SkillLevel = () => {
  const {setSkillLevel} = useContext(UserContext);

  const [skillLevels, setSkillLevels] = useState([
    { label: 'Beginner', value: 'Beginner', selected: false },
    { label: 'Intermediate', value: 'Intermediate', selected: false },
    { label: 'Advanced', value: 'Advanced', selected: false },
  ]);

  function handleSelect (selectedLevel) {
    setSkillLevels((prevLevels)=>(
      prevLevels.map((level)=>(
        selectedLevel.value === level.value ? 
          {...level, selected: true} : {...level, selected: false}
      ))
    ));
  }

  function handleConfirm () {
    for (let i = 0; i < skillLevels.length; i++) {
      if (skillLevels[i].selected) {
        setSkillLevel(skillLevels[i].label);
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
        <Text className='text-white text-center text-3xl'>Skill Level</Text>

        {skillLevels && skillLevels.map((level, index)=>(
          <TouchableOpacity 
            style={level.selected ? styles.selectedButton : null}
            onPress={()=>handleSelect(level)}
            key={index}
            className='border-2 border-white rounded-lg m-2'>
            <Text className='text-white text-2xl'>{level.label}</Text>
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

export default SkillLevel;