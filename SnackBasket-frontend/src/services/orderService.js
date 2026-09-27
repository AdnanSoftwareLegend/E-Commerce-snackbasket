import apiClient from './api';

// Create New Order (Checkout)
export const createOrder = async (orderData) => {
  return await apiClient.post('/orders/create', orderData);
};

// Get User Orders
export const getUserOrders = async () => {
  return await apiClient.get('/orders/my-orders');
};

// Get Single Order Details
export const getOrderById = async (orderId) => {
  return await apiClient.get(`/orders/${orderId}`);
};