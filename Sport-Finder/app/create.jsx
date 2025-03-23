import { View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import React, { useContext, useState} from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/custombutton';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { ScrollView } from 'react-native';
// import NavigateButton from '../components/navigateButton';
import icons from '../constants/icons.js';
import { UserContext } from './context/userContext.jsx';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './(auth)/config/firebaseConfig.js';
import Dropdownlist from '../components/dropdownlist.jsx';
import NavigateButton from '../components/navigateButton.jsx';

const Create = () => {

  const router = useRouter();

  const {address, setAddress} = useContext(UserContext);

  const [numofPlayers, setNumofPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sportType, setSportType] = useState('');
  const [hour, setHour] = useState('');

  const [error, setError] = useState('');

  const playersCount = Array.from({ length: 20 },
    (_, i) => ({ title: i + 1, value: i + 1 }));

  const skillLevels = [
    { title: 'Beginner', value: 'Beginner' },
    { title: 'Intermediate', value: 'Intermediate' },
    { title: 'Advanced', value: 'Advanced' },
  ];
  const sportTypes = [
    { title: 'Basketball', value: 'Basketball' },
    { title: 'Soccer', value: 'Soccer' },
    { title: 'Tennis', value: 'Tennis' },
    { title: 'Volleyball', value: 'Volleyball' },
    { title: 'Handball', value: 'Handball' },
    { title: 'Baseball', value: 'Baseball' },
    { title: 'Football', value: 'Football' },
    { title: 'Pickleball', value: 'Pickleball' },
  ];
  const hours = [
    { title: '1 hour', value: 1 },
    { title: '1 hour 30 minutes', value: 1.5 },
    { title: '2 hour', value: 2 },
    { title: '2 hour 30 minutes', value: 2.5 },
    { title: '3 hour', value: 3 },
    { title: '3 hour 30 minutes', value: 3.5},
    { title: '4 hour', value: 4 },
    { title: '4 hour 30 minutes', value: 4.5},
    { title: '5 hour', value: 5},
  ];


  const handleCreateGame = async () => {
    if (!(numofPlayers && skillLevel && sportType && hour && address)) {
      setError('All fields are required.');
    } else {
      // Get the address's latitude and longitude
      const gameLocation = {};
      const API_KEY = 'AIzaSyBCpIybveZ2ArS7vNo4p1Tz769tudpibHA';
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?' + 
      `address=${encodeURIComponent(address)}&key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const location = data.results[0].geometry.location;

        const currentUser = auth.currentUser;

        // Change inGame status
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {isInGame: true});

        // Store game information
        gameLocation.hostId  =currentUser.uid;
        gameLocation.guestsIds = [];
        gameLocation.latitude = location.lat;
        gameLocation.longitude = location.lng;
        gameLocation.joinedPlayers = 1;
        gameLocation.numofPlayers = numofPlayers;
        gameLocation.skillLevel = skillLevel;
        gameLocation.sportType = sportType;
        gameLocation.hour = hour;
        gameLocation.address = address;

        const gameRef = doc(db, 'games', currentUser.uid);
        await setDoc(gameRef, gameLocation);

        // Store group chat information
        const groupChatRef = doc(db, 'groupChats', currentUser.uid);
        await setDoc(groupChatRef, {users: []});

        setNumofPlayers('');
        setSkillLevel('');
        setSportType('');
        setHour('');
        setAddress('');
        setError('');
        router.push('/map');

      } catch (error) {
        console.log(error);
      }
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
            <Text>Adjust Pin</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={{color: 'red'}}>{error}</Text>}

        <View>
          <Dropdownlist
            items={playersCount}
            title={'Select number of players'}
            onSelect={setNumofPlayers}
          />
          <Dropdownlist
            items={skillLevels}
            title={'Select skill level'}
            onSelect={setSkillLevel}
          />
          <Dropdownlist
            items={sportTypes}
            title={'Select sport type'}
            onSelect={setSportType}
          />
          <Dropdownlist
            items={hours}
            title={'Select hour'}
            onSelect={setHour}
          />
          <NavigateButton 
            text={address ? address : 'Address'}
            icon={icons.right_arrow}
            onPress={()=>(router.push('/searchAddress'))}/>
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