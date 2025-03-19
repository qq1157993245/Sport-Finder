import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker, Callout} from 'react-native-maps';

import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import { collection, doc, onSnapshot, deleteDoc} from 'firebase/firestore';
import {db} from '../(auth)/config/firebaseConfig';
import icons from '../../constants/icons.js';
import * as Location from 'expo-location';

const MapScreen = () => {
  const router = useRouter();
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);

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
    // Fetch markers from Firestore and set up a listener for real-time updates
    const coordinatesCollection = collection(
      db, 'coordinates'); // 'markers' is your collection name

    onSnapshot(
      coordinatesCollection, (querySnapshot) => { // Use onSnapshot for updates
        const fetchedCoords = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
         
          // fetchedCoords.push({
          //   id: doc.id, // Firebase document ID as the unique key
          //   latitude: data.latitude,
          //   longitude: data.longitude,
          //   title: data.title,
          //   description: data.description,
          // });
          fetchedCoords.push({id: doc.data().id, 
            latitude: doc.data().latitude,
            longitude: doc.data().longitude,
            sport: doc.data().sportType, 
            playersCount: doc.data().numPlayers, 
            gameDuration: doc.data().hour, 
            skillLevel: doc.data().skillLevel,
            expires: doc.data().expiresAt, 
            currentPlayers: doc.data().currentPlayers,
            players: data.players || []});
          if (data.currentPlayers === 0) {
            deleteGame(doc.id);
          }
        });
        console.log(fetchedCoords);
        setMarkers(fetchedCoords);
      });

    // return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, []);
  
  const deleteGame = async (gameId) => {
    try {
      await deleteDoc(doc(db, 'coordinates', gameId)); // Delete the game from Firestore
      console.log(`Game ${gameId} deleted due to no players.`);
    } catch (error) {
      console.error('Error deleting game:', error);
      Alert.alert('Error', 'Failed to delete game.');
    }
  };

  // Capture the coordinates of the center of the map
  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };


  const extractTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      Alert.alert('Not an date object', 'Please input a date');
    }
    
  
    let hours = date.getHours();
    
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  
  // Function to navigate to Create screen with the coordinates
  const goToCreateScreen = () => {
    if (!region) {
      Alert.alert('Location not available', 'Please wait for your location to be set.');
      return;
    }
    router.push({
      pathname: '/create',
      params: { latitude: region.latitude, longitude: region.longitude }, // Corrected to query
    });
  };

  const goToGameDetails = (id) => {
    console.log({id});
    router.push({ pathname: '/gameDetails', params: { id } });
  };

  const handleGetCurrentLocation = () =>{
    setRegion(initialRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}

          >
            {/* Popup when clicking marker */}
            <Callout onPress={() => goToGameDetails(marker.id)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Sport: {marker.sport}</Text>
                <Text style={styles.calloutDescription}>
                  Players: {marker.currentPlayers}/{marker.playersCount}
                </Text>
                <Text style={styles.calloutDescription}>Duration: {marker.gameDuration} Hours</Text>
                <Text style={styles.calloutDescription}>Skill Level: {marker.skillLevel}</Text>
                <Text style={styles.calloutDescription}>
                  Games Ends At: {extractTime(marker.expires.toDate())}
                </Text>
                <Text style={[styles.calloutDescription, styles.calloutCentered]}>
                  Click on Callout to Join or Leave Game
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* hitmarker to choose location */}
      <View style={styles.hitmarker}/>

      <TouchableOpacity style={styles.currentLocationButton} onPress={handleGetCurrentLocation}>
        <Image source={icons.currentLocation} style={styles.currentLocationIcon}/>
      </TouchableOpacity>

      {/*create game button which redirects to create page */}
      <View style={styles.createButtonContainer}>
        <CustomButton
          title="+"
          handlePress={goToCreateScreen}
          containerStyles={'text-3xl w-16 h-16 bg-white-500 ' + 
            'text-white rounded-full flex items-center justify-center'}
        />
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  hitmarker: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 23,
    left: Dimensions.get('window').width / 2 - 5,
    width: 10,
    height: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
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
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calloutDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  calloutCentered: {
    textAlign: 'center',
  },
});

export default MapScreen;