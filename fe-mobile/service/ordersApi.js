import api from './baseURL';

const createOrder = async (orderData) => {
    try {
        console.log('Creating order with data:', orderData);
        const response = await api.post('/orders', orderData);
        console.log('Order creation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error.response?.data || new Error('Failed to create order');
    }
};

const getMyOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error.response?.data || new Error('Failed to fetch orders');
    }
};

const completeOrderStatus = async (orderId) => {
    try {
        const response = await api.patch(`/orders/${orderId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completing order:', error);
        throw error.response?.data || new Error('Failed to complete order');
    }
};

const cancelOrder = async (orderId) => {
    try {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error.response?.data || new Error('Failed to cancel order');
    }
};

export {
    createOrder,
    getMyOrders,
    completeOrderStatus,
    cancelOrder
};

