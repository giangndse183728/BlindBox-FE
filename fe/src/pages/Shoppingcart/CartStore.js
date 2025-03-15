import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCart, addItemToCart, updateCartItem, removeCartItem, clearCart as clearCartApi } from '../../services/cartApi';
import { toast } from 'react-toastify';

const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            isLoading: false,
            error: null,
            
            // Fetch cart from API
            fetchCartItems: async () => {
                set({ isLoading: true, error: null });
                try {
                    const cartData = await fetchCart();

                    if (cartData.items ) {
                        set({ 
                            cart: cartData.items, 
                            isLoading: false 
                        });
                    } else {
                        set({ 
                            cart: [], 
                            isLoading: false 
                        });
                    }
                } catch (error) {
                    set({ error: error.message, isLoading: false, cart: [] });
                    toast.error('Failed to load cart items');
                }
            },
            
            // Add item to cart
            addToCart: async (product, quantity) => {
                set({ isLoading: true, error: null });
                try {
                    const productId = product._id;
                    
                    if (!productId) {
                        throw new Error('Product ID is missing');
                    }

                    const result = await addItemToCart(productId, quantity);

                    if (result.items ) {
                        set({ 
                            cart: result.items, 
                            isLoading: false 
                        });
                        toast.success('Item added to cart');
                    } else {
                        throw new Error('Invalid response format from server');
                    }
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    toast.error(error.message || 'Failed to add item to cart');
                }
            },

            // Update item quantity
            updateQuantity: async (productId, quantity) => {
                set({ isLoading: true, error: null });
                try {
                    
                    const result = await updateCartItem(productId, quantity);
                    
                    if ( result.items ) {
                        set({ 
                            cart: result.items, 
                            isLoading: false 
                        });
                        toast.success('Quantity updated');
                    } else {
                        throw new Error('Invalid response format from server');
                    }
                } catch (error) {
                    console.error('Error updating quantity:', error);
                    set({ error: error.message, isLoading: false });
                    toast.error('Failed to update item quantity');
                }
            },

            // Remove item from cart
            removeFromCart: async (productId) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await removeCartItem(productId);
                    
                    if (result.items ) {
                        set({ 
                            cart: result.items, 
                            isLoading: false 
                        });
                        toast.success('Item removed from cart');
                    } else {
                        throw new Error('Invalid response format from server');
                    }
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    toast.error('Failed to remove item from cart');
                }
            },
            
            // Clear entire cart
            clearCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const result = await clearCartApi();     
                    set({ cart: [], isLoading: false });
                    toast.success('Cart cleared');
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    toast.error('Failed to clear cart');
                }
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCartStore; 