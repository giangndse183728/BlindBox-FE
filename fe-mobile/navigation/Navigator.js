import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CollectionScreen from '../screen/CollectionScreen/CollectionScreen';
import DetailScreen from '../screen/DetailScreen/DetailScreen';
import CartScreen from '../screen/CartScreen/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen}/>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home" 
          component={StackNavigator}
        />
        <Tab.Screen
          name="Cart"
          component={StackNavigator}
          />
      </Tab.Navigator>
    </NavigationContainer>
  );
}