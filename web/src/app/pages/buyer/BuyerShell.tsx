import { NavLink, Outlet } from 'react-router';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/buyer/profile', label: 'ข้อมูลส่วนตัว', icon: '👤' },
  { to: '/buyer/orders', label: 'คำสั่งซื้อ', icon: '📦' },
  { to: '/buyer/wishlist', label: 'Wishlist', icon: '♡' },
];

export default function BuyerShell() {
  return (
    <Container style={{ padding: '32px 24px' }}>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-ink-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white"
              style={{ background: 'linear-gradient(135deg,var(--c-primary),var(--c-ai))' }}
            >
              A
            </div>
            <div>
              <p className="text-sm font-bold">คุณ</p>
              <p className="text-xs text-ink-500">customer@shopai.dev</p>
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
