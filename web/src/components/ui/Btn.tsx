import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'ai' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const HEIGHTS: Record<Size, string> = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-[15px]' };

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[color:var(--c-primary)] text-white hover:bg-[color:var(--c-primary-dark)] disabled:bg-ink-200 disabled:text-ink-400',
  secondary:
    'bg-white text-[color:var(--c-primary)] border-[1.5px] border-[color:var(--c-primary)] hover:bg-[color:var(--c-primary-light)]',
  danger: 'bg-danger text-white hover:bg-red-600',
  ghost: 'bg-transparent text-ink-500 hover:bg-ink-100',
  ai: 'bg-[color:var(--c-ai)] text-white hover:bg-[color:var(--c-ai-dark)]',
  success: 'bg-success text-white hover:bg-emerald-600',
};

export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all duration-150 disabled:cursor-not-allowed',
        HEIGHTS[size],
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
}
