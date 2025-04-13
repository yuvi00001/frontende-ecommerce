import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { auth } from '../firebase/config';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
}

interface CartStoreState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  readonly totalPrice: number;
  readonly totalItems: number;
  addItem: (product: any, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

interface CartApiResponse {
  cart?: {
    cartItems?: Array<{
      product_id: string;
      product: {
        name: string;
        price: number;
        image_url?: string;
      };
      quantity: number;
    }>;
  };
}

const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      // Calculate total price
      get totalPrice() {
        return get().items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },
      
      // Calculate total items
      get totalItems() {
        return get().items.reduce((total, item) => {
          return total + item.quantity;
        }, 0);
      },
      
      // Add item to cart
      addItem: async (product, quantity = 1) => {
        try {
          set({ isLoading: true, error: null });
          
          const items = [...get().items];
          const existingItemIndex = items.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Item exists, update quantity
            items[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            items.push({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity
            });
          }
          
          // If user is logged in, sync with backend
          if (auth.currentUser) {
            await api.post('/api/cart', {
              product_id: product.id,
              quantity: existingItemIndex >= 0 ? items[existingItemIndex].quantity : quantity
            });
          }
          
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add item', isLoading: false });
        }
      },
      
      // Update item quantity
      updateItemQuantity: async (itemId, quantity) => {
        try {
          set({ isLoading: true, error: null });
          
          const items = [...get().items];
          const itemIndex = items.findIndex(item => item.id === itemId);
          
          if (itemIndex >= 0) {
            if (quantity <= 0) {
              // Remove item if quantity is 0 or less
              items.splice(itemIndex, 1);
            } else {
              // Update quantity
              items[itemIndex].quantity = quantity;
            }
            
            // If user is logged in, sync with backend
            if (auth.currentUser) {
              if (quantity <= 0) {
                await api.delete(`/api/cart/${itemId}`);
              } else {
                await api.put(`/api/cart/${itemId}`, { quantity });
              }
            }
            
            set({ items, isLoading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update item', isLoading: false });
        }
      },
      
      // Remove item from cart
      removeItem: async (itemId) => {
        try {
          set({ isLoading: true, error: null });
          
          const items = get().items.filter(item => item.id !== itemId);
          
          // If user is logged in, sync with backend
          if (auth.currentUser) {
            await api.delete(`/api/cart/${itemId}`);
          }
          
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove item', isLoading: false });
        }
      },
      
      // Clear cart
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // If user is logged in, sync with backend
          if (auth.currentUser) {
            await api.delete('/api/cart');
          }
          
          set({ items: [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear cart', isLoading: false });
        }
      },
      
      // Fetch cart from backend (for logged-in users)
      fetchCart: async () => {
        try {
          if (!auth.currentUser) return;
          
          set({ isLoading: true, error: null });
          
          const response = await api.get<CartApiResponse>('/api/cart');
          
          if (response.data && response.data.cart && response.data.cart.cartItems) {
            const cartItems = response.data.cart.cartItems.map(item => ({
              id: item.product_id,
              name: item.product.name,
              price: item.product.price,
              image_url: item.product.image_url,
              quantity: item.quantity
            }));
            
            set({ items: cartItems, isLoading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch cart', isLoading: false });
        }
      }
    }),
    {
      name: 'cart-storage', // name of the item in localStorage
      getStorage: () => localStorage, // storage to use
    }
  )
);

export default useCartStore; 