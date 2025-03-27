import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderListScreen = ({ navigation, route }) => {
  const { orderedItems } = route.params || { orderedItems: [] };

  // รวมจำนวนแต่ละเมนู
  const itemCounts = orderedItems.reduce((acc, item) => {
    if (acc[item.id]) {
      acc[item.id].quantity += 1;
    } else {
      acc[item.id] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});

  // แปลง Object เป็น Array
  const itemList = Object.values(itemCounts);

  // คำนวณราคารวมทั้งหมด
  const totalPrice = itemList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายการสั่งอาหาร</Text>
      <FlatList
        data={itemList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodDetails}>จำนวน: {item.quantity} | ราคา: {item.price * item.quantity} บาท</Text>
          </View>
        )}
      />

      {/* ส่วนแสดงราคารวมและปุ่มคิดเงิน */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalPrice}>ราคารวม: {totalPrice} บาท</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => alert('ดำเนินการชำระเงิน')}>
          <Text style={styles.checkoutText}>ชำระเงิน</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OrderScreen')}>
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
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    padding: 20,
    paddingBottom: 100, // เพิ่ม padding กันไม่ให้ bottom nav บัง
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CD853F',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F5DEB3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodDetails: {
    fontSize: 16,
    color: '#545353',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4A460',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#CD853F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F5DEB3',
    paddingVertical: 30,
    position: 'absolute',
    bottom: 0,
    width: '115%',
  },
});

export default OrderListScreen;
