import { useProducts } from '@/hooks/useProducts';
import { Btn } from '@/components/ui/Btn';
import { Badge } from '@/components/ui/Badge';

export default function SellerProducts() {
  const list = useProducts({ limit: 50 });
  const items = (list.data?.items as any[]) ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h2 font-bold">จัดการสินค้า</h2>
        <Btn>✚ เพิ่มสินค้าใหม่</Btn>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3 text-left">สินค้า</th>
              <th className="px-4 py-3 text-right">ราคา</th>
              <th className="px-4 py-3 text-right">สต็อก</th>
              <th className="px-4 py-3 text-right">ยอดขาย</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-ink-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md text-xl"
                      style={{ background: `linear-gradient(135deg,${p.color_from},${p.color_to})` }}
                    >
                      {p.icon}
                    </div>
                    <span className="line-clamp-1 max-w-xs">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{p.price.toLocaleString()} ₭</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-right">{p.sold.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge type={p.status === 'active' ? 'success' : p.status === 'sold_out' ? 'out' : 'cancelled'}>
                    {p.status === 'active' ? 'วางขาย' : p.status === 'sold_out' ? 'หมด' : 'หยุดขาย'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-[color:var(--c-primary)] hover:underline">
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
