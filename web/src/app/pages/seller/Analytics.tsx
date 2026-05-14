import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { RevenueChart } from '@/components/seller/RevenueChart';
import { useSellerAnalytics, useSellerDashboard } from '@/hooks/useSeller';

export default function SellerAnalytics() {
  const dash = useSellerDashboard();
  const analytics = useSellerAnalytics();

  const chart = dash.data?.revenue_chart ?? [];
  const a = analytics.data;

  return (
    <div className="space-y-6">
      <h2 className="text-h2 font-bold">วิเคราะห์ร้านค้า</h2>

      {chart.length > 0 ? <RevenueChart data={chart} /> : null}

      <AIInsightsCard
        title="AI Insights"
        items={[
          {
            label: 'หมวดที่ขายดี',
            value: a?.top_categories?.length ? a.top_categories.join(', ') : '–',
          },
          { label: 'เวลาคนซื้อมากสุด', value: a?.peak_hours ?? '–' },
          { label: 'ช่วงราคาที่ลูกค้าซื้อบ่อย', value: a?.price_band ?? '–' },
          {
            label: 'สินค้า stock ต่ำ',
            value: a?.low_stock_alert?.length ? a.low_stock_alert.join(', ') : 'ไม่มี',
          },
          {
            label: 'คำแนะนำราคา',
            value: a?.suggested_discounts?.[0] ?? '–',
          },
        ]}
      />
    </div>
  );
}
