import { Container } from './Container';
import { cn } from '@/lib/cn';
import type { Category } from '@/types/product.types';

interface Props {
  categories: Category[];
  active: string;
  onSelect: (slug: string) => void;
}

export function CategoryPills({ categories, active, onSelect }: Props) {
  return (
    <div className="border-b border-ink-200 bg-white">
      <Container>
        <div className="scroll-row flex gap-2 overflow-x-auto py-2.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.slug)}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] transition-colors',
                active === c.slug
                  ? 'bg-[color:var(--c-primary)] font-semibold text-white'
                  : 'bg-ink-100 font-medium text-ink-700 hover:bg-ink-200',
              )}
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
