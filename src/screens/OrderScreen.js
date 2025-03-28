import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  FlatList, Alert, StyleSheet, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const OrderScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('อาหาร');
  const [orderedItems, setOrderedItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // เปลี่ยน URL ตามเซิร์ฟเวอร์ของคุณ
  const API_BASE_URL = 'http://10.0.2.2:8000'; 
  const categories = ['อาหาร', 'ของหวาน', 'เครื่องดื่ม'];

  // ดึงข้อมูลเมนูอาหารจาก API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const url =  `${API_BASE_URL}/api/food/${selectedCategory}`
      console.log(url,'hee')
      const response = await axios.get(url);
      
      if (response.data && Array.isArray(response.data)) {
        setMenuItems(response.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load menu items');
      Alert.alert('Error', 'Could not load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อเลือกหมวดหมู่
  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const handleOrder = (item) => {
    setOrderedItems([...orderedItems, item]);
    Alert.alert('สั่งอาหารสำเร็จ', `${item.name} ถูกเพิ่มในรายการสั่งแล้ว`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchMenuItems}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search..."
          onChangeText={(text) => {
            // สามารถเพิ่มฟังก์ชันค้นหาได้ที่นี่
          }}
        />
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
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price} บาท</Text>
            <Text style={styles.menuStatus}>
              สถานะ: {item.isAvalible === "Avalible" ? "มีในสต็อก" : "หมด"}
            </Text>
            <TouchableOpacity 
              style={[
                styles.orderButton, 
                item.isAvalible !== "Avalible" && styles.orderButtonDisabled
              ]} 
              onPress={() => handleOrder(item)}
              disabled={item.isAvalible !== "Avalible"}
            >
              <Text style={styles.orderButtonText}>
                {item.isAvalible === "Avalible" ? "สั่ง" : "หมด"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('OrderList', { orderedItems })}
      >
        <Ionicons name="restaurant-outline" size={30} color="black" />
        {orderedItems.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{orderedItems.length}</Text>
          </View>
        )}
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
  // ... สไตล์เดิมทั้งหมด ...

  // เพิ่มสไตล์ใหม่
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF0E6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF0E6',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0000FF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
  menuStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  orderButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrderScreen;