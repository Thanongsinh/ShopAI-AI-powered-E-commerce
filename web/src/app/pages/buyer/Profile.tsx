import { useCart } from '@/store/cart.store';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';

export default function Profile() {
  const lines = useCart((s) => s.lines);
  const wish = useCart((s) => s.wishlist);
  const totalSpend = lines.reduce((a, l) => a + l.product.price * l.qty, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="mb-4 text-h2 font-bold">ภาพรวมบัญชี</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="คำสั่งซื้อ" value="24" />
          <Stat label="ใช้จ่ายทั้งหมด" value={`${totalSpend.toLocaleString()} ₭`} />
          <Stat label="Wishlist" value={String(wish.length)} />
          <Stat label="คะแนนสะสม" value="1,245 pts" />
        </div>
      </section>

      <AIInsightsCard
        title="AI วิเคราะห์การช้อปของคุณ"
        items={[
          { label: 'หมวดที่คุณชอบ', value: 'อิเล็กทรอนิกส์ 60% · แฟชั่น 25%' },
          { label: 'ช่วงราคาที่ซื้อบ่อย', value: '500 – 2,000 ₭' },
          { label: 'สินค้าที่คุณอาจต้องการเติม', value: 'Laneige Lip Mask, SK-II Essence' },
        ]}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-50 p-4">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="mt-1 text-h3 font-bold text-ink-900">{value}</p>
    </div>
  );
}
