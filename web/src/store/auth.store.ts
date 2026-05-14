import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { setToken } from '@/services/api';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'idle',
      error: null,

      async hydrate() {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('shopai.token') : null;
        if (!token) {
          set({ status: 'unauthenticated' });
          return;
        }
        if (get().status === 'loading') return;
        set({ status: 'loading' });
        try {
          const u = await authService.profile();
          set({ user: u, status: 'authenticated', error: null });
        } catch {
          setToken(null);
          set({ user: null, status: 'unauthenticated' });
        }
      },

      async login(email, password) {
        set({ status: 'loading', error: null });
        try {
          const { user } = await authService.login(email, password);
          set({ user, status: 'authenticated', error: null });
        } catch (e: any) {
          const msg = e?.response?.data?.error ?? 'login failed';
          set({ status: 'unauthenticated', error: msg });
          throw new Error(msg);
        }
      },

      async register(input) {
        set({ status: 'loading', error: null });
        try {
          const { user } = await authService.register(input);
          set({ user, status: 'authenticated', error: null });
        } catch (e: any) {
          const msg = e?.response?.data?.error ?? 'register failed';
          set({ status: 'unauthenticated', error: msg });
          throw new Error(msg);
        }
      },

      logout() {
        authService.logout();
        set({ user: null, status: 'unauthenticated', error: null });
      },
    }),
    {
      name: 'shopai.auth',
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
