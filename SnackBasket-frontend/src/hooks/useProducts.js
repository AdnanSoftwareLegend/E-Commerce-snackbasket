import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById, getCategories } from '@/services/productService';

// All Products Hook (with Filters)
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
};

// Single Product Details Hook
export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};

// Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30 mins cache
  });
};