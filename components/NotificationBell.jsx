'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Trash2, X, Loader2, CheckCircle, XCircle, MessageCircle, Star } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeDate } from '@/utils/helpers';

const typeConfig = {
  blog_approved:  { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  blog_rejected:  { icon: XCircle,     color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  new_comment:    { icon: MessageCircle,color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  blog_featured:  { icon: Star,        color: '#facc15', bg: 'rgba(250,204,21,0.12)'  },
  report_reviewed:{ icon: CheckCircle, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Poll unread count every 30 seconds
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications?limit=15');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {}
    finally { setLoading(false); }
  };

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  if (!user) return null;

  // Detect if we're inside the admin panel (dark background regardless of theme)
  const isAdmin = user?.role === 'admin';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl transition-colors"
        style={{
          color: '#9ca3af',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.background = '#111d35';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9ca3af';
          e.currentTarget.style.background = 'transparent';
        }}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ background: '#0d1526', border: '1px solid #1a2744', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1a2744' }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-950/20 transition-colors" title="Mark all read">
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a2744] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.blog_approved;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n._id}
                    onClick={() => { handleMarkRead(n._id); if (n.link) window.location.href = n.link; }}
                    className="group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#111d35] border-b"
                    style={{
                      borderColor: '#1a2744',
                      background: n.isRead ? 'transparent' : 'rgba(37,99,235,0.04)',
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 mt-0.5"
                      style={{ background: cfg.bg }}>
                      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${n.isRead ? 'text-gray-400' : 'text-white'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{formatRelativeDate(n.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, n._id)}
                        className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: '#1a2744' }}>
              <Link href="/notifications" onClick={() => setOpen(false)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
