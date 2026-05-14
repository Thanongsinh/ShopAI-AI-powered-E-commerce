import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/store/auth.store';

export const useOrders = () => {
  const authed = useAuth((s) => s.status === 'authenticated');
  return useQuery({
    queryKey: ['buyer', 'orders'],
    queryFn: orderService.list,
    enabled: authed,
  });
};
