'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { FileText, Users, Clock, CheckCircle, XCircle, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>;

  const { analytics, topBlogs, recentBlogs } = data || {};

  const statCards = [
    { label: 'Total Blogs', value: analytics?.totalBlogs, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Pending Review', value: analytics?.pendingBlogs, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Approved', value: analytics?.approvedBlogs, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Rejected', value: analytics?.rejectedBlogs, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Total Users', value: analytics?.totalUsers, icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Comments', value: analytics?.totalComments, icon: MessageCircle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {analytics?.pendingBlogs > 0 && (
          <Link href="/admin/blogs?status=pending" className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-medium transition-colors">
            <Clock className="w-4 h-4" /> {analytics.pendingBlogs} Pending
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <div className={`p-2 rounded-lg ${bg}`}><Icon className={`w-4 h-4 ${color}`} /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top blogs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Blogs</h2>
          </div>
          <div className="space-y-3">
            {topBlogs?.map((blog, i) => (
              <div key={blog._id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{blog.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{blog.author?.name}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                  <Eye className="w-3 h-3" />{blog.views}
                </span>
              </div>
            ))}
            {!topBlogs?.length && <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">No data yet</p>}
          </div>
        </div>

        {/* Recent pending */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Pending Review</h2>
            </div>
            <Link href="/admin/blogs?status=pending" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentBlogs?.map((blog) => (
              <div key={blog._id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{blog.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{blog.author?.name} · {formatDate(blog.createdAt)}</p>
                </div>
                <Link href={`/admin/blogs?status=pending`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">Review</Link>
              </div>
            ))}
            {!recentBlogs?.length && <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">No pending blogs</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
