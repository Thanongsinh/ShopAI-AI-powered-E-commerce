import { Btn } from '@/components/ui/Btn';
import { Badge } from '@/components/ui/Badge';

const MOCK = [
  { id: '#10042', product: 'iPhone 15 Pro Max', customer: 'สมชาย ว.', total: 45900, status: 'pending' as const },
  { id: '#10041', product: 'MacBook Air M3', customer: 'นิดา ก.', total: 41900, status: 'shipping' as const },
  { id: '#10040', product: 'Dyson V15', customer: 'มาลี ส.', total: 18900, status: 'delivered' as const },
  { id: '#10039', product: 'Sony WH-1000XM5', customer: 'ธนากร บ.', total: 11900, status: 'pending' as const },
];

export default function SellerOrders() {
  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">คำสั่งซื้อทั้งหมด</h2>
      <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3 text-left">เลขที่</th>
              <th className="px-4 py-3 text-left">สินค้า</th>
              <th className="px-4 py-3 text-left">ลูกค้า</th>
              <th className="px-4 py-3 text-right">ราคา</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK.map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">{o.product}</td>
                <td className="px-4 py-3 text-ink-500">{o.customer}</td>
                <td className="px-4 py-3 text-right font-semibold text-[color:var(--c-primary)]">
                  {o.total.toLocaleString()} ₭
                </td>
                <td className="px-4 py-3">
                  <Badge type={o.status}>
                    {o.status === 'pending' ? 'รอชำระ' : o.status === 'shipping' ? 'กำลังจัดส่ง' : 'ส่งแล้ว'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {o.status === 'pending' ? (
                    <Btn size="sm">จัดส่ง</Btn>
                  ) : (
                    <button className="text-xs font-semibold text-[color:var(--c-primary)] hover:underline">
                      ดู
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
