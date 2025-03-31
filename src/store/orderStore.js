import { create } from 'zustand';
import api from '../utils/api';
import { auth } from '../firebase/config';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  
  // Fetch all orders for the current user
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get('/api/orders');
      
      if (response.data) {
        set({ orders: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Fetch a single order by ID
  fetchOrderById: async (orderId) => {
    try {
      set({ isLoading: true, error: null, currentOrder: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get(`/api/orders/${orderId}`);
      
      if (response.data) {
        set({ currentOrder: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Create a new order from cart
  createOrder: async (shippingAddress) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post('/api/orders', {
        address: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip_code: shippingAddress.zipCode,
        payment_method: 'credit_card' // Default payment method
      });
      
      if (response.data) {
        // Add the new order to the orders list
        set(state => ({
          orders: [response.data, ...state.orders],
          currentOrder: response.data,
          isLoading: false
        }));
        
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Process payment for an order
  processPayment: async (orderId, paymentDetails) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post('/api/payments', {
        order_id: orderId,
        ...paymentDetails
      });
      
      if (response.data) {
        // Update the current order if it's the one being paid for
        if (get().currentOrder && get().currentOrder.id === orderId) {
          set(state => ({
            currentOrder: {
              ...state.currentOrder,
              payment_status: 'paid'
            }
          }));
        }
        
        // Refresh orders list
        get().fetchOrders();
        
        set({ isLoading: false });
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Update order status (Admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put(`/api/orders/${orderId}/status`, { status });
      
      if (response.data) {
        // Update the current order if it's the one being updated
        if (get().currentOrder && get().currentOrder.id === orderId) {
          set(state => ({
            currentOrder: {
              ...state.currentOrder,
              status
            }
          }));
        }
        
        // Update the order in the orders list
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
          ),
          isLoading: false
        }));
        
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useOrderStore; 