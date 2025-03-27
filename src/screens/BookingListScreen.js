import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookingListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (route.params?.newBooking) {
      setBookings((prevBookings) => [...prevBookings, route.params.newBooking]);
    }
  }, [route.params?.newBooking]);

  const handleOrder = (booking) => {
    navigation.navigate('OrderScreen', { booking });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายการจองโต๊ะ</Text>
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>ไม่มีรายการจอง</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>เวลา: {item.time}</Text>
              <Text style={styles.cardText}>โต๊ะ: {item.table}</Text>
              <Text style={styles.cardText}>ชื่อ: {item.name}</Text>
              <TouchableOpacity style={styles.orderButton} onPress={() => handleOrder(item)}>
                <Text style={styles.orderButtonText}>สั่งอาหาร</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    padding: 20,
    paddingBottom: 70, // ป้องกันเนื้อหาชนกับ Bottom Navigation
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CD853F',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#545353',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#545353',
    marginBottom: 5,
  },
  orderButton: {
    backgroundColor: '#F4A460',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '110%',
    backgroundColor: '#F5DEB3',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    padding: 10,
  },
});

export default BookingListScreen;
