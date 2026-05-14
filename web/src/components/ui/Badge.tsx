import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

type BadgeType =
  | 'ai'
  | 'sale'
  | 'new'
  | 'low'
  | 'out'
  | 'success'
  | 'pending'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

const STYLES: Record<BadgeType, string> = {
  ai: 'bg-[color:var(--c-ai)] text-white',
  sale: 'bg-sale text-white',
  new: 'bg-blue-500 text-white',
  low: 'bg-warning text-white',
  out: 'bg-ink-400 text-white',
  success: 'bg-success text-white',
  pending: 'bg-warning text-white',
  shipping: 'bg-blue-500 text-white',
  delivered: 'bg-success text-white',
  cancelled: 'bg-danger text-white',
};

export function Badge({
  type,
  className,
  children,
}: PropsWithChildren<{ type: BadgeType; className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap',
        STYLES[type],
        className,
      )}
    >
      {children}
    </span>
  );
}
