import Link from 'next/link';
import { Clock, Eye, Heart, Tag } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function BlogCard({ blog, compact = false }) {
  if (!blog) return null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/10">
      <Link href={`/blogs/${blog.slug}`} className="relative block overflow-hidden">
        <div className={`relative overflow-hidden bg-gray-100 dark:bg-[#1c2128] ${compact ? 'h-40' : 'h-52'}`}>
          {blog.thumbnail ? (
            <img src={blog.thumbnail} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <span className="text-5xl">📝</span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            {blog.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          {blog.author?.avatar ? (
            <img src={blog.author.avatar} alt={blog.author.name} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <Link href={`/author/${blog.author?._id}`} className="text-sm font-medium text-gray-600 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {blog.author?.name}
          </Link>
          <span className="text-gray-300 dark:text-[#21262d]">·</span>
          <span className="text-xs text-gray-400 dark:text-[#8b949e]">{formatDate(blog.createdAt)}</span>
        </div>

        <Link href={`/blogs/${blog.slug}`}>
          <h2 className={`mb-2 font-bold leading-snug text-gray-900 dark:text-[#e6edf3] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-serif ${compact ? 'line-clamp-2 text-base' : 'line-clamp-2 text-lg'}`}>
            {blog.title}
          </h2>
        </Link>

        {!compact && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-[#8b949e]">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#21262d] pt-3">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#8b949e]">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{blog.readingTime || 1} min</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{blog.views || 0}</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{blog.likes?.length || 0}</span>
          </div>
          {blog.tags?.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#8b949e]">
              <Tag className="h-3 w-3" />{blog.tags[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
