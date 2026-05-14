import type { Product } from './product.types';
import type { Order } from './order.types';

export interface Shop {
  id: number;
  user_id: number;
  name: string;
  description: string;
  logo: string;
  rating: number;
  total_sales: number;
  is_verified: boolean;
}

export interface RevenueBar {
  label: string;
  value: number;
}

export interface SellerDashboardData {
  shop: Shop;
  revenue: number;
  orders_count: number;
  products: number;
  recent_orders: Order[];
  revenue_chart: RevenueBar[];
}

export interface SellerAnalytics {
  top_categories: string[];
  orders_count: number;
  products_count: number;
  low_stock_alert: string[];
  price_band: string;
  peak_hours: string;
  suggested_discounts: string[];
}

export interface ProductUpsertRequest {
  name: string;
  description: string;
  price: number;
  original_price: number;
  stock: number;
  category_slug: string;
  icon: string;
  color_from: string;
  color_to: string;
  colors: string[];
  sizes: string[];
  specs: string;
  status: 'active' | 'inactive' | 'sold_out';
}

export type { Product, Order };
