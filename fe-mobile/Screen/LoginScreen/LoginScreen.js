import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../service/userApi';

const LoginScreen = ({ navigation, route }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const setIsLoggedIn = route.params?.setIsLoggedIn || (() => { });

    const handleLogin = async () => {
        try {
            setLoading(true);
            const tokens = await login(email, password);

            if (tokens) {
                await AsyncStorage.setItem("accessToken", tokens.accessToken);
                setIsLoggedIn(true);
                navigation.replace("Collection");
            }
        } catch (error) {
            Alert.alert("Email or password is incorrect", "Please try again");
            console.error("Login error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: "white" }}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{
                    width: '100%',
                    padding: 10,
                    borderWidth: 1,
                    borderColor: 'white', 
                    marginBottom: 10,
                    borderRadius: 5, 
                    color: 'white', 
                }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    width: '100%',
                    padding: 10,
                    borderWidth: 1,
                    borderColor: 'white', 
                    marginBottom: 20,
                    borderRadius: 5, 
                    color: 'white', 
                }}
            />

            <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: 'blue', padding: 10, width: '100%', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // ... rest of the styles ...
});

export default LoginScreen;