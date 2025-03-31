import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = "http://10.0.2.2:8000/api"; // แก้ให้ตรงกับ Backend

const OrderListScreen = ({ navigation }) => {
  const [food, setFood] = useState([]); // ใช้ state food สำหรับเก็บข้อมูลอาหาร
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [cartTotal, setCartTotal] = useState(0); // สำหรับเก็บราคาสินค้ารวมจาก API
  
  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const storageUserId = await AsyncStorage.getItem("userId");

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
      const URL = `${API_BASE_URL}/user/${userId}`;
      const response = await axios.get(URL);

      const { foods, cartTotal } = response.data; // ดึงข้อมูลจาก API
      setFood(foods); // เก็บข้อมูลอาหารใน state food
      setCartTotal(cartTotal); // เก็บราคารวมจาก API
    } catch (err) {
      console.error("Error fetching orders:", err);
      Alert.alert("Error", "ไม่สามารถโหลดรายการอาหารได้", err.message);
    }
  };

  const handleSubmitOrder = async () => {
    
    // if (food.length === 0) {
    //   Alert.alert("Error", "ไม่มีอาหารในตะกร้า");
    //   return;
    // }
    // await

    
  
    // const orderData = {
    //   userId: userId,
    //   cartId: cartId,
    //   reservationId: reservationId,
    //   order_status: "Unready",
    // };
  
    // try {
    //   const URL = `${API_BASE_URL}/order`; // API สำหรับบันทึกข้อมูล Order
    //   const response = await axios.post(URL, orderData);
  
    //   if (response.data.message === "Order created successfully") {
    //     Alert.alert("สำเร็จ", "คำสั่งซื้อของคุณได้ถูกบันทึกแล้ว");
    //     // เพิ่มฟังก์ชันที่คุณต้องการให้เกิดขึ้นหลังจากการสั่งซื้อเสร็จ
    //     navigation.navigate("Home"); // สามารถเปลี่ยนการนำทางไปที่หน้าจออื่นๆ
    //   }
    // } catch (err) {
    //   console.error("Error submitting order:", err);
    //   Alert.alert("Error", "ไม่สามารถบันทึกคำสั่งซื้อได้", err.message);
    // }
  };
  
  const resetcart = async()=>{
    try{
      const URL = `${API_BASE_URL}/user/${userId}`;
      
      await axios.delete(URL)
      setFood([])
      setCartTotal(0)
    }catch(err){
      console.error("Error fetching reset:", err);
    }

  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 รายการอาหาร</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          {food.length === 0 ? (
            <Text style={styles.noOrderText}>ไม่มีอาหารในรายการ</Text>
          ) : (
            <FlatList
              data={food}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.foodName}>{item.foodId.name}</Text>
                  <Text style={styles.foodDetails}>
                    จำนวน: {item.quantity} | ราคา: {item.price * item.quantity} บาท
                  </Text>
                </View>
              )}
            />
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.totalPrice}>ราคารวม: {cartTotal} บาท</Text>
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={handleSubmitOrder} // เมื่อกดจะทำการส่งข้อมูลไปยัง API
            >
              <Text style={styles.checkoutText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={resetcart}
          >
            <Text style={styles.refreshText}>🔄 ยกเลิกรายการทั้งหมด</Text>
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
  orderButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  orderText: {
    color: "#fff",
    fontWeight: "bold",
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
