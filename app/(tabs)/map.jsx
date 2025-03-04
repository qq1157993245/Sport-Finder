import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import coordinates from './coordinates.json';
import { collection, addDoc, setDoc, doc, onSnapshot} from "firebase/firestore";
import {db} from '../(auth)/config/firebaseConfig';
import icons from '../../constants/icons.js'
import * as Location from 'expo-location';

const MapScreen = () => {
  const router = useRouter();
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
      // Get the user's current location
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
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
      const coordinatesCollection = collection(db, 'coordinates'); // 'markers' is your collection name

      const unsubscribe = onSnapshot(coordinatesCollection, (querySnapshot) => { // Use onSnapshot for updates
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
          fetchedCoords.push({latitude: doc.data().latitude, longitude: doc.data().longitude, sport: doc.data().sportType, playersCount: doc.data().numPlayers, gameDuration: doc.data().hour, skillLevel: doc.data().skillLevel})
        });
        console.log(fetchedCoords)
        setMarkers(fetchedCoords);
      });

      // return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
    }, []);

  // Capture the coordinates of the center of the map
  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  // Function to navigate to Create screen with the coordinates
  const goToCreateScreen = () => {
    if (!region) {
      Alert.alert("Location not available", "Please wait for your location to be set.");
      return;
    }
    router.push({
      pathname: "/create",
      params: { latitude: region.latitude, longitude: region.longitude }, // Corrected to query
    });
  };

  const handleGetCurrentLocation = () =>{
    setRegion(initialRegion);
  }

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

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          
          >
            {/* Popup when clicking marker */}
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Sport: {marker.sport}</Text>
                <Text style={styles.calloutDescription}>Players: {marker.playersCount}/{marker.playersCount}</Text>
                <Text style={styles.calloutDescription}>Game Duration: {marker.gameDuration} hours</Text>
                <Text style={styles.calloutDescription}>Skill Level: {marker.skillLevel}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>

      {/* hitmarker to choose location */}
      <View style={styles.hitmarker} />

      <TouchableOpacity style={styles.currentLocationButton} onPress={handleGetCurrentLocation}>
        <Image source={icons.currentLocation} style={styles.currentLocationIcon}/>
      </TouchableOpacity>

      {/*create game button which redirects to create page */}
      <View style={styles.createButtonContainer}>
        <CustomButton
          title="+"
          handlePress={goToCreateScreen}
          containerStyles="text-3xl w-16 h-16 bg-white-500 text-white rounded-full flex items-center justify-center"
        />
      </View>

      {/* refresh button */}
      <CustomButton
        title="↻"
        handlePress={() => {/* add refresh function here */}}
        containerStyles="text-2xl mb-8 w-10 h-6 bg-white-500 text-white rounded-full flex items-center justify-center absolute bottom-5 right-5"      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
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
    borderRadius: '50%',
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
});

export default MapScreen;