import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { useOrders } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types/order.types';
import { fmtKip } from '@/lib/format';
import { cn } from '@/lib/cn';

type TabKey = 'all' | OrderStatus;

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'รอชำระ',
  paid: 'ชำระแล้ว',
  shipping: 'กำลังจัดส่ง',
  delivered: 'ส่งแล้ว',
  cancelled: 'ยกเลิก',
};

const STATUS_BADGE: Record<OrderStatus, React.ComponentProps<typeof Badge>['type']> = {
  pending: 'pending',
  paid: 'success',
  shipping: 'shipping',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch {
    return iso;
  }
}

export default function Orders() {
  const [tab, setTab] = useState<TabKey>('all');
  const query = useOrders();

  const filtered = useMemo<Order[]>(() => {
    const all = query.data ?? [];
    if (tab === 'all') return all;
    return all.filter((o) => o.status === tab);
  }, [query.data, tab]);

  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">คำสั่งซื้อของฉัน</h2>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-ink-200">
        {(
          [
            ['all', 'ทั้งหมด'],
            ['pending', 'รอชำระ'],
            ['paid', 'ชำระแล้ว'],
            ['shipping', 'กำลังจัดส่ง'],
            ['delivered', 'ส่งแล้ว'],
            ['cancelled', 'ยกเลิก'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k as TabKey)}
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

      {query.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-ink-100" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-sm text-danger">
          โหลดคำสั่งซื้อไม่สำเร็จ — ตรวจสอบการเข้าสู่ระบบและลองอีกครั้ง
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-12 text-center">
          <p className="mb-2 text-5xl">📦</p>
          <p className="text-h4 font-bold">ยังไม่มีคำสั่งซื้อ</p>
          <p className="text-sm text-ink-500">เริ่มช้อปแล้วกลับมาตรวจสอบรายการที่นี่</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items?.reduce((a, i) => a + i.qty, 0) ?? 0;
  const orderNo = `SO${String(order.id).padStart(8, '0')}`;
  const status = order.status;
  const reached = (target: OrderStatus): boolean => {
    const ladder: OrderStatus[] = ['pending', 'paid', 'shipping', 'delivered'];
    if (status === 'cancelled') return false;
    return ladder.indexOf(status) >= ladder.indexOf(target);
  };
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-ink-500">เลขที่ #{orderNo}</p>
          <p className="text-sm font-semibold text-ink-900">วันที่ {formatDate(order.created_at)}</p>
        </div>
        <Badge type={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</Badge>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <span className={reached('pending') ? 'text-success' : ''}>✓ สั่งแล้ว</span>
        <span>→</span>
        <span className={reached('paid') ? 'text-success' : ''}>
          {reached('paid') ? '✓' : '○'} ชำระแล้ว
        </span>
        <span>→</span>
        <span className={reached('shipping') ? 'text-success' : ''}>
          {reached('shipping') ? '✓' : '○'} กำลังจัดส่ง
        </span>
        <span>→</span>
        <span className={reached('delivered') ? 'text-success' : ''}>
          {reached('delivered') ? '✓' : '○'} ส่งแล้ว
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{itemCount} รายการ</p>
        <p className="font-bold text-[color:var(--c-primary)]">{fmtKip(order.total)}</p>
      </div>
    </div>
  );
}
