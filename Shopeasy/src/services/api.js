import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export const fetchProducts = async (limit = 20, category = '') => {
  try {
    const endpoint = category 
      ? `/products/category/${category}` 
      : '/products';
    
    const response = await api.get(endpoint);
    
    // If limit is specified, limit the number of products returned
    const products = limit ? response.data.slice(0, limit) : response.data;
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Mock function for authentication in a real app this would be an actual API call
export const loginUser = async (credentials) => {
  try {
    // This is a fake API call for demo purposes
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    // For demo purposes, return mock data
    return {
      token: 'fake-jwt-token',
      user: {
        id: 1,
        email: credentials.email,
        name: 'Demo User',
      }
    };
  }
};

// Function to handle mock checkout process
export const processCheckout = async (orderData) => {
  try {
    // In a real app, this would be an actual API call
    // For demo purposes, we'll simulate a successful checkout
    return {
      success: true,
      orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
      message: 'Order placed successfully!',
    };
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
};