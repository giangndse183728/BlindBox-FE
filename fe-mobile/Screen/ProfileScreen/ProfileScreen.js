import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ImageBackground, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, fetchUserData, updateUserData } from '../../service/userApi';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import EditIcon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await fetchUserData();
            setUserData(data);
            setEditedData(data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData(userData);
    };

    const handleSave = async () => {
        try {
            await updateUserData(editedData);
            setUserData(editedData);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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
            Alert.alert('Error', 'Failed to logout');
        }
    };

    return (
        <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#FFD700" />
            ) : userData ? (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/pfp.jpeg')} style={styles.avatar} />
                    </View>
                    <Text style={styles.header}>{userData.fullName}</Text>

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>User Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editedData?.userName}
                            placeholder="Username"
                            editable={false}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={editedData?.email}
                            placeholder="Email"
                            keyboardType="email-address"
                            editable={false}
                        />

                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            value={editedData?.address}
                            placeholder="Address"
                            multiline
                            numberOfLines={3}
                            editable={false}
                        />

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={[styles.input, isEditing && styles.editableInput]}
                            value={editedData?.fullName}
                            placeholder="Full Name"
                            editable={isEditing}
                            onChangeText={(value) => handleInputChange('fullName', value)}
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, isEditing && styles.editableInput]}
                            value={editedData?.phoneNumber}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            editable={isEditing}
                            onChangeText={(value) => handleInputChange('phoneNumber', value)}
                        />

                        <Text style={styles.label}>Biography</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput, isEditing && styles.editableInput]}
                            value={editedData?.biography}
                            placeholder="Biography"
                            multiline
                            numberOfLines={4}
                            editable={isEditing}
                            onChangeText={(value) => handleInputChange('biography', value)}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                                    <EditIcon name="edit" size={20} color="white" style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                                    <Text style={styles.buttonText}>Logout</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.errorText}>Failed to load user data</Text>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    avatarContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFD700'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Yusei Magic'
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        color: 'white',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    editableInput: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: '#FFD700',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#757575',
    },
    logoutButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Yusei Magic'
    },
    buttonIcon: {
        marginRight: 8,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    },
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
        fontFamily: 'Yusei Magic'
    },
});

export default ProfileScreen;
