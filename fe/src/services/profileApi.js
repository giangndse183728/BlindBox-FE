import api from './baseURL';
import axios from 'axios';

export const fetchUserData = async () => {
    try {
        const userResponse = await api.get('/accounts/me');
        const userData = userResponse.data.result;

        // Store user details in localStorage
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('role', userData.role);

        return userData;

    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }


};

// Update user data
export const updateUserData = async (updatedUser) => {
    try {
        const response = await api.patch('/accounts/me', updatedUser);
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw new Error('Failed to update user data');
    }
};


