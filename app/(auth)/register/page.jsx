'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to BlogHub.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">

      {/* ── LEFT — purple panel ── */}
      <div className="relative hidden w-1/2 md:block">
        {/* Blue gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #3b82f6 0%, #1d4ed8 50%, #1e3a8a 100%)',
          }}
        />
        {/* Diagonal cut — black triangle over purple (right side) */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: '#ffffff',
            clipPath: 'polygon(70% 0, 100% 0, 100% 100%)',
          }}
        />
        {/* Content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-16 text-center">
          <h2 className="mb-4 text-6xl font-extrabold uppercase leading-tight tracking-wide text-white">
            WELCOME<br />BACK!
          </h2>
          <p className="text-base leading-relaxed text-blue-200">
            Join BlogHub and start sharing<br />your stories with the world.
          </p>
        </div>
      </div>

      {/* ── RIGHT — dark form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-10 py-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-5xl font-bold text-gray-900 font-serif">Sign Up</h1>
          <p className="mb-10 text-sm text-gray-500">Create your account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="relative">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                className="w-full border-b border-gray-300 bg-transparent py-3 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <User className="absolute right-0 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full border-b border-gray-300 bg-transparent py-3 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full border-b border-gray-300 bg-transparent py-3 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3">
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Lock className="h-4 w-4 text-gray-400" />}
              </button>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Confirm Password"
                className="w-full border-b border-gray-300 bg-transparent py-3 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <Lock className="absolute right-0 top-3 h-4 w-4 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 4px 20px rgba(59,130,246,0.5)' }}
            >
              {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
