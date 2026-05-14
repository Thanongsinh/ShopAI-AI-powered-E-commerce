import { NavLink, Outlet } from 'react-router';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/seller/dashboard', label: 'ภาพรวม', icon: '📊' },
  { to: '/seller/products', label: 'สินค้า', icon: '📦' },
  { to: '/seller/orders', label: 'คำสั่งซื้อ', icon: '🧾' },
  { to: '/seller/analytics', label: 'วิเคราะห์', icon: '✨' },
];

export default function SellerShell() {
  return (
    <Container style={{ padding: '32px 24px' }}>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-ink-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <span className="text-3xl">🏪</span>
            <div>
              <p className="text-sm font-bold">ShopAI Official</p>
              <p className="text-xs text-ink-500">⭐ 4.8 · ขาย 25,000+</p>
            </div>
          </div>
          <nav className="flex flex-col">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
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
