'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield, Loader2, ArrowLeft, Lock, Mail } from 'lucide-react';

const inputCls = "w-full border-b bg-transparent py-3 pr-8 text-sm placeholder-gray-400 focus:outline-none transition-colors border-gray-300 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white dark:placeholder-gray-600";

export default function AdminLoginPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      if (data.user.role !== 'admin') {
        toast.error('Access denied. This portal is for admins only.');
        return;
      }

      sessionStorage.setItem('admin_token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      updateUser(data.user);

      toast.success(`Welcome back, ${data.user.name}`);
      window.location.href = '/admin';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0f]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  const FormContent = (
    <>
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to site
      </Link>

      <h1 className="mb-1 text-5xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
        Admin Login
      </h1>
      <p className="mb-10 text-sm text-gray-500">Restricted access — authorized personnel only</p>

      {/* Warning */}
      <div className="mb-8 flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
        <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          This portal is for administrators only. Regular users should use the{' '}
          <Link href="/login" className="underline font-semibold hover:text-amber-500">user login</Link> instead.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email address"
            className={inputCls}
          />
          <Mail className="absolute right-0 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className={inputCls}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3">
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Lock className="h-4 w-4 text-gray-400" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 4px 20px rgba(59,130,246,0.5)' }}
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
            : <><Shield className="w-4 h-4" /> Sign In to Admin Panel</>
          }
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Secure connection
        </div>
        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
        <span>JWT Protected</span>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Not an admin?{' '}
        <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
          User login →
        </Link>
      </p>
    </>
  );

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0f]">

      {/* ── DESKTOP split layout ── */}
      <div className="hidden md:flex w-full min-h-screen">

        {/* Left — form */}
        <div className="flex items-center justify-center w-[55%] px-16 py-20">
          <div className="w-full max-w-md">{FormContent}</div>
        </div>

        {/* Right — blue panel */}
        <div className="relative w-[45%] overflow-hidden"
          style={{ background: 'linear-gradient(160deg,#1e3a8a 0%,#1d4ed8 45%,#3b82f6 100%)' }}>

          {/* Diagonal clip on the left edge */}
          <div className="absolute inset-y-0 left-0 bg-white dark:bg-[#0a0a0f]"
            style={{ width: 'calc(16% + 2px)', clipPath: 'polygon(0 0,100% 0,0 100%)' }} />

          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-16 text-center">
            {/* Shield icon */}
            <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Shield className="w-10 h-10 text-white" />
              <div className="absolute translate-x-5 -translate-y-5 w-4 h-4 rounded-full bg-green-400 border-2 border-blue-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            <h2 className="text-5xl font-extrabold uppercase leading-tight tracking-wide text-white mb-4">
              ADMIN<br />PORTAL
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              Manage content, review submissions, and keep BlogHub running at its best.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { val: '1.2K+', label: 'Articles' },
                { val: '500+', label: 'Writers' },
                { val: '50K+', label: 'Readers' },
                { val: '99.9%', label: 'Uptime' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center py-3 px-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <p className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>{val}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen w-full px-8 py-16 bg-white dark:bg-[#0a0a0f]">
        <div className="w-full max-w-sm">{FormContent}</div>
      </div>

    </div>
  );
}
