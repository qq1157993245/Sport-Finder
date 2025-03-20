import { View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import React, { useContext, useState} from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { ScrollView } from 'react-native';
import NavigateButton from '../components/navigateButton';
import icons from '../constants/icons.js';
import { UserContext } from './context/userContext.jsx';

const Create = () => {

  const router = useRouter();

  const {numofPlayers, setNumofPlayers, skillLevel, setSkillLevel,
    sportType, setSportType, hour, setHour, address, setAddress} = useContext(UserContext);

  const [error, setError] = useState('');


  // Function to create game and set isInGame to true
  const handleCreateGame = async () => {
    if (!(numofPlayers && skillLevel && sportType && hour)) {
      setError('All fields are required.');
    } else {
      setNumofPlayers('');
      setSkillLevel('');
      setSportType('');
      setHour('');
      setAddress('');
      setError('');
      router.push('/map');
    }
  };

  // Function to leave game and set isInGame to false
  const handleLeaveGame = async () => {
    setNumofPlayers('');
    setSkillLevel('');
    setSportType('');
    setHour('');
    setAddress('');
    setError('');
    router.back();
  };

  return (
    <SafeAreaView className="flex h-full bg-black px-6">
      {/* Close Button */}
      <TouchableOpacity onPress={handleLeaveGame}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      {/* ScrollView - Ensures Vertical Scrolling */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
      >
        {/* Map Section */}
        <View className="w-full h-24 rounded-lg overflow-hidden mt-10 justify-center items-center">
          <MapView className="w-full h-full" />
          <TouchableOpacity style={styles.pinButton} onPress={()=>router.push('/location')}>
            <Image source={icons.map} style={styles.pinIcon}/>
            <Text>Edit Pin</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={{color: 'red'}}>{error}</Text>}

        <View className="mt-10 space-y-6">
          <NavigateButton 
            text={numofPlayers ? `Players: ${numofPlayers}` : 'Number of Players'} 
            icon={icons.right_arrow} 
            onPress={()=>router.push('/numofPlayers')}/>
          <NavigateButton 
            text={skillLevel ? skillLevel : 'Skill Level'} 
            icon={icons.right_arrow}
            onPress={()=>(router.push('/skillLevel'))}/>
          <NavigateButton 
            text={sportType ? sportType : 'Sport Type'} 
            icon={icons.right_arrow}
            onPress={()=>(router.push('/sportType'))}/>
          <NavigateButton 
            text={hour ? hour : 'Hours'} 
            icon={icons.right_arrow}
            onPress={()=>(router.push('/hours'))}/>
          <NavigateButton 
            text={address ? address : 'Address'}
            icon={icons.right_arrow}
            onPress={()=>(router.push('/address'))}/>
        </View>

        {/* Create Button */}
        <View className="mt-10 mb-20">
          <CustomButton
            title="Create"
            handlePress={handleCreateGame}
            containerStyles="bg-gray-500 text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pinButton: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'gray',
    height: '25%',
    width: '30%',
    borderRadius: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinIcon: {
    height: 20,
    width: 20,
  },
});

export default Create;