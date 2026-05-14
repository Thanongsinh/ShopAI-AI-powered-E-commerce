import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductScrollRow } from '@/components/product/ProductGrid';
import { useTweaks } from '@/store/tweaks.store';
import type { Product } from '@/types/product.types';

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  why?: string;
}

export function RecommendSection({ title, subtitle, products, why }: Props) {
  const { showAI } = useTweaks();
  if (!showAI || products.length === 0) return null;
  return (
    <section className="py-10" style={{ background: 'var(--c-ai-light)' }}>
      <Container>
        <SectionTitle icon="✨" title={title} subtitle={subtitle} linkText="ดูสินค้าแนะนำทั้งหมด" ai />
        <ProductScrollRow products={products} />
        {why ? (
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.1)] px-4 py-2 text-[13px] font-semibold text-[color:var(--c-ai)]"
            title="เหตุผลที่ AI แนะนำ"
          >
            ℹ️ {why}
          </button>
        ) : null}
      </Container>
    </section>
  );
}
