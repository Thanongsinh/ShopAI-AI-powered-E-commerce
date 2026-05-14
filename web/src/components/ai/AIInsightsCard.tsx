interface Props {
  title: string;
  items: { label: string; value: string }[];
}

export function AIInsightsCard({ title, items }: Props) {
  return (
    <section
      className="rounded-2xl border border-[rgba(139,92,246,0.2)] p-5"
      style={{ background: 'var(--c-ai-light)' }}
    >
      <h3 className="mb-4 flex items-center gap-2 text-h4 font-bold text-[color:var(--c-ai-dark)]">
        ✨ {title}
      </h3>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.label} className="rounded-xl bg-white/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {i.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{i.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
