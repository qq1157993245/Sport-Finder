import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/custombutton';
import coordinates from './coordinates.json';

const MapScreen = () => {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [gameMarkers, setGameMarkers] = useState([]);

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
        showsUsersLocationButton={true}
      >
        {coordinates.map((coordinate, index) => (
          <Marker
            key={index} // Important: Use a unique key for each marker
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            title={coordinate.title}
            description={coordinate.description}
          />
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
});

export default MapScreen;