import { RevenueChart } from '@/components/seller/RevenueChart';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';

const MOCK_REV = [
  { label: 'จ', value: 1200 },
  { label: 'อ', value: 1800 },
  { label: 'พ', value: 1500 },
  { label: 'พฤ', value: 2200 },
  { label: 'ศ', value: 2800 },
  { label: 'ส', value: 3100 },
  { label: 'อา', value: 2450 },
];

const MOCK_ORDERS = [
  { id: '#10042', product: 'iPhone 15 Pro Max', customer: 'สมชาย ว.', total: 45900, status: 'paid' },
  { id: '#10041', product: 'MacBook Air M3', customer: 'นิดา ก.', total: 41900, status: 'shipping' },
  { id: '#10040', product: 'Dyson V15', customer: 'มาลี ส.', total: 18900, status: 'delivered' },
];

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="รายได้วันนี้" value="2,450 ₭" delta="+12%" deltaPositive />
        <StatCard label="คำสั่งซื้อใหม่" value="8" delta="3 รอชำระ" />
        <StatCard label="สินค้าขายดี" value="iPhone 15" />
        <StatCard label="Rating เฉลี่ย" value="⭐ 4.8" />
      </div>

      <RevenueChart data={MOCK_REV} />

      <section className="rounded-2xl border border-ink-200 bg-white p-5">
        <h3 className="mb-4 text-h4 font-bold">คำสั่งซื้อล่าสุด</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase text-ink-500">
                <th className="pb-2 pr-4">เลขที่</th>
                <th className="pb-2 pr-4">สินค้า</th>
                <th className="pb-2 pr-4">ลูกค้า</th>
                <th className="pb-2 pr-4">ราคา</th>
                <th className="pb-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((o) => (
                <tr key={o.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4 font-semibold">{o.id}</td>
                  <td className="py-3 pr-4">{o.product}</td>
                  <td className="py-3 pr-4 text-ink-500">{o.customer}</td>
                  <td className="py-3 pr-4 font-semibold text-[color:var(--c-primary)]">
                    {o.total.toLocaleString()} ₭
                  </td>
                  <td className="py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AIInsightsCard
        title="AI วิเคราะห์ร้านของคุณ"
        items={[
          { label: 'สินค้าที่ควรเพิ่ม stock', value: 'iPhone Case (เหลือ 2 ชิ้น)' },
          { label: 'ราคาที่แนะนำ', value: 'ลด 10% เพื่อเพิ่มยอดขาย 40%' },
          { label: 'เวลาที่ลูกค้า active มากสุด', value: '18:00 – 21:00' },
        ]}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaPositive,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="mt-1 text-h3 font-extrabold text-ink-900">{value}</p>
      {delta ? (
        <p className={`mt-1 text-xs font-semibold ${deltaPositive ? 'text-success' : 'text-ink-500'}`}>
          {delta}
        </p>
      ) : null}
    </div>
  );
}
