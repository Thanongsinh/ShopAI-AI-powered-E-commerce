import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './app/routes';
import { applyPalette, useTweaks } from './store/tweaks.store';
import { useAuth } from './store/auth.store';
import { useCart } from './store/cart.store';
import { productService } from './services/product.service';
import './app/theme.css';

// Hydrate palette before first paint
applyPalette(useTweaks.getState().primary);

// Refresh user profile if a token exists, and react to 401s globally
useAuth.getState().hydrate();
window.addEventListener('shopai:unauthorized', () => {
  useAuth.getState().logout();
});

// On login transition, push guest cart up then reload from server.
let prevAuthStatus = useAuth.getState().status;
useAuth.subscribe((s) => {
  if (s.status === prevAuthStatus) return;
  const wasUnauth = prevAuthStatus !== 'authenticated';
  prevAuthStatus = s.status;
  if (s.status === 'authenticated' && wasUnauth) {
    const cart = useCart.getState();
    cart
      .syncOnLogin()
      .then(() =>
        cart.loadFromBackend((id) => productService.get(id).catch(() => null)),
      );
  }
});

// Register Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.warn('[ShopAI SW]', err));
  });
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
