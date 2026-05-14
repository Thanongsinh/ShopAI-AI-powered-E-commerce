import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '@/store/cart.store';
import { cn } from '@/lib/cn';

export function Navbar() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const cartCount = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const wishCount = useCart((s) => s.wishlist.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[1000] flex h-16 items-center gap-4 border-b border-ink-200 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <Link to="/" className="flex-shrink-0 select-none">
        <span className="text-[22px] font-extrabold tracking-tight">
          Shop<span className="text-[color:var(--c-ai)]">✨</span>AI
        </span>
      </Link>

      <form
        onSubmit={submit}
        className={cn(
          'relative hidden flex-1 items-center sm:flex',
          'max-w-[480px]',
        )}
      >
        <span className="pointer-events-none absolute left-3.5 text-base text-ink-400">🔍</span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="ค้นหาสินค้า..."
          className={cn(
            'h-10 w-full rounded-full border-[1.5px] pl-10 pr-4 text-sm outline-none transition-all',
            focused
              ? 'border-[color:var(--c-primary)] shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
              : 'border-ink-300',
          )}
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link
          to="/buyer/wishlist"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-ink-100"
          aria-label="Wishlist"
        >
          ♡
          {wishCount > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
              {wishCount}
            </span>
          ) : null}
        </Link>

        <Link
          to="/cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-ink-100"
          aria-label="Cart"
        >
          🛍️
          {cartCount > 0 ? (
            <span className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-danger text-[11px] font-bold text-white">
              {cartCount}
            </span>
          ) : null}
        </Link>

        <Link
          to="/buyer/profile"
          aria-label="Account"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,var(--c-primary),var(--c-ai))' }}
        >
          A
        </Link>

        <Link
          to="/seller/dashboard"
          className="ml-1 hidden rounded-md bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-200 sm:inline"
        >
          🏪 ร้านค้า
        </Link>
      </div>
    </nav>
  );
}
