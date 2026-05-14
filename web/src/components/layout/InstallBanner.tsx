import { useEffect, useState } from 'react';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
    };
    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible || installed) return null;

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-[68px] left-3 right-3 z-[997] flex animate-fadeInUp items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.14)] md:bottom-4 md:left-auto md:right-4 md:w-[360px]"
    >
      <img src="/icon-192.png" width={44} height={44} className="flex-shrink-0 rounded-xl" alt="" />
      <div className="flex-1">
        <p className="text-[13px] font-bold text-ink-900">ติดตั้ง ShopAI</p>
        <p className="text-xs text-ink-500">เพิ่มลงหน้าจอหลักเพื่อประสบการณ์แบบ App</p>
      </div>
      <button
        onClick={install}
        className="h-9 flex-shrink-0 rounded-md bg-[color:var(--c-primary)] px-3.5 text-[13px] font-bold text-white hover:bg-[color:var(--c-primary-dark)]"
      >
        ติดตั้ง
      </button>
      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 p-1 text-lg text-ink-400 hover:text-ink-700"
        aria-label="ปิด"
      >
        ✕
      </button>
    </div>
  );
}
