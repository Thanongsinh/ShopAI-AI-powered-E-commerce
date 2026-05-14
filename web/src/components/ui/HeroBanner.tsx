import { useNavigate } from 'react-router';
import { Container } from './Container';
import type { Product } from '@/types/product.types';
import { fmtKip } from '@/lib/format';

export function HeroBanner({ featured }: { featured: Product[] }) {
  const nav = useNavigate();
  return (
    <div
      className="relative flex min-h-[400px] items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg,#4338ca 0%,#6d28d9 55%,#7e22ce 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 50%,rgba(255,255,255,0.06) 0%,transparent 50%),radial-gradient(circle at 85% 20%,rgba(255,255,255,0.08) 0%,transparent 40%)',
        }}
      />
      <Container style={{ display: 'flex', alignItems: 'center', gap: 48, padding: '48px 24px', flexWrap: 'wrap' }}>
        <div className="relative z-10 flex-[1_1_360px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 backdrop-blur-sm">
            <span>✨</span>
            <span className="text-[13px] font-semibold tracking-wide text-white">
              AI-Powered Shopping
            </span>
          </div>
          <h1 className="mb-4 text-[44px] font-extrabold leading-tight tracking-tight text-white">
            ช้อปสมาร์ท
            <br />
            ด้วย AI ที่รู้ใจคุณ
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-white/80">
            แนะนำสินค้าที่ใช่สำหรับคุณ
            <br />
            โดย AI ที่เรียนรู้จากความชอบของคุณ
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => nav('/search')}
              className="h-[50px] rounded-xl bg-white px-7 text-[15px] font-bold text-[color:var(--c-primary)] shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-ink-50"
            >
              🛍️ เริ่มช้อปเลย
            </button>
            <button
              className="h-[50px] rounded-xl border-2 border-white/35 bg-white/10 px-7 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              ✨ ดูสินค้าแนะนำ
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-shrink-0 items-start gap-3.5">
          {featured.slice(0, 2).map((p, i) => (
            <button
              key={p.id}
              onClick={() => nav(`/products/${p.id}`)}
              className="w-[148px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white/95 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
              style={{ transform: i === 1 ? 'translateY(22px)' : 'none' }}
            >
              <div
                className="flex h-[100px] items-center justify-center text-4xl"
                style={{ background: `linear-gradient(135deg,${p.color_from},${p.color_to})` }}
              >
                {p.icon}
              </div>
              <div className="px-2.5 pb-3 pt-2.5">
                <p className="mb-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-ink-900">
                  {p.name}
                </p>
                <p className="text-sm font-extrabold text-[color:var(--c-primary)]">
                  {fmtKip(p.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
