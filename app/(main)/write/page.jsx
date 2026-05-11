'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Save, Send, Upload, X, Loader2, PenSquare, Tag, Image as ImageIcon, Zap, Plus, Trash2, HelpCircle, AlignLeft, Video } from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

function WriteContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '', conclusion: '' });
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailType, setThumbnailType] = useState('image'); // 'image' | 'video'
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (editId) {
      api.get('/blogs/my').then(({ data }) => {
        const blog = data.blogs.find((b) => b._id === editId);
        if (blog) {
          setForm({ title: blog.title, content: blog.content || '', category: blog.category, tags: blog.tags?.join(', ') || '', conclusion: blog.conclusion || '' });
          if (blog.faqs?.length) setFaqs(blog.faqs);
          if (blog.thumbnail) setThumbnailPreview(blog.thumbnail);
          if (blog.thumbnailType) setThumbnailType(blog.thumbnailType);
        }
      });
    }
  }, [editId]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) return toast.error(isVideo ? 'Video must be under 100MB' : 'Image must be under 5MB');
    setThumbnail(file);
    setThumbnailType(isVideo ? 'video' : 'image');
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const buildFormData = (status) => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('tags', form.tags);
    fd.append('status', status);
    fd.append('conclusion', form.conclusion);
    // Only include non-empty FAQs
    const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
    fd.append('faqs', JSON.stringify(validFaqs));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    return fd;
  };

  const handleSaveDraft = async () => {
    if (!form.title || !form.content || !form.category) return toast.error('Title, content and category are required');
    setSaving(true);
    try {
      const fd = buildFormData('draft');
      if (editId) await api.put(`/blogs/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Draft saved!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.category) return toast.error('Title, content and category are required');
    setSubmitting(true);
    try {
      const fd = buildFormData('pending');
      if (editId) await api.put(`/blogs/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Blog submitted for review!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> {editId ? 'Edit Article' : 'New Article'}
          </p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            {editId ? 'Edit Blog Post' : 'Write a Blog Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-all disabled:opacity-50 text-sm font-semibold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit for Review
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-3">
            <PenSquare className="w-3.5 h-3.5" /> Article Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Write a compelling title..."
            className="w-full text-2xl font-black bg-transparent text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none border-0 border-b-2 border-gray-100 dark:border-[#1a2744] pb-3 focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
            style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
          />
        </div>

        {/* Thumbnail / Media */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-3">
            <ImageIcon className="w-3.5 h-3.5" /> Cover Media (Image or Video)
          </label>
          {thumbnailPreview ? (
            <div className="relative rounded-xl overflow-hidden h-52">
              {thumbnailType === 'video' ? (
                <video src={thumbnailPreview} className="w-full h-full object-cover" controls muted playsInline />
              ) : (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); setThumbnailType('image'); }}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white bg-black/50 backdrop-blur-sm flex items-center gap-1">
                {thumbnailType === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                {thumbnailType === 'video' ? 'Video' : 'Image'}
              </span>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-200 dark:border-[#1a2744] rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-gray-50 dark:bg-[#060b18] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Click to upload cover image or video</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB · MP4, MOV up to 100MB</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" onChange={handleThumbnail} className="hidden" />
            </label>
          )}
        </div>

        {/* Category & Tags */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-3.5 h-3.5" /> Tags
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="react, javascript, web (comma separated)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1a2744]">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
              <PenSquare className="w-3.5 h-3.5" /> Content *
            </label>
          </div>
          <RichTextEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
              <HelpCircle className="w-3.5 h-3.5" /> FAQs (Frequently Asked Questions)
            </label>
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-100 dark:border-[#1a2744] p-4 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                  className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  aria-label="Remove FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">Question {i + 1}</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[i] = { ...updated[i], question: e.target.value };
                      setFaqs(updated);
                    }}
                    placeholder="e.g. What is this article about?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[i] = { ...updated[i], answer: e.target.value };
                      setFaqs(updated);
                    }}
                    placeholder="Provide a clear, concise answer..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No FAQs added yet. Click "Add FAQ" to include common questions.
              </p>
            )}
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-3">
            <AlignLeft className="w-3.5 h-3.5" /> Conclusion
          </label>
          <textarea
            value={form.conclusion}
            onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
            placeholder="Summarize your key takeaways and wrap up the article..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors resize-none"
          />
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={handleSaveDraft} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111d35] transition-all disabled:opacity-50 text-sm font-semibold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save as Draft
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <WriteContent />
    </Suspense>
  );
}
