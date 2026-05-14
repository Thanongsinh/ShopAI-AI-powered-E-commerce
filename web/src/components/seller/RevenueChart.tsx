interface Props {
  data: { label: string; value: number }[];
}

export function RevenueChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-h4 font-bold">รายได้ 7 วันล่าสุด</h3>
        <span className="text-xs text-ink-500">หน่วย: ₭</span>
      </div>
      <div className="flex h-40 items-end gap-3">
        {data.map((d) => {
          const h = (d.value / max) * 100;
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-md bg-[color:var(--c-primary)] transition-all"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-ink-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
