import { useNavigate } from 'react-router';
import { Container } from './Container';
import { SectionTitle } from './SectionTitle';
import type { Category } from '@/types/product.types';

export function PopularCategories({ categories }: { categories: Category[] }) {
  const nav = useNavigate();
  const items = categories.filter((c) => c.slug !== 'all');
  return (
    <section className="py-10">
      <Container>
        <SectionTitle title="หมวดหมู่ยอดนิยม" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {items.map((c) => (
            <button
              key={c.id}
              onClick={() => nav(`/search?category=${c.slug}`)}
              className="group flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--c-primary)] hover:shadow-hover"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-semibold text-ink-900">{c.name}</span>
              <span className="text-[11px] text-ink-500">{c.count.toLocaleString()} รายการ</span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
