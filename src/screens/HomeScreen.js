import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [menus, setMenus] = useState([
    { id: 1, name: 'เมนู A', price: '100 บาท' },
    { id: 2, name: 'เมนู B', price: '120 บาท' },
    { id: 3, name: 'เมนู C', price: '90 บาท' },
    { id: 4, name: 'เมนู D', price: '150 บาท' },
    { id: 5, name: 'เมนู E', price: '90 บาท' },
    { id: 6, name: 'เมนู F', price: '150 บาท' },
    { id: 7, name: 'เมนู G', price: '90 บาท' },
    { id: 8, name: 'เมนู H', price: '150 บาท' },
  ]);

  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <View style={styles.container}>
      {/* เมนูขายดีอันดับ 1 */}
      <TouchableOpacity style={styles.bestSelling} onPress={() => setSelectedMenu({ name: 'เมนูขายดีอันดับ 1', price: '200 บาท' })}>
        <Text style={styles.bestSellingText}>เมนูขายดีอันดับ 1</Text>
      </TouchableOpacity>

      {/* เมนูแนะนำ */}
      <View style={styles.menuGrid}>
        {menus.map((menu) => (
          <TouchableOpacity key={menu.id} style={styles.menuItem} onPress={() => setSelectedMenu(menu)}>
            <Text style={styles.menuText}>{menu.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popup */}
      <Modal transparent visible={!!selectedMenu} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedMenu(null)}>
          <View style={styles.modalContent}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.menuTitle}>{selectedMenu?.name}</Text>
            <Text style={styles.menuPrice}>{selectedMenu?.price}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

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
    alignItems: 'center',
  },
  bestSelling: {
    width: '90%',
    height: 200,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  bestSellingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  menuItem: {
    width: '40%',
    height: 80,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#D3D3D3',
    marginBottom: 10,
    borderRadius: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuPrice: {
    fontSize: 16,
    color: 'gray',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F5DEB3',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    padding: 10,
  },
});

export default HomeScreen;
