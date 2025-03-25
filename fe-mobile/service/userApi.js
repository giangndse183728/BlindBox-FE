import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from './baseURL';

export const login = async (email, password) => {
    try {
        const response = await api.post('/accounts/login', { email, password });
        const { accessToken, refreshToken } = response.data.result;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        return { accessToken, refreshToken };

    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Failed to log in');
    }
};

export const logout = async () => {
    try {
        // Simply clear all auth data without making an API call
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
        return true;
    } catch (error) {
        console.error('Error clearing auth data:', error);
        throw new Error('Failed to logout');
    }
};

export const fetchUserData = async () => {
    try {
        const response = await api.get('/accounts/me');
        return response.data.result;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }
};

export const updateUserData = async (updatedUser) => {
    try {
        // Only send the fields that have changed, excluding email
        const changedFields = {};
        Object.keys(updatedUser).forEach(key => {
            // Skip email field and only include non-null/undefined values
            if (key !== 'email' && updatedUser[key] !== undefined && updatedUser[key] !== null) {
                changedFields[key] = updatedUser[key];
            }
        });

        console.log('Updating user data with changed fields:', changedFields);
        const response = await api.patch('/accounts/me', changedFields);
        return response.data.result;
    } catch (error) {
        console.error('Error updating user data:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to update user data');
    }
};
