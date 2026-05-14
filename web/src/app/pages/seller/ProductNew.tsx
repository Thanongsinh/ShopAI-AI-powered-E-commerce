import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductForm } from '@/components/seller/ProductForm';
import { useCreateProduct } from '@/hooks/useSeller';

export default function ProductNew() {
  const nav = useNavigate();
  const create = useCreateProduct();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => nav(-1)}
          className="text-sm font-semibold text-ink-500 hover:text-ink-700"
        >
          ← กลับ
        </button>
        <h2 className="mt-2 text-h2 font-bold">เพิ่มสินค้าใหม่</h2>
      </div>
      <ProductForm
        submitting={create.isPending}
        error={error}
        onCancel={() => nav('/seller/products')}
        onSubmit={(body) => {
          setError(null);
          create.mutate(body, {
            onSuccess: () => nav('/seller/products'),
            onError: (e: any) =>
              setError(e?.response?.data?.error ?? 'บันทึกไม่สำเร็จ'),
          });
        }}
      />
    </div>
  );
}
