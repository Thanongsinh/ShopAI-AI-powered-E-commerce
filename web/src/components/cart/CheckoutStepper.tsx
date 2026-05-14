import { cn } from '@/lib/cn';

const STEPS = ['ที่อยู่', 'การชำระเงิน', 'ยืนยัน'] as const;

export function CheckoutStepper({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors',
                done
                  ? 'bg-success text-white'
                  : active
                    ? 'bg-[color:var(--c-primary)] text-white'
                    : 'bg-ink-200 text-ink-500',
              )}
            >
              {done ? '✓' : idx}
            </div>
            <span
              className={cn(
                'text-sm font-semibold',
                active
                  ? 'text-[color:var(--c-primary)]'
                  : done
                    ? 'text-success'
                    : 'text-ink-500',
              )}
            >
              {label}
            </span>
            {idx < STEPS.length ? (
              <span
                className={cn(
                  'mx-2 hidden h-px w-8 sm:block',
                  done ? 'bg-success' : 'bg-ink-200',
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
