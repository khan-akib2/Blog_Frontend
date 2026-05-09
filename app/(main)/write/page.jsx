'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Save, Send, Upload, X, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

function WriteContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (editId) {
      api.get(`/blogs/my`).then(({ data }) => {
        const blog = data.blogs.find((b) => b._id === editId);
        if (blog) {
          setForm({ title: blog.title, content: blog.content || '', category: blog.category, tags: blog.tags?.join(', ') || '' });
          if (blog.thumbnail) setThumbnailPreview(blog.thumbnail);
        }
      });
    }
  }, [editId]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const buildFormData = (status) => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('tags', form.tags);
    fd.append('status', status);
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

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{editId ? 'Edit Blog' : 'Write a Blog'}</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} disabled={saving} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit for Review
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Your blog title..."
            className="w-full px-4 py-3 text-2xl font-bold border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail Image</label>
          {thumbnailPreview ? (
            <div className="relative rounded-xl overflow-hidden h-48">
              <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors bg-gray-50 dark:bg-gray-900">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload thumbnail (max 5MB)</span>
              <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
            </label>
          )}
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="react, javascript, web"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content *</label>
          <RichTextEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
      <WriteContent />
    </Suspense>
  );
}
