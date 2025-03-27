import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('อาหาร');
  const [orderedItems, setOrderedItems] = useState([]);

  const categories = ['อาหาร', 'ของหวาน', 'เครื่องดื่ม'];

  const menuItems = [
    { id: '1', name: 'กะเพราไก่ไข่ดาว', price: 50 },
    { id: '2', name: 'ข้าวมันไก่', price: 45 },
    { id: '3', name: 'ข้าวผัดกุ้ง', price: 55 },
    { id: '4', name: 'ขนมเค้ก', price: 40 },
    { id: '5', name: 'ชานมไข่มุก', price: 35 },
  ];

  const handleOrder = (item) => {
    setOrderedItems([...orderedItems, item]);
    Alert.alert('สั่งอาหารสำเร็จ', `${item.name} ถูกเพิ่มในรายการสั่งแล้ว`);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search..." />
        <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categorySelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Items List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price} บาท</Text>
            <TouchableOpacity style={styles.orderButton} onPress={() => handleOrder(item)}>
              <Text style={styles.orderButtonText}>สั่ง</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('OrderList', { orderedItems })}>
        <Ionicons name="restaurant-outline" size={30} color="black" />
      </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryButton: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0000FF',
  },
  categorySelected: {
    backgroundColor: '#0000FF',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuPrice: {
    fontSize: 14,
    color: '#545353',
  },
  orderButton: {
    marginTop: 10,
    backgroundColor: '#CD853F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#F4A460',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '110%',
    height: 80,
    backgroundColor: '#F5DEB3',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default OrderScreen;
