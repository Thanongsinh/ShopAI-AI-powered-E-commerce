import { useQueries } from '@tanstack/react-query';
import { useCart } from '@/store/cart.store';
import { productService } from '@/services/product.service';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/types/product.types';

export default function Wishlist() {
  const wish = useCart((s) => s.wishlist);

  const queries = useQueries({
    queries: wish.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => productService.get(id),
    })),
  });

  const list: Product[] = queries
    .map((q) => q.data)
    .filter((p): p is Product => !!p);

  const loading = queries.some((q) => q.isLoading);

  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">รายการที่บันทึก</h2>

      {wish.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <p className="mb-3 text-6xl">♡</p>
          <p className="mb-1 text-h4 font-bold">ยังไม่มีสินค้าใน Wishlist</p>
          <p className="text-sm text-ink-500">กดรูปหัวใจในการ์ดสินค้าเพื่อบันทึก</p>
        </div>
      ) : loading && list.length === 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: Math.min(wish.length, 4) }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
