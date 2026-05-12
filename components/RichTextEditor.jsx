'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useState, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, List, ListOrdered, Quote, Code, Link2, Image as ImageIcon,
  Heading1, Heading2, Heading3, Undo, Redo, Strikethrough,
  X, Check, ExternalLink, Unlink,
} from 'lucide-react';

// ── Extensions (stable reference) ────────────────────────────────────────────
const buildExtensions = (placeholder) => [
  StarterKit,
  Image.configure({ inline: false, allowBase64: true }),
  Link.configure({ openOnClick: false }),
  Placeholder.configure({ placeholder }),
];

// ── Toolbar button ────────────────────────────────────────────────────────────
const ToolbarButton = ({ onClick, active, title, children, danger }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-colors ${
      danger
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
        : active
        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2744]'
    }`}
  >
    {children}
  </button>
);

// ── Inline URL modal (used for both Image and Link) ───────────────────────────
function UrlModal({ open, title, placeholder, icon: Icon, onConfirm, onCancel, defaultValue = '', dark }) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  // Reset value and focus when opened
  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open, defaultValue]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(value.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: dark ? '#0d1526' : '#ffffff',
          border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`,
          boxShadow: dark
            ? '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(79,142,247,0.1)'
            : '0 32px 80px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: dark ? '#1a2744' : '#f3f4f6' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Icon className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <h3
              className="text-sm font-bold"
              style={{ color: dark ? '#e8f0fe' : '#111827' }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: dark ? '#4a6080' : '#9ca3af' }}
            onMouseEnter={(e) => e.currentTarget.style.background = dark ? '#1a2744' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-[0.1em] mb-2"
              style={{ color: dark ? '#4a6080' : '#6b7280' }}
            >
              {placeholder}
            </label>
            <input
              ref={inputRef}
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://"
              className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all"
              style={{
                background: dark ? '#060b18' : '#f9fafb',
                border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`,
                color: dark ? '#e8f0fe' : '#111827',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,0.5)'}
              onBlur={(e) => e.target.style.borderColor = dark ? '#1a2744' : '#e5e7eb'}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: dark ? 'rgba(26,39,68,0.5)' : '#f3f4f6',
                color: dark ? '#7a90b8' : '#6b7280',
                border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                boxShadow: value.trim() ? '0 4px 16px rgba(37,99,235,0.3)' : 'none',
              }}
            >
              <Check className="w-4 h-4" />
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function RichTextEditor({ content, onChange }) {
  const [imageModal, setImageModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [dark, setDark] = useState(false);

  // Track dark mode
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: buildExtensions('Start writing your amazing blog post...'),
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'ProseMirror focus:outline-none min-h-[400px] p-4' },
    },
  });

  // Sync external content changes (edit mode)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content && content !== current && content !== '<p></p>') {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openImageModal = () => setImageModal(true);

  const handleImageInsert = (url) => {
    setImageModal(false);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const openLinkModal = () => {
    // Pre-fill with existing link href if cursor is on one
    const existing = editor.getAttributes('link').href || '';
    setCurrentLink(existing);
    setLinkModal(true);
  };

  const handleLinkInsert = (url) => {
    setLinkModal(false);
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const handleUnlink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const isLinkActive = editor.isActive('link');

  return (
    <>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: `1px solid ${dark ? '#1a2744' : '#e5e7eb'}`,
          background: dark ? '#0d1526' : '#ffffff',
        }}
      >
        {/* ── Toolbar ── */}
        <div
          className="flex flex-wrap items-center gap-0.5 p-2 border-b"
          style={{
            borderColor: dark ? '#1a2744' : '#e5e7eb',
            background: dark ? 'rgba(17,29,53,0.8)' : '#f9fafb',
          }}
        >
          {/* Headings */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolbarButton>

          <div className="w-px h-5 mx-1 rounded-full" style={{ background: dark ? '#1a2744' : '#e5e7eb' }} />

          {/* Inline formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code"><Code className="w-4 h-4" /></ToolbarButton>

          <div className="w-px h-5 mx-1 rounded-full" style={{ background: dark ? '#1a2744' : '#e5e7eb' }} />

          {/* Lists & blocks */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List"><ListOrdered className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="w-4 h-4" /></ToolbarButton>

          <div className="w-px h-5 mx-1 rounded-full" style={{ background: dark ? '#1a2744' : '#e5e7eb' }} />

          {/* Link — show unlink button when cursor is on a link */}
          <ToolbarButton onClick={openLinkModal} active={isLinkActive} title={isLinkActive ? 'Edit link' : 'Insert link'}>
            <Link2 className="w-4 h-4" />
          </ToolbarButton>
          {isLinkActive && (
            <ToolbarButton onClick={handleUnlink} title="Remove link" danger>
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}

          {/* Image */}
          <ToolbarButton onClick={openImageModal} title="Insert image from URL">
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 mx-1 rounded-full" style={{ background: dark ? '#1a2744' : '#e5e7eb' }} />

          {/* History */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-4 h-4" /></ToolbarButton>
        </div>

        {/* ── Editor content ── */}
        <EditorContent
          editor={editor}
          className="text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* ── Image URL modal ── */}
      <UrlModal
        open={imageModal}
        title="Insert Image"
        placeholder="Image URL"
        icon={ImageIcon}
        defaultValue=""
        onConfirm={handleImageInsert}
        onCancel={() => setImageModal(false)}
        dark={dark}
      />

      {/* ── Link URL modal ── */}
      <UrlModal
        open={linkModal}
        title={currentLink ? 'Edit Link' : 'Insert Link'}
        placeholder="Link URL"
        icon={ExternalLink}
        defaultValue={currentLink}
        onConfirm={handleLinkInsert}
        onCancel={() => setLinkModal(false)}
        dark={dark}
      />
    </>
  );
}
