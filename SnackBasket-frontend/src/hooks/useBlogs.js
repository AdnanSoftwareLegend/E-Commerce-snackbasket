import { useQuery } from '@tanstack/react-query';
import { getBlogs, getBlogBySlug } from '@/services/blogService';

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogBySlug = (slug) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: !!slug,
  });
};