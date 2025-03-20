import api from './baseURL';

export const getAdminAccounts = async () => {
    try {
        const response = await api.get('/admins/accounts');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin accounts:', error);
        throw error.response?.data || new Error('Failed to fetch admin accounts');
    }
};

export const updateAdminAccount = async (accountId, accountData) => {
    try {
        const response = await api.patch(`/admins/accounts/${accountId}`, accountData);
        return response.data;
    } catch (error) {
        console.error('Error updating admin account:', error);
        throw error.response?.data || new Error('Failed to update admin account');
    }
};

export const deleteAdminAccount = async (accountId) => {
    try {
        const response = await api.delete(`/admins/accounts/${accountId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting admin account:', error);
        throw error.response?.data || new Error('Failed to delete admin account');
    }
};
