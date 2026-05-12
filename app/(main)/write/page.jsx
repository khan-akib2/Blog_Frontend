'use client';
import { Suspense } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  Save, Send, Upload, X, Loader2, PenSquare, Tag, Image as ImageIcon,
  Zap, Plus, Trash2, HelpCircle, AlignLeft, ChevronDown, Check,
  Monitor, FlaskConical, HeartPulse, Briefcase, Plane, UtensilsCrossed,
  Sparkles, GraduationCap, Clapperboard, Trophy, FileText,
  Code2, Brain, ShieldCheck, Smartphone, Compass, BookOpen, Layers,
} from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

const RichTextEditor  = dynamic(() => import('@/components/RichTextEditor'),      { ssr: false });
const ImagePositionPicker = dynamic(() => import('@/components/ImagePositionPicker'), { ssr: false });
const AIAssistant     = dynamic(() => import('@/components/AIAssistant'),          { ssr: false });

// ── Category metadata ─────────────────────────────────────────────────────────
const CATEGORY_META = {
  Technology:              { icon: Monitor,         color: '#4f8ef7' },
  Science:                 { icon: FlaskConical,    color: '#a78bfa' },
  Health:                  { icon: HeartPulse,      color: '#f87171' },
  Business:                { icon: Briefcase,       color: '#fbbf24' },
  Travel:                  { icon: Plane,           color: '#34d399' },
  Food:                    { icon: UtensilsCrossed, color: '#fb923c' },
  Lifestyle:               { icon: Sparkles,        color: '#f472b6' },
  Education:               { icon: GraduationCap,   color: '#818cf8' },
  Entertainment:           { icon: Clapperboard,    color: '#2dd4bf' },
  Sports:                  { icon: Trophy,          color: '#4ade80' },
  'Web Development':       { icon: Code2,           color: '#60a5fa' },
  'AI & Machine Learning': { icon: Brain,           color: '#c084fc' },
  Cybersecurity:           { icon: ShieldCheck,     color: '#34d399' },
  'Mobile Apps':           { icon: Smartphone,      color: '#fb923c' },
  'Career Guidance':       { icon: Compass,         color: '#fbbf24' },
  'Study Tips':            { icon: BookOpen,        color: '#818cf8' },
  Other:                   { icon: FileText,        color: '#94a3b8' },
};

const CATEGORY_GROUPS = [
  { label: 'Tech & Development', icon: Code2,        color: '#60a5fa', items: ['Technology', 'Web Development', 'AI & Machine Learning', 'Cybersecurity', 'Mobile Apps'] },
  { label: 'Education',          icon: GraduationCap, color: '#818cf8', items: ['Education', 'Career Guidance', 'Study Tips', 'Science'] },
  { label: 'Lifestyle & More',   icon: Sparkles,      color: '#f472b6', items: ['Health', 'Business', 'Travel', 'Food', 'Lifestyle', 'Entertainment', 'Sports', 'Other'] },
];

// ── Category item ─────────────────────────────────────────────────────────────
function CategoryItem({ cat, isSelected, onSelect, dark }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[cat] || CATEGORY_META.Other;
  const Icon = meta.icon;
  return (
    <button type="button" onClick={() => onSelect(cat)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors"
      style={{ background: isSelected ? `${meta.color}14` : hovered ? (dark ? '#111d35' : '#f3f4f6') : 'transparent', color: isSelected ? meta.color : (dark ? '#c8d8f0' : '#374151') }}>
      <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${meta.color}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
      </div>
      <span className="flex-1 truncate">{cat}</span>
      {isSelected && <Check className="w-4 h-4 flex-shrink-0" style={{ color: meta.color }} />}
    </button>
  );
}

// ── Category picker ───────────────────────────────────────────────────────────
function CategoryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
    else setSearch('');
  }, [open]);

  const meta = CATEGORY_META[value];
  const SelectedIcon = meta?.icon || Layers;
  const filtered = search.trim() ? CATEGORIES.filter((c) => c.toLowerCase().includes(search.toLowerCase())) : null;

  const t = {
    trigger: { background: dark ? (open ? 'rgba(37,99,235,0.12)' : '#060b18') : (open ? 'rgba(37,99,235,0.06)' : '#f9fafb'), border: `1px solid ${open ? 'rgba(37,99,235,0.5)' : (dark ? '#1a2744' : '#e5e7eb')}`, color: value ? (dark ? '#e8f0fe' : '#111827') : (dark ? '#4a6080' : '#9ca3af'), boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none' },
    dropdown: { background: dark ? '#0d1526' : '#ffffff', border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`, boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.12)' },
    searchInput: { background: dark ? '#060b18' : '#f3f4f6', border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`, color: dark ? '#e8f0fe' : '#111827' },
    divider: { borderColor: dark ? '#1a2744' : '#f3f4f6' },
  };

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150" style={t.trigger}>
        {value ? (
          <><div className="flex h-6 w-6 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${meta?.color}18` }}><SelectedIcon className="w-3.5 h-3.5" style={{ color: meta?.color }} /></div><span className="flex-1 text-left truncate">{value}</span></>
        ) : (
          <><Layers className="w-4 h-4 flex-shrink-0" style={{ color: dark ? '#4a6080' : '#9ca3af' }} /><span className="flex-1 text-left">Select a category</span></>
        )}
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: open ? '#3b82f6' : (dark ? '#4a6080' : '#9ca3af') }} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50" style={t.dropdown}>
          <div className="p-2 border-b" style={t.divider}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: dark ? '#4a6080' : '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-8 pr-3 py-2 rounded-xl text-sm focus:outline-none" style={t.searchInput} />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered ? (
              filtered.length > 0 ? filtered.map((cat) => <CategoryItem key={cat} cat={cat} isSelected={value === cat} onSelect={(c) => { onChange(c); setOpen(false); }} dark={dark} />) : <p className="text-center text-sm py-8" style={{ color: dark ? '#4a6080' : '#9ca3af' }}>No categories found</p>
            ) : (
              CATEGORY_GROUPS.map((group, gi) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.label}>
                    {gi > 0 && <div className="mx-3 my-1 border-t" style={t.divider} />}
                    <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                      <GroupIcon className="w-3 h-3 flex-shrink-0" style={{ color: group.color }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: group.color }}>{group.label}</span>
                    </div>
                    {group.items.map((cat) => <CategoryItem key={cat} cat={cat} isSelected={value === cat} onSelect={(c) => { onChange(c); setOpen(false); }} dark={dark} />)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Multi-tag pill input ──────────────────────────────────────────────────────
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const [dark, setDark] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const addTag = useCallback((raw) => {
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9\-\s]/g, '').trim();
    if (!cleaned || tags.includes(cleaned) || tags.length >= 10) return;
    onChange([...tags, cleaned]);
  }, [tags, onChange]);

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      if (input.trim()) { addTag(input); setInput(''); }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    pasted.split(/[,\s]+/).forEach((t) => { if (t.trim()) addTag(t); });
    setInput('');
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 px-3 py-2 rounded-xl min-h-[44px] cursor-text transition-all"
      style={{
        border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`,
        background: dark ? '#060b18' : '#f9fafb',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ background: 'rgba(37,99,235,0.12)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.2)' }}>
          #{tag}
          <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="hover:text-red-400 transition-colors ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => { if (input.trim()) { addTag(input); setInput(''); } }}
        placeholder={tags.length === 0 ? 'Type a tag, press Enter or comma…' : tags.length < 10 ? 'Add more…' : ''}
        className="flex-1 min-w-[140px] bg-transparent text-sm focus:outline-none"
        style={{ color: dark ? '#e8f0fe' : '#111827' }}
        disabled={tags.length >= 10}
      />
    </div>
  );
}

// ── Write page content ────────────────────────────────────────────────────────
function WriteContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({ title: '', content: '', category: '', conclusion: '' });
  const [tags, setTags] = useState([]); // array of strings
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailType, setThumbnailType] = useState('image');
  const [thumbnailPosition, setThumbnailPosition] = useState('50% 50%');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef(null); // for inserting AI content

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth?mode=login');
  }, [user, authLoading]);

  useEffect(() => {
    if (!editId) return;
    api.get('/blogs/my?limit=100').then(({ data }) => {
      const blog = data.blogs.find((b) => b._id === editId);
      if (!blog) return;
      api.get(`/blogs/${blog.slug}?preview=true`).then(({ data: fullData }) => {
        const full = fullData.blog;
        setForm({ title: full.title, content: full.content || '', category: full.category, conclusion: full.conclusion || '' });
        setTags(full.tags || []);
        if (full.faqs?.length) setFaqs(full.faqs);
        if (full.thumbnail) setThumbnailPreview(full.thumbnail);
        if (full.thumbnailType) setThumbnailType(full.thumbnailType);
        if (full.thumbnailPosition) setThumbnailPosition(full.thumbnailPosition);
      }).catch(() => {
        setForm({ title: blog.title, content: '', category: blog.category, conclusion: blog.conclusion || '' });
        setTags(blog.tags || []);
        if (blog.faqs?.length) setFaqs(blog.faqs);
        if (blog.thumbnail) setThumbnailPreview(blog.thumbnail);
      });
    });
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
    if (!isVideo) setThumbnailPosition('50% 50%');
  };

  // AI: insert image URL as cover
  const handleAIInsertImage = useCallback(async (url) => {
    try {
      // Fetch the image and create a File object so it uploads to Cloudinary
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'ai-generated.jpg', { type: 'image/jpeg' });
      setThumbnail(file);
      setThumbnailType('image');
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailPosition('50% 50%');
      toast.success('AI image set as cover!');
    } catch {
      // Fallback: use URL directly
      setThumbnailPreview(url);
      setThumbnailType('image');
      toast.success('AI image set as cover!');
    }
  }, []);

  // AI: insert video URL as cover
  const handleAIInsertVideo = useCallback((url) => {
    setThumbnailPreview(url);
    setThumbnailType('video');
    setThumbnail(null); // video from URL, not file upload
    toast.success('AI video added as cover!');
  }, []);

  // AI: insert text content into editor / form fields
  const handleAIInsertContent = useCallback((text, type) => {
    if (type === 'conclusion') {
      setForm((f) => ({ ...f, conclusion: f.conclusion ? f.conclusion + '\n\n' + text : text }));
    } else if (type === 'tags') {
      // Parse comma-separated tags from AI
      const newTags = text.split(/[,\n]+/).map((t) => t.trim().toLowerCase().replace(/[^a-z0-9\-\s]/g, '').trim()).filter(Boolean);
      setTags((prev) => {
        const combined = [...new Set([...prev, ...newTags])].slice(0, 10);
        return combined;
      });
      toast.success(`${newTags.length} tags added!`);
    } else {
      // Append to content
      setForm((f) => ({ ...f, content: f.content + (f.content ? '<br><br>' : '') + text.replace(/\n/g, '<br>') }));
    }
  }, []);

  const buildFormData = (status) => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('tags', tags.join(', '));
    fd.append('status', status);
    fd.append('conclusion', form.conclusion);
    fd.append('thumbnailPosition', thumbnailPosition);
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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">

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

        {/* Cover Media */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-3">
            <ImageIcon className="w-3.5 h-3.5" /> Cover Media (Image or Video)
          </label>
          {thumbnailPreview ? (
            <div className="space-y-3">
              {thumbnailType === 'video' ? (
                <div className="relative rounded-xl overflow-hidden h-52">
                  <video src={thumbnailPreview} className="w-full h-full object-cover" controls muted playsInline />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); setThumbnailType('image'); }}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <ImagePositionPicker src={thumbnailPreview} position={thumbnailPosition} onChange={setThumbnailPosition} height={380} />
                  <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); setThumbnailType('image'); setThumbnailPosition('50% 50%'); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg z-10">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-200 dark:border-[#1a2744] rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-gray-50 dark:bg-[#060b18] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Click to upload cover image or video</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB · MP4, MOV up to 100MB</span>
              <span className="text-xs text-purple-400 dark:text-purple-500 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Or use AI to generate one below
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" onChange={handleThumbnail} className="hidden" />
            </label>
          )}
        </div>

        {/* Category & Tags */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
                <Layers className="w-3.5 h-3.5" /> Category *
              </label>
              <CategoryPicker value={form.category} onChange={(cat) => setForm({ ...form, category: cat })} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-3.5 h-3.5" /> Tags
                <span className="ml-auto text-[10px] font-normal text-gray-400">{tags.length}/10 · Enter or comma to add</span>
              </label>
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </div>
        </div>

        {/* Rich text editor */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1a2744]">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
              <PenSquare className="w-3.5 h-3.5" /> Content *
            </label>
          </div>
          <RichTextEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
              <HelpCircle className="w-3.5 h-3.5" /> FAQs
            </label>
            <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-100 dark:border-[#1a2744] p-4 space-y-3 relative">
                <button type="button" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                  className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">Question {i + 1}</label>
                  <input type="text" value={faq.question}
                    onChange={(e) => { const u = [...faqs]; u[i] = { ...u[i], question: e.target.value }; setFaqs(u); }}
                    placeholder="e.g. What is this article about?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">Answer</label>
                  <textarea value={faq.answer}
                    onChange={(e) => { const u = [...faqs]; u[i] = { ...u[i], answer: e.target.value }; setFaqs(u); }}
                    placeholder="Provide a clear, concise answer..." rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors resize-none" />
                </div>
              </div>
            ))}
            {faqs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No FAQs added yet.</p>}
          </div>
        </div>

        {/* Conclusion */}
        <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-3">
            <AlignLeft className="w-3.5 h-3.5" /> Conclusion
          </label>
          <textarea value={form.conclusion} onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
            placeholder="Summarize your key takeaways and wrap up the article..." rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors resize-none" />
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

      {/* AI Assistant — floating panel */}
      <AIAssistant
        title={form.title}
        onInsertImage={handleAIInsertImage}
        onInsertVideo={handleAIInsertVideo}
        onInsertContent={handleAIInsertContent}
      />
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
