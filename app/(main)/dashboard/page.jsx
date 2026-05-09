'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { PenSquare, Eye, Clock, Trash2, Edit, Loader2, Filter } from 'lucide-react';
import { formatDate, getStatusColor } from '@/utils/helpers';

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

  const stats = {
    total: pagination.total,
    approved: blogs.filter((b) => b.status === 'approved').length,
    pending: blogs.filter((b) => b.status === 'pending').length,
    draft: blogs.filter((b) => b.status === 'draft').length,
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link href="/write" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium">
          <PenSquare className="w-4 h-4" /> New Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: pagination.total, color: 'text-gray-900 dark:text-white' },
          { label: 'Approved', value: blogs.filter((b) => b.status === 'approved').length, color: 'text-green-600 dark:text-green-400' },
          { label: 'Pending', value: blogs.filter((b) => b.status === 'pending').length, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Drafts', value: blogs.filter((b) => b.status === 'draft').length, color: 'text-gray-500 dark:text-gray-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-gray-400" />
        {['', 'draft', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog list */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : blogs.length > 0 ? (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              {blog.thumbnail && (
                <img src={blog.thumbnail} alt={blog.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                    {blog.status}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{blog.category}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{blog.title}</h3>
                {blog.status === 'rejected' && blog.rejectionReason && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">Reason: {blog.rejectionReason}</p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(blog.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {blog.status !== 'approved' && (
                  <Link href={`/write?edit=${blog._id}`} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                )}
                {blog.status === 'approved' && (
                  <Link href={`/blogs/${blog.slug}`} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
          <p className="text-lg mb-3">No blogs yet</p>
          <Link href="/write" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Write your first blog →</Link>
        </div>
      )}
    </div>
  );
}
