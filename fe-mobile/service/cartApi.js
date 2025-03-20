import api from './baseURL';

// Fetch user's cart
export const fetchCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart');
  }
};

// Add item to cart
export const addItemToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/cart', {
      productId,
      quantity
    });
    return response.data.result;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw new Error('Failed to add item to cart');
  }
};

// Update item quantity in cart
export const updateCartItem = async (productId, quantity) => {
  try {
    console.log('API call - Updating cart item:', { productId, quantity });
    const response = await api.put(`/cart/${productId}`, {
      quantity: quantity
    });
    console.log('API response:', response.data);
    return response.data.result;
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
};

// Remove item from cart
export const removeCartItem = async (productId) => {
  try {
    console.log('API call to remove item:', productId); // Debug log
    const response = await api.delete(`/cart/${productId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error removing item from cart:', error.response?.data || error); // Log more detailed error
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.post('/cart/clear-all');
    return response.data.result;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear cart');
  }
};
