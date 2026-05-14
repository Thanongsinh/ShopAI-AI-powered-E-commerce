import { useNavigate } from 'react-router';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CartItemRow } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { RecommendSection } from '@/components/ai/RecommendSection';
import { useCart } from '@/store/cart.store';
import { useRecommendations } from '@/hooks/useProducts';
import { Btn } from '@/components/ui/Btn';

export default function Cart() {
  const nav = useNavigate();
  const lines = useCart((s) => s.lines);
  const recs = useRecommendations();

  return (
    <Container style={{ padding: '32px 24px' }}>
      <SectionTitle title={`ตะกร้าสินค้า (${lines.length} รายการ)`} />

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <p className="mb-3 text-6xl">🛒</p>
          <p className="mb-1 text-h4 font-bold">ตะกร้าของคุณว่างเปล่า</p>
          <p className="mb-6 text-sm text-ink-500">มาช้อปสินค้าที่ถูกใจกันเลย</p>
          <Btn onClick={() => nav('/')}>เริ่มช้อปเลย</Btn>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            {lines.map((l) => (
              <CartItemRow key={l.product.id} line={l} />
            ))}
          </div>
          <OrderSummary onCheckout={() => nav('/checkout')} />
        </div>
      )}

      <RecommendSection
        title="สินค้าที่คุณอาจชอบ"
        subtitle="แนะนำเพิ่มเติมจาก AI"
        products={recs.data ?? []}
      />
    </Container>
  );
}
