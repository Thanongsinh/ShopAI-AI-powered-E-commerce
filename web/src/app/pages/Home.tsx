import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CategoryPills } from '@/components/ui/CategoryPills';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { FlashSaleSection } from '@/components/ui/FlashSaleSection';
import { PopularCategories } from '@/components/ui/PopularCategories';
import { TrendingSection } from '@/components/ui/TrendingSection';
import { RecommendSection } from '@/components/ai/RecommendSection';
import {
  useCategories,
  useRecommendations,
  useTrending,
} from '@/hooks/useProducts';

export default function Home() {
  const cats = useCategories();
  const trending = useTrending();
  const recs = useRecommendations();
  const nav = useNavigate();
  const [active, setActive] = useState<string>('all');

  const categories = cats.data ?? [];
  const trendList = trending.data ?? [];
  const recList = recs.data ?? [];

  const flashSale = trendList.filter((p) => p.discount >= 15).slice(0, 8);

  return (
    <div>
      <CategoryPills
        categories={categories}
        active={active}
        onSelect={(slug) => {
          setActive(slug);
          if (slug !== 'all') nav(`/search?category=${slug}`);
        }}
      />

      <HeroBanner featured={trendList} />

      <RecommendSection
        title="แนะนำสำหรับคุณ"
        subtitle="โดย AI ที่เรียนรู้ความชอบของคุณ"
        products={recList}
        why="ทำไม AI ถึงแนะนำสิ่งเหล่านี้?"
      />

      {flashSale.length > 0 ? <FlashSaleSection products={flashSale} /> : null}

      {categories.length > 0 ? <PopularCategories categories={categories} /> : null}

      {trendList.length > 0 ? <TrendingSection products={trendList} /> : null}
    </div>
  );
}
