import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, fetchUserData } from '../../service/userApi';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Collection' }] })
            );
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : userData ? (
                <>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/pfp.jpeg')} style={styles.avatar} />
                    </View>
                    <Text style={styles.header}> {userData.fullName} </Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>User Name</Text>
                        <TextInput 
                            style={styles.input} 
                            value={userData.userName} 
                            placeholder="Username"
                            editable={false}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={styles.input} 
                            value={userData.email} 
                            placeholder="Email" 
                            keyboardType="email-address"
                            editable={false}
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput 
                            style={styles.input} 
                            value={userData.phoneNumber} 
                            placeholder="Phone Number" 
                            keyboardType="phone-pad"
                            editable={false}
                        />
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.errorText}>Failed to load user data</Text>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        padding: 20 
    },
    avatarContainer: { marginTop: 20, alignItems: 'center' },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 5,
        backgroundColor: '#007bff',
        borderRadius: 15,
        padding: 5
    },
    header: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, color: 'white' },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center'
    },
    logoutText: { color: 'white', fontWeight: 'bold' },
    errorText: { fontSize: 18, color: 'red' },
    infoContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    label: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
        marginLeft: 5,
    },
});

export default ProfileScreen;
