import React, { useContext, useEffect, useRef, useState } from 'react';

import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { View } from 'react-native';
import * as Location from 'expo-location';
import icons from '../../constants/icons.js';
import { useRouter } from 'expo-router';
import { auth, db } from '../(auth)/config/firebaseConfig.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { UserContext } from '../context/userContext.jsx';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = () => {

  const router = useRouter();

  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  const [games, setGames] = useState(null);
  const [shouldShowCallout, setShouldShowCallout] = useState(false);

  const {gameId, setGameId, joinedGameId, setJoinedGameId} = useContext(UserContext);

  const markerRefs = useRef({});
  const mapRef = useRef(null);

  async function handleClickCreateIcon () {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);
    const response = await getDoc(userRef);
    const data = response.data();

    if (data.isInGame) {
      Alert.alert('You are already in a game.');
    } else {
      router.push('/create');
    }
  }

  function handleGetCurrentLocation () {
    if (mapRef) {
      mapRef.current.animateToRegion(initialRegion, 500);
    }
  }

  function handleClickRefreshIcon () {
    handleGetAllGames();
  }

  const handleRegionChangeComplete = (newRegion) => {
    if (shouldShowCallout) {
      const marker = markerRefs.current[joinedGameId];
      if (marker) {
        marker.showCallout();
      }
      setShouldShowCallout(false);
    }
    setRegion(newRegion);
  };

  function handleCalloutPress (id) {
    setGameId(id);
    router.push('/groupChat');
  }

  async function handleToCurrentGame () {
    const gameRef = doc(db, 'games', joinedGameId);
    const gameResponse = await getDoc(gameRef);
    const gameData = gameResponse.data();

    const newRegion = {
      latitude: gameData.latitude,
      longitude: gameData.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
    setShouldShowCallout(true);
  }

  // Get all the games
  async function handleGetAllGames () {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);
    const userResponse = await getDoc(userRef);
    const userData = userResponse.data();

    const gamesRef = collection(db, 'games');
    const snapshot = await getDocs(gamesRef);
    const documents = snapshot.docs.map((doc)=>{
      return {
        id: doc.id,
        hostId: doc.data().hostId,
        guestsIds: doc.data().guestsIds,
        latitude: doc.data().latitude,
        longitude: doc.data().longitude,
        joinedPlayers: doc.data().joinedPlayers,
        numofPlayers: doc.data().numofPlayers,
        skillLevel: doc.data().skillLevel,
        sportType: doc.data().sportType,
        hour: doc.data().hour,
        address: doc.data().address,
      };
    });
    setJoinedGameId(userData.joinedGameId);
    setGames(documents);
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
    })();

    handleGetAllGames();
  }, [gameId]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        key={games && games.length}
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
      >
        {games && games.map((game, index)=>(
          <Marker
            ref={(ref) => {
              if (ref) markerRefs.current[game.id] = ref;
            }}
            key={index}
            coordinate={{
              latitude: game.latitude,
              longitude: game.longitude,
            }
            }
          >
            <Callout
              onPress={()=>handleCalloutPress(game.id)}
            >
              <View>
                <Text>{`Players: ${game.joinedPlayers}/${game.numofPlayers}`}</Text>
                <Text>{`Sport Type: ${game.sportType}`}</Text>
                <Text>{`Skill Level: ${game.skillLevel}`}</Text>
                <Text>{`Address: ${game.address}`}</Text>
                <Text>{`Hour: ${game.hour}`}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleGetCurrentLocation}>
          <Image source={icons.currentLocation} style={styles.currentLocationIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleClickCreateIcon}>
          <Image source={icons.create} style={styles.createIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={handleClickRefreshIcon}>
          <Image source={icons.refresh} style={styles.refreshIcon}/>
        </TouchableOpacity>
        {joinedGameId && 
        <TouchableOpacity style={styles.flagIcon} onPress={handleToCurrentGame}>
          <Ionicons name="flag" size={40} color="black" />
        </TouchableOpacity>
        }
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
  refreshButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.28,
    right: Dimensions.get('window').width * 0.015,
  },
  refreshIcon: {
    width: 43,
    height: 43,
    backgroundColor: '#F3F1F1',
    borderRadius: 50,
  },
  flagIcon: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.35,
    right: Dimensions.get('window').width * 0.015,
  },
});

export default MapScreen;