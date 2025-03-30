import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชัน Login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/api/login', {
        email,
        password,
      });

      // ตรวจสอบว่า response มีข้อมูลที่คาดหวังหรือไม่
      if (response.data && response.data.user) {
        const { user } = response.data;

        // เก็บข้อมูลของผู้ใช้ใน AsyncStorage
        await AsyncStorage.setItem('userId', user.email);  // เก็บอีเมลของผู้ใช้
        await AsyncStorage.setItem('userName', user.name);  // เก็บชื่อของผู้ใช้
        await AsyncStorage.setItem('userPhone', user.phone);  // เก็บเบอร์โทรศัพท์ของผู้ใช้

        // แจ้งเตือนผู้ใช้ว่า login สำเร็จ
        Alert.alert('Login Successful', 'You have successfully logged in!');
        navigation.replace('Home'); // ไปหน้า Home
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response) {
        // ถ้ามี response จากเซิร์ฟเวอร์
        Alert.alert('Login Failed', error.response.data.message || 'Unknown error');
      } else {
        // ถ้าไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CD853F',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CD853F',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#CD853F',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#CD853F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
