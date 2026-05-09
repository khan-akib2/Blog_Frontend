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
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
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
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="hidden md:flex w-60 flex-col bg-gray-900 border-r border-gray-800">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
          <PenSquare className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white">BlogHub</span>
          <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${pathname === href ? 'text-indigo-400' : 'text-gray-500'}`}>
            <Icon className="w-5 h-5 mb-1" /> {label}
          </Link>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
          <h1 className="text-sm font-semibold text-gray-300 capitalize">
            {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
          </h1>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Back to site</Link>
        </header>
        <main className="flex-1 overflow-auto p-6 pb-24 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
