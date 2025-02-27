import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set) => ({
            cart: [],
            
            addToCart: (product, quantity) => set((state) => {
                const existingProduct = state.cart.find((item) => item.id === product.id);
                if (existingProduct) {
                    return {
                        cart: state.cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    };
                }
                return { cart: [...state.cart, { ...product, quantity }] };
            }),

            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === productId
                        ? { ...item, quantity }
                        : item
                )
            })),

            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((item) => item.id !== id)
            })),

           
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCartStore; 