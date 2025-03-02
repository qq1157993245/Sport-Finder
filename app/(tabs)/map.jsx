import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
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
          return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        setInitialRegion({
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
          fetchedCoords.push({latitude: doc.data().longitude, longitude: doc.data().latitude}); // Include the document ID
        });
        console.log("coords: ", fetchedCoords.join(", "));
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
    router.push({
      pathname: "/(tabs)/create",
      params: { latitude: region.latitude, longitude: region.longitude },
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
        showsUsersLocationButton={true}
      >
        {/* {coordinates.map((coordinate, index) => (
          <Marker
            key={index} // Important: Use a unique key for each marker
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            title={coordinate.title}
            description={coordinate.description}
          />
        ))} */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index} // Use the document ID as the key
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude, 
            }}
            title={marker.title}
            description={marker.description}
          >
          </Marker>
        ))}
      </MapView>

      {/* Fixed Hitmarker */}
      <View style={styles.hitmarker} />

      <TouchableOpacity style={styles.currentLocationButton} onPress={handleGetCurrentLocation}>
        <Image source={icons.currentLocation} style={styles.currentLocationIcon}/>
      </TouchableOpacity>

      {/* Button to Create a Game */}
      <View style={styles.createButtonContainer}>
        <CustomButton title="Create Game Here" handlePress={goToCreateScreen} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: { flex: 1 },
  hitmarker: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 15,
    left: Dimensions.get('window').width / 2 - 15,
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    borderWidth: 2,
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
    right: Dimensions.get('window').width * 0.01,
  },
  currentLocationIcon: {
    width: Dimensions.get('window').height * 0.06,
    height: Dimensions.get('window').width * 0.12,
    backgroundColor: '#F3F1F1',
    borderRadius: '50%',
  }
});

export default MapScreen;