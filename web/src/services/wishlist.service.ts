import { api, unwrap } from './api';

interface BackendWishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
}

export const wishlistService = {
  list: () => unwrap<BackendWishlistItem[]>(api.get('/buyer/wishlist')),
  add: (product_id: number) => api.post('/buyer/wishlist', { product_id }),
  remove: (product_id: number) => api.delete(`/buyer/wishlist/${product_id}`),
};
