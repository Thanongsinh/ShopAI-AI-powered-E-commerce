import { api, unwrap } from './api';
import type { Order } from '@/types/order.types';

export const orderService = {
  list: () => unwrap<Order[]>(api.get('/buyer/orders')),
  get: (id: number) => unwrap<Order>(api.get(`/buyer/orders/${id}`)),
  checkout: (body: { address: string; payment_method: string }) =>
    unwrap<Order>(api.post('/buyer/cart/checkout', body)),
};
