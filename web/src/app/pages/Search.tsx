import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Container } from '@/components/ui/Container';
import { CategoryPills } from '@/components/ui/CategoryPills';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useCategories, useProducts } from '@/hooks/useProducts';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const cats = useCategories();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const sort = params.get('sort') ?? 'popular';
  const [input, setInput] = useState(q);
  const nav = useNavigate();

  useEffect(() => setInput(q), [q]);

  const list = useProducts({
    q,
    category: category === 'all' ? undefined : category,
    sort,
    limit: 24,
  });

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value == null || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParam('q', input);
  };

  return (
    <div>
      <CategoryPills
        categories={cats.data ?? []}
        active={category}
        onSelect={(slug) => setParam('category', slug === 'all' ? null : slug)}
      />

      <Container style={{ padding: '24px' }}>
        <form onSubmit={onSubmit} className="mb-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="h-11 flex-1 rounded-md border border-ink-300 px-4 outline-none focus:border-[color:var(--c-primary)]"
          />
          <button
            type="submit"
            className="h-11 rounded-md bg-[color:var(--c-primary)] px-6 font-semibold text-white"
          >
            ค้นหา
          </button>
        </form>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            พบ {list.data?.pagination.total ?? 0} รายการ
          </p>
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="rounded-md border border-ink-300 px-3 py-2 text-sm"
          >
            <option value="popular">ยอดนิยม</option>
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price_asc">ราคา ต่ำ → สูง</option>
            <option value="price_desc">ราคา สูง → ต่ำ</option>
            <option value="rating">คะแนนสูงสุด</option>
          </select>
        </div>

        {list.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : (
          <ProductGrid products={(list.data?.items as any) ?? []} />
        )}

        {list.data && list.data.items.length === 0 ? (
          <div className="py-16 text-center text-ink-500">
            <p className="mb-3 text-5xl">🔍</p>
            <p>ไม่พบสินค้าที่ตรงกับคำค้น</p>
            <button
              onClick={() => nav('/')}
              className="mt-4 text-sm font-semibold text-[color:var(--c-primary)]"
            >
              กลับสู่หน้าแรก →
            </button>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
