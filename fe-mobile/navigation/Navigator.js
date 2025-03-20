import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Import thư viện icon
import CollectionScreen from '../screen/CollectionScreen/CollectionScreen';
import DetailScreen from '../screen/DetailScreen/DetailScreen';
import CartScreen from '../screen/CartScreen/CartScreen';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import ProfileScreen from '../screen/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CollectionStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
const CartStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'ShoppingCart') {
              iconName = 'cart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'orange',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={CollectionStackNavigator} />
        <Tab.Screen name="ShoppingCart" component={CartStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
