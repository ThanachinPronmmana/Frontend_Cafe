import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_BASE_URL = "http://10.0.2.2:8000"

const BookingScreen = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [errorMessage, setErrorMessage] = useState('');


  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (storedUserId){
        setUserId(storedUserId)
      }else{
        Alert.alert("Error")
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTables = async () => {
    setLoading(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/table`)
      setTables(response.data.tables || [] )
    } catch (error) {
      console.error('Error fetching tables:', error);
      setErrorMessage('ไม่สามารถโหลดรายการโต๊ะได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTables();
  }, []);

  const handleBooking = async () => {
    if (!selectedTime || !selectedTable || !customerName.trim()) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      setBookingLoading(true);
      // const bookingData = {
      //   user_name: customerName,
      //   table_id: selectedTable,
      //   reservation_time: selectedTime,
      //   user_id: userId, 
      // };

      // const response = await api.post('/reservations', bookingData);

      Alert.alert('จองสำเร็จ', 'การจองของคุณได้รับการยืนยัน', [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('BookingListScreen', { newBooking: response.data }) 
        }
      ]);
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถจองโต๊ะได้ กรุณาลองใหม่');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>จองโต๊ะ </Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Picker selectedValue={selectedTime} onValueChange={setSelectedTime} style={styles.picker}>
            <Picker.Item label="เลือกเวลา" value="" />
            {[ '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30' ].map(time => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>

          {loading ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <Picker selectedValue={selectedTable} onValueChange={setSelectedTable} style={styles.picker}>
              <Picker.Item label="เลือกโต๊ะ" value="" />
              {tables.map((table) => (
                <Picker.Item 
                key={table._id} 
                label={`โต๊ะ ${table.number}`}
                value={table._id} 
                />
              ))}
            </Picker>
          )}

          <TextInput 
            style={styles.input} 
            placeholder="ชื่อของคุณ" 
            value={customerName} 
            onChangeText={setCustomerName}
          />

          <TouchableOpacity 
            style={[ styles.button, (bookingLoading || !selectedTime || !selectedTable || !customerName.trim()) && styles.buttonDisabled ]}
            onPress={handleBooking}
            disabled={bookingLoading || !selectedTime || !selectedTable || !customerName.trim()}
          >
            {bookingLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>ยืนยันการจอง</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  inner: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 30 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  picker: { height: 50, backgroundColor: 'white', borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#BDBDBD' },
  input: { height: 50, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 15, borderWidth: 1, borderColor: '#BDBDBD', fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', height: 50 },
  buttonDisabled: { backgroundColor: '#9E9E9E' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default BookingScreen;
