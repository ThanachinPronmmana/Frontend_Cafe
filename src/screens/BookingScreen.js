import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, StyleSheet, 
  Alert, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const BookingScreen = ({ navigation }) => {
  // State management
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // สร้าง Axios instance
  const api = axios.create({
    baseURL: 'http://10.0.2.2:8000',
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  // Fetch tables data
  const fetchTables = async () => {
    try {
      setLoading(true);
      setApiError(null);
      console.log('Fetching tables from API...');
      
      const response = await api.get('/api/tables');
      
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setTables(response.data);
      } else {
        throw new Error('Invalid data format: expected array');
      }
    } catch (error) {
      console.error('Fetch Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Cannot load table data';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'API endpoint not found (404)';
        } else {
          errorMessage = `Server returned ${error.response.status} status`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      }
      
      setApiError(errorMessage);
      Alert.alert(
        'Connection Error',
        errorMessage,
        [
          { text: 'Retry', onPress: () => fetchTables() },
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedTime || !selectedTable || !customerName.trim()) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return;
    }

    try {
      setBookingLoading(true);
      
      const bookingData = {
        user_name: customerName,
        table_id: selectedTable,
        reservation_time: selectedTime,
        user_id: 'user123', // ควรเปลี่ยนเป็น ID ผู้ใช้จริง
      };

      console.log('Submitting booking:', bookingData);
      
      const response = await api.post('/api/reservations', bookingData);
      
      console.log('Booking Response:', response.data);
      
      Alert.alert(
        'Success', 
        'Your reservation has been confirmed',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Cart', { 
              newBooking: response.data 
            }) 
          }
        ]
      );
    } catch (error) {
      console.error('Booking Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Could not complete booking';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      Alert.alert(
        'Booking Failed',
        `${errorMessage}\n${error.message}`,
        [
          { text: 'Try Again', onPress: () => {} },
          { text: 'Cancel' }
        ]
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    return [...Array(8).keys()].map(i => {
      const hour = 9 + Math.floor(i / 2);
      const minute = i % 2 === 0 ? '00' : '30';
      return `${hour}:${minute}`;
    });
  };

  // Render table picker
  const renderTablePicker = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading table data...</Text>
        </View>
      );
    }

    if (apiError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load tables</Text>
          <Text style={styles.errorDetail}>{apiError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTables}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tables.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tables available</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchTables}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Picker
        selectedValue={selectedTable}
        onValueChange={setSelectedTable}
        style={styles.picker}
        dropdownIconColor="#4CAF50"
      >
        <Picker.Item label="Select a table" value="" />
        {tables.map(table => (
          <Picker.Item 
            key={table.id || table._id} 
            label={`Table ${table.table_number || table.id}`} 
            value={table.id} 
          />
        ))}
      </Picker>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Table Reservation</Text>

          {/* Time Picker */}
          <Picker
            selectedValue={selectedTime}
            onValueChange={setSelectedTime}
            style={styles.picker}
            dropdownIconColor="#4CAF50"
          >
            <Picker.Item label="Select time" value="" />
            {generateTimeSlots().map(time => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>

          {/* Table Picker */}
          {renderTablePicker()}

          {/* Customer Name Input */}
          <TextInput 
            style={styles.input} 
            placeholder="Your name" 
            placeholderTextColor="#888"
            value={customerName}
            onChangeText={setCustomerName}
          />

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.button, 
              (bookingLoading || !selectedTime || !selectedTable || !customerName.trim()) && styles.buttonDisabled
            ]} 
            onPress={handleBooking}
            disabled={bookingLoading || !selectedTime || !selectedTable || !customerName.trim()}
          >
            {bookingLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Confirm Reservation</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles (คงเดิมเหมือนในโค้ดเดิม)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 30,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorDetail: {
    color: '#B71C1C',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    width: '100%',
  },
  emptyText: {
    color: '#2E7D32',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookingScreen;