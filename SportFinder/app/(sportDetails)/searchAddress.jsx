import { Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
  View } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/custombutton';
import { router } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { UserContext } from '../context/userContext';

const SearchAddress = () => {

  const {address, setAddress} = useContext(UserContext);

  const [selectedAddress, setSelectedAddress] = useState('');

  function handleConfirm() {
    setAddress(selectedAddress);
    router.back();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        className='flex-col h-full bg-black'
      >
        <TouchableOpacity>
          <Ionicons name="close" size={30} color="white" onPress={()=>router.back()}/>
        </TouchableOpacity>
        <View
          className='flex-1'
        >
          <Text className='text-white text-center text-3xl'>Address</Text>
          <GooglePlacesAutocomplete
            onPress={(data, details = null) => {
              if (details) {
                setSelectedAddress(details.formatted_address);
              }
            }}
            placeholder="Search for an address"
            fetchDetails={true}
            query={{
              key: process.env.EXPO_PUBLIC_API_KEY,
              language: 'en',
            }}
            styles={styles.searchAddress}
          />
        </View>
        {address && <Text style={{color: 'white', fontSize: 15}}>{address}</Text>}
        <CustomButton 
          handlePress={handleConfirm}
          title={'Confirm'}
          containerStyles={'mt-10'}/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchAddress: {
    container: {
      flex: 0,
    },
    listView: {
      height: Dimensions.get('window').height * 0.27,
      backgroundColor: 'white',
    },
  },
});

export default SearchAddress;