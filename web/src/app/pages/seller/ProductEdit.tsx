import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductForm } from '@/components/seller/ProductForm';
import { useUpdateProduct } from '@/hooks/useSeller';
import { useProduct } from '@/hooks/useProducts';

export default function ProductEdit() {
  const { id } = useParams();
  const pid = Number(id);
  const nav = useNavigate();
  const product = useProduct(pid);
  const update = useUpdateProduct();
  const [error, setError] = useState<string | null>(null);

  if (product.isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />;
  }
  if (!product.data) {
    return <p className="text-ink-500">ไม่พบสินค้า</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => nav(-1)}
          className="text-sm font-semibold text-ink-500 hover:text-ink-700"
        >
          ← กลับ
        </button>
        <h2 className="mt-2 text-h2 font-bold">แก้ไขสินค้า</h2>
      </div>
      <ProductForm
        initial={product.data}
        submitting={update.isPending}
        error={error}
        onCancel={() => nav('/seller/products')}
        onSubmit={(body) => {
          setError(null);
          update.mutate(
            { id: pid, body },
            {
              onSuccess: () => nav('/seller/products'),
              onError: (e: any) =>
                setError(e?.response?.data?.error ?? 'บันทึกไม่สำเร็จ'),
            },
          );
        }}
      />
    </div>
  );
}
