import React, { useCallback, useContext, useState } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../(auth)/config/firebaseConfig';
import { arrayRemove, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../context/userContext';
import { router } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';

const App = () => {
  const [contacts, setContacts] = useState(null);

  const {setPersonId} = useContext(UserContext);

  function handleClickContact (id) {
    setPersonId(id);
    router.push('/directMessage');
  }

  async function handleDeleteContact (id) {
    const currentUser = auth.currentUser;
    const userRef = doc(db, 'users', currentUser.uid);
    const userResponse = await getDoc(userRef);
    const userData = userResponse.data();

    const personRef = doc(db, 'users', id);
    const personResponse = await getDoc(personRef);
    const personData = personResponse.data();

    let directMessageId;
    for (let i = 0; i < userData.privateChats.length; i++) {
      if (id === userData.privateChats[i].personId) {
        directMessageId = userData.privateChats[i].directMessageId;
        await updateDoc(userRef, {
          privateChats: arrayRemove(userData.privateChats[i]),
        });
        break;
      }
    }

    for (let i = 0; i < personData.privateChats.length; i++) {
      if (currentUser.uid === personData.privateChats[i].personId) {
        await updateDoc(personRef, {
          privateChats: arrayRemove(personData.privateChats[i]),
        });
        break;
      }
    }

    const directMessagesCollectionRef = collection(db, 'directMessages');
    await deleteDoc(doc(directMessagesCollectionRef, directMessageId));
    await getData();
  }

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

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text className='text-3xl text-center'>Chats</Text>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SwipeListView
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              className='bg-black h-16 justify-center'
              onPress={() => handleClickContact(item.id)}
            >
              <Text className='text-gray-100 text-3xl'>{item.username}</Text>
            </TouchableOpacity>
          )}
          renderHiddenItem={({ item }) => (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteContact(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
          disableRightSwipe={true}
          rightOpenValue={-75}
        />
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
    paddingBottom: 80,
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
