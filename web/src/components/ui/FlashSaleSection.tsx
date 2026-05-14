import { useEffect, useState } from 'react';
import { Container } from './Container';
import { ProductScrollRow } from '@/components/product/ProductGrid';
import type { Product } from '@/types/product.types';

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

export function FlashSaleSection({ products }: { products: Product[] }) {
  // End in ~6h from page load — fixed for the prototype demo
  const [end] = useState(() => Date.now() + 6 * 3600 * 1000);
  const { h, m, s } = useCountdown(end);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="py-10">
      <Container>
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-white"
          style={{ background: 'linear-gradient(90deg,#EF4444 0%,#F97316 100%)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <p className="text-h4 font-extrabold">Flash Sale</p>
              <p className="text-xs opacity-90">ดีลพิเศษ จำกัดเวลา</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="rounded-md bg-white/25 px-2.5 py-1 text-lg font-bold">{pad(h)}</span>
            <span className="text-lg font-bold">:</span>
            <span className="rounded-md bg-white/25 px-2.5 py-1 text-lg font-bold">{pad(m)}</span>
            <span className="text-lg font-bold">:</span>
            <span className="rounded-md bg-white/25 px-2.5 py-1 text-lg font-bold">{pad(s)}</span>
          </div>
        </div>
        <ProductScrollRow products={products} />
      </Container>
    </section>
  );
}
