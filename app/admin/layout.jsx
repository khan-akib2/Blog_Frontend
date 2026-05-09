'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, FileText, Users, Loader2, PenSquare, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/admin-login';
    }
  }, [loading, user]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/blogs', label: 'Blogs', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin-login';
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-[#161b22] border-r border-[#21262d]">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#21262d]">
          <PenSquare className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-white">BlogHub</span>
          <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8b949e] hover:bg-[#1c2128] hover:text-[#e6edf3]'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[#21262d]">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-[#8b949e] truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#8b949e] hover:bg-red-900/30 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-[#21262d] flex z-40">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${pathname === href ? 'text-blue-400' : 'text-[#8b949e]'}`}>
            <Icon className="w-5 h-5 mb-1" /> {label}
          </Link>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#21262d] bg-[#161b22]">
          <h1 className="text-sm font-semibold text-[#8b949e] capitalize">
            {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
          </h1>
          <Link href="/" className="text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors">← Back to site</Link>
        </header>
        <main className="flex-1 overflow-auto p-6 pb-24 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
