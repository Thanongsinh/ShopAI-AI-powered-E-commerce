import type { Product } from '@/types/product.types';

interface Props {
  product: Pick<Product, 'color_from' | 'color_to' | 'icon' | 'category_slug'>;
  height?: number | string;
  category?: string;
}

export function ProductImage({ product, height = '100%', category }: Props) {
  return (
    <div
      className="relative flex w-full flex-col items-center justify-center gap-1.5 overflow-hidden"
      style={{
        height,
        background: `linear-gradient(135deg, ${product.color_from}, ${product.color_to})`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 0,transparent 50%)',
          backgroundSize: '10px 10px',
        }}
      />
      <span className="relative" style={{ fontSize: height === '100%' ? 52 : 28 }}>
        {product.icon}
      </span>
      <span
        className="relative font-mono text-[9px] uppercase tracking-widest text-white/40"
      >
        {category ?? product.category_slug}
      </span>
    </div>
  );
}
