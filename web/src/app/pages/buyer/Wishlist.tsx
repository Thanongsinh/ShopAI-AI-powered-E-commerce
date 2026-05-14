import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/store/cart.store';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function Wishlist() {
  const wish = useCart((s) => s.wishlist);
  const products = useProducts({ limit: 100 });

  const list = (products.data?.items as any[] | undefined)?.filter((p) =>
    wish.includes(p.id),
  ) ?? [];

  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">รายการที่บันทึก</h2>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <p className="mb-3 text-6xl">♡</p>
          <p className="mb-1 text-h4 font-bold">ยังไม่มีสินค้าใน Wishlist</p>
          <p className="text-sm text-ink-500">กดรูปหัวใจในการ์ดสินค้าเพื่อบันทึก</p>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
