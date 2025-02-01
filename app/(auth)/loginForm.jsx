import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = () => {
    // Call backend auth function (you can replace this with Firebase/Auth API)
    console.log('Logging in with:', form.email, form.password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to SportsFinder</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(email) => setForm({ ...form, email })}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.password}
        onChangeText={(password) => setForm({ ...form, password })}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Navigate to Signup */}
      <TouchableOpacity onPress={() => router.push('/index')}>
        <Text style={styles.switchText}>Don't have an account? Sign up here!</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#25292e',
    color: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: 'white',
    marginTop: 10,
  },
});