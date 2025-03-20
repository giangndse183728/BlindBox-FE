import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  fetchCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from "../../service/cartApi"; 

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null, 
      isLoading: false,
      error: null,

      // Fetch cart items from API
      fetchCartItems: async () => {
        set({ isLoading: true, error: null });
        try {
          const cartData = await fetchCart();
          console.log("Fetched Cart Data:", cartData);
          set({ cart: cartData }); 
        } catch (error) {
          console.error("Error fetching cart:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addToCart: async (productId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCart = await addItemToCart(productId, quantity);
          console.log("Updated Cart After Add:", updatedCart);
          set({ cart: updatedCart }); 
        } catch (error) {
          console.error("Error adding to cart:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Update item quantity in cart
      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Updating cart - Product ID:', productId, 'New Quantity:', quantity);
          const updatedCart = await updateCartItem(productId, quantity);
          if (!updatedCart) {
            throw new Error('No response from server');
          }
          console.log("Updated Cart Response:", updatedCart);
          set({ cart: updatedCart });
        } catch (error) {
          console.error("Error updating cart item:", error);
          console.error("Error details:", error.response?.data);
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Remove item from cart
      removeFromCart: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Calling removeCartItem with productId:', productId); // Debug log
          const updatedCart = await removeCartItem(productId);
          console.log("Updated Cart After Remove:", updatedCart);
          set({ cart: updatedCart });
        } catch (error) {
          console.error("Error removing cart item:", error);
          set({ error: error.message });
          throw error; // Make sure to re-throw the error
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear the cart
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await clearCart();
          console.log("Cart Cleared");
          set({ cart: null }); 
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => AsyncStorage,
    }
  )
);

export default useCartStore;
