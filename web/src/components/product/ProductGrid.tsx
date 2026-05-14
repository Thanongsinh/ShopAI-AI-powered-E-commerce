import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product.types';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <div key={p.id} className="mx-auto w-full max-w-[260px]">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export function ProductScrollRow({ products, compact }: { products: Product[]; compact?: boolean }) {
  return (
    <div className="scroll-row flex gap-4 overflow-x-auto pb-2">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} compact={compact} />
      ))}
    </div>
  );
}
