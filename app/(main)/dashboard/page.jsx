'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  PenSquare, Eye, Clock, Trash2, Edit, Loader2, Filter,
  FileText, CheckCircle, AlertCircle, BookOpen, TrendingUp, Zap
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/utils/helpers';

const statusConfig = {
  approved: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  draft:    { color: '#7a90b8', bg: 'rgba(122,144,184,0.1)', border: 'rgba(122,144,184,0.2)' },
  rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchBlogs();
  }, [user, statusFilter, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/blogs/my?${params}`);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  const statItems = [
    { label: 'Total',    value: pagination.total,                                    icon: BookOpen,    color: '#4f8ef7', glow: 'rgba(37,99,235,0.12)'   },
    { label: 'Approved', value: blogs.filter(b => b.status === 'approved').length,   icon: CheckCircle, color: '#34d399', glow: 'rgba(52,211,153,0.12)'  },
    { label: 'Pending',  value: blogs.filter(b => b.status === 'pending').length,    icon: Clock,       color: '#f59e0b', glow: 'rgba(245,158,11,0.12)'  },
    { label: 'Drafts',   value: blogs.filter(b => b.status === 'draft').length,      icon: FileText,    color: '#7a90b8', glow: 'rgba(122,144,184,0.1)'  },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Writer Dashboard
          </p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your published content</p>
        </div>
        <Link href="/write"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
          <PenSquare className="w-4 h-4" /> New Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statItems.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label}
            className="group rounded-2xl p-5 border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] transition-all duration-300 hover:-translate-y-1 text-center"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-3 transition-transform group-hover:scale-110"
              style={{ background: glow, border: `1px solid ${color}25` }}>
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}>
              {value}
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {['', 'draft', 'pending', 'approved', 'rejected'].map((s) => {
          const active = statusFilter === s;
          const cfg = s ? statusConfig[s] : null;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={active
                ? { background: cfg ? cfg.bg : 'rgba(37,99,235,0.1)', color: cfg ? cfg.color : '#4f8ef7', border: `1px solid ${cfg ? cfg.border : 'rgba(37,99,235,0.2)'}` }
                : { background: 'transparent', color: '#94a3b8', border: '1px solid #e2e8f0' }
              }
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Blog list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : blogs.length > 0 ? (
        <div className="space-y-3">
          {blogs.map((blog) => {
            const cfg = statusConfig[blog.status] || statusConfig.draft;
            return (
              <div key={blog._id}
                className="group bg-white dark:bg-[#0d1526] rounded-2xl border border-gray-100 dark:border-[#1a2744] p-4 flex items-center gap-4 transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-500/5">
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt={blog.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {blog.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{blog.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                    {blog.title}
                  </h3>
                  {blog.status === 'rejected' && blog.rejectionReason && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {blog.rejectionReason}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {blog.status !== 'approved' && (
                    <Link href={`/write?edit=${blog._id}`}
                      className="p-2 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                      title="Edit">
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  <Link href={`/blogs/${blog.slug}?preview=true`}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                    title="Preview">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(blog._id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
            <PenSquare className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">No blogs yet</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Start writing and share your ideas with the world</p>
          <Link href="/write"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            Write your first blog →
          </Link>
        </div>
      )}
    </div>
  );
}
