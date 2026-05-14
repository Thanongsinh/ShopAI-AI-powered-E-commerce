import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-white py-10 text-sm text-ink-500">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="mb-3 text-base font-extrabold text-ink-900">
              Shop<span className="text-[color:var(--c-ai)]">✨</span>AI
            </p>
            <p>ร้านค้าที่รู้ใจคุณ</p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink-700">เกี่ยวกับเรา</p>
            <ul className="space-y-1.5">
              <li>เกี่ยวกับ ShopAI</li>
              <li>ข่าวสาร</li>
              <li>ร่วมงานกับเรา</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink-700">นโยบาย</p>
            <ul className="space-y-1.5">
              <li>ข้อกำหนดการใช้งาน</li>
              <li>นโยบายความเป็นส่วนตัว</li>
              <li>การคืนสินค้า</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-ink-700">ติดต่อ</p>
            <ul className="space-y-1.5">
              <li>support@shopai.app</li>
              <li>020-555-0001</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-ink-100 pt-6 text-center text-xs">
          © 2026 ShopAI. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
