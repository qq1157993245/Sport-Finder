import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const Create = () => {
  const [numPlayers, setNumPlayers] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sport, setSport] = useState('');

  const handleCreateGame = () => {
    console.log('Game Created!', { numPlayers, skillLevel, sport });
  };

  return (
    <SafeAreaView className="bg-black h-full px-6">
      <Text className="text-white text-3xl font-psemibold mt-6 text-center">
        Create a Game!
      </Text>

      {/* Input Fields */}
      <View className="mt-10 space-y-6">
        <View>
          <Text className="text-white text-base mb-2">Number of Players</Text>
          <TextInput
            className="border-2 border-gray-500 bg-black text-white px-4 py-3 rounded-lg"
            keyboardType="numeric"
            placeholder="Enter number of players"
            placeholderTextColor="#7b7b8b"
            value={numPlayers}
            onChangeText={setNumPlayers}
          />
        </View>

        <View>
          <Text className="text-white text-base mb-2">Skill Level</Text>
          <TextInput
            className="border-2 border-gray-500 bg-black text-white px-4 py-3 rounded-lg"
            placeholder="Enter skill level (Beginner, Intermediate, Advanced)"
            placeholderTextColor="#7b7b8b"
            value={skillLevel}
            onChangeText={setSkillLevel}
          />
        </View>

        <View>
          <Text className="text-white text-base mb-2">Sport</Text>
          <TextInput
            className="border-2 border-gray-500 bg-black text-white px-4 py-3 rounded-lg"
            placeholder="Enter sport name"
            placeholderTextColor="#7b7b8b"
            value={sport}
            onChangeText={setSport}
          />
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        className="mt-10 bg-gray-700 py-4 rounded-lg items-center"
        onPress={handleCreateGame}
      >
        <Text className="text-white text-lg font-semibold">Create</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Create;