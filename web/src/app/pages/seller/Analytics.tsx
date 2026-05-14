import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { RevenueChart } from '@/components/seller/RevenueChart';

export default function SellerAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-h2 font-bold">วิเคราะห์ร้านค้า</h2>

      <RevenueChart
        data={[
          { label: 'จ', value: 1200 },
          { label: 'อ', value: 1800 },
          { label: 'พ', value: 1500 },
          { label: 'พฤ', value: 2200 },
          { label: 'ศ', value: 2800 },
          { label: 'ส', value: 3100 },
          { label: 'อา', value: 2450 },
        ]}
      />

      <AIInsightsCard
        title="AI Insights"
        items={[
          { label: 'หมวดที่ขายดี', value: 'อิเล็กทรอนิกส์ 62%, ความงาม 21%' },
          { label: 'เวลาคนซื้อมากสุด', value: '18:00 – 21:00 (52% ของยอดขาย)' },
          { label: 'ลูกค้าซื้อซ้ำ', value: '34% — คุ้มค่ากับการลงทุนทำ loyalty' },
          { label: 'แนะนำให้เพิ่ม stock', value: 'Laneige Lip Mask, iPhone Case' },
        ]}
      />
    </div>
  );
}
