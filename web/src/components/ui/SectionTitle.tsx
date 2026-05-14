import { cn } from '@/lib/cn';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  onLink?: () => void;
  ai?: boolean;
}

export function SectionTitle({ icon, title, subtitle, linkText, onLink, ai }: Props) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2
          className={cn(
            'flex items-center gap-2 text-h2 font-bold',
            ai ? 'text-[color:var(--c-ai-dark)]' : 'text-ink-900',
          )}
        >
          {icon ? <span>{icon}</span> : null}
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {linkText ? (
        <button
          onClick={onLink}
          className={cn(
            'text-sm font-semibold transition hover:opacity-80',
            ai ? 'text-[color:var(--c-ai)]' : 'text-[color:var(--c-primary)]',
          )}
        >
          {linkText} →
        </button>
      ) : null}
    </div>
  );
}
