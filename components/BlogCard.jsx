import { Clock, Eye, Heart, PenSquare, ArrowUpRight } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import Link from 'next/link';

export default function BlogCard({ blog, compact = false, onOpenModal }) {
  if (!blog) return null;

  // If onOpenModal is provided, clicking the card opens the modal.
  // Otherwise fall back to navigating to the blog page (e.g. in admin preview).
  const handleCardClick = (e) => {
    if (!onOpenModal) return; // let the Link handle it
    e.preventDefault();
    onOpenModal(blog);
  };

  const ThumbnailWrapper = onOpenModal
    ? ({ children }) => (
        <button onClick={handleCardClick} className="relative block overflow-hidden w-full text-left" aria-label={`Read ${blog.title}`}>
          {children}
        </button>
      )
    : ({ children }) => (
        <Link href={`/blogs/${blog.slug}`} className="relative block overflow-hidden">
          {children}
        </Link>
      );

  const TitleWrapper = onOpenModal
    ? ({ children }) => (
        <button onClick={handleCardClick} className="mb-2 block text-left w-full">
          {children}
        </button>
      )
    : ({ children }) => (
        <Link href={`/blogs/${blog.slug}`} className="mb-2 block">
          {children}
        </Link>
      );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 hover:border-blue-200/80 dark:hover:border-blue-800/50">

      {/* Thumbnail */}
      <ThumbnailWrapper>
        <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-52'} bg-gray-100 dark:bg-[#111d35]`}>
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: blog.thumbnailPosition || '50% 50%' }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0d1a3a 0%, #1a0a3a 100%)' }}>
              <PenSquare className="w-10 h-10 text-white/20" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category pill */}
          <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm"
            style={{ background: 'rgba(37,99,235,0.9)' }}>
            {blog.category}
          </span>
          {/* Read arrow on hover */}
          <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </ThumbnailWrapper>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Author */}
        <div className="mb-3 flex items-center gap-2.5">
          {blog.author?.avatar ? (
            <img src={blog.author.avatar} alt={blog.author.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-100 dark:ring-[#1a2744]" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-gray-100 dark:ring-[#1a2744]"
              style={{ background: '#2563eb' }}>
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-1.5 min-w-0">
            <Link href={`/author/${blog.author?._id}`}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              onClick={(e) => e.stopPropagation()}>
              {blog.author?.name}
            </Link>
            <span className="text-gray-300 dark:text-[#1a2744] flex-shrink-0">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <TitleWrapper>
          <h2 className={`font-bold leading-snug text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${compact ? 'line-clamp-2 text-base' : 'line-clamp-2 text-[1.05rem]'}`}
            style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
            {blog.title}
          </h2>
        </TitleWrapper>

        {/* Excerpt */}
        {!compact && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 dark:bg-[#111d35] px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#1a2744]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-[#1a2744] pt-3">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {blog.readingTime || 1} min
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
          {onOpenModal ? (
            <button
              onClick={handleCardClick}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Read →
            </button>
          ) : (
            <Link href={`/blogs/${blog.slug}`}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Read →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
