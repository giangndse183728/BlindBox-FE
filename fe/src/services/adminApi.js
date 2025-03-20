import api from './baseURL';

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