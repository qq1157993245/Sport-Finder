import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../(auth)/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../context/userContext';
import { router } from 'expo-router';

const App = () => {
  const [contacts, setContacts] = useState(null);

  const {personId, setPersonId} = useContext(UserContext);

  function handleClickContact (id) {
    setPersonId(id);
    router.push('/directMessage');
  }

  useEffect(() =>{
    const getData = async () =>{
      const currentUser = auth.currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      const userResponse = await getDoc(userRef);
      const userData = userResponse.data();
      
      const users = [];
      for (let i = 0; i < userData.privateChats.length; i++) {
        const personRef = doc(db, 'users', userData.privateChats[i].personId);
        const personResponse = await getDoc(personRef);
        const personData = personResponse.data();
        users.push(personData);
      }
      setContacts(users);
    };
    
    getData();
  }, [personId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          {contacts && contacts.map((contact, index)=>(
            <TouchableOpacity
              key={index} 
              className='bg-black h-16 justify-center'
              onPress={()=>handleClickContact(contact.id)}
            >
              <Text className='text-gray-100 text-3xl'>{contact.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // enough space for keyboard + input bar
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  inputBar: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default App;
