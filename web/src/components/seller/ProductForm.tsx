import { useState, useEffect } from 'react';
import { Btn } from '@/components/ui/Btn';
import { useCategories } from '@/hooks/useProducts';
import type { Product } from '@/types/product.types';
import type { ProductUpsertRequest } from '@/types/seller.types';

interface Props {
  initial?: Product | null;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (body: ProductUpsertRequest) => void;
  onCancel: () => void;
}

const EMOJI_CHOICES = ['📱', '👟', '👜', '💻', '🎧', '👕', '📷', '🌀', '🧴', '💋', '🫕', '⌚', '🎮', '📚'];
const GRADIENTS = [
  ['#0f0c29', '#302b63'],
  ['#134e5e', '#71b280'],
  ['#5c3d2e', '#a0522d'],
  ['#1a1a2e', '#e94560'],
  ['#2c3e50', '#4a6fa5'],
  ['#c94b4b', '#4b134f'],
  ['#0f2027', '#2c5364'],
  ['#1a3a5c', '#2d6a9f'],
  ['#2193b0', '#6dd5ed'],
  ['#8e2de2', '#f64f59'],
];

export function ProductForm({ initial, submitting, error, onSubmit, onCancel }: Props) {
  const categories = useCategories();
  const [form, setForm] = useState<ProductUpsertRequest>(() => ({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    original_price: initial?.original_price ?? 0,
    stock: initial?.stock ?? 0,
    category_slug: initial?.category_slug ?? 'electronics',
    icon: initial?.icon ?? '📱',
    color_from: initial?.color_from ?? GRADIENTS[0][0],
    color_to: initial?.color_to ?? GRADIENTS[0][1],
    colors: initial?.colors ?? [],
    sizes: initial?.sizes ?? [],
    specs: initial?.specs ?? '',
    status: (initial?.status as ProductUpsertRequest['status']) ?? 'active',
  }));

  // Make sure category falls back to a valid backend slug once categories load
  useEffect(() => {
    if (!form.category_slug && categories.data?.length) {
      setForm((f) => ({ ...f, category_slug: categories.data![1]?.slug ?? 'electronics' }));
    }
  }, [categories.data, form.category_slug]);

  const set = <K extends keyof ProductUpsertRequest>(k: K, v: ProductUpsertRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const catOptions = (categories.data ?? []).filter((c) => c.slug !== 'all');

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-ink-200 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ชื่อสินค้า" required>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="หมวดหมู่">
          <select
            value={form.category_slug}
            onChange={(e) => set('category_slug', e.target.value)}
            className={inputClass}
          >
            {catOptions.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="คำอธิบาย">
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className={inputClass + ' resize-y py-2'}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="ราคา (₭)" required>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
            className={inputClass}
          />
        </Field>
        <Field label="ราคาเดิม (₭)">
          <input
            type="number"
            min={0}
            value={form.original_price}
            onChange={(e) => set('original_price', Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="สต็อก">
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set('stock', Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="ไอคอน">
        <div className="flex flex-wrap gap-2">
          {EMOJI_CHOICES.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => set('icon', e)}
              className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-xl transition-colors ${
                form.icon === e
                  ? 'border-[color:var(--c-primary)] bg-[color:var(--c-primary-light)]'
                  : 'border-ink-200 hover:border-ink-300'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>

      <Field label="ภาพพื้นหลัง (gradient)">
        <div className="flex flex-wrap gap-2">
          {GRADIENTS.map(([a, b]) => {
            const active = form.color_from === a && form.color_to === b;
            return (
              <button
                type="button"
                key={a + b}
                onClick={() => {
                  set('color_from', a);
                  set('color_to', b);
                }}
                className={`h-10 w-16 rounded-md border-2 transition-transform ${
                  active ? 'border-ink-900 scale-105' : 'border-white'
                }`}
                style={{ background: `linear-gradient(135deg,${a},${b})` }}
                aria-label={`gradient ${a}/${b}`}
              />
            );
          })}
        </div>
      </Field>

      <Field
        label="รูปภาพสินค้า (เร็วๆ นี้)"
        hint="ระบบจะรองรับการอัปโหลดผ่าน MinIO ใน Phase ถัดไป"
      >
        <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-ink-300 bg-ink-50 text-sm text-ink-500">
          📷 ลากไฟล์มาวางที่นี่ (ยังไม่เปิดใช้งาน)
        </div>
      </Field>

      <Field label="สถานะ">
        <select
          value={form.status}
          onChange={(e) => set('status', e.target.value as ProductUpsertRequest['status'])}
          className={inputClass}
        >
          <option value="active">วางขาย</option>
          <option value="inactive">หยุดขาย</option>
          <option value="sold_out">หมดสต็อก</option>
        </select>
      </Field>

      {error ? (
        <p className="rounded-md bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      ) : null}

      <div className="flex justify-end gap-3">
        <Btn variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          ยกเลิก
        </Btn>
        <Btn type="submit" disabled={submitting}>
          {submitting ? 'กำลังบันทึก...' : initial ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
        </Btn>
      </div>
    </form>
  );
}

const inputClass =
  'h-10 w-full rounded-md border border-ink-300 px-3 text-sm outline-none focus:border-[color:var(--c-primary)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]';

function Field({
  label,
  hint,
  required,
  children,
}: React.PropsWithChildren<{ label: string; hint?: string; required?: boolean }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-700">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-ink-500">{hint}</span> : null}
    </label>
  );
}
