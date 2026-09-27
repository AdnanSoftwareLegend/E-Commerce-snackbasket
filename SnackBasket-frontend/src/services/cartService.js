import apiClient from './api';

// User Cart Get
export const getCart = async () => {
  return await apiClient.get('/cart');
};

// Add Item to Cart
export const addToCartAPI = async (productId, quantity = 1) => {
  return await apiClient.post('/cart/add', { productId, quantity });
};

// Update Cart Item Quantity
export const updateCartQuantityAPI = async (productId, quantity) => {
  return await apiClient.put(`/cart/update/${productId}`, { quantity });
};

// Remove Item from Cart
export const removeFromCartAPI = async (productId) => {
  return await apiClient.delete(`/cart/remove/${productId}`);
};