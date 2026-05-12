'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Eye, Clock, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function RelatedBlogs({ blogId, currentSlug }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;
    api.get(`/blogs/${blogId}/related`)
      .then(({ data }) => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [blogId]);

  if (loading || blogs.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
          You may also like
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blogs/${blog.slug}`}
            className="group flex gap-4 p-4 rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
          >
            {blog.thumbnail && (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                style={{ objectPosition: blog.thumbnailPosition || '50% 50%' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1.5"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#3b82f6' }}>
                {blog.category}
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {blog.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readingTime} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
