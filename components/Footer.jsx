'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, GitBranch, AtSign, Link2, Mail, ArrowUpRight, Code2, Globe, Shield, CheckCircle, Send } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribing(true);
    // Simulate subscription (replace with real API call when ready)
    setTimeout(() => {
      setSubscribed(true);
      setSubscribing(false);
      setEmail('');
    }, 800);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#060b18] text-gray-300">
      {/* Top gradient line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #2563eb, #7c3aed, transparent)' }} />

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Glow blobs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 mb-14">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
                <Zap className="h-5 w-5 text-white" fill="white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-white tracking-tight">
                  Blog<span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-500">by NIT</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs mb-6">
              A next-generation publishing platform built for thinkers, creators, and innovators. Share ideas that move the world forward.
            </p>
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Next.js', 'Node.js', 'MongoDB'].map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-400 border border-[#1a2744] bg-[#0d1526]">
                  <Code2 className="w-3 h-3" /> {tech}
                </span>
              ))}
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: GitBranch, href: '#', label: 'GitHub' },
                { icon: AtSign,    href: '#', label: 'Twitter' },
                { icon: Link2,     href: '#', label: 'LinkedIn' },
                { icon: Mail,      href: '#', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a2744] bg-[#0d1526] text-gray-400 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-950/30 transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Platform</h3>
              <ul className="space-y-3">
                {[
                  ['Home', '/'],
                  ['Explore Blogs', '/blogs'],
                  ['Categories', '/categories'],
                  ['Trending', '/blogs?sort=-views'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}
                      className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Writers</h3>
              <ul className="space-y-3">
                {[
                  ['Start Writing', '/write'],
                  ['Dashboard', '/dashboard'],
                  ['My Profile', '/profile'],
                  ['Bookmarks', '/bookmarks'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}
                      className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Account</h3>
              <ul className="space-y-3">
                {[
                  ['Sign In', '/login'],
                  ['Create Account', '/register'],
                  ['Admin Portal', '/admin-login'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}
                      className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="rounded-2xl border border-[#1a2744] p-6 mb-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.2)' }}>
                <Send className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Stay in the loop</p>
                <p className="text-xs text-gray-400 mt-0.5">Get the best articles delivered to your inbox weekly.</p>
              </div>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-green-400"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <CheckCircle className="h-4 w-4" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto" suppressHydrationWarning>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 sm:w-52 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                  style={{ background: 'rgba(6,11,24,0.8)', border: '1px solid #1a2744' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = '#1a2744'}
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 16px rgba(37,99,235,0.25)' }}
                  suppressHydrationWarning
                >
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1a2744] pt-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe className="h-3.5 w-3.5" />
            <span>© {year} BlogHub by NIT. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            <span>Secure & Trusted Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
