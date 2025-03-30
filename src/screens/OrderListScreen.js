import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = "http://localhost:8000/api"; // แก้ให้ตรงกับ Backend

const OrderListScreen = ({ navigation }) => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const storageUserId = await AsyncStorage.getItem("userId");
      console.log("📌 Loaded userId:", storageUserId); // ตรวจสอบว่า userId ถูกโหลดมาจาก AsyncStorage หรือไม่

      if (storageUserId) {
        setUserId(storageUserId);
        fetchOrders(storageUserId);
      } else {
        Alert.alert("Error", "ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่");
      }
    } catch (err) {
      console.error("❌ Error loading userId", err);
    }
  };

  const fetchOrders = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      console.log("📌 API Response:", response.data);

      if (response.data.orders) {
        setOrderedItems(response.data.orders);
      } else {
        setOrderedItems([]);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      Alert.alert("Error", "ไม่สามารถโหลดรายการสั่งอาหารได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📌 Ordered Items Updated:", orderedItems);
  }, [orderedItems]);

  // รวมจำนวนแต่ละเมนู
  const itemCounts = orderedItems.reduce((acc, item) => {
    if (acc[item.foodId]) {
      acc[item.foodId].quantity += 1;
    } else {
      acc[item.foodId] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});

  const itemList = Object.values(itemCounts);
  const totalPrice = itemList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 รายการสั่งอาหาร</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          {orderedItems.length === 0 ? (
            <Text style={styles.noOrderText}>ไม่มีรายการสั่งอาหาร</Text>
          ) : (
            <FlatList
              data={itemList}
              keyExtractor={(item) => item.foodId.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.foodName}>{item.foodName}</Text>
                  <Text style={styles.foodDetails}>
                    จำนวน: {item.quantity} | ราคา: {item.price * item.quantity} บาท
                  </Text>
                </View>
              )}
            />
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.totalPrice}>ราคารวม: {totalPrice} บาท</Text>
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={() => Alert.alert("แจ้งเตือน", "ระบบชำระเงินอยู่ระหว่างการพัฒนา")}
            >
              <Text style={styles.checkoutText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={() => fetchOrders(userId)}
          >
            <Text style={styles.refreshText}>🔄 โหลดรายการล่าสุด</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("OrderScreen")}>
          <Ionicons name="fast-food" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0E6",
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CD853F",
    textAlign: "center",
    marginBottom: 20,
  },
  noOrderText: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#F5DEB3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodDetails: {
    fontSize: 16,
    color: "#545353",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4A460",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  checkoutButton: {
    backgroundColor: "#CD853F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F5DEB3",
    paddingVertical: 30,
    position: "absolute",
    bottom: 0,
    width: "115%",
  },
});

export default OrderListScreen;
