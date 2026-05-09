'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Menu, X, PenSquare, User, LogOut, LayoutDashboard, Bookmark, ChevronDown } from 'lucide-react';

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
    const fn = () => setScrolled(window.scrollY > 8);
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled
        ? 'bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#21262d]'
        : 'bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-[#21262d]'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <PenSquare className="h-5 w-5" />
          <span>BlogHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {[['/', 'Home'], ['/blogs', 'Blogs'], ['/categories', 'Categories']].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-[#8b949e] dark:hover:text-[#e6edf3]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-[#8b949e] dark:hover:bg-[#1c2128] dark:hover:text-[#e6edf3] transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {user ? (
            <>
              <Link
                href="/write"
                className="hidden items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors md:flex"
              >
                <PenSquare className="h-4 w-4" /> Write
              </Link>

              <div id="user-menu" className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-[#1c2128]"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/30" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className={`hidden h-4 w-4 text-gray-400 transition-transform md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-[#21262d] dark:bg-[#161b22]">
                    <div className="border-b border-gray-100 dark:border-[#21262d] px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-[#e6edf3]">{user.name}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-[#8b949e]">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { href: '/profile', icon: User, label: 'Profile' },
                        { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#8b949e] hover:bg-gray-50 dark:hover:bg-[#1c2128] hover:text-gray-900 dark:hover:text-[#e6edf3] transition-colors">
                          <Icon className="h-4 w-4" /> {label}
                        </Link>
                      ))}
                      {user.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 dark:border-[#21262d] py-1">
                      <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128] hover:text-gray-900 dark:hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128] transition-colors md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {[['/', 'Home'], ['/blogs', 'Blogs'], ['/categories', 'Categories']].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]">{label}</Link>
            ))}
            <div className="my-2 border-t border-gray-100 dark:border-[#21262d]" />
            {user ? (
              <>
                <Link href="/write" className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">Write a Blog</Link>
                <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]">Dashboard</Link>
                <Link href="/profile" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#1c2128]">Profile</Link>
                {user.role === 'admin' && <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400">Admin Panel</Link>}
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-[#8b949e]">Login</Link>
                <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
