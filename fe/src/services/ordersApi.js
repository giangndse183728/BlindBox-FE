import api from './baseURL';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response?.data || new Error('Failed to create order');
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || new Error('Failed to fetch orders');
  }
};

export const getSellerOrders = async () => {
  try {
    const response = await api.get('/orders/seller');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error.response?.data || new Error('Failed to fetch seller orders');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/seller/${orderId}/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || new Error('Failed to update order status');
  }
};


