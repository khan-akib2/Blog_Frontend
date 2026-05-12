'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import {
  Bell, CheckCheck, Trash2, Loader2, CheckCircle, XCircle,
  MessageCircle, Star, Zap
} from 'lucide-react';
import { formatRelativeDate } from '@/utils/helpers';

const typeConfig = {
  blog_approved:  { icon: CheckCircle,  color: '#34d399', bg: 'rgba(52,211,153,0.1)',   label: 'Approved'  },
  blog_rejected:  { icon: XCircle,      color: '#f87171', bg: 'rgba(248,113,113,0.1)',  label: 'Rejected'  },
  new_comment:    { icon: MessageCircle,color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   label: 'Comment'   },
  blog_featured:  { icon: Star,         color: '#facc15', bg: 'rgba(250,204,21,0.1)',   label: 'Featured'  },
  report_reviewed:{ icon: CheckCircle,  color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  label: 'Report'    },
};

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth?mode=login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications?limit=50');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {}
    finally { setLoading(false); }
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Inbox
          </p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">No notifications yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">You'll be notified when your blogs are reviewed or get comments</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.blog_approved;
            const Icon = cfg.icon;
            return (
              <div
                key={n._id}
                onClick={() => { handleMarkRead(n._id); if (n.link) router.push(n.link); }}
                className="group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md"
                style={{
                  background: n.isRead
                    ? 'var(--card-bg, white)'
                    : 'linear-gradient(135deg, rgba(37,99,235,0.03), rgba(124,58,237,0.03))',
                  borderColor: n.isRead ? 'var(--border, #e2e8f0)' : 'rgba(37,99,235,0.15)',
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: cfg.bg }}>
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${n.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{formatRelativeDate(n.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
