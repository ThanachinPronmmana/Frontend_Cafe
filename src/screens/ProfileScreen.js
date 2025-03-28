import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ดึง user_id จาก AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const { _id } = JSON.parse(userData); // ได้ user_id
          console.log("User ID:", _id);

          // ใช้ axios เรียก API
          const response = await axios.get(`http://10.0.2.2:8000/api/user/${_id}`);
          
          // อัปเดต state ของ profile
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // ลบ user ออกจาก AsyncStorage
      navigation.replace('Login'); // กลับไปหน้า Login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Data */}
      <View style={styles.profileContainer}>
        {profile?.profileImage ? (
          <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
        <Text style={styles.profileName}>{profile?.name || 'Guest User'}</Text>
        <Text style={styles.profileEmail}>{profile?.email || 'No Email'}</Text>
        <Text style={styles.profilePhone}>{profile?.phone || 'No Phone'}</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BookingOptions')}>
          <Ionicons name="fast-food" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF0E6', padding: 10, alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#CD853F', padding: 15, width: '100%' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  profileContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D3D3D3' },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  profileEmail: { fontSize: 14, color: '#666' },
  profilePhone: { fontSize: 14, color: '#444' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', width: '110%', backgroundColor: '#F5DEB3', height: 90, paddingVertical: 30, position: 'absolute', bottom: 0 },
});

export default ProfileScreen;
