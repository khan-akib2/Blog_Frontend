'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Heart, Bookmark, Eye, Clock, Share2, MessageCircle, Send, Trash2, Copy } from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/utils/helpers';

export default function BlogPostClient({ blog: initialBlog }) {
  const { user } = useAuth();
  const [blog, setBlog] = useState(initialBlog);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
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
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full">
            {blog.category}
          </span>
          {blog.tags?.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              #{tag}
            </span>
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
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 sm:h-96 object-cover" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="blog-content text-gray-800 dark:text-gray-200 mb-10" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Actions */}
      <div className="flex items-center gap-3 py-6 border-t border-b border-gray-200 dark:border-gray-800 mb-10">
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
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
                Copy link
              </button>
              <button
                onClick={handleWhatsAppShare}
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
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login</Link> to leave a comment
            </p>
          </div>
        )}

        {/* Comment list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {comment.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.name}</span>
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
    </div>
  );
}
