'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, FileText, Users, Loader2, Zap, LogOut,
  ChevronRight, Bell, Settings, Menu, X, Shield
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/admin-login';
    }
  }, [loading, user]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#060b18' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap className="w-7 h-7 text-white" fill="white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & analytics' },
    { href: '/admin/blogs', label: 'Blogs', icon: FileText, desc: 'Manage content' },
    { href: '/admin/users', label: 'Users', icon: Users, desc: 'Manage accounts' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin-login';
  };

  const currentPage = pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop();
  const currentPageCapitalized = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div className="flex min-h-screen" style={{ background: '#060b18', color: '#e8f0fe' }}>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0d1526', borderRight: '1px solid #1a2744' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1a2744' }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-white tracking-tight">BlogHub</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">Admin Console</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(79,142,247,0.2)', color: '#4f8ef7' }}>
            <Shield className="w-2.5 h-2.5" /> Admin
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Navigation</p>
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#111d35]'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))',
                  borderLeft: '3px solid #4f8ef7',
                  paddingLeft: '9px'
                } : {}}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 transition-all ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`}
                  style={active ? { background: 'rgba(79,142,247,0.15)' } : {}}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate">{label}</p>
                  <p className="text-[10px] font-normal text-gray-500 truncate">{desc}</p>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-blue-400 ml-auto flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3" style={{ borderTop: '1px solid #1a2744' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1"
            style={{ background: 'rgba(79,142,247,0.05)', border: '1px solid rgba(26,39,68,0.5)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 sticky top-0 z-30"
          style={{ background: 'rgba(6,11,24,0.9)', borderBottom: '1px solid #1a2744', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#111d35] transition-colors md:hidden">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>
                {pathname !== '/admin' && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-300">{currentPageCapitalized}</span>
                  </>
                )}
              </div>
              <h1 className="text-base font-bold text-white">{currentPageCapitalized}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#111d35] transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>
            <Link href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#111d35] transition-colors">
              ← Back to site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: '#0d1526', borderTop: '1px solid #1a2744' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold transition-colors ${active ? 'text-blue-400' : 'text-gray-500'}`}>
              <Icon className="w-5 h-5 mb-1" /> {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
