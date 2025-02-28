import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CollectionPage from '../pages/Collectionpage/Collectionpage';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Tab.Screen
          name="Collection"
          component={CollectionPage}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
