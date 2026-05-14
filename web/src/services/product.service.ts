import { api, unwrap } from './api';
import type { Category, Paginated, Product } from '@/types/product.types';

export const productService = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    unwrap<Paginated<Product>>(api.get('/products', { params })),

  get: (id: number) => unwrap<Product>(api.get(`/products/${id}`)),

  similar: (id: number) => unwrap<Product[]>(api.get(`/products/${id}/similar`)),

  trending: () => unwrap<Product[]>(api.get('/trending')),

  popularRecs: () => unwrap<Product[]>(api.get('/recommendations/popular')),

  myRecs: () => unwrap<Product[]>(api.get('/buyer/recommendations')),

  categories: () => unwrap<Category[]>(api.get('/categories')),
};
