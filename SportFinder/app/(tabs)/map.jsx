import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import * as Location from 'expo-location';
import icons from '../../constants/icons.js';
import { useRouter } from 'expo-router';
import { auth, db } from '../(auth)/config/firebaseConfig.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { UserContext } from '../context/userContext.jsx';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView,
  BottomSheetView } from '@gorhom/bottom-sheet';

const MapScreen = () => {

  const router = useRouter();

  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);
  const [games, setGames] = useState(null);
  const [game, setGame] = useState(null);
  const [gameTime, setGameTime] = useState(null);
  // const [browsingGameId, setBrowsingGameId] = useState('');

  const {gameId, setGameId, joinedGameId, setJoinedGameId} = useContext(UserContext);

  const markerRefs = useRef({});
  const mapRef = useRef(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['20%', '60%'], []);

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
    setRegion(newRegion);
  };

  function handleEnterGroupChat (id) {
    setGameId(id);
    bottomSheetRef.current?.close();
    router.push('/groupChat');
  }

  async function handleOpenSheet (game) {
    // setBrowsingGameId(game.id);
    const gameTimeRef = doc(db, 'gamesTime', game.id);
    const gameTimeResponse = await getDoc(gameTimeRef);
    const gameTimeData = gameTimeResponse.data();

    setGame(game);
    setGameTime(gameTimeData);
    setTimeout(()=>{
      bottomSheetRef.current?.snapToIndex(0);
    }, 100);
  }

  async function handleToCurrentGame () {
    const gameRef = doc(db, 'games', joinedGameId);
    const gameResponse = await getDoc(gameRef);
    const gameData = gameResponse.data();

    const gameTimeRef = doc(db, 'gamesTime', joinedGameId);
    const gameTimeResponse = await getDoc(gameTimeRef);
    const gameTimeData = gameTimeResponse.data();

    const newRegion = {
      latitude: gameData.latitude,
      longitude: gameData.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
    // setBrowsingGameId(gameData.id);
    setGame(gameData);
    setGameTime(gameTimeData);
    setTimeout(() => {
      const marker = markerRefs.current[joinedGameId];
      if (marker) marker.showCallout();
      bottomSheetRef.current?.snapToIndex(0);
    }, 600);
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
      if (markerRefs.current[doc.id]) {
        markerRefs.current[doc.id].hideCallout();
      } 
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
        // hour: doc.data().hour,
        // startTime: doc.data().startTime,
        // endTime: doc.data().endTime,
        // timeLeft: doc.data().timeLeft,
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
  }, [gameId, joinedGameId]);

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
            onPress={()=>handleOpenSheet(game)}
            key={index}
            coordinate={{
              latitude: game.latitude,
              longitude: game.longitude,
            }
            }
          />
        ))}
      </MapView>

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

      <GestureHandlerRootView className='absolute h-full w-full'>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
          // onChange={() => {
          //   const marker = markerRefs.current[browsingGameId];
          //   if (marker) {
          //     setBrowsingGameId('');
          //     marker.hideCallout();
          //   }
          // }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
              opacity={0.6}
            />
          )}
        >
          <BottomSheetView>
            {game && gameTime &&
              <BottomSheetScrollView contentContainerStyle={styles.bottomScrollViewContainer}>
                <Text className='text-3xl mt-4'>
                  {`Players: ${game.joinedPlayers}/${game.numofPlayers}`}
                </Text>
                <Text className='text-3xl mt-4'>{`Sport Type: ${game.sportType}`}</Text>
                <Text className='text-3xl mt-4'>{`Skill Level: ${game.skillLevel}`}</Text>
                <Text className='text-3xl mt-4'>{`Address: ${game.address}`}</Text>
                <Text className='text-3xl mt-4'>{`Hour: ${gameTime.hour}`}</Text>
                <Text className='text-3xl mt-4'>
                  {`Staring Time: ${new Date(gameTime.startTime).getHours()}:` + 
                  `${new Date(gameTime.startTime).getMinutes()}`}
                </Text>
                <Text className='text-3xl mt-4'>
                  {`Ending Time: ${new Date(gameTime.endTime).getHours()}:` +
                   `${new Date(gameTime.endTime).getMinutes()}`}
                </Text>
                <TouchableOpacity 
                  onPress={()=>handleEnterGroupChat(game.id)}
                  className={'mt-10 rounded-full border border-white shadow-md ' + 
                  'bg-blue-500 p-4'}>
                  <Text className='text-white text-2xl'>Group Chat</Text>
                </TouchableOpacity>
              </BottomSheetScrollView >}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
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
  bottomScrollViewContainer: {
    alignItems: 'center',
  },
});

export default MapScreen;