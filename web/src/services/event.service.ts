import { api } from './api';

export type BehaviorAction = 'view' | 'add_cart' | 'purchase' | 'wishlist';

export function trackEvent(input: {
  productId: number;
  action: BehaviorAction;
  sessionId: string;
  userId?: number;
}) {
  return api
    .post('/events', {
      product_id: input.productId,
      action: input.action,
      session_id: input.sessionId,
      user_id: input.userId,
    })
    .catch(() => undefined); // never block UI on analytics
}
