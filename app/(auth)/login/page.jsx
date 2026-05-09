'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') {
        toast.error('Please use the admin login portal.');
        localStorage.removeItem('token');
        router.push('/admin-login');
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0f] transition-colors duration-300">

      {/* ── LEFT — dark form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-10 py-16 relative">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-5xl font-bold text-gray-900 dark:text-white font-serif transition-colors">Login</h1>
          <p className="mb-10 text-sm text-gray-500">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full border-b border-gray-300 dark:border-gray-700 bg-transparent py-3 pr-8 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <Mail className="absolute right-0 top-3 h-4 w-4 text-gray-400 dark:text-gray-600 transition-colors" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full border-b border-gray-300 dark:border-gray-700 bg-transparent py-3 pr-8 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3">
                {showPassword
                  ? <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-600 transition-colors" />
                  : <Lock className="h-4 w-4 text-gray-400 dark:text-gray-600 transition-colors" />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 4px 20px rgba(59,130,246,0.5)' }}
            >
              {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── DIAGONAL DIVIDER + RIGHT purple panel ── */}
      <div className="relative hidden w-1/2 md:block">
        {/* Diagonal cut — black/white triangle over blue */}
        <div
          className="absolute inset-0 z-10 bg-white dark:bg-[#0a0a0f] transition-colors duration-300"
          style={{
            clipPath: 'polygon(0 0, 30% 0, 0 100%)',
          }}
        />
        {/* Blue gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 40%, #3b82f6 100%)',
          }}
        />
        {/* Content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-16 text-center">
          <h2 className="mb-4 text-6xl font-extrabold uppercase leading-tight tracking-wide text-white">
            WELCOME<br />BACK!
          </h2>
          <p className="text-base leading-relaxed text-blue-200">
            Sign in to explore, write, and share<br />your stories with the world.
          </p>
        </div>
      </div>
    </div>
  );
}
