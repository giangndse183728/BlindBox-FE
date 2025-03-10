import api from './baseURL';

// Fetch all blindboxes
export const fetchBlindboxData = async () => {
    try {
        const blindboxResponse = await api.get('/products/blind-boxes');
        return blindboxResponse.data;
    } catch (error) {
        console.error('Error fetching blindbox data:', error);
        throw new Error('Failed to fetch blindbox data');
    }
};

// Fetch blindbox detail
export const fetchBlindboxDetails = async (slug) => {
    try {
        const response = await api.get(`/products/blind-boxes/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blindbox details:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch blindbox details');
    }
};