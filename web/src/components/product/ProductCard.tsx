import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductImage } from './ProductImage';
import { Stars } from '@/components/ui/Stars';
import { useCart } from '@/store/cart.store';
import { useTweaks } from '@/store/tweaks.store';
import { useTrackBehavior } from '@/hooks/useTrackBehavior';
import { fmtKip } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Product } from '@/types/product.types';

interface Props {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact }: Props) {
  const nav = useNavigate();
  const add = useCart((s) => s.add);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWish = useCart((s) => s.toggleWishlist);
  const { showAI, cardStyle, density } = useTweaks();
  const { trackAddToCart, trackWishlist } = useTrackBehavior();
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);

  const wished = wishlist.includes(product.id);
  const sharp = cardStyle === 'sharp';
  const w = compact ? 'w-[180px]' : 'w-[220px]';

  const inStock = product.status === 'active' && product.stock > 0;

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    add(product, 1);
    trackAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <article
      onClick={() => nav(`/products/${product.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={cn(
        'flex flex-shrink-0 cursor-pointer flex-col overflow-hidden bg-white transition-all duration-200',
        w,
        sharp ? 'rounded-sm' : 'rounded-2xl',
        hov ? 'shadow-hover -translate-y-0.5' : 'shadow-card',
      )}
    >
      <div className="relative pb-[100%]">
        <div className="absolute inset-0">
          <ProductImage product={product} category={product.category_slug} />
        </div>
        {showAI && product.is_ai_recommended ? (
          <div className="absolute left-2 top-2 rounded-full bg-[color:var(--c-ai)] px-2 py-0.5 text-[11px] font-bold text-white">
            ✨ AI แนะนำ
          </div>
        ) : null}
        {product.discount > 0 ? (
          <div
            className="absolute left-2 rounded-full bg-sale px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ top: showAI && product.is_ai_recommended ? 34 : 8 }}
          >
            ลด {product.discount}%
          </div>
        ) : null}
        {product.is_new ? (
          <div
            className="absolute left-2 rounded-full bg-blue-500 px-2 py-0.5 text-[11px] font-bold text-white"
            style={{
              top:
                showAI && product.is_ai_recommended
                  ? 60
                  : product.discount > 0
                    ? 34
                    : 8,
            }}
          >
            ใหม่
          </div>
        ) : null}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(product.id);
            trackWishlist(product.id);
          }}
          aria-label="Wishlist"
          className={cn(
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-colors',
            wished ? 'text-sale' : 'text-ink-400',
          )}
        >
          {wished ? '♥' : '♡'}
        </button>
        {!inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-ink-400 px-3 py-1 text-xs font-bold text-white">
              หมดแล้ว
            </span>
          </div>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col', density === 'compact' ? 'p-2' : 'p-3')}>
        <p
          className={cn(
            'mb-1.5 line-clamp-2 font-semibold leading-tight text-ink-900',
            compact ? 'text-[13px]' : 'text-sm',
          )}
        >
          {product.name}
        </p>
        <div className="mb-1.5 flex items-center gap-1">
          <Stars rating={product.rating} size={11} />
          <span className="text-[11px] text-ink-500">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>
        <div className="mb-2 flex items-baseline gap-1.5">
          <span
            className={cn(
              'font-bold text-[color:var(--c-primary)]',
              compact ? 'text-[15px]' : 'text-[17px]',
            )}
          >
            {fmtKip(product.price)}
          </span>
          {product.original_price > product.price ? (
            <span className="text-xs text-ink-400 line-through">
              {product.original_price.toLocaleString()}
            </span>
          ) : null}
        </div>
        <button
          onClick={onAdd}
          disabled={!inStock}
          className={cn(
            'mt-auto h-[34px] w-full text-[13px] font-semibold transition-all',
            sharp ? 'rounded-sm' : 'rounded-md',
            added
              ? 'bg-success text-white'
              : !inStock
                ? 'cursor-not-allowed bg-ink-200 text-ink-400'
                : 'bg-[color:var(--c-primary)] text-white hover:bg-[color:var(--c-primary-dark)]',
          )}
        >
          {added ? '✓ เพิ่มแล้ว' : inStock ? '🛒 เพิ่มลงตะกร้า' : 'สินค้าหมด'}
        </button>
      </div>
    </article>
  );
}
