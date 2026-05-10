'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Menu, X, PenSquare, User, LogOut, LayoutDashboard, Bookmark, ChevronDown, Search } from 'lucide-react';

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
    const fn = () => setScrolled(window.scrollY > 12);
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

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-[#21262d]/80 shadow-sm'
        : 'bg-white dark:bg-[#0d1117] border-b border-gray-100 dark:border-[#21262d]'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/30 transition-transform group-hover:scale-105">
            <PenSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-[#f0f6fc] tracking-tight">
            Blog<span className="text-blue-600 dark:text-blue-400">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[['/', 'Home'], ['/blogs', 'Blogs'], ['/categories', 'Categories']].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(href)
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                  : 'text-gray-600 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-[#f0f6fc] hover:bg-gray-100 dark:hover:bg-[#1c2128]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="rounded-lg p-2 text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128] hover:text-gray-900 dark:hover:text-[#f0f6fc] transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}

          {user ? (
            <>
              <Link
                href="/write"
                className="hidden items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:shadow-blue-600/30 md:flex"
              >
                <PenSquare className="h-3.5 w-3.5" /> Write
              </Link>

              <div id="user-menu" className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-[#1c2128]"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className={`hidden h-3.5 w-3.5 text-gray-400 transition-transform duration-200 md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] shadow-xl shadow-black/10 dark:shadow-black/40">
                    <div className="border-b border-gray-100 dark:border-[#21262d] px-4 py-3.5">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-[#f0f6fc]">{user.name}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-[#8b949e] mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { href: '/profile', icon: User, label: 'Profile' },
                        { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-50 dark:hover:bg-[#1c2128] hover:text-gray-900 dark:hover:text-[#f0f6fc] transition-colors">
                          <Icon className="h-4 w-4 text-gray-400 dark:text-[#8b949e]" /> {label}
                        </Link>
                      ))}
                      {user.role === 'admin' && (
                        <Link href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 dark:border-[#21262d] py-1.5">
                      <button onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128] hover:text-gray-900 dark:hover:text-[#f0f6fc] transition-colors">
                Sign in
              </Link>
              <Link href="/register"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all">
                Get started
              </Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128] transition-colors md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 dark:border-[#21262d] bg-white dark:bg-[#0d1117] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {[['/', 'Home'], ['/blogs', 'Blogs'], ['/categories', 'Categories']].map(([href, label]) => (
              <Link key={href} href={href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href) ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]'}`}>
                {label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-100 dark:border-[#21262d]" />
            {user ? (
              <>
                <Link href="/write" className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">Write a Blog</Link>
                <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]">Dashboard</Link>
                <Link href="/profile" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]">Profile</Link>
                {user.role === 'admin' && <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400">Admin Panel</Link>}
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e]">Sign in</Link>
                <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
