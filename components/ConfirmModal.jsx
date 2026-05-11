'use client';
import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Reusable confirmation modal — replaces native browser confirm().
 *
 * Props:
 *   open        {boolean}   — whether the modal is visible
 *   title       {string}    — bold heading
 *   message     {string}    — body text
 *   confirmText {string}    — label for the destructive button (default "Delete")
 *   cancelText  {string}    — label for the cancel button (default "Cancel")
 *   variant     {string}    — "danger" (default) | "warning"
 *   onConfirm   {function}  — called when user clicks the confirm button
 *   onCancel    {function}  — called when user clicks cancel or backdrop
 */
export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  const accentColor  = isDanger ? '#ef4444' : '#f59e0b';
  const accentBg     = isDanger ? 'rgba(239,68,68,0.12)'  : 'rgba(245,158,11,0.12)';
  const accentBorder = isDanger ? 'rgba(239,68,68,0.25)'  : 'rgba(245,158,11,0.25)';
  const btnGradient  = isDanger
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #f59e0b, #d97706)';
  const btnShadow    = isDanger
    ? '0 4px 16px rgba(239,68,68,0.35)'
    : '0 4px 16px rgba(245,158,11,0.35)';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg, #ffffff)', border: '1px solid var(--border, #e2e8f0)' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a2744] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
            style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
          >
            {isDanger
              ? <Trash2 className="w-5 h-5" style={{ color: accentColor }} />
              : <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            }
          </div>

          {/* Text */}
          <h3
            id="confirm-title"
            className="text-base font-bold text-gray-900 dark:text-white mb-1.5"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h3>
          <p
            id="confirm-desc"
            className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6"
          >
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'var(--bg-subtle, #f8fafc)',
                border: '1px solid var(--border, #e2e8f0)',
                color: 'var(--muted, #64748b)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text, #0a0f1e)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted, #64748b)'; }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: btnGradient, boxShadow: btnShadow }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
