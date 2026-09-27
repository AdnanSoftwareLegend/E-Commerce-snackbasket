import { useQuery } from '@tanstack/react-query';
import { getUserOrders, getOrderById } from '@/services/orderService';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};