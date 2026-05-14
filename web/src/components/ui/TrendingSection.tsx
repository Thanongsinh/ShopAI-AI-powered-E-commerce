import { useNavigate } from 'react-router';
import { Container } from './Container';
import { SectionTitle } from './SectionTitle';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Btn } from './Btn';
import type { Product } from '@/types/product.types';

export function TrendingSection({ products }: { products: Product[] }) {
  const nav = useNavigate();
  return (
    <section className="py-10">
      <Container>
        <SectionTitle icon="🔥" title="สินค้าขายดี" />
        <ProductGrid products={products.slice(0, 8)} />
        <div className="mt-8 flex justify-center">
          <Btn variant="secondary" onClick={() => nav('/search')}>
            ดูสินค้าทั้งหมด →
          </Btn>
        </div>
      </Container>
    </section>
  );
}
