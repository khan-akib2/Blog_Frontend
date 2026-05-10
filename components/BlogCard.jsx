import Link from 'next/link';
import { Clock, Eye, Heart, PenSquare } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function BlogCard({ blog, compact = false }) {
  if (!blog) return null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 dark:hover:shadow-black/30 hover:border-blue-200 dark:hover:border-blue-900/50">

      {/* Thumbnail */}
      <Link href={`/blogs/${blog.slug}`} className="relative block overflow-hidden">
        <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-52'} bg-gray-100 dark:bg-[#1c2128]`}>
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' }}>
              <PenSquare className="w-10 h-10 text-white/40" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category pill */}
          <span className="absolute left-3 top-3 rounded-full bg-blue-600/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {blog.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Author */}
        <div className="mb-3 flex items-center gap-2.5">
          {blog.author?.avatar ? (
            <img src={blog.author.avatar} alt={blog.author.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-100 dark:ring-[#21262d]" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white ring-2 ring-gray-100 dark:ring-[#21262d]">
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-1.5 min-w-0">
            <Link href={`/author/${blog.author?._id}`} className="text-sm font-medium text-gray-700 dark:text-[#c9d1d9] hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
              {blog.author?.name}
            </Link>
            <span className="text-gray-300 dark:text-[#21262d] flex-shrink-0">·</span>
            <span className="text-xs text-gray-400 dark:text-[#8b949e] flex-shrink-0">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.slug}`} className="mb-2 block">
          <h2 className={`font-bold leading-snug text-gray-900 dark:text-[#f0f6fc] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-serif ${compact ? 'line-clamp-2 text-base' : 'line-clamp-2 text-[1.05rem]'}`}
            style={{ letterSpacing: '-0.01em' }}>
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {!compact && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-[#8b949e]">
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 dark:bg-[#1c2128] px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-[#8b949e]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#21262d] pt-3">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {blog.readingTime || 1} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {blog.views || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              {blog.likes?.length || 0}
            </span>
          </div>
          <Link href={`/blogs/${blog.slug}`} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
