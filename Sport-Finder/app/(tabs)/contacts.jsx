import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const App = () => {

  const scrollRef = useRef();
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

      >
        {/* Scrollable messages */}
        <ScrollView
          ref={scrollRef}
          // contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {Array.from({ length: 80 }).map((_, i) => (
            <Text key={i} style={styles.message}>Hello!!!!!!!!!!!!!!!!!!!!</Text>
          ))}
        </ScrollView>

        {/* Fixed input at bottom */}
        <View style={styles.inputBar}>
          <TextInput 
            onFocus={()=>{
              if (scrollRef.current) {
                scrollRef.current.scrollToEnd({animated: false});
              }
            }}
            placeholder="Enter text..." 
            style={styles.input} />
        </View>
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
