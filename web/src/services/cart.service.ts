import { api, unwrap } from './api';
import type { Product } from '@/types/product.types';

// Backend returns CartLine[] where each item has cart + nested product
interface BackendCartLine {
  id: number;
  user_id: number;
  product_id: number;
  qty: number;
  product: Product | null;
}

export const cartService = {
  list: () => unwrap<BackendCartLine[]>(api.get('/buyer/cart')),
  upsert: (product_id: number, qty: number) =>
    api.post('/buyer/cart', { product_id, qty }),
  remove: (product_id: number) => api.delete(`/buyer/cart/${product_id}`),
};
