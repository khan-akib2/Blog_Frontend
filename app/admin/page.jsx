'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import {
  FileText, Users, Clock, CheckCircle, XCircle, TrendingUp,
  Eye, ArrowUpRight, Zap, ArrowRight, RefreshCw, Heart,
  AlertTriangle, MessageCircle, Star, UserPlus, PenSquare,
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

// ── SVG Donut Chart ───────────────────────────────────────────────────────────
function DonutChart({ segments, size = 120, thickness = 18 }) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const arc = { ...seg, dash, gap, offset: offset * circumference };
    offset += pct;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(26,39,68,0.8)" strokeWidth={thickness} />
      {/* Segments */}
      {arcs.map((arc, i) =>
        arc.value > 0 ? (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        ) : null
      )}
    </svg>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, value, max, color, href }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const bar = (
    <div className="group flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-400 w-24 truncate flex-shrink-0 group-hover:text-gray-200 transition-colors">{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,39,68,0.8)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right flex-shrink-0" style={{ color }}>{value}</span>
    </div>
  );
  return href ? <Link href={href}>{bar}</Link> : bar;
}

// ── Sparkline (mini SVG line chart) ──────────────────────────────────────────
function Sparkline({ values, color, width = 80, height = 28 }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - (v / max) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

// ── Compact metric row ────────────────────────────────────────────────────────
function MetricRow({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#1a2744' }}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        {sub && <p className="text-[10px] text-gray-600 truncate">{sub}</p>}
      </div>
      <span className="text-sm font-black text-white">{(value ?? 0).toLocaleString()}</span>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const { data: res } = await api.get('/admin/analytics');
      setData(res);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: '#111d35' }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: '#111d35' }} />
        ))}
      </div>
    </div>
  );

  const { analytics: a, topBlogs, recentBlogs, categoryStats } = data || {};

  // Donut segments — blog status breakdown
  const totalBlogs = a?.totalBlogs || 0;
  const donutSegments = [
    { label: 'Approved', value: a?.approvedBlogs || 0, color: '#34d399' },
    { label: 'Pending',  value: a?.pendingBlogs  || 0, color: '#f59e0b' },
    { label: 'Rejected', value: a?.rejectedBlogs || 0, color: '#f87171' },
    { label: 'Draft',    value: Math.max(0, totalBlogs - (a?.approvedBlogs || 0) - (a?.pendingBlogs || 0) - (a?.rejectedBlogs || 0)), color: '#4a6080' },
  ].filter((s) => s.value > 0);

  // Engagement bar max
  const engMax = Math.max(a?.totalViews || 0, a?.totalLikes || 0, a?.totalComments || 0, 1);

  // Category bar max
  const catMax = categoryStats?.[0]?.count || 1;

  // Fake sparkline data (last 7 days trend — use weekly counts as proxy)
  const blogSparkline = [0, 0, 0, 0, 0, a?.newBlogsThisWeek || 0, a?.totalBlogs || 0].map((v, i, arr) =>
    i === 0 ? Math.max(0, (a?.totalBlogs || 0) - (a?.newBlogsThisWeek || 0)) : v
  );

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white" style={{ letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Platform overview</p>
        </div>
        <div className="flex items-center gap-2">
          {(a?.pendingBlogs > 0) && (
            <Link href="/admin/blogs?status=pending"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
              <Clock className="w-3.5 h-3.5" /> {a.pendingBlogs} Pending
            </Link>
          )}
          {(a?.totalReports > 0) && (
            <Link href="/admin/reports"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
              <AlertTriangle className="w-3.5 h-3.5" /> {a.totalReports} Reports
            </Link>
          )}
          <button onClick={handleRefresh}
            className={`p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#111d35] transition-all ${refreshing ? 'animate-spin' : ''}`}
            style={{ border: '1px solid #1a2744' }}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Row 1: Donut + Engagement + Quick stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Blog status donut */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(79,142,247,0.15)' }}>
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Blog Status</h2>
            <Link href="/admin/blogs" className="ml-auto text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <DonutChart segments={donutSegments} size={110} thickness={16} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white leading-none">{totalBlogs}</span>
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {[
                { label: 'Approved', value: a?.approvedBlogs || 0, color: '#34d399', href: '/admin/blogs?status=approved' },
                { label: 'Pending',  value: a?.pendingBlogs  || 0, color: '#f59e0b', href: '/admin/blogs?status=pending'  },
                { label: 'Rejected', value: a?.rejectedBlogs || 0, color: '#f87171', href: '/admin/blogs?status=rejected' },
                { label: 'Draft',    value: Math.max(0, totalBlogs - (a?.approvedBlogs||0) - (a?.pendingBlogs||0) - (a?.rejectedBlogs||0)), color: '#4a6080' },
              ].map(({ label, value, color, href }) => {
                const pct = totalBlogs > 0 ? Math.round((value / totalBlogs) * 100) : 0;
                const row = (
                  <div key={label} className="flex items-center gap-2 group cursor-default">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-xs text-gray-400 flex-1 group-hover:text-gray-200 transition-colors">{label}</span>
                    <span className="text-xs font-bold text-white">{value}</span>
                    <span className="text-[10px] text-gray-600 w-7 text-right">{pct}%</span>
                  </div>
                );
                return href ? <Link key={label} href={href}>{row}</Link> : row;
              })}
            </div>
          </div>
        </div>

        {/* Engagement bars */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(251,113,133,0.15)' }}>
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Engagement</h2>
          </div>
          <div className="space-y-1">
            <HBar label="Views"    value={a?.totalViews    || 0} max={engMax} color="linear-gradient(90deg,#34d399,#059669)" />
            <HBar label="Likes"    value={a?.totalLikes    || 0} max={engMax} color="linear-gradient(90deg,#fb7185,#e11d48)" />
            <HBar label="Comments" value={a?.totalComments || 0} max={engMax} color="linear-gradient(90deg,#60a5fa,#2563eb)" />
          </div>

          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2" style={{ borderColor: '#1a2744' }}>
            {[
              { label: 'Views',    value: a?.totalViews    || 0, color: '#34d399' },
              { label: 'Likes',    value: a?.totalLikes    || 0, color: '#fb7185' },
              { label: 'Comments', value: a?.totalComments || 0, color: '#60a5fa' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className="text-base font-black text-white leading-none">{value.toLocaleString()}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform snapshot */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(124,58,237,0.15)' }}>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Platform</h2>
          </div>
          <div>
            <MetricRow icon={Users}         label="Total Users"    value={a?.totalUsers}        color="#a78bfa" sub={`+${a?.newUsersThisWeek||0} this week`} />
            <MetricRow icon={Star}          label="Featured Blogs" value={a?.featuredBlogs}     color="#facc15" />
            <MetricRow icon={AlertTriangle} label="Reports"        value={a?.totalReports}      color="#f97316" sub="Needs review" />
            <MetricRow icon={UserPlus}      label="New Users (7d)" value={a?.newUsersThisWeek}  color="#818cf8" />
            <MetricRow icon={PenSquare}     label="New Blogs (7d)" value={a?.newBlogsThisWeek}  color="#4f8ef7" />
          </div>
        </div>
      </div>

      {/* ── Row 2: Top blogs + Category bars + Pending ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top performing blogs */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(79,142,247,0.15)' }}>
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h2 className="text-sm font-bold text-white">Top Blogs</h2>
            </div>
            <Link href="/admin/blogs" className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topBlogs?.length > 0 ? topBlogs.map((blog, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={blog._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#111d35] transition-colors">
                  <span className="text-sm flex-shrink-0 w-5 text-center">{medals[i] || `${i + 1}`}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{blog.title}</p>
                    <p className="text-[10px] text-gray-500">{blog.author?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{blog.views}</span>
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{blog.likes?.length || 0}</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-gray-600 text-center py-6">No blogs yet</p>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(124,58,237,0.15)' }}>
              <FileText className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h2 className="text-sm font-bold text-white">By Category</h2>
          </div>
          <div className="space-y-1">
            {categoryStats?.length > 0 ? (
              categoryStats.slice(0, 7).map((cat) => (
                <HBar
                  key={cat._id}
                  label={cat._id}
                  value={cat.count}
                  max={catMax}
                  color="linear-gradient(90deg,#7c3aed,#2563eb)"
                  href={`/admin/blogs?category=${encodeURIComponent(cat._id)}`}
                />
              ))
            ) : (
              <p className="text-xs text-gray-600 text-center py-6">No data yet</p>
            )}
          </div>
        </div>

        {/* Pending review queue */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h2 className="text-sm font-bold text-white">Pending Review</h2>
            </div>
            <Link href="/admin/blogs?status=pending"
              className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBlogs?.length > 0 ? recentBlogs.map((blog) => (
              <div key={blog._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#111d35] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{blog.title}</p>
                  <p className="text-[10px] text-gray-500">{blog.author?.name} · {formatDate(blog.createdAt)}</p>
                </div>
                <Link href="/admin/blogs?status=pending"
                  className="flex-shrink-0 p-1.5 rounded-lg text-amber-400 hover:bg-amber-950/30 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )) : (
              <div className="text-center py-6">
                <CheckCircle className="w-7 h-7 text-green-500/30 mx-auto mb-2" />
                <p className="text-xs text-gray-500">All caught up!</p>
              </div>
            )}
          </div>

          {/* Quick actions strip */}
          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2" style={{ borderColor: '#1a2744' }}>
            {[
              { label: 'Manage Users', href: '/admin/users',   color: '#a78bfa', bg: 'rgba(124,58,237,0.1)' },
              { label: 'View Reports', href: '/admin/reports', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
            ].map(({ label, href, color, bg }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: bg, border: `1px solid ${color}20`, color }}>
                {label} <ArrowUpRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
