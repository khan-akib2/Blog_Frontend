'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Eye, Heart, PenSquare, Shield, TrendingUp, FileText } from 'lucide-react';

export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const card = isDark
    ? { bg: 'rgba(13,21,38,0.95)', border: 'rgba(255,255,255,0.07)', inner: 'rgba(255,255,255,0.03)', innerBorder: 'rgba(255,255,255,0.05)', txt: '#e2e8f0', sub: '#7a90b8', line: 'rgba(255,255,255,0.06)', barFg: 'rgba(79,142,247,0.3)', barBg: 'rgba(255,255,255,0.08)', statBg: 'rgba(255,255,255,0.03)', statBorder: 'rgba(255,255,255,0.05)', thumbBg: 'linear-gradient(135deg,#0f1f3d,#1a1040)', thumbLabel: '#4a5568', btn2bg: 'rgba(255,255,255,0.04)', btn2border: 'rgba(255,255,255,0.08)', btn2txt: '#94a3b8' }
    : { bg: '#ffffff', border: '#e2e8f0', inner: '#f8fafc', innerBorder: '#f1f5f9', txt: '#1e293b', sub: '#94a3b8', line: '#f1f5f9', barFg: 'rgba(37,99,235,0.2)', barBg: '#e2e8f0', statBg: '#f8fafc', statBorder: '#f1f5f9', thumbBg: 'linear-gradient(135deg,#dbeafe,#ede9fe)', thumbLabel: '#94a3b8', btn2bg: '#f8fafc', btn2border: '#e2e8f0', btn2txt: '#64748b' };

  const iconBlue = isDark ? '#60a5fa' : '#2563eb';
  const iconGreen = isDark ? '#34d399' : '#059669';

  return (
    <div className="hero-visual-wrapper">

      {/* ── Central Dashboard Card ── */}
      <div className="hero-card hero-card-center" style={{ background: card.bg, borderColor: isDark ? 'rgba(79,142,247,0.15)' : 'rgba(37,99,235,0.15)', boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.03),0 8px 32px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.08)' }}>
        <div className="hero-card-header" style={{ borderBottomColor: card.line }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, color: card.sub, marginLeft: 4 }}>Admin Review Queue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.22)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ca8a04' }}>3 Pending</span>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Building Scalable APIs with Node.js', author: 'Arjun S.', tag: 'Engineering', status: 'review' },
            { title: 'Modern CSS Grid Techniques', author: 'Priya N.', tag: 'Design', status: 'approved' },
            { title: 'Understanding React Server Components', author: 'Rahul V.', tag: 'React', status: 'review' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 8, borderRadius: 8, background: card.inner, border: `1px solid ${card.innerBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.12)' }}>
                  <FileText style={{ width: 12, height: 12, color: iconBlue }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: card.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{item.title}</p>
                  <p style={{ fontSize: 9, color: card.sub, marginTop: 2 }}>{item.author} · {item.tag}</p>
                </div>
              </div>
              {item.status === 'approved'
                ? <span className="review-badge approved">✓ Live</span>
                : <span className="review-badge pending">Review</span>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: '#2563eb', border: 'none', cursor: 'pointer' }}>Approve</button>
          <button style={{ flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 10, fontWeight: 700, color: card.btn2txt, background: card.btn2bg, border: `1px solid ${card.btn2border}`, cursor: 'pointer' }}>Request Edit</button>
        </div>
      </div>

      {/* ── Writing Card (top-left) ── */}
      <div className="hero-card hero-card-tl hero-float-1" style={{ background: card.bg, borderColor: card.border, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <PenSquare style={{ width: 14, height: 14, color: iconBlue }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: card.txt }}>Writing...</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: iconGreen }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Auto-saved
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 6, borderRadius: 999, width: '100%', background: card.barFg }} />
          <div style={{ height: 6, borderRadius: 999, width: '80%', background: card.barBg }} />
          <div style={{ height: 6, borderRadius: 999, width: '100%', background: card.barBg }} />
          <div style={{ height: 6, borderRadius: 999, width: '66%', background: card.barBg }} />
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 9, color: card.sub }}>274 words</span>
          <span style={{ color: card.sub }}>·</span>
          <span style={{ fontSize: 9, color: card.sub }}>2 min read</span>
        </div>
      </div>

      {/* ── Published Card (bottom-right) ── */}
      <div className="hero-card hero-card-br hero-float-2" style={{ background: card.bg, borderColor: card.border, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div style={{ width: '100%', height: 56, borderRadius: 8, marginBottom: 8, overflow: 'hidden', position: 'relative', background: card.thumbBg }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: card.thumbLabel, letterSpacing: '0.1em' }}>THUMBNAIL</span>
          </div>
          <div style={{ position: 'absolute', top: 6, left: 6, padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, color: '#fff', background: '#2563eb' }}>Engineering</div>
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: card.txt, lineHeight: 1.35, marginBottom: 6 }}>Building Scalable APIs with Node.js</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: card.sub }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye style={{ width: 10, height: 10 }} /> 2.4k</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart style={{ width: 10, height: 10 }} /> 148</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, color: iconGreen, fontWeight: 600 }}>
            <CheckCircle style={{ width: 10, height: 10 }} /> Published
          </span>
        </div>
      </div>

      {/* ── Stats Card (top-right) ── */}
      <div className="hero-card hero-card-tr hero-float-3" style={{ background: card.bg, borderColor: card.border, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <TrendingUp style={{ width: 12, height: 12, color: '#22c55e' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: card.txt }}>This Week</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { val: '12.4k', label: 'Views', color: '#3b82f6' },
            { val: '847', label: 'Likes', color: '#ec4899' },
            { val: '23', label: 'Published', color: '#22c55e' },
            { val: '94%', label: 'Quality', color: '#f59e0b' },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: card.statBg, border: `1px solid ${card.statBorder}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono,monospace)', color, lineHeight: 1.2 }}>{val}</p>
              <p style={{ fontSize: 8, color: card.sub, marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Approval Badge (bottom-left) ── */}
      <div className="hero-card hero-card-bl hero-float-1" style={{ animationDelay: '-2s', background: card.bg, borderColor: card.border, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.1)' }}>
            <Shield style={{ width: 11, height: 11, color: iconGreen }} />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: card.txt, lineHeight: 1.3 }}>Quality Approved</p>
            <p style={{ fontSize: 8, color: card.sub }}>2 mins ago</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <CheckCircle style={{ width: 11, height: 11, color: iconGreen, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: isDark ? '#6ee7b7' : '#047857', fontWeight: 500 }}>Post is now live to 50K+ readers</span>
        </div>
      </div>

    </div>
  );
}
