'use client';
import { useState, useEffect } from 'react';
import {
  X, Clock, Eye, CheckCircle, XCircle, Send, Loader2,
  ChevronDown, ChevronUp, AlertCircle, Shield, Star, TrendingUp,
  BookOpen, Calendar,
} from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/helpers';

export default function AdminBlogPreviewModal({ blogMeta, onClose, onApprove, onReject }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // Reject state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);

  // Admin note state
  const [noteText, setNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [notes, setNotes] = useState([]);

  // Schedule state
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // Feature flags
  const [flags, setFlags] = useState({ isFeatured: false, isTrending: false, isEditorsPick: false });
  const [togglingFlag, setTogglingFlag] = useState(null);

  // Lock body scroll
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

  // Fetch full blog content
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/blogs/${blogMeta._id}/preview`);
        setBlog(data.blog);
        setNotes(data.notes || []);
        setFlags({
          isFeatured: data.blog.isFeatured || false,
          isTrending: data.blog.isTrending || false,
          isEditorsPick: data.blog.isEditorsPick || false,
        });
      } catch {
        try {
          const { data } = await api.get(`/blogs/${blogMeta.slug}?preview=true`);
          setBlog(data.blog);
        } catch {
          toast.error('Failed to load blog content');
          onClose();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogMeta._id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.put(`/admin/blogs/${blogMeta._id}/approve`);
      toast.success('Blog approved!');
      onApprove(blogMeta._id);
      onClose();
    } catch {
      toast.error('Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await api.put(`/admin/blogs/${blogMeta._id}/reject`, { reason: rejectReason });
      toast.success('Blog rejected');
      onReject(blogMeta._id);
      onClose();
    } catch {
      toast.error('Failed to reject');
    } finally {
      setRejecting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) return toast.error('Please select a date and time');
    setScheduling(true);
    try {
      await api.put(`/admin/blogs/${blogMeta._id}/schedule`, { scheduledAt: scheduleDate });
      toast.success('Blog scheduled for publishing!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    } finally {
      setScheduling(false);
    }
  };

  const handleToggleFlag = async (flag) => {
    if (blog?.status !== 'approved') {
      return toast.error('Only approved blogs can be featured');
    }
    setTogglingFlag(flag);
    try {
      const { data } = await api.put(`/admin/blogs/${blogMeta._id}/flag/${flag}`);
      setFlags((prev) => ({ ...prev, [flag]: data[flag] }));
      toast.success(`${flag.replace('is', '')} ${data[flag] ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update flag');
    } finally {
      setTogglingFlag(null);
    }
  };

  const handleSendNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSendingNote(true);
    try {
      const { data } = await api.post(`/blogs/${blogMeta._id}/comments`, { content: noteText });
      setNotes((prev) => [data.comment, ...prev]);
      setNoteText('');
      toast.success('Note sent to author');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send note');
    } finally {
      setSendingNote(false);
    }
  };

  const isPending = blogMeta.status === 'pending';
  const isApproved = blogMeta.status === 'approved';

  // Min datetime for schedule input (now + 5 min)
  const minDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0d1526', border: '1px solid #1a2744' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#1a2744', background: 'rgba(17,29,53,0.9)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.2)' }}>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-0.5">Admin Preview</p>
              <h2 className="text-sm font-bold text-white truncate">{blogMeta.title}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="ml-3 flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2744] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : blog ? (
            <div className="px-6 py-6">

              {/* Meta row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b"
                style={{ borderColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  {blog.author?.avatar ? (
                    <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {blog.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{blog.author?.name}</p>
                    <p className="text-xs text-gray-500">{blog.author?.email} · {formatDate(blog.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blog.readingTime || 1} min read</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.25)' }}>
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-white mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                {blog.title}
              </h1>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-400"
                      style={{ background: 'rgba(26,39,68,0.8)', border: '1px solid #1a2744' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Thumbnail */}
              {blog.thumbnail && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-auto block"
                    style={{
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      background: '#060b18',
                      objectPosition: blog.thumbnailPosition || '50% 50%',
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="blog-content text-gray-300 mb-8 prose-invert"
                dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* FAQ */}
              {blog.faqs?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-white mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-2">
                    {blog.faqs.map((faq, i) => (
                      <div key={i} className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${openFaq === i ? 'rgba(79,142,247,0.3)' : '#1a2744'}` }}>
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 hover:bg-[#111d35] transition-colors"
                        >
                          <span className="text-sm font-semibold text-white">Q{i + 1}. {faq.question}</span>
                          {openFaq === i
                            ? <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          }
                        </button>
                        {openFaq === i && (
                          <div className="px-4 pb-3 pt-1 text-sm text-gray-400 border-t" style={{ borderColor: '#1a2744' }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusion */}
              {blog.conclusion?.trim() && (
                <div className="mb-8 rounded-xl p-4"
                  style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                  <h3 className="text-sm font-bold text-blue-400 mb-2">Conclusion</h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{blog.conclusion}</p>
                </div>
              )}

              {/* ── Feature flags (approved blogs only) ── */}
              {isApproved && (
                <div className="rounded-xl p-4 mb-6"
                  style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-bold text-yellow-400">Editorial Flags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'isFeatured', label: 'Featured', icon: Star, color: '#facc15' },
                      { key: 'isTrending', label: 'Trending', icon: TrendingUp, color: '#f97316' },
                      { key: 'isEditorsPick', label: "Editor's Pick", icon: BookOpen, color: '#a78bfa' },
                    ].map(({ key, label, icon: Icon, color }) => (
                      <button
                        key={key}
                        onClick={() => handleToggleFlag(key)}
                        disabled={togglingFlag === key}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={flags[key]
                          ? { background: `${color}20`, color, border: `1px solid ${color}40` }
                          : { background: 'rgba(26,39,68,0.5)', color: '#7a90b8', border: '1px solid #1a2744' }
                        }
                      >
                        {togglingFlag === key
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Icon className="w-3.5 h-3.5" />
                        }
                        {label}
                        {flags[key] && <span className="ml-1">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Schedule publishing (pending blogs) ── */}
              {isPending && (
                <div className="rounded-xl p-4 mb-6"
                  style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}>
                  <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="flex items-center gap-2 text-sm font-bold text-blue-400 w-full"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Publishing
                    {showSchedule ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                  </button>
                  {showSchedule && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="datetime-local"
                        value={scheduleDate}
                        min={minDateTime}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
                        style={{ background: '#060b18', border: '1px solid rgba(37,99,235,0.3)', colorScheme: 'dark' }}
                      />
                      <button
                        onClick={handleSchedule}
                        disabled={scheduling || !scheduleDate}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                      >
                        {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                        Schedule
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Admin Notes to Author ── */}
              <div className="rounded-xl p-4 mb-6"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-amber-400">Private Note to Author</h3>
                  <span className="text-xs text-amber-600">(only visible to the author)</span>
                </div>

                {notes.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {notes.map((note) => (
                      <div key={note._id} className="rounded-lg px-3 py-2.5"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <p className="text-xs text-amber-300 font-semibold mb-0.5">Admin · {formatDate(note.createdAt)}</p>
                        <p className="text-sm text-gray-300">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a private note to the author..."
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: '#060b18', border: '1px solid rgba(245,158,11,0.2)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(245,158,11,0.2)'}
                  />
                  <button type="submit" disabled={sendingNote || !noteText.trim()}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {sendingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </form>
              </div>

            </div>
          ) : null}
        </div>

        {/* ── Sticky footer actions (only for pending) ── */}
        {isPending && (
          <div className="flex-shrink-0 border-t px-5 py-4" style={{ borderColor: '#1a2744', background: 'rgba(6,11,24,0.95)' }}>
            {showRejectForm ? (
              <div className="space-y-3">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (optional — will be shown to the author)..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none resize-none transition-all"
                  style={{ background: '#060b18', border: '1px solid rgba(248,113,113,0.3)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(248,113,113,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(248,113,113,0.3)'}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                    style={{ background: 'rgba(26,39,68,0.5)', border: '1px solid #1a2744' }}>
                    Cancel
                  </button>
                  <button onClick={handleReject} disabled={rejecting}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
                    {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Confirm Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-auto">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Review the full content before deciding
                </div>
                <button onClick={() => setShowRejectForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-400 transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button onClick={handleApprove} disabled={approving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
                  {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
