import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles, PenSquare, Users, BookOpen } from 'lucide-react';
import BlogCard from '@/components/BlogCard';

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const [latestRes, trendingRes] = await Promise.all([
      fetch(`${baseUrl}/blogs?limit=6&sort=-createdAt`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/blogs/trending`, { next: { revalidate: 60 } }),
    ]);
    const latest = latestRes.ok ? await latestRes.json() : { blogs: [] };
    const trending = trendingRes.ok ? await trendingRes.json() : { blogs: [] };
    return { latest: latest.blogs || [], trending: trending.blogs || [] };
  } catch {
    return { latest: [], trending: [] };
  }
}

export default async function HomePage() {
  const { latest, trending } = await getHomeData();

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 py-24 px-4">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-200 dark:bg-indigo-900 opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-900 opacity-30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            Share your story with the world
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl font-serif">
            Ideas worth{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              reading
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500 dark:text-gray-400 sm:text-xl font-sans leading-relaxed">
            Discover insightful articles, share your expertise, and connect with a community of passionate writers.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Explore Blogs <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <PenSquare className="h-5 w-5" /> Start Writing
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-10 dark:border-gray-800">
            {[
              { icon: BookOpen, label: 'Articles Published', value: '1,200+' },
              { icon: Users, label: 'Active Writers', value: '500+' },
              { icon: TrendingUp, label: 'Monthly Readers', value: '50K+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="mb-1 h-5 w-5 text-indigo-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending ── */}
      {trending.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            </div>
            <Link
              href="/blogs?sort=-views"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
          <Link
            href="/blogs"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 dark:border-gray-800">
            <PenSquare className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-700" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No blogs yet</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">Be the first to write something amazing</p>
            <Link
              href="/write"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Start Writing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 py-20 px-4">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to share your story?</h2>
          <p className="mb-8 text-lg text-indigo-100">
            Join thousands of writers and start publishing today. It&apos;s free.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:-translate-y-0.5"
          >
            Get Started Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
