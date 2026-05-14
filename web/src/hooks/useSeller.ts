import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '@/services/seller.service';
import { useAuth } from '@/store/auth.store';
import type { ProductUpsertRequest } from '@/types/seller.types';

const useSellerEnabled = () =>
  useAuth(
    (s) =>
      s.status === 'authenticated' && (s.user?.role === 'seller' || s.user?.role === 'admin'),
  );

export const useSellerDashboard = () => {
  const enabled = useSellerEnabled();
  return useQuery({
    queryKey: ['seller', 'dashboard'],
    queryFn: sellerService.dashboard,
    enabled,
  });
};

export const useSellerProducts = () => {
  const enabled = useSellerEnabled();
  return useQuery({
    queryKey: ['seller', 'products'],
    queryFn: sellerService.products,
    enabled,
  });
};

export const useSellerOrders = () => {
  const enabled = useSellerEnabled();
  return useQuery({
    queryKey: ['seller', 'orders'],
    queryFn: sellerService.orders,
    enabled,
  });
};

export const useSellerAnalytics = () => {
  const enabled = useSellerEnabled();
  return useQuery({
    queryKey: ['seller', 'analytics'],
    queryFn: sellerService.analytics,
    enabled,
  });
};

export const useSellerShop = () => {
  const enabled = useSellerEnabled();
  return useQuery({
    queryKey: ['seller', 'shop'],
    queryFn: sellerService.getShop,
    enabled,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductUpsertRequest) => sellerService.createProduct(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller', 'products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<ProductUpsertRequest> }) =>
      sellerService.updateProduct(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller', 'products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sellerService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller', 'products'] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      sellerService.updateOrderStatus(id, status),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['seller', 'orders'] }),
        qc.invalidateQueries({ queryKey: ['seller', 'dashboard'] }),
      ]),
  });
};
