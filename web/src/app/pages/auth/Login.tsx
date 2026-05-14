import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/store/auth.store';
import { Btn } from '@/components/ui/Btn';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState('seller@shopai.dev');
  const [pwd, setPwd] = useState('password123');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, pwd);
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      nav(from, { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-card"
      >
        <p className="mb-1 text-h2 font-extrabold">
          Shop<span className="text-[color:var(--c-ai)]">✨</span>AI
        </p>
        <p className="mb-6 text-sm text-ink-500">เข้าสู่ระบบเพื่อช้อปสนุก</p>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-ink-700">อีเมล</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border border-ink-300 px-3 outline-none focus:border-[color:var(--c-primary)]"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold text-ink-700">รหัสผ่าน</span>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="h-10 w-full rounded-md border border-ink-300 px-3 outline-none focus:border-[color:var(--c-primary)]"
          />
        </label>

        {err ? <p className="mb-3 text-sm text-danger">{err}</p> : null}

        <Btn fullWidth type="submit" disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </Btn>

        <p className="mt-4 text-center text-sm text-ink-500">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="font-semibold text-[color:var(--c-primary)]">
            สมัครสมาชิก
          </Link>
        </p>
      </form>
    </div>
  );
}
