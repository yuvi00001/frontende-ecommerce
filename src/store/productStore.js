import { create } from 'zustand';
import api from '../utils/api';
import { auth } from '../firebase/config';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    page: 1,
    limit: 10
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  },
  
  // Fetch all products with optional filters
  fetchProducts: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      // Merge current filters with new filters
      const currentFilters = { ...get().filters, ...filters };
      set({ filters: currentFilters });
      
      // Build query parameters
      const params = new URLSearchParams();
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
      params.append('page', currentFilters.page);
      params.append('limit', currentFilters.limit);
      
      const response = await api.get(`/api/products?${params.toString()}`);
      
      console.log("products", response.data);
      if (response.data) {
        set({ 
          products: response.data.products || [],
          pagination: response.data.pagination || {
            total: 0,
            page: 1,
            limit: currentFilters.limit,
            pages: 1
          },
          isLoading: false 
        });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Fetch a single product by ID
  fetchProductById: async (productId) => {
    try {
      set({ isLoading: true, error: null, currentProduct: null });
      
      const response = await api.get(`/api/products/${productId}`);
      
      if (response.data) {
        set({ currentProduct: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Fetch all categories
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Assuming there's an endpoint for categories, otherwise we can extract from products
      const response = await api.get('/api/products/categories');
      
      if (response.data) {
        set({ categories: response.data, isLoading: false });
      }
    } catch (error) {
      // If there's no specific endpoint for categories, extract from products
      try {
        const response = await api.get('/api/products?limit=100');
        
        if (response.data && response.data.products) {
          const uniqueCategories = [...new Set(
            response.data.products.map(product => product.category)
          )];
          
          set({ categories: uniqueCategories, isLoading: false });
        }
      } catch (innerError) {
        set({ error: innerError.message, isLoading: false });
      }
    }
  },
  
  // Admin: Create a new product
  createProduct: async (productData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post('/api/products', productData);
      
      if (response.data) {
        // Refresh products list
        get().fetchProducts();
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Admin: Update a product
  updateProduct: async (productId, productData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put(`/api/products/${productId}`, productData);
      
      if (response.data) {
        // Refresh products list and current product
        get().fetchProducts();
        if (get().currentProduct && get().currentProduct.id === productId) {
          set({ currentProduct: response.data });
        }
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Admin: Delete a product
  deleteProduct: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('Authentication required');
      }
      
      await api.delete(`/api/products/${productId}`);
      
      // Refresh products list
      get().fetchProducts();
      
      // Clear current product if it's the deleted one
      if (get().currentProduct && get().currentProduct.id === productId) {
        set({ currentProduct: null });
      }
      
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Set filters
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters, page: 1 } });
    get().fetchProducts();
  },
  
  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        category: '',
        minPrice: 0,
        maxPrice: 10000,
        page: 1,
        limit: 10
      }
    });
    get().fetchProducts();
  },
  
  // Change page
  setPage: (page) => {
    set({ filters: { ...get().filters, page } });
    get().fetchProducts();
  }
}));

export default useProductStore; 