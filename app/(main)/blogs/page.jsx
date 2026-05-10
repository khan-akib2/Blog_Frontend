'use client';
import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import api from '@/services/api';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, BookOpen } from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

function BlogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, sort });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const { data } = await api.get(`/blogs?${params}`);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Knowledge Hub
        </p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.025em' }}>
          All Articles
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {pagination.total} articles published by our community
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
          />
        </form>
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors"
          >
            <option value="-createdAt">Latest</option>
            <option value="-views">Most Viewed</option>
            <option value="-likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(search || category) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
              "{search}"
              <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-blue-800 dark:hover:text-blue-200">×</button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
              {category}
              <button onClick={() => { setCategory(''); setPage(1); }} className="hover:text-purple-800 dark:hover:text-purple-200">×</button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
            <Search className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">No articles found</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          {(search || category) && (
            <button onClick={() => { setSearch(''); setCategory(''); setPage(1); }}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] disabled:opacity-40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                p === page
                  ? 'text-white shadow-lg'
                  : 'border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
              style={p === page ? { background: 'linear-gradient(135deg, #2563eb, #7c3aed)' } : {}}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] disabled:opacity-40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    }>
      <BlogsContent />
    </Suspense>
  );
}
