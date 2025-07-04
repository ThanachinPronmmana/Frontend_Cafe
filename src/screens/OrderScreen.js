import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:8000';

const OrderScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(""); // ✅ เพิ่ม state เก็บ userId

  const categories = ['Desert', 'Food', 'Drinks'];

  useEffect(() => {
    getUserId()
    fetchMenuItems(); // ✅ แก้ชื่อฟังก์ชัน
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/food/${selectedCategory}`);
      setMenuItems(response.data.foods || response.data.data || []);
    } catch (err) {
      setError("โหลดเมนูไม่สำเร็จ กรุณาลองใหม่!");
      Alert.alert("Error", "ไม่สามารถโหลดเมนูได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };
  

  const handleOrder = async (item) => {
    if (!userId) {
      Alert.alert("Error", "ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่");
      return;
    }

    try {
      
      await axios.post(`${API_BASE_URL}/api/user`, {
        userId:String(userId), // ✅ ส่ง userId ที่ถูกต้อง
        foodId: item._id,
        quantity: 1,
      }); 
      Alert.alert('สั่งอาหารสำเร็จ', `${item.name} ถูกเพิ่มในรายการสั่งแล้ว`);
      navigation.navigate("OrderList", { refresh: true }); // ✅ บอกให้โหลดข้อมูลใหม่
    } catch (err) {
      Alert.alert("Error", "ไม่สามารถสั่งอาหารได้ กรุณาลองใหม่",userId);
    }
  };

  return (
    <View style={styles.container}>
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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price} บาท</Text>
              <TouchableOpacity 
                style={[styles.orderButton, item.isAvalible !== "Avalible" && styles.orderButtonDisabled]} 
                onPress={() => handleOrder(item)}
                disabled={item.isAvalible !== "Avalible"}
              >
                <Text style={styles.orderButtonText}>{item.isAvalible === "Avalible" ? "สั่ง" : "หมด"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.viewOrderButton} onPress={() => navigation.navigate("OrderList")}> 
        <Text style={styles.viewOrderText}>ดูรายการสั่งซื้อ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  categoryButton: { padding: 10, marginHorizontal: 5, backgroundColor: '#ddd', borderRadius: 5 },
  categorySelected: { backgroundColor: '#0000FF' },
  categoryText: { color: '#000' },
  categoryTextSelected: { color: '#FFF' },
  menuItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  menuName: { fontSize: 18, fontWeight: 'bold' },
  menuPrice: { fontSize: 16, color: '#444' },
  orderButton: { marginTop: 10, padding: 10, backgroundColor: '#28a745', borderRadius: 5, alignItems: 'center' },
  orderButtonDisabled: { backgroundColor: '#ccc' },
  orderButtonText: { color: '#fff', fontWeight: 'bold' },
  viewOrderButton: { marginTop: 20, padding: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
  viewOrderText: { color: '#fff', fontWeight: 'bold' },
});

export default OrderScreen;
