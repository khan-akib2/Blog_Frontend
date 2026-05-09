'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import api from '@/services/api';
import { Bookmark, Loader2 } from 'lucide-react';

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      api.get('/blogs/bookmarks')
        .then(({ data }) => setBlogs(data.blogs))
        .catch(() => setBlogs([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
        <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm rounded-full">{blogs.length}</span>
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
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No bookmarks yet</p>
          <p className="text-sm mt-2">Save blogs you want to read later</p>
        </div>
      )}
    </div>
  );
}
