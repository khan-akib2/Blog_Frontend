import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { formatDate } from '@/utils/helpers';
import { Calendar, BookOpen, Eye, ArrowLeft } from 'lucide-react';

async function getAuthorData(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const [blogsRes, profileRes] = await Promise.all([
      fetch(`${baseUrl}/blogs/author/${id}?limit=12`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/blogs/author/${id}/profile`, { next: { revalidate: 60 } }),
    ]);
    const blogsData = blogsRes.ok ? await blogsRes.json() : { blogs: [] };
    const profileData = profileRes.ok ? await profileRes.json() : { author: null };
    return {
      blogs: blogsData.blogs || [],
      author: profileData.author || blogsData.blogs?.[0]?.author || null,
      totalPublished: profileData.author?.totalPublished ?? blogsData.blogs?.length ?? 0,
      totalViews: profileData.author?.totalViews ?? 0,
    };
  } catch {
    return { blogs: [], author: null, totalPublished: 0, totalViews: 0 };
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { author } = await getAuthorData(resolvedParams.id);
  if (!author) return { title: 'Author Not Found' };
  return {
    title: `${author.name} — Author Profile | BlogHub`,
    description: author.bio || `Read articles by ${author.name} on BlogHub.`,
  };
}

export default async function AuthorPage({ params }) {
  const resolvedParams = await params;
  const { blogs, author, totalPublished, totalViews } = await getAuthorData(resolvedParams.id);

  if (!author && blogs.length === 0) notFound();

  const displayAuthor = author || blogs[0]?.author;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Back link */}
      <Link href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to blogs
      </Link>

      {/* Author header card */}
      <div className="rounded-3xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] overflow-hidden mb-10 shadow-sm">
        {/* Cover gradient */}
        <div className="h-28 sm:h-36"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)' }} />

        <div className="px-6 sm:px-8 pb-8">
          {/* Avatar — overlaps cover */}
          <div className="-mt-12 sm:-mt-14 mb-4 flex items-end justify-between">
            <div className="relative">
              {displayAuthor?.avatar ? (
                <img
                  src={displayAuthor.avatar}
                  alt={displayAuthor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-[#0d1526] shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white text-4xl font-black ring-4 ring-white dark:ring-[#0d1526] shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  {displayAuthor?.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>

          {/* Name & bio */}
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            {displayAuthor?.name || 'Author'}
          </h1>
          {displayAuthor?.bio && (
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl mb-4">
              {displayAuthor.bio}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18]">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{totalPublished}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Published</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18]">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Total views</span>
            </div>
            {displayAuthor?.createdAt && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18]">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Joined {formatDate(displayAuthor.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Published articles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Published Articles
          <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">({totalPublished})</span>
        </h2>
      </div>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-20 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No published articles yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back soon!</p>
        </div>
      )}
    </div>
  );
}
