import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './(auth)/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const GameDetailsScreen = () => {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const [gameDetails, setGameDetails] = useState({});
  const [userInGame, setUserInGame] = useState(false); // Track if the user is in a game

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        console.log({id});
        const gameRef = doc(db, 'coordinates', id);
        const docSnap = await getDoc(gameRef);
        if (docSnap.exists()) {
          setGameDetails(docSnap.data());
        } else {
          Alert.alert('Error', 'Game not found.');
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
        Alert.alert('Error', 'Failed to fetch game details.');
      }
    };
    const checkUserInGame = async () => {
      try {
        const userRef = doc(
          db, 'users', auth.currentUser.uid); // Fetch current user from 'users' collection
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserInGame(userDoc.data().isInGame || false); // Check if user is already in a game
        }
      } catch (error) {
        console.error('Error checking user\'s game status:', error);
      }
    };

    fetchGameDetails();
    checkUserInGame();
  }, [id]);

  const handleJoinGame = async () => {
    if (userInGame) {
      Alert.alert('You\'re already in a game!', 'You can only join one game at a time.');
      return;
    }

    try {
      const gameRef = doc(db, 'coordinates', id);
      const docSnap = await getDoc(gameRef);
      const gameData = docSnap.data();

      if (gameData.currentPlayers >= gameData.numPlayers) {
        Alert.alert('Game is full', 'There are no available spots in this game.');
        return;
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userID = auth.currentUser.uid;

      // Add the user to the players array if they aren't already in the game
      if (!gameData.players.includes(userID)) {
        await updateDoc(gameRef, {
          currentPlayers: gameData.currentPlayers + 1,
          players: [...gameData.players, userID], // Add user UID to the players array
        });

        // Update the user's `isInGame` status to true
        await updateDoc(userRef, { isInGame: true });

        setUserInGame(true); // Update the state to reflect user is in a game
        Alert.alert('Success', 'You have joined the game!');
        router.back();
      } else {
        Alert.alert('You\'re already in this game.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Failed to join game. Please try again.');
    }
  };
  
  const handleLeaveGame = async () => {
    if (!userInGame) {
      Alert.alert('You\'re not in a game!', 
        'You cannot leave a game if you\'re not currently in one.');
      return;
    }

    try {
      const gameRef = doc(db, 'coordinates', id);
      const docSnap = await getDoc(gameRef);
      const gameData = docSnap.data();

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userId = auth.currentUser.uid;

      // Check if the user is in the players array
      if (!gameData.players.includes(userId)) {
        Alert.alert('You\'re not in this game!');
        return;
      }
      // Remove the user from the players array and update the currentPlayers count
      await updateDoc(gameRef, {
        currentPlayers: Math.max(0, gameData.currentPlayers - 1),
        players: gameData.players.filter(
          (player) => player !== userId), // Remove user from the players array
      });

      // Update the user's `isInGame` status to false
      await updateDoc(userRef, { isInGame: false });

      setUserInGame(false); // Update the state to reflect user is no longer in a game
      Alert.alert('Success', 'You have left the game!');
      router.back();
    } catch (error) {
      console.error('Error leaving game:', error);
      Alert.alert('Error', 'Failed to leave game. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Game Details</Text>
      <Text style={styles.detail}>Sport: {gameDetails.sportType}</Text>
      <Text style={styles.detail}>
        Players: {gameDetails.currentPlayers}/{gameDetails.numPlayers}
      </Text>
      <Text style={styles.detail}>Game Duration: {gameDetails.hour} Hours</Text>
      <Text style={styles.detail}>Skill Level: {gameDetails.skillLevel}</Text>
      
      <TouchableOpacity style={styles.joinButton} onPress={handleJoinGame}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGame}>
        <Text style={styles.buttonText}>Leave Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  detail: {
    fontSize: 26,
    marginBottom: 10,
    color: 'white',
  },
  joinButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveButton: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

export default GameDetailsScreen;
