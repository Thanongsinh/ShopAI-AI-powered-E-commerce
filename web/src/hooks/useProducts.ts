import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const useProducts = (params: Record<string, string | number | undefined> = {}) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.list(params),
  });

export const useProduct = (id: number | undefined) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.get(id!),
    enabled: !!id,
  });

export const useSimilar = (id: number | undefined) =>
  useQuery({
    queryKey: ['product', id, 'similar'],
    queryFn: () => productService.similar(id!),
    enabled: !!id,
  });

export const useTrending = () =>
  useQuery({ queryKey: ['trending'], queryFn: productService.trending });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: productService.categories });

export const useRecommendations = () =>
  useQuery({
    queryKey: ['recommendations'],
    queryFn: productService.popularRecs,
  });
