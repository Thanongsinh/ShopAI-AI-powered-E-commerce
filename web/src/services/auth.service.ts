import { api, setToken, unwrap } from './api';
import type { AuthResponse, User } from '@/types/auth.types';

export const authService = {
  async login(email: string, password: string) {
    const data = await unwrap<AuthResponse>(api.post('/auth/login', { email, password }));
    setToken(data.access_token);
    return data;
  },
  async register(input: { name: string; email: string; password: string; phone?: string }) {
    const data = await unwrap<AuthResponse>(api.post('/auth/register', input));
    setToken(data.access_token);
    return data;
  },
  profile: () => unwrap<User>(api.get('/buyer/profile')),
  logout: () => setToken(null),
};
