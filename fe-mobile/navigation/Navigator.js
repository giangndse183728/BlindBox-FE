import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CollectionPage from '../pages/Collectionpage/Collectionpage';
import { Ionicons } from '@expo/vector-icons'; // or any other icon library

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Collection" 
          component={CollectionPage} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }} 
        />
        {/* Add more tabs if needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}