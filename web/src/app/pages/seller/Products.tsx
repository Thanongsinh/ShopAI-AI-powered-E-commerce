import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/Badge';
import { useDeleteProduct, useSellerProducts } from '@/hooks/useSeller';
import { fmtKip } from '@/lib/format';

export default function SellerProducts() {
  const list = useSellerProducts();
  const del = useDeleteProduct();
  const [confirming, setConfirming] = useState<number | null>(null);
  const items = list.data ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h2 font-bold">จัดการสินค้า</h2>
        <Link
          to="/seller/products/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[color:var(--c-primary)] px-4 text-sm font-semibold text-white hover:bg-[color:var(--c-primary-dark)]"
        >
          ✚ เพิ่มสินค้าใหม่
        </Link>
      </div>

      {list.isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <p className="mb-3 text-6xl">📦</p>
          <p className="mb-1 text-h4 font-bold">ยังไม่มีสินค้า</p>
          <p className="mb-6 text-sm text-ink-500">เริ่มต้นด้วยการเพิ่มสินค้าใหม่</p>
          <Link
            to="/seller/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[color:var(--c-primary)] px-4 text-sm font-semibold text-white"
          >
            ✚ เพิ่มสินค้าใหม่
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3 text-left">สินค้า</th>
                <th className="px-4 py-3 text-right">ราคา</th>
                <th className="px-4 py-3 text-right">สต็อก</th>
                <th className="px-4 py-3 text-right">ยอดขาย</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-ink-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md text-xl"
                        style={{
                          background: `linear-gradient(135deg,${p.color_from},${p.color_to})`,
                        }}
                      >
                        {p.icon}
                      </div>
                      <span className="line-clamp-1 max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{fmtKip(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-right">{p.sold.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge
                      type={
                        p.status === 'active'
                          ? 'success'
                          : p.status === 'sold_out'
                            ? 'out'
                            : 'cancelled'
                      }
                    >
                      {p.status === 'active'
                        ? 'วางขาย'
                        : p.status === 'sold_out'
                          ? 'หมด'
                          : 'หยุดขาย'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/seller/products/${p.id}/edit`}
                        className="text-xs font-semibold text-[color:var(--c-primary)] hover:underline"
                      >
                        แก้ไข
                      </Link>
                      {confirming === p.id ? (
                        <>
                          <button
                            onClick={() =>
                              del.mutate(p.id, { onSettled: () => setConfirming(null) })
                            }
                            className="text-xs font-semibold text-danger hover:underline"
                          >
                            ยืนยันลบ
                          </button>
                          <button
                            onClick={() => setConfirming(null)}
                            className="text-xs text-ink-500 hover:underline"
                          >
                            ยกเลิก
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirming(p.id)}
                          className="text-xs font-semibold text-danger hover:underline"
                        >
                          ลบ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
