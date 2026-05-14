export interface Product {
  id: number;
  shop_id: number;
  category_slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  stock: number;
  images: string[] | null;
  colors: string[] | null;
  sizes: string[] | null;
  specs: string; // JSON-encoded [[key,value]]
  icon: string;
  color_from: string;
  color_to: string;
  status: 'active' | 'inactive' | 'sold_out';
  sold: number;
  views: number;
  rating: number;
  reviews: number;
  is_ai_recommended: boolean;
  is_new: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: number;
  product_id: number;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  has_img: boolean;
  created_at: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
}
