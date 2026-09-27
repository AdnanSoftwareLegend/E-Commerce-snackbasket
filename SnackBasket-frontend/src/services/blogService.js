import apiClient from './api';

// Fetch all blogs
export const getBlogs = async () => {
  return await apiClient.get('/blogs');
};

// Fetch single blog by slug or ID
export const getBlogBySlug = async (slug) => {
  return await apiClient.get(`/blogs/${slug}`);
};