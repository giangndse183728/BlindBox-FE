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
    const response = await api.put(`/cart/${productId}`, {
      quantity
    });
    return response.data.result;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Failed to update cart item');
  }
};

// Remove item from cart
export const removeCartItem = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw new Error('Failed to remove item from cart');
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
