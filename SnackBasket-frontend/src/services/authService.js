import apiClient from "./api";

// User Register
export const registerUser = async (userData) => {
  return await apiClient.post("/auth/register", userData);
};

// User Login
export const loginUser = async (credentials) => {
  return await apiClient.post("/auth/login", credentials);
};

// Fetch Logged-in User Profile
export const getUserProfile = async () => {
  return await apiClient.get("/auth/profile");
};

// Request seller access
export const requestSellerRole = async (message = "") => {
  return await apiClient.post("/auth/request-seller", { message });
};

// Admin: get pending seller requests
export const getSellerRequests = async () => {
  return await apiClient.get("/auth/seller-requests");
};

// Admin: approve/reject seller request
export const handleSellerRequest = async (userId, action) => {
  return await apiClient.patch(`/auth/seller-requests/${userId}`, { action });
};

// Admin: get all users
export const getUsers = async () => {
  return await apiClient.get("/auth/users");
};

// Admin: update a user role
export const updateUserRole = async (userId, role) => {
  return await apiClient.patch(`/auth/users/${userId}/role`, { role });
};

// User Logout (Optional server-side logout)
export const logoutUser = async () => {
  return await apiClient.post("/auth/logout");
};
