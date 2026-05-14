import { useLocation, useNavigate } from 'react-router';
import { useCart } from '@/store/cart.store';
import { cn } from '@/lib/cn';

const TABS = [
  { id: 'home', icon: '🏠', label: 'หน้าแรก', path: '/' },
  { id: 'search', icon: '🔍', label: 'สำรวจ', path: '/search' },
  { id: 'cart', icon: '🛍️', label: 'ตะกร้า', path: '/cart' },
  { id: 'wishlist', icon: '♡', label: 'บัญชี', path: '/buyer/wishlist' },
  { id: 'seller', icon: '🏪', label: 'ร้านค้า', path: '/seller/dashboard' },
] as const;

export function MobileBottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const cartCount = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const wishCount = useCart((s) => s.wishlist.length);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[998] flex border-t border-ink-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map((t) => {
        const active = isActive(t.path);
        const badge =
          t.id === 'cart' ? cartCount : t.id === 'wishlist' ? wishCount : 0;
        return (
          <button
            key={t.id}
            onClick={() => nav(t.path)}
            className={cn(
              'relative flex h-[60px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors',
              active ? 'text-[color:var(--c-primary)]' : 'text-ink-400',
            )}
          >
            <span className="text-[22px] leading-none">{t.icon}</span>
            <span className={cn('text-[10px]', active ? 'font-bold' : 'font-normal')}>
              {t.label}
            </span>
            {badge > 0 ? (
              <span className="absolute left-[55%] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                {badge > 9 ? '9+' : badge}
              </span>
            ) : null}
            {active ? (
              <span
                className="absolute left-1/2 top-0 h-[3px] w-6 -translate-x-1/2 rounded-b bg-[color:var(--c-primary)]"
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
