import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

type Status = 'all' | 'pending' | 'shipping' | 'delivered' | 'cancelled';
type OrderStatus = Exclude<Status, 'all'>;

interface MockOrder {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
}

const MOCK_ORDERS: MockOrder[] = [
  { id: 'SO20260514001', date: '14 พ.ค. 69', status: 'shipping', total: 45900, items: 1 },
  { id: 'SO20260510002', date: '10 พ.ค. 69', status: 'delivered', total: 4990, items: 2 },
  { id: 'SO20260502003', date: '2 พ.ค. 69', status: 'cancelled', total: 11900, items: 1 },
  { id: 'SO20260428004', date: '28 เม.ย. 69', status: 'pending', total: 590, items: 1 },
];

export default function Orders() {
  const [tab, setTab] = useState<Status>('all');
  const orders = tab === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === tab);

  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">คำสั่งซื้อของฉัน</h2>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-ink-200">
        {(
          [
            ['all', 'ทั้งหมด'],
            ['pending', 'รอชำระ'],
            ['shipping', 'กำลังจัดส่ง'],
            ['delivered', 'ส่งแล้ว'],
            ['cancelled', 'ยกเลิก'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              'whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold',
              tab === k
                ? 'border-[color:var(--c-primary)] text-[color:var(--c-primary)]'
                : 'border-transparent text-ink-500 hover:text-ink-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-ink-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-ink-500">เลขที่ #{o.id}</p>
                <p className="text-sm font-semibold text-ink-900">วันที่ {o.date}</p>
              </div>
              <Badge type={o.status === 'shipping' ? 'shipping' : o.status === 'delivered' ? 'delivered' : o.status === 'pending' ? 'pending' : 'cancelled'}>
                {o.status === 'shipping' ? 'กำลังจัดส่ง' : o.status === 'delivered' ? 'ส่งแล้ว' : o.status === 'pending' ? 'รอชำระ' : 'ยกเลิก'}
              </Badge>
            </div>
            <div className="mb-3 flex items-center gap-2 text-xs text-ink-500">
              <span className="text-success">✓ สั่งแล้ว</span>
              <span>→</span>
              <span className={o.status !== 'pending' ? 'text-success' : ''}>
                {o.status === 'pending' ? '○' : '✓'} ชำระแล้ว
              </span>
              <span>→</span>
              <span className={o.status === 'shipping' || o.status === 'delivered' ? 'text-success' : ''}>
                {o.status === 'shipping' || o.status === 'delivered' ? '✓' : '○'} กำลังจัดส่ง
              </span>
              <span>→</span>
              <span className={o.status === 'delivered' ? 'text-success' : ''}>
                {o.status === 'delivered' ? '✓' : '○'} ส่งแล้ว
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-500">{o.items} รายการ</p>
              <p className="font-bold text-[color:var(--c-primary)]">{o.total.toLocaleString()} ₭</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
