export interface OrderItem {
  id: number;
  product_id: number;
  shop_id: number;
  qty: number;
  price: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  buyer_id: number;
  total: number;
  status: OrderStatus;
  address: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
  items: OrderItem[];
}
