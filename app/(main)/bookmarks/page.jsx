'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import api from '@/services/api';
import { Bookmark, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth?mode=login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      api.get('/blogs/bookmarks')
        .then(({ data }) => setBlogs(data.blogs))
        .catch(() => setBlogs([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(37,99,235,0.2)' }}>
            <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
              Saved Articles
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} bookmarked
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
            <Bookmark className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">No bookmarks yet</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Save articles you want to read later by clicking the bookmark icon on any post
          </p>
          <Link href="/blogs"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            Explore articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
