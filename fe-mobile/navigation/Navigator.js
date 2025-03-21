import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Import thư viện icon
import CollectionScreen from '../screen/CollectionScreen/CollectionScreen';
import DetailScreen from '../screen/DetailScreen/DetailScreen';
import CartScreen from '../screen/CartScreen/CartScreen';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import ProfileScreen from '../screen/ProfileScreen/ProfileScreen';
import useCartStore from '../screen/CartScreen/CartStore';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CollectionStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTransparent: true,
        headerTintColor: 'yellow',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: '',
      }}
    >
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const CartStack = createNativeStackNavigator();

function CartStackScreen() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartMain" component={CartScreen} />
    </CartStack.Navigator>
  );
}

export default function App() {
  const { cart } = useCartStore();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'black',
            borderTopColor: 'rgba(255, 255, 255, 0.2)',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'ShoppingCart') {
              iconName = 'cart-outline';
              if (cart && cart.items && cart.items.length > 0) {
                return (
                  <View>
                    <Ionicons name={iconName} size={size} color={color} />
                    <View style={{
                      position: 'absolute',
                      right: -6,
                      top: -3,
                      backgroundColor: 'yellow',
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        color: 'black',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}>
                        {cart.items.length}
                      </Text>
                    </View>
                  </View>
                );
              }
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'yellow',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={CollectionStackNavigator} />
        <Tab.Screen name="ShoppingCart" component={CartStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
