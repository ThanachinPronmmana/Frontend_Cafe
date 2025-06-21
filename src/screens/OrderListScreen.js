import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, Modal, Image 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = "http://10.0.2.2:8000/api"; // เปลี่ยนเป็น URL ของคุณ

const OrderListScreen = ({ navigation }) => {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [cartId,setCartId] = useState()
  const [tableId,setTableId] = useState()
  // const [cartId,setCartId] = useState("")
  // const [reservationId,setreservationId] = useState("")

  useEffect(() => {
    loadUserId();
    
  }, []); // เรียกใช้แค่ครั้งแรกที่โหลด component

  // ฟังก์ชันสำหรับรีเซ็ตรายการอาหาร
  const resetCart = async () => {
    try {
      setLoading(true); // ตั้งค่าให้ loading เป็น true ก่อนทำการรีเซ็ต
      const URL = `${API_BASE_URL}/user/${userId}`;
      await axios.delete(URL);
      setFood([]); // เคลียร์รายการอาหาร
      setCartTotal(0); // รีเซ็ตยอดรวม
      setLoading(false); // ปิดการโหลด
    } catch (err) {
      setLoading(false); // ปิดการโหลดหากเกิดข้อผิดพลาด
      console.error("Error resetting cart:", err);
      Alert.alert("Error", "ไม่สามารถรีเซ็ตรายการอาหารได้", err.message);
    }
  };

  // ฟังก์ชันโหลดข้อมูลผู้ใช้จาก AsyncStorage
  const loadUserId = async () => {
    try {
      const storageUserId = await AsyncStorage.getItem("userId");
      
      if (storageUserId) {
        setUserId(storageUserId);
        fetchOrders(storageUserId);
      }
      else {
        Alert.alert("Error", "ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่");
      }
    } catch (err) {
      console.error("❌ Error loading userId", err);
    }
  };

  // ฟังก์ชันดึงข้อมูลรายการอาหาร
  const fetchOrders = async (userId) => {
    if (!userId) return;
    setLoading(true);  // เริ่มการโหลดข้อมูล
    try {
      const URL = `${API_BASE_URL}/user/${userId}`;
      const response = await axios.get(URL);
      const { foods, cartTotal,cartId,tableId } = response.data;
      setFood(foods);
      setCartTotal(cartTotal);
      setCartId(cartId)
      setTableId(tableId)
      
    } catch (err) {
      console.error("Error fetching orders:", err);
      Alert.alert("Error", "ไม่สามารถโหลดรายการอาหารได้", err.message);
    } finally {
      setLoading(false); // ปิดการโหลดหลังจากดึงข้อมูลเสร็จ
    }
  };
  
  const handleShowQR =  async() => {
  
    try{
      await axios.post(`${API_BASE_URL}/order`,{
        userId: userId,
        cartId: cartId,
        reservationId:tableId,
        order_status: "Unready",
      })
      setShowQR(true)
    }catch(err){
      Alert.alert("Error","Can't save",err)
    }
  };
  
    
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
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={resetCart} // เรียกใช้ฟังก์ชันรีเซ็ต
          >
            <Text style={styles.refreshText}>🔄 ยกเลิกรายการทั้งหมด</Text>
          </TouchableOpacity>
        </>
      )}
          
      {/* ตรวจสอบการแสดงปุ่มชำระเงิน */}
      {cartTotal > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.totalPrice}>ราคารวม: {cartTotal} บาท</Text>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={handleShowQR} 
          >
            <Text style={styles.checkoutText}>ชำระเงิน</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Modal สำหรับ QR Code */}
      <Modal visible={showQR} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>🔗 สแกนเพื่อชำระเงิน</Text>
            <Image 
              source={require("../../images/Rickrolling_QR_code.png")} // ใช้ไฟล์รูป QR ภายในโปรเจค
              style={{ width: 200, height: 200 }} 
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowQR(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#CD853F", // สีพื้นหลังเหมือนปุ่มชำระเงิน
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10, // เพิ่มระยะห่างจากปุ่มชำระเงิน
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  closeButton: { marginTop: 15, backgroundColor: "#CD853F", padding: 10, borderRadius: 5 },
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
