'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  AlertTriangle, Eye, Trash2, CheckCircle, Loader2,
  ChevronLeft, ChevronRight, Flag, User, Calendar
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import ConfirmModal from '@/components/ConfirmModal';
import AdminBlogPreviewModal from '@/components/AdminBlogPreviewModal';

const reasonLabels = {
  spam: { label: 'Spam', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  offensive: { label: 'Offensive', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  fake: { label: 'Fake Info', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  other: { label: 'Other', color: '#7a90b8', bg: 'rgba(122,144,184,0.12)' },
};

export default function AdminReportsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [dismissModal, setDismissModal] = useState({ open: false, blogId: null, blogTitle: '' });
  const [previewBlog, setPreviewBlog] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => { fetchReports(); }, [page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/reports?page=${page}&limit=10`);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (blog) => {
    setDismissModal({ open: true, blogId: blog._id, blogTitle: blog.title });
  };

  const handleConfirmDismiss = async () => {
    const id = dismissModal.blogId;
    setDismissModal({ open: false, blogId: null, blogTitle: '' });
    try {
      await api.put(`/admin/reports/${id}/dismiss`);
      toast.success('Reports dismissed');
      fetchReports();
    } catch {
      toast.error('Failed to dismiss reports');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Reported Blogs
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{pagination.total} blogs with reports</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <CheckCircle className="w-12 h-12 text-green-500/40 mx-auto mb-3" />
          <p className="text-white font-bold mb-1">No reports to review</p>
          <p className="text-sm text-gray-500">All clear! No blogs have been reported.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="rounded-2xl overflow-hidden" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
              {/* Blog header */}
              <div className="p-4 flex items-start gap-4">
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                      <Flag className="w-3 h-3 inline mr-1" />{blog.reportCount} report{blog.reportCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-500">{blog.category}</span>
                  </div>
                  <h3 className="font-bold text-white truncate">{blog.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{blog.author?.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setPreviewBlog(blog)}
                    className="p-2 rounded-xl text-gray-500 hover:text-blue-400 hover:bg-blue-950/20 transition-colors" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedBlog(expandedBlog === blog._id ? null : blog._id)}
                    className="p-2 rounded-xl text-gray-500 hover:text-amber-400 hover:bg-amber-950/20 transition-colors" title="View reports">
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDismiss(blog)}
                    className="p-2 rounded-xl text-gray-500 hover:text-green-400 hover:bg-green-950/20 transition-colors" title="Dismiss all reports">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded reports */}
              {expandedBlog === blog._id && (
                <div className="border-t px-4 pb-4 pt-3 space-y-2" style={{ borderColor: '#1a2744' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Individual Reports</p>
                  {blog.reports?.map((report, i) => {
                    const cfg = reasonLabels[report.reason] || reasonLabels.other;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(26,39,68,0.4)' }}>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">{report.user?.name || 'Anonymous'}</p>
                          {report.description && (
                            <p className="text-xs text-gray-300 mt-0.5">{report.description}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 flex-shrink-0">{formatDate(report.createdAt)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
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
          <span className="text-sm font-semibold text-gray-400 px-3">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <ConfirmModal
        open={dismissModal.open}
        title="Dismiss Reports"
        message={`Dismiss all reports for "${dismissModal.blogTitle}"? The blog will remain published.`}
        confirmText="Dismiss Reports"
        onConfirm={handleConfirmDismiss}
        onCancel={() => setDismissModal({ open: false, blogId: null, blogTitle: '' })}
      />

      {previewBlog && (
        <AdminBlogPreviewModal
          blogMeta={previewBlog}
          onClose={() => setPreviewBlog(null)}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
}
