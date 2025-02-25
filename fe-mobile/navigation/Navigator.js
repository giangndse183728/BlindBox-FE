import React from 'react'
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screen/LoginScreen';
import WelcomeScreen from '../Screen/WelcomeScreen';

export default function Navigator() {

    const Stack = createNativeStackNavigator({
        screens:{
            Login: LoginScreen,
            Welcome: WelcomeScreen,
        },
    });

    const Navigator = createStaticNavigation(Stack);
    
    return (
        <Navigator/>
    )
}