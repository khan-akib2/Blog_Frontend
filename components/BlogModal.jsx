'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  X, Heart, Bookmark, Share2, MessageCircle, Send, Trash2,
  Clock, Eye, ChevronDown, ChevronUp,
} from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/utils/helpers';

export default function BlogModal({ blog: initialBlog, onClose }) {
  const { user } = useAuth();
  const [blog, setBlog] = useState(initialBlog);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (user) setLiked(blog.likes?.includes(user._id));
    fetchComments();
  }, [user]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/blogs/${blog._id}/comments`);
      setComments(data.comments);
    } catch {}
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    try {
      const { data } = await api.post(`/blogs/${blog._id}/like`);
      setLiked(data.liked);
      setBlog((b) => ({ ...b, likes: { length: data.likes } }));
    } catch {}
  };

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to bookmark');
    try {
      const { data } = await api.post(`/blogs/${blog._id}/bookmark`);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks');
    } catch {}
  };

  const handleShare = () => {
    const url = `${window.location.origin}/blogs/${blog.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!commentText.trim()) return;
    setLoadingComment(true);
    try {
      const { data } = await api.post(`/blogs/${blog._id}/comments`, { content: commentText });
      setComments((prev) => [data.comment, ...prev]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/blogs/${blog._id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {}
  };

  const hasFaqs = blog.faqs?.length > 0;
  const hasConclusion = blog.conclusion?.trim();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        {/* ── Sticky header ── */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0"
              style={{ background: '#2563eb' }}
            >
              {blog.category}
            </span>
            <h2
              className="text-sm font-bold text-gray-900 dark:text-white truncate"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {blog.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a2744] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-6">

          {/* Meta row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <Link href={`/author/${blog.author?._id}`} className="flex items-center gap-3 group" onClick={onClose}>
              {blog.author?.avatar ? (
                <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {blog.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {blog.author?.name}
                </p>
                <p className="text-xs text-gray-400">{formatDate(blog.createdAt)}</p>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blog.readingTime || 1} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{blog.views || 0} views</span>
            </div>
          </div>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="mb-7 rounded-xl overflow-hidden">
              <img src={blog.thumbnail} alt={blog.title} className="w-full h-56 sm:h-72 object-cover" />
            </div>
          )}

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#111d35] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#1a2744]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Main content */}
          <div
            className="blog-content text-gray-800 dark:text-gray-200 mb-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* ── FAQ Section ── */}
          {hasFaqs && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {blog.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl border overflow-hidden transition-colors"
                    style={{ borderColor: openFaq === i ? 'rgba(37,99,235,0.3)' : 'var(--border)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Q{i + 1}. {faq.question}
                      </span>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t"
                        style={{ borderColor: 'var(--border)' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Conclusion Section ── */}
          {hasConclusion && (
            <div className="mb-8 rounded-xl p-5 border"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.04))', borderColor: 'rgba(37,99,235,0.15)' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                Conclusion
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {blog.conclusion}
              </p>
            </div>
          )}

          {/* ── Action bar ── */}
          <div className="flex items-center gap-3 py-5 border-t border-b mb-8"
            style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                liked
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                  : 'border-gray-200 dark:border-[#1a2744] text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {blog.likes?.length || 0}
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                bookmarked
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'border-gray-200 dark:border-[#1a2744] text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              Save
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#1a2744] text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 text-sm font-medium transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* ── Author bio ── */}
          {blog.author?.bio && (
            <div className="rounded-xl p-5 mb-8 border"
              style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-2">
                {blog.author.avatar ? (
                  <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {blog.author.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{blog.author.name}</p>
                  <Link href={`/author/${blog.author._id}`} onClick={onClose}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View profile
                  </Link>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{blog.author.bio}</p>
            </div>
          )}

          {/* ── Comments ── */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Comments ({comments.length})
            </h3>

            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                    />
                    <button
                      type="submit"
                      disabled={loadingComment || !commentText.trim()}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 rounded-xl border text-center text-sm text-gray-500 dark:text-gray-400"
                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                <Link href="/login" onClick={onClose} className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link> to leave a comment
              </div>
            )}

            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {comment.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-xl p-3.5 border"
                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author?.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatRelativeDate(comment.createdAt)}</span>
                        {(user?._id === comment.author?._id || user?.role === 'admin') && (
                          <button onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-600 py-8 text-sm">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
