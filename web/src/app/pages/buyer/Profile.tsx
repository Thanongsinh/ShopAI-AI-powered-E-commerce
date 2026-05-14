import { useCart } from '@/store/cart.store';
import { useAuth } from '@/store/auth.store';
import { useOrders } from '@/hooks/useOrders';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { fmtKip } from '@/lib/format';

export default function Profile() {
  const wish = useCart((s) => s.wishlist);
  const user = useAuth((s) => s.user);
  const orders = useOrders();

  const orderList = orders.data ?? [];
  const totalSpend = orderList
    .filter((o) => o.status !== 'cancelled')
    .reduce((a, o) => a + o.total, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,var(--c-primary),var(--c-ai))' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <h2 className="text-h2 font-bold">{user?.name ?? 'บัญชีของคุณ'}</h2>
            <p className="text-sm text-ink-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="คำสั่งซื้อ" value={String(orderList.length)} />
          <Stat label="ใช้จ่ายทั้งหมด" value={fmtKip(totalSpend)} />
          <Stat label="Wishlist" value={String(wish.length)} />
          <Stat label="คะแนนสะสม" value={`${Math.floor(totalSpend / 10).toLocaleString()} pts`} />
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
