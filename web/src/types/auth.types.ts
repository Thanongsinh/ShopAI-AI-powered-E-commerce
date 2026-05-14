export interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar: string;
  phone: string;
  is_seller: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
