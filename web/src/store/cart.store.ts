import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product.types';

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  wishlist: number[];
  add: (p: Product, qty?: number) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clear: () => void;
  toggleWishlist: (productId: number) => void;
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      wishlist: [],

      add: (p, qty = 1) =>
        set((s) => {
          const idx = s.lines.findIndex((l) => l.product.id === p.id);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            return { lines: next };
          }
          return { lines: [...s.lines, { product: p, qty }] };
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, qty) } : l)),
        })),

      clear: () => set({ lines: [] }),

      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),

      count: () => get().lines.reduce((s, l) => s + l.qty, 0),
      total: () => get().lines.reduce((s, l) => s + l.product.price * l.qty, 0),
    }),
    { name: 'shopai.cart' },
  ),
);
