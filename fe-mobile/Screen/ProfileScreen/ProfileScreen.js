import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../service/userApi';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            console.log('Stored Refresh Token:', refreshToken);

            if (!refreshToken) {
                Alert.alert('Error');
                return;
            }

            await logout();
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            Alert.alert('Success', 'Logged out successfully');
            
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Collection' }],
                })
            );

        } catch (error) {
            Alert.alert('Error', 'Failed to log out');
            console.error('Logout error:', error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>

            <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: 'red', padding: 10, width: '100%', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;
