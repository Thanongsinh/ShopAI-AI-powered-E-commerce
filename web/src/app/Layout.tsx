import { Outlet, useLocation } from 'react-router';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { InstallBanner } from '@/components/layout/InstallBanner';
import { TweaksPanel } from '@/components/ui/TweaksPanel';
import { Footer } from '@/components/layout/Footer';

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div>
      <Navbar />
      <main key={pathname} className="page-enter has-bottom-nav pt-16">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <InstallBanner />
      <TweaksPanel />
    </div>
  );
}
