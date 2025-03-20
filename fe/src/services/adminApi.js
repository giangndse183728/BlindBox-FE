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
const getAllPosts = async () => {
    try {
        const response = await api.get('/admins/products?category=0');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
    }
};

const updatePostStatus = async (slug, id, status) => {
    try {
        const response = await api.put(`/admins/products/${slug}?id=${id}`, {
            status: status
        });
        return response.data;
    } catch (error) {
        console.error('Error updating post status:', error);
        throw new Error('Failed to update post status');
    }
};


export const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/admins/dashboard/stats');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
  }
};


export const adminApi = {
    getAllPosts,
    updatePostStatus,
    fetchDashboardStats
}; 
