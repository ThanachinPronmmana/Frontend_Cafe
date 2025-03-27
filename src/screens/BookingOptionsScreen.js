import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BookingOptionsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>เลือกประเภทการจอง</Text>
      
      <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('Booking')}>
        <Text style={styles.optionText}>จองโต๊ะ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('OrderScreen')}>
        <Text style={styles.optionText}>Walk-in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF0E6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CD853F',
    marginBottom: 20,
  },
  optionBox: {
    width: '80%',
    padding: 20,
    backgroundColor: '#F4A460',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default BookingOptionsScreen;
