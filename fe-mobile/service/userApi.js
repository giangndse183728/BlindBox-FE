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
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await api.post('/accounts/logout', { refreshToken });

        if (response.status === 200) { 
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            return true;
        } else {
            console.error('Logout failed:', response.data);
            throw new Error('Logout API did not return success');
        }

    } catch (error) {
        console.error('Error logging out:', error.response ? error.response.data : error.message);
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
