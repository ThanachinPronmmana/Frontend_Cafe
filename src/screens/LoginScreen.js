import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ ใช้ useEffect เพื่อตรวจสอบ Token
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('Home'); // ถ้ามี token ให้ไปหน้า Home อัตโนมัติ
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/login', { // เปลี่ยน IP เครื่องคุณ
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Network request failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF0E6', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#CD853F', marginBottom: 40 },
  input: { width: '100%', padding: 10, marginBottom: 15, borderWidth: 1, borderColor: '#CD853F', borderRadius: 5, backgroundColor: '#FFF' },
  button: { width: '100%', paddingVertical: 10, backgroundColor: '#CD853F', borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  registerButton: { width: '100%', paddingVertical: 10, alignItems: 'center' },
  registerButtonText: { color: '#CD853F', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
