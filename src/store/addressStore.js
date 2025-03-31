import { create } from 'zustand';
import api from '../utils/api';
import { auth } from '../firebase/config';

const useAddressStore = create((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,
  
  // Fetch all shipping addresses for the current user
  fetchAddresses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get('/api/shipping/addresses');
      
      if (response.data) {
        set({ addresses: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Add a new shipping address
  addAddress: async (addressData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post('/api/shipping/addresses', addressData);
      
      if (response.data) {
        set(state => ({
          addresses: [...state.addresses, response.data],
          isLoading: false
        }));
        
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Update an existing shipping address
  updateAddress: async (addressId, addressData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put(`/api/shipping/addresses/${addressId}`, addressData);
      
      if (response.data) {
        set(state => ({
          addresses: state.addresses.map(address => 
            address.id === addressId ? response.data : address
          ),
          isLoading: false
        }));
        
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Delete a shipping address
  deleteAddress: async (addressId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      await api.delete(`/api/shipping/addresses/${addressId}`);
      
      set(state => ({
        addresses: state.addresses.filter(address => address.id !== addressId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useAddressStore; 