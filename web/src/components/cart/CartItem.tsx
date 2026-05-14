import { ProductImage } from '@/components/product/ProductImage';
import { useCart, type CartLine } from '@/store/cart.store';
import { fmtKip } from '@/lib/format';

interface Props {
  line: CartLine;
}

export function CartItemRow({ line }: Props) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { product, qty } = line;

  return (
    <div className="flex gap-4 border-b border-ink-100 py-4 last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <ProductImage product={product} height="100%" />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="line-clamp-2 text-sm font-semibold text-ink-900">{product.name}</p>
        <p className="mt-1 text-xs text-ink-500">หมวด: {product.category_slug}</p>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[color:var(--c-primary)]">
              {fmtKip(product.price)}
            </span>
            {product.original_price > product.price ? (
              <span className="text-xs text-ink-400 line-through">
                {product.original_price.toLocaleString()}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center overflow-hidden rounded-md border border-ink-200">
              <button
                onClick={() => setQty(product.id, qty - 1)}
                className="h-8 w-8 hover:bg-ink-100"
              >
                −
              </button>
              <span className="h-8 w-10 border-x border-ink-200 text-center leading-8">{qty}</span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                className="h-8 w-8 hover:bg-ink-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => remove(product.id)}
              className="rounded-md p-2 text-ink-400 hover:bg-ink-100 hover:text-danger"
              aria-label="ลบ"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
