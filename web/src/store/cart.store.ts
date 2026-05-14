import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product.types';
import { cartService } from '@/services/cart.service';
import { wishlistService } from '@/services/wishlist.service';
import { useAuth } from './auth.store';

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

  /** Push guest cart/wishlist to backend after login. */
  syncOnLogin: () => Promise<void>;
  /** Reload cart+wishlist from backend; productLookup resolves IDs we don't have a snapshot for. */
  loadFromBackend: (productLookup: (id: number) => Promise<Product | null>) => Promise<void>;
}

const isAuthed = () => useAuth.getState().status === 'authenticated';

// Fire-and-forget backend sync; UI never blocks on it.
const bgUpsert = (productId: number, qty: number) => {
  if (!isAuthed()) return;
  cartService.upsert(productId, qty).catch(() => {});
};
const bgRemove = (productId: number) => {
  if (!isAuthed()) return;
  cartService.remove(productId).catch(() => {});
};
const bgWishAdd = (productId: number) => {
  if (!isAuthed()) return;
  wishlistService.add(productId).catch(() => {});
};
const bgWishRemove = (productId: number) => {
  if (!isAuthed()) return;
  wishlistService.remove(productId).catch(() => {});
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      wishlist: [],

      add(p, qty = 1) {
        set((s) => {
          const idx = s.lines.findIndex((l) => l.product.id === p.id);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            bgUpsert(p.id, next[idx].qty);
            return { lines: next };
          }
          bgUpsert(p.id, qty);
          return { lines: [...s.lines, { product: p, qty }] };
        });
      },

      remove(id) {
        set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) }));
        bgRemove(id);
      },

      setQty(id, qty) {
        const next = Math.max(1, qty);
        set((s) => ({
          lines: s.lines.map((l) => (l.product.id === id ? { ...l, qty: next } : l)),
        }));
        bgUpsert(id, next);
      },

      clear() {
        // Server-side cart is cleared by /buyer/cart/checkout after order creation.
        set({ lines: [] });
      },

      toggleWishlist(id) {
        set((s) => {
          const has = s.wishlist.includes(id);
          if (has) bgWishRemove(id);
          else bgWishAdd(id);
          return {
            wishlist: has ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
          };
        });
      },

      count: () => get().lines.reduce((s, l) => s + l.qty, 0),
      total: () => get().lines.reduce((s, l) => s + l.product.price * l.qty, 0),

      async syncOnLogin() {
        if (!isAuthed()) return;
        const { lines, wishlist } = get();
        await Promise.allSettled([
          ...lines.map((l) => cartService.upsert(l.product.id, l.qty)),
          ...wishlist.map((id) => wishlistService.add(id)),
        ]);
      },

      async loadFromBackend(productLookup) {
        if (!isAuthed()) return;
        try {
          const [cart, wish] = await Promise.all([
            cartService.list(),
            wishlistService.list(),
          ]);
          const guestLines = get().lines;
          const resolved: CartLine[] = (
            await Promise.all(
              cart.map(async (row) => {
                if (row.product) return { product: row.product, qty: row.qty };
                const guest = guestLines.find((l) => l.product.id === row.product_id);
                if (guest) return { product: guest.product, qty: row.qty };
                const p = await productLookup(row.product_id);
                return p ? { product: p, qty: row.qty } : null;
              }),
            )
          ).filter((x): x is CartLine => x !== null);

          set({
            lines: resolved,
            wishlist: wish.map((w) => w.product_id),
          });
        } catch {
          /* keep local state on failure */
        }
      },
    }),
    { name: 'shopai.cart' },
  ),
);
