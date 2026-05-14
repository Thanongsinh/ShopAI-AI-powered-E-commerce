import { useEffect, useState } from 'react';
import {
  applyPalette,
  PALETTES,
  useTweaks,
  type Palette,
} from '@/store/tweaks.store';
import { cn } from '@/lib/cn';

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const tweaks = useTweaks();

  useEffect(() => {
    applyPalette(tweaks.primary);
  }, [tweaks.primary]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-3 z-[1001] flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-[0_4px_12px_rgba(0,0,0,0.18)] md:bottom-4 md:right-4"
        aria-label="Tweaks"
      >
        ⚙️
      </button>

      {open ? (
        <div className="fixed bottom-32 right-3 z-[1001] w-[280px] rounded-2xl bg-white p-4 shadow-modal md:bottom-20 md:right-4">
          <p className="mb-3 text-sm font-bold text-ink-900">Tweaks</p>

          <Section title="ธีม">
            <p className="mb-1.5 text-xs text-ink-500">สีหลัก</p>
            <div className="flex gap-2">
              {(Object.keys(PALETTES) as Palette[]).map((p) => (
                <button
                  key={p}
                  onClick={() => tweaks.set('primary', p)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform',
                    tweaks.primary === p ? 'border-ink-900 scale-110' : 'border-white',
                  )}
                  style={{ background: PALETTES[p].primary }}
                  aria-label={p}
                />
              ))}
            </div>
          </Section>

          <Section title="AI Features">
            <Toggle
              label="แสดง AI แนะนำ"
              value={tweaks.showAI}
              onChange={(v) => tweaks.set('showAI', v)}
            />
          </Section>

          <Section title="การ์ดสินค้า">
            <Radio
              label="สไตล์มุม"
              options={['rounded', 'sharp']}
              value={tweaks.cardStyle}
              onChange={(v) => tweaks.set('cardStyle', v)}
            />
            <Radio
              label="ความหนาแน่น"
              options={['comfortable', 'compact']}
              value={tweaks.density}
              onChange={(v) => tweaks.set('density', v)}
            />
          </Section>
        </div>
      ) : null}
    </>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          value ? 'bg-[color:var(--c-primary)]' : 'bg-ink-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            value ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  );
}

function Radio<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1.5 text-xs text-ink-500">{label}</p>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              'flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold capitalize',
              value === o
                ? 'border-[color:var(--c-primary)] bg-[color:var(--c-primary-light)] text-[color:var(--c-primary-dark)]'
                : 'border-ink-200 text-ink-500',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
