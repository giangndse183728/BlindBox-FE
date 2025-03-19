import api from './baseURL';

export const fetchBeads= async () => {
    try {
      const response = await api.get('/products/accessories/customization');
      return response.data.result;
    } catch (error) {
      console.error('Error fetching beads:', error);
      throw new Error('Failed to fetch beads');
    }
  };

  export const createCustomAccessory= async (data) => {
    try {
      const response = await api.post('/products/accessories/customization', data);
      return response.data;
    } catch (error) {
      console.error('Error creating custom accessory:', error);
      throw new Error('Failed to create custom accessory');
    }
  };