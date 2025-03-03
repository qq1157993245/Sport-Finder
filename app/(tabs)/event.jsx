import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formfield';
import CustomButton from '../../components/custombutton';
import Dropdownmenu from '../../components/dropdownmenu'; // Import Dropdownmenu


const Event = () => {
    const [numPlayers, setNumPlayers] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [sportType, setSportType] = useState('');

    const skillLevels = [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' }
    ];

    const sportTypes = [
      { label: 'Basketball', value: 'basketball' },
      { label: 'Soccer', value: 'soccer' },
      { label: 'Tennis', value: 'tennis' },
      { label: 'Volleyball', value: 'volleyball' },
      { label: 'Handball', value: 'handball' }
    ];

    const handleSave = () => {
      // Implement save functionality
      console.log('Event saved');
    };

    const handleAddTime = () => {
      // Implement add time functionality
      console.log('Time added');
    };

    const handleEndGame = () => {
      // Implement end game functionality
      console.log('Game ended');
    };

    return (
      <SafeAreaView className="bg-black h-full px-6 py-10">
        {/* Header */}
        <Text className="text-white text-3xl font-semibold text-center">My Event</Text>

        {/* Event Info Section */}
        <View className="mt-8 space-y-6">
          <Text className="text-white text-xl font-semibold">Event Info</Text>

          {/* Form fields for number of players, skill level, and sport type */}
          <FormField
            title="Number of Players"
            value={numPlayers}
            placeholder="Enter number of players"
            handleChangeText={setNumPlayers}
            otherStyles="mt-2"
          />
          <Dropdownmenu
              title="Skill Level"
              items={skillLevels}
              value={skillLevel}
              setValue={setSkillLevel}
              placeholder="Select skill level"
              zIndex={2000}
          />
          <Dropdownmenu
              title="Sport Type"
              items={sportTypes}
              value={sportType}
              setValue={setSportType}
              placeholder="Select sport type"
              zIndex={1000}
          />
        </View>

        {/* Save Button */}
        <View className="mt-10">
          <CustomButton
            title="Save"
            handlePress={handleSave}
            containerStyles="bg-gray-500 text-white w-full"
          />
        </View>

        {/* Buttons: Add Time & End Game */}
        <View className="mt-6 flex-row justify-between space-x-4">
          <CustomButton
            title="Add Time"
            handlePress={handleAddTime}
            containerStyles="bg-blue-500 text-white w-40 "
          />
          <CustomButton
            title="End Game"
            handlePress={handleEndGame}
            containerStyles="bg-red-500 text-white w-40 "
          />
        </View>
      </SafeAreaView>
    );
  };

  export default Event;