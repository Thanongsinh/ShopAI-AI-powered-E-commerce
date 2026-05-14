import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authService } from '@/services/auth.service';
import { Btn } from '@/components/ui/Btn';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await authService.register(form);
      nav('/');
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'สมัครไม่สำเร็จ');
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
        <p className="mb-1 text-h2 font-extrabold">สมัครสมาชิก</p>
        <p className="mb-6 text-sm text-ink-500">เริ่มต้นช้อปสมาร์ทกับ ShopAI</p>

        <Input label="ชื่อ" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <Input label="อีเมล" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Input label="เบอร์โทร" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
        <Input
          label="รหัสผ่าน"
          type="password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />

        {err ? <p className="mb-3 text-sm text-danger">{err}</p> : null}

        <Btn fullWidth type="submit" disabled={loading}>
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </Btn>

        <p className="mt-4 text-center text-sm text-ink-500">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="font-semibold text-[color:var(--c-primary)]">
            เข้าสู่ระบบ
          </Link>
        </p>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-ink-300 px-3 outline-none focus:border-[color:var(--c-primary)]"
      />
    </label>
  );
}
