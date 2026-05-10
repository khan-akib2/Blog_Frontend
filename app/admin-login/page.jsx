'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield, Loader2, ArrowLeft, Lock, Zap, Code2, Database, Globe } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b18' }}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1a3a 50%, #1a0a3a 100%)' }}>

      {/* Tech grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(79,142,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(ellipse, #2563eb, transparent)' }} />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </div>

      {/* Floating tech icons */}
      <div className="absolute top-20 left-10 opacity-10 animate-float hidden lg:block">
        <Code2 className="w-8 h-8 text-blue-400" />
      </div>
      <div className="absolute top-40 right-16 opacity-10 hidden lg:block" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>
        <Database className="w-6 h-6 text-purple-400" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-10 hidden lg:block" style={{ animation: 'float 6s ease-in-out infinite 2s' }}>
        <Globe className="w-7 h-7 text-blue-300" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>

        {/* Card */}
        <div className="rounded-3xl border p-8 shadow-2xl"
          style={{
            background: 'rgba(13, 21, 38, 0.9)',
            border: '1px solid rgba(26, 39, 68, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.05)'
          }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 relative"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(79,142,247,0.2)' }}>
              <Shield className="w-9 h-9 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0d1526] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
              Admin Portal
            </h1>
            <p className="text-sm text-gray-400">Restricted access — authorized personnel only</p>
          </div>

          {/* Warning banner */}
          <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">
              This portal is for administrators only. Regular users should use the{' '}
              <Link href="/login" className="underline hover:text-amber-200 font-semibold">user login</Link> instead.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{
                  background: 'rgba(6, 11, 24, 0.8)',
                  border: '1px solid rgba(26, 39, 68, 0.8)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(26, 39, 68, 0.8)'}
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(6, 11, 24, 0.8)',
                    border: '1px solid rgba(26, 39, 68, 0.8)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26, 39, 68, 0.8)'}
                  placeholder="••••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: submitting ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: submitting ? 'none' : '0 8px 24px rgba(37,99,235,0.3)'
              }}
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                : <><Shield className="w-4 h-4" /> Sign In to Admin Panel</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-[#1a2744]">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Secure connection
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-blue-500" />
                JWT Protected
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Not an admin?{' '}
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors font-semibold">
            User login →
          </Link>
        </p>
      </div>
    </div>
  );
}
