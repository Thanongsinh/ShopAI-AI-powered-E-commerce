import { useEffect, useCallback } from 'react';
import { trackEvent, type BehaviorAction } from '@/services/event.service';
import { useSessionId } from './useSessionId';

export function useTrackBehavior(productId?: number) {
  const sessionId = useSessionId();

  useEffect(() => {
    if (productId) {
      trackEvent({ productId, action: 'view', sessionId });
    }
  }, [productId, sessionId]);

  const track = useCallback(
    (pid: number, action: BehaviorAction) => trackEvent({ productId: pid, action, sessionId }),
    [sessionId],
  );

  return {
    track,
    trackAddToCart: (pid: number) => track(pid, 'add_cart'),
    trackPurchase: (pid: number) => track(pid, 'purchase'),
    trackWishlist: (pid: number) => track(pid, 'wishlist'),
  };
}
