import { Navigate, NavLink, Outlet } from 'react-router';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/store/auth.store';
import { useSellerShop } from '@/hooks/useSeller';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/seller/dashboard', label: 'ภาพรวม', icon: '📊' },
  { to: '/seller/products', label: 'สินค้า', icon: '📦' },
  { to: '/seller/orders', label: 'คำสั่งซื้อ', icon: '🧾' },
  { to: '/seller/analytics', label: 'วิเคราะห์', icon: '✨' },
];

export default function SellerShell() {
  const user = useAuth((s) => s.user);
  const isSeller = user?.role === 'seller' || user?.role === 'admin' || user?.is_seller;
  const shop = useSellerShop();

  if (!isSeller) {
    return <Navigate to="/buyer/profile" replace />;
  }

  return (
    <Container style={{ padding: '32px 24px' }}>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-ink-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <span className="text-3xl">{shop.data?.logo ?? '🏪'}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{shop.data?.name ?? 'ร้านของฉัน'}</p>
              <p className="truncate text-xs text-ink-500">
                {shop.data?.rating ? `⭐ ${shop.data.rating}` : '⭐ –'}
                {shop.data?.total_sales
                  ? ` · ขาย ${shop.data.total_sales.toLocaleString()}+`
                  : ''}
              </p>
            </div>
          </div>
          <nav className="flex flex-col">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/seller/products'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-[color:var(--c-primary-light)] font-semibold text-[color:var(--c-primary-dark)]'
                      : 'text-ink-700 hover:bg-ink-100',
                  )
                }
              >
                <span>{t.icon}</span>
                {t.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
