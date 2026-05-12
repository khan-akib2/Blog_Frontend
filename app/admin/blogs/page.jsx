'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  XCircle, Trash2, Eye, Search, ChevronLeft,
  ChevronRight, Loader2, Filter, FileText, AlertCircle
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import ConfirmModal from '@/components/ConfirmModal';
import AdminBlogPreviewModal from '@/components/AdminBlogPreviewModal';

const statusConfig = {
  pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
  approved: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)'  },
  rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
  draft:    { color: '#7a90b8', bg: 'rgba(122,144,184,0.12)', border: 'rgba(122,144,184,0.25)' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.draft;
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {status}
    </span>
  );
}

function AdminBlogsContent() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, blogId: null, blogTitle: '' });
  const [previewBlog, setPreviewBlog] = useState(null); // blog meta for preview modal

  useEffect(() => { fetchBlogs(); }, [statusFilter, page, search]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/blogs?${params}`);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/blogs/${id}/approve`);
      toast.success('Blog approved!');
      fetchBlogs();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    try {
      await api.put(`/admin/blogs/${rejectModal}/reject`, { reason: rejectReason });
      toast.success('Blog rejected');
      setRejectModal(null);
      setRejectReason('');
      fetchBlogs();
    } catch { toast.error('Failed to reject'); }
  };

  const handleDelete = async (id) => {
    const blog = blogs.find((b) => b._id === id);
    setDeleteModal({ open: true, blogId: id, blogTitle: blog?.title || 'this blog' });
  };

  const handleConfirmDelete = async () => {
    const id = deleteModal.blogId;
    setDeleteModal({ open: false, blogId: null, blogTitle: '' });
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch { toast.error('Failed to delete'); }
  };

  const filterTabs = ['', 'pending', 'approved', 'rejected', 'draft'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Manage Blogs
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{pagination.total} total articles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search blogs by title or author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
            style={{ background: '#060b18', border: '1px solid #1a2744' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.4)'}
            onBlur={(e) => e.target.style.borderColor = '#1a2744'}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          {filterTabs.map((s) => {
            const active = statusFilter === s;
            const cfg = s ? statusConfig[s] : null;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={active
                  ? { background: cfg ? cfg.bg : 'rgba(79,142,247,0.15)', color: cfg ? cfg.color : '#4f8ef7', border: `1px solid ${cfg ? cfg.border : 'rgba(79,142,247,0.3)'}` }
                  : { background: 'rgba(26,39,68,0.4)', color: '#7a90b8', border: '1px solid #1a2744' }
                }
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y" style={{ borderColor: '#1a2744' }}>
            {blogs.map((blog) => (
              <div key={blog._id} className="p-4 flex items-start gap-3 hover:bg-[#111d35] transition-colors cursor-pointer"
                onClick={() => setPreviewBlog(blog)}>
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate mb-1">{blog.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{blog.category} · {blog.author?.name}</p>
                  <StatusBadge status={blog.status} />
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setPreviewBlog(blog)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-950/20 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(blog._id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No blogs found</p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'rgba(17,29,53,0.8)', borderBottom: '1px solid #1a2744' }}>
                <tr>
                  {['Blog', 'Author', 'Status', 'Date', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 ${i === 3 ? 'hidden md:table-cell' : ''} ${i === 4 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-t hover:bg-[#111d35] transition-colors cursor-pointer" style={{ borderColor: '#1a2744' }}
                    onClick={() => setPreviewBlog(blog)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {blog.thumbnail ? (
                          <img src={blog.thumbnail} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(79,142,247,0.1)' }}>
                            <FileText className="w-5 h-5 text-blue-400/50" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate max-w-[200px] hover:text-blue-400 transition-colors">{blog.title}</p>
                          <p className="text-xs text-gray-500">{blog.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-gray-300">{blog.author?.name}</p>
                      <p className="text-xs text-gray-500">{blog.author?.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-gray-400">{formatDate(blog.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setPreviewBlog(blog)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-950/20 transition-colors" title="Preview & Review">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(blog._id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No blogs found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400 px-3">
            Page {page} of {pagination.pages}
          </span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Reject Modal — kept for non-preview reject flow */}
      {rejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(248,113,113,0.15)' }}>
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Blog</h3>
                <p className="text-xs text-gray-400">Provide a reason for the author</p>
              </div>
            </div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none resize-none mb-4 transition-all"
              style={{ background: '#060b18', border: '1px solid #1a2744' }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(248,113,113,0.4)'}
              onBlur={(e) => e.target.style.borderColor = '#1a2744'}
            />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: 'rgba(26,39,68,0.5)', border: '1px solid #1a2744' }}>
                Cancel
              </button>
              <button onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
                Reject Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete Blog"
        message={`Permanently delete "${deleteModal.blogTitle}"? This cannot be undone.`}
        confirmText="Delete Blog"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ open: false, blogId: null, blogTitle: '' })}
      />

      {/* Admin Blog Preview Modal */}
      {previewBlog && (
        <AdminBlogPreviewModal
          blogMeta={previewBlog}
          onClose={() => setPreviewBlog(null)}
          onApprove={(id) => { setBlogs((prev) => prev.map((b) => b._id === id ? { ...b, status: 'approved' } : b)); }}
          onReject={(id) => { setBlogs((prev) => prev.map((b) => b._id === id ? { ...b, status: 'rejected' } : b)); }}
        />
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <AdminBlogsContent />
    </Suspense>
  );
}
