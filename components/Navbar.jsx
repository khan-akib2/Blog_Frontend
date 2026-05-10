'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import {
  Sun, Moon, Menu, X, PenSquare, User, LogOut,
  LayoutDashboard, Bookmark, ChevronDown, Zap, Shield
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [pathname]);
  useEffect(() => {
    if (!dropdownOpen) return;
    const fn = (e) => { if (!e.target.closest('#user-menu')) setDropdownOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [dropdownOpen]);

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navLinks = [['/', 'Home'], ['/blogs', 'Blogs'], ['/categories', 'Categories']];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled
        ? 'bg-white/90 dark:bg-[#060b18]/90 backdrop-blur-2xl border-b border-blue-100/80 dark:border-[#1a2744]/80 shadow-lg shadow-blue-500/5 dark:shadow-blue-900/10'
        : 'bg-white/70 dark:bg-[#060b18]/70 backdrop-blur-xl border-b border-transparent'
    }`}>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
            <Zap className="h-4.5 w-4.5 text-white" fill="white" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' }} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-tight text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)' }}>
              Blog<span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
            </span>
            <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-400 dark:text-gray-500">by NIT</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive(href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {isActive(href) && (
                <span className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-950/40" />
              )}
              <span className="relative">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#111d35] hover:text-gray-900 dark:hover:text-white transition-all duration-200"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />}
            </button>
          )}

          {user ? (
            <>
              <Link
                href="/write"
                className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-600/40"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
              >
                <PenSquare className="h-3.5 w-3.5" /> Write
              </Link>

              <div id="user-menu" className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-gray-100 dark:hover:bg-[#111d35]"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/30" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className={`hidden h-3.5 w-3.5 text-gray-400 transition-transform duration-200 md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200/80 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] shadow-2xl shadow-black/15 dark:shadow-black/50">
                    {/* User info header */}
                    <div className="px-4 py-4 border-b border-gray-100 dark:border-[#1a2744]"
                      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(124,58,237,0.05))' }}>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/20" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
                        { href: '/profile', icon: User, label: 'Edit Profile' },
                        { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111d35] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" /> {label}
                        </Link>
                      ))}
                      {user.role === 'admin' && (
                        <Link href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 dark:border-[#1a2744] py-2">
                      <button onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35] hover:text-gray-900 dark:hover:text-white transition-all duration-200">
                Sign in
              </Link>
              <Link href="/register"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
                Get started
              </Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#111d35] transition-colors md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 dark:border-[#1a2744] bg-white/95 dark:bg-[#060b18]/95 backdrop-blur-xl px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={href}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(href)
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35]'
                }`}>
                {label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-100 dark:border-[#1a2744]" />
            {user ? (
              <>
                <Link href="/write" className="rounded-xl px-4 py-3 text-sm font-semibold text-white text-center"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  ✍️ Write a Blog
                </Link>
                <Link href="/dashboard" className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35]">Dashboard</Link>
                <Link href="/profile" className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35]">Profile</Link>
                <Link href="/bookmarks" className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35]">Bookmarks</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">Admin Panel</Link>
                )}
                <button onClick={logout} className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111d35]">Sign in</Link>
                <Link href="/register" className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  Get started free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
