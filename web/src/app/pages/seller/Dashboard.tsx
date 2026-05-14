import { RevenueChart } from '@/components/seller/RevenueChart';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { useSellerAnalytics, useSellerDashboard } from '@/hooks/useSeller';
import { fmtKip } from '@/lib/format';
import { cn } from '@/lib/cn';

export default function SellerDashboard() {
  const dash = useSellerDashboard();
  const analytics = useSellerAnalytics();

  const data = dash.data;
  const revenue = data?.revenue ?? 0;
  const ordersCount = data?.orders_count ?? 0;
  const productsCount = data?.products ?? 0;
  const chart = data?.revenue_chart ?? [];
  const recentOrders = data?.recent_orders ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="รายได้รวม" value={fmtKip(revenue)} loading={dash.isLoading} />
        <StatCard label="คำสั่งซื้อ" value={String(ordersCount)} loading={dash.isLoading} />
        <StatCard label="สินค้า" value={String(productsCount)} loading={dash.isLoading} />
        <StatCard
          label="Rating เฉลี่ย"
          value={data?.shop?.rating ? `⭐ ${data.shop.rating}` : '⭐ –'}
          loading={dash.isLoading}
        />
      </div>

      {chart.length > 0 ? <RevenueChart data={chart} /> : null}

      <section className="rounded-2xl border border-ink-200 bg-white p-5">
        <h3 className="mb-4 text-h4 font-bold">คำสั่งซื้อล่าสุด</h3>
        {dash.isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-ink-100" />
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-ink-500">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase text-ink-500">
                  <th className="pb-2 pr-4">เลขที่</th>
                  <th className="pb-2 pr-4">รายการ</th>
                  <th className="pb-2 pr-4">รวม</th>
                  <th className="pb-2">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-ink-100 last:border-0">
                    <td className="py-3 pr-4 font-semibold">
                      #{String(o.id).padStart(8, '0')}
                    </td>
                    <td className="py-3 pr-4 text-ink-500">{o.items?.length ?? 0} รายการ</td>
                    <td className="py-3 pr-4 font-semibold text-[color:var(--c-primary)]">
                      {fmtKip(o.total)}
                    </td>
                    <td className="py-3 capitalize">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AIInsightsCard
        title="AI วิเคราะห์ร้านของคุณ"
        items={[
          {
            label: 'สินค้าที่ควรเพิ่ม stock',
            value: analytics.data?.low_stock_alert?.join(', ') || 'ไม่มี',
          },
          { label: 'ราคาที่แนะนำ', value: analytics.data?.suggested_discounts?.[0] ?? '–' },
          { label: 'เวลาที่ลูกค้า active มากสุด', value: analytics.data?.peak_hours ?? '–' },
        ]}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p
        className={cn(
          'mt-1 text-h3 font-extrabold text-ink-900',
          loading && 'animate-pulse text-ink-300',
        )}
      >
        {loading ? '...' : value}
      </p>
    </div>
  );
}
