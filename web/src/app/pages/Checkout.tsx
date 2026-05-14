import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Container } from '@/components/ui/Container';
import { Btn } from '@/components/ui/Btn';
import { CheckoutStepper } from '@/components/cart/CheckoutStepper';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { RecommendSection } from '@/components/ai/RecommendSection';
import { useCart } from '@/store/cart.store';
import { useRecommendations } from '@/hooks/useProducts';
import { useTrackBehavior } from '@/hooks/useTrackBehavior';
import { orderService } from '@/services/order.service';
import { cn } from '@/lib/cn';

type Payment = 'promptpay' | 'bcel' | 'card' | 'cod';

export default function Checkout() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const recs = useRecommendations();
  const { trackPurchase } = useTrackBehavior();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    line: '',
    city: 'นครหลวงเวียงจันทน์',
    zip: '01000',
  });
  const [payment, setPayment] = useState<Payment>('promptpay');
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (lines.length === 0 && !orderNo) {
    return (
      <Container style={{ padding: '40px 24px' }}>
        <p className="text-ink-500">
          ตะกร้าว่างเปล่า — กลับไป{' '}
          <button onClick={() => nav('/')} className="text-[color:var(--c-primary)] underline">
            หน้าแรก
          </button>
        </p>
      </Container>
    );
  }

  const placeOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fullAddress = `${address.name} (${address.phone}) — ${address.line}, ${address.city} ${address.zip}`;
      const order = await orderService.checkout({
        address: fullAddress,
        payment_method: payment,
      });
      lines.forEach((l) => trackPurchase(l.product.id));
      clear();
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] });
      setOrderNo(`SO${String(order.id).padStart(8, '0')}`);
    } catch (e: any) {
      setSubmitError(e?.response?.data?.error ?? 'สั่งซื้อไม่สำเร็จ — ลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNo) return <OrderSuccess orderNo={orderNo} recs={recs.data ?? []} />;

  return (
    <Container style={{ padding: '32px 24px' }}>
      <CheckoutStepper step={step} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          {step === 1 ? (
            <Step1
              address={address}
              setAddress={setAddress}
              onNext={() => setStep(2)}
            />
          ) : null}
          {step === 2 ? (
            <Step2
              payment={payment}
              setPayment={setPayment}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : null}
          {step === 3 ? (
            <Step3
              address={address}
              payment={payment}
              onBack={() => setStep(2)}
              onPlace={placeOrder}
              submitting={submitting}
              error={submitError}
            />
          ) : null}
        </div>

        <OrderSummary
          onCheckout={() => {
            if (step < 3) setStep((s) => s + 1);
            else placeOrder();
          }}
          ctaLabel={step === 3 ? 'ยืนยันและชำระเงิน' : 'ต่อไป →'}
        />
      </div>
    </Container>
  );
}

function Step1({
  address,
  setAddress,
  onNext,
}: {
  address: ReturnType<typeof useState<any>>[0];
  setAddress: any;
  onNext: () => void;
}) {
  const valid = address.name && address.phone && address.line;
  return (
    <div>
      <h3 className="mb-4 text-h3 font-bold">ที่อยู่จัดส่ง</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ชื่อผู้รับ" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
        <Field label="เบอร์โทร" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
        <div className="sm:col-span-2">
          <Field label="ที่อยู่" value={address.line} onChange={(v) => setAddress({ ...address, line: v })} />
        </div>
        <Field label="เมือง/แขวง" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
        <Field label="รหัสไปรษณีย์" value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} />
      </div>
      <div className="mt-6 flex justify-end">
        <Btn onClick={onNext} disabled={!valid}>
          ต่อไป →
        </Btn>
      </div>
    </div>
  );
}

function Step2({
  payment,
  setPayment,
  onBack,
  onNext,
}: {
  payment: Payment;
  setPayment: (p: Payment) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const options: { id: Payment; icon: string; label: string; sub: string }[] = [
    { id: 'promptpay', icon: '📱', label: 'PromptPay QR', sub: 'สแกน QR ผ่านแอปธนาคาร' },
    { id: 'bcel', icon: '🏦', label: 'BCEL OnePay', sub: 'ชำระผ่าน BCEL' },
    { id: 'card', icon: '💳', label: 'บัตรเครดิต/เดบิต', sub: 'Visa / Mastercard / JCB' },
    { id: 'cod', icon: '💵', label: 'เก็บเงินปลายทาง', sub: 'จ่ายเมื่อรับสินค้า' },
  ];
  return (
    <div>
      <h3 className="mb-4 text-h3 font-bold">การชำระเงิน</h3>
      <div className="grid gap-3">
        {options.map((o) => (
          <label
            key={o.id}
            className={cn(
              'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition',
              payment === o.id
                ? 'border-[color:var(--c-primary)] bg-[color:var(--c-primary-light)]'
                : 'border-ink-200 bg-white hover:border-ink-300',
            )}
          >
            <input
              type="radio"
              name="payment"
              value={o.id}
              checked={payment === o.id}
              onChange={() => setPayment(o.id)}
              className="h-4 w-4 accent-[color:var(--c-primary)]"
            />
            <span className="text-2xl">{o.icon}</span>
            <div>
              <p className="font-semibold text-ink-900">{o.label}</p>
              <p className="text-xs text-ink-500">{o.sub}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Btn variant="ghost" onClick={onBack}>
          ← กลับ
        </Btn>
        <Btn onClick={onNext}>ต่อไป →</Btn>
      </div>
    </div>
  );
}

function Step3({
  address,
  payment,
  onBack,
  onPlace,
  submitting,
  error,
}: {
  address: any;
  payment: Payment;
  onBack: () => void;
  onPlace: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div>
      <h3 className="mb-4 text-h3 font-bold">ยืนยันคำสั่งซื้อ</h3>
      <div className="space-y-4 text-sm">
        <div className="rounded-xl bg-ink-50 p-4">
          <p className="mb-1 font-semibold text-ink-700">📍 ที่อยู่จัดส่ง</p>
          <p>{address.name} · {address.phone}</p>
          <p className="text-ink-500">{address.line} · {address.city} · {address.zip}</p>
        </div>
        <div className="rounded-xl bg-ink-50 p-4">
          <p className="mb-1 font-semibold text-ink-700">💳 การชำระเงิน</p>
          <p className="capitalize">{payment}</p>
        </div>
      </div>
      {error ? (
        <div className="mt-4 rounded-md bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</div>
      ) : null}
      <div className="mt-6 flex justify-between">
        <Btn variant="ghost" onClick={onBack} disabled={submitting}>
          ← กลับ
        </Btn>
        <Btn size="lg" onClick={onPlace} disabled={submitting}>
          {submitting ? 'กำลังสั่งซื้อ...' : 'ยืนยันและชำระเงิน ✓'}
        </Btn>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-ink-300 px-3 text-sm outline-none focus:border-[color:var(--c-primary)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
      />
    </label>
  );
}

function OrderSuccess({ orderNo, recs }: { orderNo: string; recs: any[] }) {
  const nav = useNavigate();
  return (
    <Container style={{ padding: '60px 24px' }}>
      <div className="mx-auto max-w-xl rounded-3xl border border-ink-200 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success text-4xl text-white">
          ✓
        </div>
        <h2 className="mb-2 text-h2 font-extrabold text-ink-900">สั่งซื้อสำเร็จ!</h2>
        <p className="mb-6 text-sm text-ink-500">
          หมายเลขคำสั่งซื้อ <span className="font-bold text-ink-900">{orderNo}</span>
        </p>
        <div className="flex justify-center gap-3">
          <Btn variant="secondary" onClick={() => nav('/buyer/orders')}>
            ติดตามคำสั่งซื้อ
          </Btn>
          <Btn onClick={() => nav('/')}>ช้อปต่อ</Btn>
        </div>
      </div>

      <RecommendSection
        title="สินค้าที่คุณอาจสนใจ"
        subtitle="แนะนำเพิ่มเติมโดย AI"
        products={recs}
      />
    </Container>
  );
}
