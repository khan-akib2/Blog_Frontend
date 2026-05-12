'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  Heart, Bookmark, Eye, Clock, Share2, MessageCircle, Send, Trash2,
  Copy, ChevronDown, ChevronUp, Flag, X, Star, TrendingUp, BookOpen,
} from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/utils/helpers';
import RelatedBlogs from '@/components/RelatedBlogs';

function FaqSection({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4"
        style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border overflow-hidden transition-colors"
            style={{ borderColor: openIdx === i ? 'rgba(37,99,235,0.3)' : 'var(--border, #e2e8f0)' }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-colors"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Q{i + 1}. {faq.question}
              </span>
              {openIdx === i
                ? <ChevronUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              }
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-[#1a2744]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPostClient({ blog: initialBlog }) {
  const { user } = useAuth();
  const [blog, setBlog] = useState(initialBlog);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDesc, setReportDesc] = useState('');
  const [reporting, setReporting] = useState(false);
  const isPreview = blog.status !== 'approved';

  useEffect(() => {
    if (user) {
      setLiked(blog.likes?.includes(user._id));
    }
    fetchComments();
  }, [user]);

  useEffect(() => {
    if (!shareOpen) return;
    const fn = (e) => { if (!e.target.closest('#share-menu')) setShareOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [shareOpen]);

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
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = `Check out this blog: "${blog.title}"\n\n${blog.excerpt ? blog.excerpt.substring(0, 120) + '...' : ''}\n\nRead here: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
    setShareOpen(false);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to report');
    setReporting(true);
    try {
      await api.post(`/blogs/${blog._id}/report`, { reason: reportReason, description: reportDesc });
      toast.success('Report submitted. Our team will review it.');
      setReportOpen(false);
      setReportDesc('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  const handleShareTrack = async () => {
    try { await api.post(`/blogs/${blog._id}/share`); } catch {}
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Preview banner */}
      {isPreview && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
            Preview mode — this blog is <span className="font-bold capitalize">{blog.status}</span> and not yet public
          </span>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Link
            href={`/blogs?category=${encodeURIComponent(blog.category)}`}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
          >
            {blog.category}
          </Link>
          {/* Editorial badges */}
          {blog.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(250,204,21,0.12)', color: '#facc15', border: '1px solid rgba(250,204,21,0.25)' }}>
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
          {blog.isTrending && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {blog.isEditorsPick && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
              <BookOpen className="w-3 h-3" /> Editor's Pick
            </span>
          )}
          {blog.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blogs?tag=${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author & meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <Link href={`/author/${blog.author?._id}`} className="flex items-center gap-3 group">
            {blog.author?.avatar ? (
              <img src={blog.author.avatar} alt={blog.author.name} className="w-11 h-11 rounded-full object-cover" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {blog.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{blog.author?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(blog.createdAt)}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readingTime} min read</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views} views</span>
          </div>
        </div>
      </div>

      {/* Thumbnail / Media */}
      {blog.thumbnail && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          {blog.thumbnailType === 'video' ? (
            <video
              src={blog.thumbnail}
              className="w-full h-64 sm:h-96 object-cover"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 sm:h-96 object-cover"
            style={{ objectPosition: blog.thumbnailPosition || '50% 50%' }} />
          )}
        </div>
      )}

      {/* Content */}
      <div className="blog-content text-gray-800 dark:text-gray-200 mb-10" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* FAQ Section */}
      {blog.faqs?.length > 0 && (
        <FaqSection faqs={blog.faqs} />
      )}

      {/* Conclusion */}
      {blog.conclusion?.trim() && (
        <div className="mb-10 rounded-xl p-5 border"
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

      {/* Actions */}
      <div className="flex items-center gap-3 py-6 border-t border-b border-gray-200 dark:border-gray-800 mb-10 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${liked ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{blog.likes?.length || 0}</span>
        </button>
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${bookmarked ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">Save</span>
        </button>

        {/* Share dropdown */}
        <div className="relative" id="share-menu">
          <button
            onClick={() => setShareOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
          {shareOpen && (
            <div className="absolute left-0 mt-2 w-52 rounded-2xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] shadow-2xl shadow-black/10 dark:shadow-black/40 z-20 overflow-hidden">
              <button
                onClick={() => { handleCopyLink(); handleShareTrack(); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
                Copy link
              </button>
              <button
                onClick={() => { handleWhatsAppShare(); handleShareTrack(); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors border-t border-gray-100 dark:border-[#1a2744]"
              >
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Report button */}
        {!isPreview && user && user._id !== blog.author?._id && (
          <button
            onClick={() => setReportOpen(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 transition-all"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm font-medium">Report</span>
          </button>
        )}
      </div>

      {/* Author bio */}
      {blog.author?.bio && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-10 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {blog.author.avatar ? (
              <img src={blog.author.avatar} alt={blog.author.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{blog.author.name}</p>
              <Link href={`/author/${blog.author._id}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View profile</Link>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{blog.author.bio}</p>
        </div>
      )}

      {/* Comments */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Comments ({comments.length})
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleComment} className="mb-8">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loadingComment || !commentText.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Link href="/auth?mode=login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login</Link> to leave a comment
            </p>
          </div>
        )}

        {/* Comment list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${comment.isAdminNote ? 'bg-amber-600' : 'bg-indigo-600'}`}>
                {comment.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div className={`flex-1 rounded-xl p-4 border ${comment.isAdminNote ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.name}</span>
                    {comment.isAdminNote && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400"
                        style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        🛡 Admin Note
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeDate(comment.createdAt)}</span>
                    {(user?._id === comment.author?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500 transition-colors">
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

      {/* Related Blogs */}
      {!isPreview && <RelatedBlogs blogId={blog._id} />}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setReportOpen(false); }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-[#1a2744]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30">
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Report Blog</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Help us keep the platform safe</p>
                </div>
              </div>
              <button onClick={() => setReportOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a2744] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block">
                  Reason
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'spam', label: '🚫 Spam' },
                    { value: 'offensive', label: '⚠️ Offensive' },
                    { value: 'fake', label: '❌ Fake Info' },
                    { value: 'other', label: '📋 Other' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReportReason(value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
                      style={reportReason === value
                        ? { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
                        : { background: 'transparent', color: '#6b7280', border: '1px solid #e5e7eb' }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block">
                  Additional details (optional)
                </label>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-red-400 dark:focus:border-red-600 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setReportOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#1a2744] hover:bg-gray-50 dark:hover:bg-[#111d35] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={reporting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  {reporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
