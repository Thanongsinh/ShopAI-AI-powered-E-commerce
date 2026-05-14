import { api, unwrap } from './api';
import type {
  ProductUpsertRequest,
  SellerAnalytics,
  SellerDashboardData,
  Shop,
} from '@/types/seller.types';
import type { Product } from '@/types/product.types';
import type { Order } from '@/types/order.types';

export const sellerService = {
  dashboard: () => unwrap<SellerDashboardData>(api.get('/seller/dashboard')),
  products: () => unwrap<Product[]>(api.get('/seller/products')),
  createProduct: (body: ProductUpsertRequest) =>
    unwrap<Product>(api.post('/seller/products', body)),
  updateProduct: (id: number, body: Partial<ProductUpsertRequest>) =>
    unwrap<Product>(api.put(`/seller/products/${id}`, body)),
  deleteProduct: (id: number) =>
    unwrap<{ deleted: boolean }>(api.delete(`/seller/products/${id}`)),
  orders: () => unwrap<Order[]>(api.get('/seller/orders')),
  updateOrderStatus: (id: number, status: string) =>
    api.put(`/seller/orders/${id}/status`, { status }),
  analytics: () => unwrap<SellerAnalytics>(api.get('/seller/analytics')),
  getShop: () => unwrap<Shop>(api.get('/seller/shop')),
  updateShop: (body: Partial<Shop>) => unwrap<Shop>(api.put('/seller/shop', body)),
};
