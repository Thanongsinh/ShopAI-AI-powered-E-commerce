import { useState } from 'react';
import { Btn } from '@/components/ui/Btn';
import { useCart } from '@/store/cart.store';
import { fmtKip } from '@/lib/format';

interface Props {
  onCheckout: () => void;
  ctaLabel?: string;
}

const COUPONS: Record<string, number> = { SHOPAI10: 0.1, FREE50: 50 };

export function OrderSummary({ onCheckout, ctaLabel = 'สั่งซื้อเลย' }: Props) {
  const lines = useCart((s) => s.lines);
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<{ code: string; amount: number } | null>(null);

  const apply = () => {
    const c = code.trim().toUpperCase();
    if (!c || !(c in COUPONS)) {
      setApplied(null);
      return;
    }
    const v = COUPONS[c];
    const amount = v < 1 ? Math.round(subtotal * v) : v;
    setApplied({ code: c, amount });
  };

  const shipping = subtotal >= 500 ? 0 : 30;
  const discount = applied?.amount ?? 0;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <aside className="sticky top-20 rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-h4 font-bold text-ink-900">สรุปคำสั่งซื้อ</h3>

      <Row label={`ราคาสินค้า (${lines.length})`} value={fmtKip(subtotal)} />
      {discount > 0 ? (
        <Row label={`ส่วนลด (${applied?.code})`} value={`-${fmtKip(discount)}`} className="text-danger" />
      ) : null}
      <Row
        label="ค่าจัดส่ง"
        value={shipping === 0 ? <span className="text-success">ฟรี</span> : fmtKip(shipping)}
      />

      <div className="my-4 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ใส่โค้ดส่วนลด"
          className="h-10 flex-1 rounded-md border border-ink-300 px-3 text-sm uppercase outline-none focus:border-[color:var(--c-primary)]"
        />
        <button
          onClick={apply}
          className="rounded-md bg-ink-100 px-4 text-sm font-semibold text-ink-700 hover:bg-ink-200"
        >
          ใช้โค้ด
        </button>
      </div>
      {applied ? (
        <p className="-mt-2 mb-3 text-xs text-success">✓ ใช้โค้ด {applied.code} สำเร็จ</p>
      ) : null}

      <div className="my-4 h-px bg-ink-100" />

      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink-700">รวมทั้งหมด</span>
        <span className="text-h2 font-extrabold text-[color:var(--c-primary)]">
          {fmtKip(total)}
        </span>
      </div>

      <Btn fullWidth size="lg" onClick={onCheckout} disabled={lines.length === 0}>
        {ctaLabel}
      </Btn>

      <div className="mt-4 flex justify-center gap-3 text-xl">
        <span title="PromptPay">💳</span>
        <span title="BCEL">🏦</span>
        <span title="QR">📱</span>
        <span title="COD">💵</span>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-2 flex justify-between text-sm ${className ?? ''}`}>
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
