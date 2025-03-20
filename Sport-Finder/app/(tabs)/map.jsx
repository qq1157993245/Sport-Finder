import React, { useEffect, useState } from 'react';

import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import * as Location from 'expo-location';
import icons from '../../constants/icons.js';
import { useRouter } from 'expo-router';
import { db } from '../(auth)/config/firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';

const MapScreen = () => {

  const router = useRouter();

  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  const [games, setGames] = useState(null);

  function handleClickCreateIcon () {
    router.push('/create');
  }

  async function handleGetCurrentLocation () {
    setRegion(initialRegion);
  }

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

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
    })();

    const collectionRef = collection(db, 'game');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot)=>{
      const documents = querySnapshot.docs.map((doc)=>(
        {
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
          numofPlayers: doc.data().numofPlayers,
          skillLevel: doc.data().skillLevel,
          sportType: doc.data().sportType,
          hour: doc.data().hour,
          address: doc.data().address,
        }
      ));
      setGames(documents);
    });

    // Clean up function: avoid memory leak
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        key={games && games.length}
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
      >
        {games && games.map((game, index)=>(
          <Marker
            key={index}
            coordinate={{
              latitude: game.latitude,
              longitude: game.longitude,
            }
            }
          />
        ))}
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleGetCurrentLocation}>
          <Image source={icons.currentLocation} style={styles.currentLocationIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleClickCreateIcon}>
          <Image source={icons.create} style={styles.createIcon}/>
        </TouchableOpacity>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.12,
    right: Dimensions.get('window').width * 0.015,
  },
  currentLocationIcon: {
    width: 43,
    height: 43,
    backgroundColor: '#F3F1F1',
    borderRadius: 50,
  },
  createButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.2,
    right: Dimensions.get('window').width * 0.015,
  },
  createIcon: {
    width: 43,
    height: 43,
    backgroundColor: '#F3F1F1',
    borderRadius: 50,
  },
});

export default MapScreen;