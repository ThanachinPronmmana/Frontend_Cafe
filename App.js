import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingOptionsScreen from './src/screens/BookingOptionsScreen';
import OrderScreen from './src/screens/OrderScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BookingListScreen from './src/screens/BookingListScreen';
import OrderListScreen from './src/screens/OrderListScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#CD853F',  // สีพื้นหลังของ header
          },
          headerTintColor: '#FFFFFF',  // สีของตัวอักษรใน header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="BookingOptions" component={BookingOptionsScreen} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Cart" component={BookingListScreen} />
        <Stack.Screen name="OrderList" component={OrderListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
