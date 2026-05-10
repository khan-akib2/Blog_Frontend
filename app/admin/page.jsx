'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import {
  FileText, Users, Clock, CheckCircle, XCircle, MessageCircle,
  TrendingUp, Eye, ArrowUpRight, Activity, Zap, BarChart3,
  ArrowRight, RefreshCw
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: '#111d35' }} />
        ))}
      </div>
    </div>
  );

  const { analytics, topBlogs, recentBlogs } = data || {};

  const statCards = [
    { label: 'Total Blogs',    value: analytics?.totalBlogs,    icon: FileText,      color: '#4f8ef7', glow: 'rgba(37,99,235,0.15)',   change: '+12%' },
    { label: 'Pending Review', value: analytics?.pendingBlogs,  icon: Clock,         color: '#f59e0b', glow: 'rgba(245,158,11,0.15)',  change: 'needs action' },
    { label: 'Approved',       value: analytics?.approvedBlogs, icon: CheckCircle,   color: '#34d399', glow: 'rgba(52,211,153,0.15)',  change: '+8%' },
    { label: 'Rejected',       value: analytics?.rejectedBlogs, icon: XCircle,       color: '#f87171', glow: 'rgba(248,113,113,0.15)', change: '-3%' },
    { label: 'Total Users',    value: analytics?.totalUsers,    icon: Users,         color: '#a78bfa', glow: 'rgba(124,58,237,0.15)',  change: '+24%' },
    { label: 'Comments',       value: analytics?.totalComments, icon: MessageCircle, color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  change: '+18%' },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Monitor your platform performance</p>
        </div>
        <div className="flex items-center gap-2">
          {analytics?.pendingBlogs > 0 && (
            <Link href="/admin/blogs?status=pending"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
              <Clock className="w-4 h-4" /> {analytics.pendingBlogs} Pending
            </Link>
          )}
          <button onClick={handleRefresh}
            className={`p-2 rounded-xl text-gray-400 hover:text-white transition-all ${refreshing ? 'animate-spin' : 'hover:bg-[#111d35]'}`}
            style={{ border: '1px solid #1a2744' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, glow, change }) => (
          <div key={label}
            className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 60%)` }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: glow, border: `1px solid ${color}30` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${glow}`, color, border: `1px solid ${color}20` }}>
                  {change}
                </span>
              </div>
              <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}>
                {value ?? 0}
              </p>
              <p className="text-xs font-semibold text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity indicator */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(79,142,247,0.15)' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'rgba(79,142,247,0.15)' }}>
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Platform is running smoothly</p>
          <p className="text-xs text-gray-400">All systems operational · Last updated just now</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top blogs */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(79,142,247,0.15)' }}>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="font-bold text-white text-sm">Top Performing Blogs</h2>
            </div>
            <Link href="/admin/blogs?sort=-views"
              className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topBlogs?.map((blog, i) => (
              <div key={blog._id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[#111d35]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black flex-shrink-0"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : i === 1 ? 'rgba(79,142,247,0.15)' : 'rgba(26,39,68,0.5)',
                    color: i === 0 ? 'white' : i === 1 ? '#4f8ef7' : '#4a6080'
                  }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{blog.title}</p>
                  <p className="text-xs text-gray-500">{blog.author?.name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 flex-shrink-0">
                  <Eye className="w-3.5 h-3.5" />{blog.views}
                </div>
              </div>
            ))}
            {!topBlogs?.length && (
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending review */}
        <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="font-bold text-white text-sm">Pending Review</h2>
            </div>
            <Link href="/admin/blogs?status=pending"
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Review all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentBlogs?.map((blog) => (
              <div key={blog._id} className="flex items-center justify-between gap-3 p-3 rounded-xl transition-colors hover:bg-[#111d35]">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{blog.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{blog.author?.name} · {formatDate(blog.createdAt)}</p>
                </div>
                <Link href="/admin/blogs?status=pending"
                  className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 flex-shrink-0 transition-colors">
                  Review <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
            {!recentBlogs?.length && (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-green-500/40 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All caught up!</p>
                <p className="text-xs text-gray-600 mt-1">No pending blogs to review</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl p-5" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-400" />
          <h2 className="font-bold text-white text-sm">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Review Pending', href: '/admin/blogs?status=pending', color: '#f59e0b', glow: 'rgba(245,158,11,0.1)' },
            { label: 'Manage Users', href: '/admin/users', color: '#a78bfa', glow: 'rgba(124,58,237,0.1)' },
            { label: 'All Blogs', href: '/admin/blogs', color: '#4f8ef7', glow: 'rgba(37,99,235,0.1)' },
          ].map(({ label, href, color, glow }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: glow, border: `1px solid ${color}20`, color }}>
              {label}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
