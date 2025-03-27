import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, StyleSheet, 
  Alert, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const BookingScreen = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [bookedTables, setBookedTables] = useState([]); // เก็บข้อมูลการจองทั้งหมด

  // ฟังก์ชันตรวจสอบว่ามีการจองซ้ำหรือไม่
  const isTableBooked = (time, table) => {
    return bookedTables.some(
      (booking) => booking.table === table && booking.time === time
    );
  };

  // ฟังก์ชันจัดการจองโต๊ะ
  const handleBooking = () => {
    if (!selectedTime || !selectedTable || !customerName.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (isTableBooked(selectedTime, selectedTable)) {
      Alert.alert('แจ้งเตือน', `โต๊ะ ${selectedTable} ถูกจองแล้วในเวลา ${selectedTime}\nโปรดเลือกเวลาอื่น`);
      return;
    }

    const newBooking = {
      time: selectedTime,
      table: selectedTable,
      name: customerName,
    };

    // บันทึกการจองใหม่
    setBookedTables([...bookedTables, newBooking]);

    // ส่งข้อมูลไปยังหน้ารายการจอง
    navigation.navigate('Cart', { newBooking });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>จองโต๊ะ</Text>

          {/* เลือกเวลา */}
          <Picker selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)} style={styles.picker}>
            <Picker.Item label="เวลาที่เริ่มการจอง" value="" />
            {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
              .map((time) => <Picker.Item key={time} label={time} value={time} />)}
          </Picker>

          {/* เลือกโต๊ะ */}
          <Picker selectedValue={selectedTable} onValueChange={(itemValue) => setSelectedTable(itemValue)} style={styles.picker}>
            <Picker.Item label="โต๊ะ" value="" />
            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
              <Picker.Item key={num} label={`โต๊ะ ${num}`} value={`${num}`} />
            ))}
          </Picker>
          
          {/* กรอกชื่อ */}
          <TextInput 
            style={styles.input} 
            placeholder="ชื่อของคุณ" 
            value={customerName}
            onChangeText={setCustomerName}
          />
          
          {/* ปุ่มจองโต๊ะ */}
          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <Text style={styles.buttonText}>จองโต๊ะ</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookingOptions')}>
          <Ionicons name="fast-food" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF0E6' },
  inner: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#CD853F', marginBottom: 20 },
  picker: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 5, marginBottom: 15 },
  input: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 5, paddingHorizontal: 10, marginBottom: 20 },
  button: { backgroundColor: '#F4A460', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: '#F5DEB3', paddingVertical: 20, position: 'absolute', bottom: 0 },
  navItem: { padding: 10 },
});

export default BookingScreen;
