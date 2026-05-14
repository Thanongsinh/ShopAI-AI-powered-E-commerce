import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Stars } from '@/components/ui/Stars';
import { Btn } from '@/components/ui/Btn';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductScrollRow, ProductGrid } from '@/components/product/ProductGrid';
import { useProduct, useSimilar } from '@/hooks/useProducts';
import { useCart } from '@/store/cart.store';
import { useTweaks } from '@/store/tweaks.store';
import { useTrackBehavior } from '@/hooks/useTrackBehavior';
import { fmtKip } from '@/lib/format';
import { cn } from '@/lib/cn';

export default function ProductDetail() {
  const { id } = useParams();
  const pid = Number(id);
  const nav = useNavigate();
  const product = useProduct(pid);
  const similar = useSimilar(pid);
  const add = useCart((s) => s.add);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWish = useCart((s) => s.toggleWishlist);
  const { trackAddToCart } = useTrackBehavior(pid);
  const { showAI } = useTweaks();

  const [thumb, setThumb] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'qa'>('details');
  const [showWhy, setShowWhy] = useState(false);
  const [added, setAdded] = useState(false);

  const p = product.data;
  const sim = similar.data ?? [];

  const specs = useMemo(() => {
    if (!p?.specs) return [];
    try {
      return JSON.parse(p.specs) as [string, string][];
    } catch {
      return [];
    }
  }, [p?.specs]);

  if (product.isLoading) {
    return (
      <Container style={{ padding: '40px 24px' }}>
        <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />
      </Container>
    );
  }
  if (!p) {
    return (
      <Container style={{ padding: '40px 24px' }}>
        <p className="text-ink-500">ไม่พบสินค้า</p>
      </Container>
    );
  }

  const wished = wishlist.includes(p.id);
  const lowStock = p.stock > 0 && p.stock < 30;

  const doAdd = () => {
    add(p, qty);
    trackAddToCart(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    add(p, qty);
    trackAddToCart(p.id);
    nav('/checkout');
  };

  const thumbs = [p, ...sim.slice(0, 4)];

  return (
    <div className="pb-20">
      <div className="border-b border-ink-200 bg-ink-50 py-2.5">
        <Container>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <Link to="/" className="text-[color:var(--c-primary)] hover:underline">
              หน้าแรก
            </Link>
            <span>›</span>
            <span>{p.category_slug}</span>
            <span>›</span>
            <span className="text-ink-900">{p.name}</span>
          </div>
        </Container>
      </div>

      <Container style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,480px)_1fr]">
          {/* Images */}
          <div>
            <div className="relative mb-3.5 w-full overflow-hidden rounded-2xl pb-[100%] shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0">
                <ProductImage product={thumbs[thumb] || p} />
              </div>
            </div>
            <div className="flex gap-2.5">
              {thumbs.slice(0, 5).map((tp, i) => (
                <button
                  key={i}
                  onClick={() => setThumb(i)}
                  className={cn(
                    'h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                    thumb === i
                      ? 'border-[color:var(--c-primary)] shadow-[0_0_0_2px_rgba(99,102,241,0.2)]'
                      : 'border-ink-200',
                  )}
                >
                  <ProductImage product={tp} height="68px" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {showAI && p.is_ai_recommended ? (
              <div className="relative mb-3 inline-block">
                <button
                  onClick={() => setShowWhy((w) => !w)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(139,92,246,0.25)] bg-[color:var(--c-ai-light)] px-3.5 py-1.5 text-[13px] font-semibold text-[color:var(--c-ai-dark)]"
                >
                  ✨ AI แนะนำสำหรับคุณ ℹ️
                </button>
                {showWhy ? (
                  <div className="absolute left-0 top-full z-10 mt-2 w-[300px] rounded-xl border border-ink-200 bg-white p-4 text-[13px] leading-relaxed text-ink-700 shadow-modal">
                    <p className="mb-1.5 font-bold text-ink-900">เหตุผลที่ AI แนะนำ:</p>
                    <p>คุณดูสินค้าหมวด{p.category_slug}บ่อย และซื้อสินค้าราคา 500–50,000 ₭</p>
                    <button className="mt-2 text-xs font-semibold text-[color:var(--c-primary)]">
                      ปรับความสนใจ →
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <h1 className="mb-3 text-h2 font-bold text-ink-900">{p.name}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <Stars rating={p.rating} size={14} />
              <span className="font-semibold text-ink-900">{p.rating}</span>
              <span>({p.reviews.toLocaleString()} รีวิว)</span>
              <span>|</span>
              <span>ขายแล้ว {p.sold.toLocaleString()} ชิ้น</span>
            </div>

            <div className="mb-4 flex flex-wrap items-baseline gap-3 rounded-xl bg-ink-50 p-4">
              <span className="text-display font-extrabold text-[color:var(--c-primary)]">
                {fmtKip(p.price)}
              </span>
              {p.original_price > p.price ? (
                <>
                  <span className="text-h4 text-ink-400 line-through">
                    {p.original_price.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-sale px-3 py-1 text-sm font-bold text-white">
                    -{p.discount}%
                  </span>
                </>
              ) : null}
            </div>

            {lowStock ? (
              <div className="mb-4">
                <p className="mb-1.5 text-sm font-semibold text-warning">
                  ⚠️ เหลือเพียง {p.stock} ชิ้น
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
                  <div
                    className="h-full bg-warning"
                    style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                  />
                </div>
              </div>
            ) : null}

            {p.colors && p.colors.length > 0 ? (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-ink-700">สี</p>
                <div className="flex gap-2">
                  {p.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelColor(i)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-transform',
                        selColor === i
                          ? 'border-[color:var(--c-primary)] scale-110'
                          : 'border-ink-200',
                      )}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {p.sizes && p.sizes.length > 0 ? (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-ink-700">ไซส์</p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setSelSize(i)}
                      className={cn(
                        'min-w-[44px] rounded-md border px-3 py-1.5 text-sm font-semibold transition',
                        selSize === i
                          ? 'border-[color:var(--c-primary)] bg-[color:var(--c-primary-light)] text-[color:var(--c-primary-dark)]'
                          : 'border-ink-200 text-ink-700',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mb-5 flex items-center gap-3">
              <p className="text-sm font-semibold text-ink-700">จำนวน</p>
              <div className="inline-flex items-center overflow-hidden rounded-md border border-ink-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 hover:bg-ink-100"
                >
                  −
                </button>
                <span className="h-9 w-12 border-x border-ink-200 text-center leading-9">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                  className="h-9 w-9 hover:bg-ink-100"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-ink-500">มี {p.stock} ชิ้น</p>
            </div>

            <div className="mb-5 flex flex-wrap gap-3">
              <Btn variant="secondary" size="lg" onClick={doAdd} disabled={p.stock <= 0}>
                {added ? '✓ เพิ่มแล้ว' : '🛒 เพิ่มลงตะกร้า'}
              </Btn>
              <Btn size="lg" onClick={buyNow} disabled={p.stock <= 0}>
                ⚡ ซื้อเลย
              </Btn>
              <Btn
                variant="ghost"
                size="lg"
                onClick={() => toggleWish(p.id)}
                className={wished ? 'text-sale' : ''}
              >
                {wished ? '♥ บันทึกแล้ว' : '♡ บันทึก'}
              </Btn>
            </div>

            <p className="rounded-md bg-success/10 px-4 py-2.5 text-sm text-success">
              🚚 ส่งฟรีเมื่อซื้อครบ 500 ₭
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-ink-200">
          <div className="flex gap-6">
            {(
              [
                ['details', 'รายละเอียด'],
                ['reviews', `รีวิว (${p.reviews.toLocaleString()})`],
                ['qa', 'คำถาม (56)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'border-b-2 px-1 py-3 text-sm font-semibold transition',
                  tab === key
                    ? 'border-[color:var(--c-primary)] text-[color:var(--c-primary)]'
                    : 'border-transparent text-ink-500 hover:text-ink-700',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {tab === 'details' ? (
            <div>
              <p className="mb-6 text-body-lg leading-relaxed text-ink-700">{p.description}</p>
              <table className="w-full max-w-md overflow-hidden rounded-md border border-ink-200 text-sm">
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k} className="border-b border-ink-100 last:border-0">
                      <td className="w-1/3 bg-ink-50 px-4 py-2.5 font-semibold text-ink-700">
                        {k}
                      </td>
                      <td className="px-4 py-2.5">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {tab === 'reviews' ? (
            <ReviewSummary rating={p.rating} count={p.reviews} />
          ) : null}
          {tab === 'qa' ? <p className="text-ink-500">ยังไม่มีคำถาม</p> : null}
        </div>

        {/* AI cross-sell */}
        {showAI && sim.length > 0 ? (
          <section
            className="mt-10 rounded-2xl p-6"
            style={{ background: 'var(--c-ai-light)' }}
          >
            <SectionTitle
              icon="✨"
              title="คนที่ซื้อสินค้านี้ยังซื้อ"
              subtitle="87% ของผู้ชมสินค้านี้ดูสิ่งนี้ด้วย"
              ai
            />
            <ProductScrollRow products={sim} compact />
          </section>
        ) : null}

        {/* Similar grid */}
        {sim.length > 0 ? (
          <section className="mt-10">
            <SectionTitle title="สินค้าคล้ายกัน" />
            <ProductGrid products={sim.slice(0, 4)} />
          </section>
        ) : null}
      </Container>
    </div>
  );
}

function ReviewSummary({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
      <div className="rounded-xl bg-ink-50 p-5 text-center">
        <p className="text-5xl font-extrabold text-ink-900">{rating}</p>
        <div className="mt-2 flex justify-center">
          <Stars rating={Math.round(rating)} size={18} />
        </div>
        <p className="mt-2 text-xs text-ink-500">{count.toLocaleString()} รีวิว</p>
      </div>
      <div>
        {[5, 4, 3, 2, 1].map((s) => (
          <div key={s} className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-6 text-ink-500">{s}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-200">
              <div
                className="h-full bg-warning"
                style={{ width: `${s === 5 ? 70 : s === 4 ? 18 : 4}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs text-ink-500">
              {s === 5 ? '70%' : s === 4 ? '18%' : '4%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
