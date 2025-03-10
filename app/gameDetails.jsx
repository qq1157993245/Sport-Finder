import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './(auth)/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const GameDetailsScreen = () => {
  const router = useRouter();
  const { id, sport, playersCount, currentPlayers, gameDuration, skillLevel } = useLocalSearchParams();
  
  const handleJoinGame = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      const gameRef = doc(db, "coordinates", id);
      await updateDoc(gameRef, { currentPlayers: Number(currentPlayers) + 1 });
      Alert.alert("Success", "You have joined the game!");
      router.back();
    } catch (error) {
      console.error("Error joining game:", error);
      Alert.alert("Error", "Failed to join game. Please try again.");
    }
  };
  
  const handleLeaveGame = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      const gameRef = doc(db, "coordinates", id);
      await updateDoc(gameRef, { currentPlayers: Math.max(0, Number(currentPlayers) - 1) });
      Alert.alert("Success", "You have left the game!");
      router.back();
    } catch (error) {
      console.error("Error leaving game:", error);
      Alert.alert("Error", "Failed to leave game. Please try again.");
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Game Details</Text>
      <Text style={styles.detail}>Sport: {sport}</Text>
      <Text style={styles.detail}>Players: {currentPlayers}/{playersCount}</Text>
      <Text style={styles.detail}>Game Duration: {gameDuration} Hours</Text>
      <Text style={styles.detail}>Skill Level: {skillLevel}</Text>
      
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white'
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  },
  joinButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  leaveButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
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
