import { Alert, Image, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CustomButton from '../../components/custombutton';
import * as Location from 'expo-location';
import icons from '../../constants/icons';
import { UserContext } from '../context/userContext';

const SelectLocation = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  
  const {setAddress} = useContext(UserContext);


  function handleRegionChangeComplete (newRegion) {
    setRegion(newRegion);
  }

  async function handleSave () {
    const API_KEY = 'AIzaSyBCpIybveZ2ArS7vNo4p1Tz769tudpibHA';
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?' + 
    `latlng=${region.latitude},${region.longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results[0].formatted_address.includes('+')) {
        await new Promise((resolve) => {
          Alert.alert(
            'Unknown Location',
            'This is an unknown location, are you sure to continue?',
            [
              { text: 'Yes', onPress: () => {
                const parts = data.results[0].formatted_address.split(', ');
                if (parts.length <= 1) {
                  setAddress('Unknown Location'); 
                } else {
                  for (const component of data.results[0].address_components) {
                    if (component.types.includes('locality')) {
                      parts[0] = `Unknown Location, ${component.long_name}`;
                      break;
                    }
                  }
                  const newAddress = parts.join(', ');
                  setAddress(newAddress);
                }
                resolve(true);
              } },
              { text: 'Cancel'},
            ],
          );
        });
      } else {
        setAddress(data.results[0].formatted_address);
      }
      router.back();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Get the user's current location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
      }
    
      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  return (
    <SafeAreaView className='bg-black h-full'>
      <TouchableOpacity>
        <Ionicons name="close" size={30} color="white" onPress={()=>router.back()}/>
      </TouchableOpacity>
      <MapView 
        className='h-4/6'
        initialRegion={initialRegion}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        <Image source={icons.map} style={styles.hitmarker}/>
      </MapView>
      <CustomButton
        handlePress={handleSave}
        title={'Save'}
        containerStyles={'mt-20'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hitmarker: {
    position: 'absolute',
    height: 30,
    width: 30,
    top: '50%',
    left: '50%',
    transform: [
      {translateX: -15},
      {translateY: -30},
    ],
  },
});

export default SelectLocation;

