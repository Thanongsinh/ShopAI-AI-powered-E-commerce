import { Btn } from '@/components/ui/Btn';
import { Badge } from '@/components/ui/Badge';
import { useSellerOrders, useUpdateOrderStatus } from '@/hooks/useSeller';
import type { Order, OrderStatus } from '@/types/order.types';
import { fmtKip } from '@/lib/format';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'paid',
  paid: 'shipping',
  shipping: 'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'รับชำระ',
  paid: 'จัดส่ง',
  shipping: 'ทำเครื่องหมายส่งแล้ว',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'รอชำระ',
  paid: 'ชำระแล้ว',
  shipping: 'กำลังจัดส่ง',
  delivered: 'ส่งแล้ว',
  cancelled: 'ยกเลิก',
};

export default function SellerOrders() {
  const orders = useSellerOrders();
  const update = useUpdateOrderStatus();
  const items = orders.data ?? [];

  return (
    <div>
      <h2 className="mb-4 text-h2 font-bold">คำสั่งซื้อทั้งหมด</h2>

      {orders.isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-12 text-center">
          <p className="mb-2 text-5xl">🧾</p>
          <p className="text-h4 font-bold">ยังไม่มีคำสั่งซื้อ</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3 text-left">เลขที่</th>
                <th className="px-4 py-3 text-left">รายการ</th>
                <th className="px-4 py-3 text-right">ราคา</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <Row key={o.id} order={o} onAdvance={(status) => update.mutate({ id: o.id, status })} pending={update.isPending} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({
  order,
  onAdvance,
  pending,
}: {
  order: Order;
  onAdvance: (status: OrderStatus) => void;
  pending: boolean;
}) {
  const next = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];
  return (
    <tr className="border-t border-ink-100">
      <td className="px-4 py-3 font-semibold">#{String(order.id).padStart(8, '0')}</td>
      <td className="px-4 py-3 text-ink-500">{order.items?.length ?? 0} รายการ</td>
      <td className="px-4 py-3 text-right font-semibold text-[color:var(--c-primary)]">
        {fmtKip(order.total)}
      </td>
      <td className="px-4 py-3">
        <Badge
          type={
            order.status === 'pending'
              ? 'pending'
              : order.status === 'shipping'
                ? 'shipping'
                : order.status === 'delivered'
                  ? 'delivered'
                  : order.status === 'cancelled'
                    ? 'cancelled'
                    : 'success'
          }
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        {next && nextLabel ? (
          <Btn size="sm" disabled={pending} onClick={() => onAdvance(next)}>
            {nextLabel}
          </Btn>
        ) : (
          <span className="text-xs text-ink-400">เสร็จสิ้น</span>
        )}
      </td>
    </tr>
  );
}
