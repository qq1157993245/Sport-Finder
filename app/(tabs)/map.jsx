import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import coordinates from './coordinates.json';
import { collection, addDoc, setDoc, doc, onSnapshot} from "firebase/firestore";
import {db} from '../(auth)/config/firebaseConfig';
const MapScreen = () => {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
      // Fetch markers from Firestore and set up a listener for real-time updates
      const coordinatesCollection = collection(db, 'coordinates'); // 'markers' is your collection name
  
      const unsubscribe = onSnapshot(coordinatesCollection, (querySnapshot) => { // Use onSnapshot for updates
        const fetchedCoords = [];
        querySnapshot.forEach((doc) => {
          fetchedCoords.push({latitude: doc.data().longitude, longitude: doc.data().latitude, sport: doc.data.sport, playersCount: doc.data.playersCount, gameDuration: doc.data.gameDuration})
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
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
          >
            {/* Popup when clicking marker */}
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Sport: {marker.sport}</Text>
                <Text style={styles.calloutDescription}>Players: {marker.playersCount}</Text>
                <Text style={styles.calloutDescription}>Game Duration: {marker.gameDuration} minutes</Text>
                <Text style={styles.calloutDescription}>Latitude: {marker.latitude}</Text>
                <Text style={styles.calloutDescription}>Longitude: {marker.longitude}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Fixed Hitmarker */}
      <View style={styles.hitmarker} />

      {/* Button to Create a Game */}
      <View style={styles.createButtonContainer}>
        <CustomButton title="Create Game Here" handlePress={goToCreateScreen} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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