import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [menus, setMenus] = useState([
    { id: 1, name: 'เค้ก', price: '55 บาท', image: 'https://static01.nyt.com/images/2023/10/27/multimedia/27cakerex-plzm/27cakerex-plzm-jumbo.jpg?quality=75&auto=webp' },
    { id: 2, name: 'คุกกี้', price: '50 บาท', image: 'https://static01.nyt.com/images/2022/02/12/dining/JT-Chocolate-Chip-Cookies/JT-Chocolate-Chip-Cookies-jumbo.jpg?quality=75&auto=webp' },
    { id: 3, name: 'แพนเค้ก', price: '45 บาท', image: 'https://mojo.generalmills.com/api/public/content/Pw6SBIgi-Ee6pTZBpU1oBg_webp_base.webp?v=4dec1972&t=191ddcab8d1c415fa10fa00a14351227'  },
    { id: 4, name: 'กะเพราหมูสับ', price: '150 บาท', image: 'https://s359.kapook.com/pagebuilder/3132fac8-2481-477d-8f83-54af38ccb434.jpg'  },
    { id: 5, name: 'เมนู E', price: '90 บาท', image: './images/ข้าวไข่เจียวหมูสับ.jpg'  },
    { id: 6, name: 'เมนู F', price: '150 บาท', image: './images/มัทฉะลาเต้.jpg'  },
    { id: 7, name: 'เมนู G', price: '90 บาท', image: './images/เอสเปรโซ่.jpg'  },
    { id: 8, name: 'เมนู H', price: '150 บาท', image: './images/ชาเย็น.jpg'  },
  ]);

  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <View style={styles.container}>
      {/* เมนูขายดีอันดับ 1 */}
      <TouchableOpacity 
        style={styles.bestSelling} 
        onPress={() => setSelectedMenu({ name: 'เมนูขายดีอันดับ 1', price: '99 บาท', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/aSAKumEHs/Tea/IG_HK_0025__4_.jpg?v=202405291424' })}
      >
        <Image source={{ uri: 'https://image.makewebeasy.net/makeweb/m_1920x0/aSAKumEHs/Tea/IG_HK_0025__4_.jpg?v=202405291424' }} style={styles.bestSellingImage} />
        <Text style={styles.bestSellingText}>เมนูขายดีอันดับ 1</Text>
      </TouchableOpacity>

      {/* เมนูแนะนำ */}
      <View style={styles.menuGrid}>
        {menus.map((menu) => (
          <TouchableOpacity key={menu.id} style={styles.menuItem} onPress={() => setSelectedMenu(menu)}>
            <Image source={{ uri: menu.image }} style={styles.menuImage} />
            <Text style={styles.menuText}>{menu.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popup รายละเอียดเมนู */}
      <Modal transparent visible={!!selectedMenu} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedMenu(null)}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedMenu?.image }} style={styles.modalImage} />
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

// ✅ สไตล์
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
    overflow: 'hidden',
  },
  bestSellingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bestSellingText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  menuItem: {
    width: '40%',
    height: 120,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
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
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
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
