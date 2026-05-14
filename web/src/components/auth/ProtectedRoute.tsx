import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/store/auth.store';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const status = useAuth((s) => s.status);
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-500">
        <span className="animate-pulse">กำลังโหลด...</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function RequireGuest({ children }: PropsWithChildren) {
  const status = useAuth((s) => s.status);
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return <>{children}</>;
}
