import Link from 'next/link';
import { ArrowRight, TrendingUp, PenSquare, Users, BookOpen, Zap } from 'lucide-react';
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

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden bg-white dark:bg-[#0d1117] pt-20 pb-28 px-4">
        {/* Mesh gradient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] dark:opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 65%)' }} />
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 65%)' }} />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Eyebrow label */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-5 py-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400 tracking-wide">
              The home for curious minds
            </span>
          </div>

          {/* Headline */}
          <h1 className="display-xl mb-6 text-gray-900 dark:text-[#f0f6fc]">
            Where great ideas<br />
            <span className="gradient-text">come to life</span>
          </h1>

          {/* Subheading */}
          <p className="body-lg mx-auto mb-10 max-w-2xl text-gray-500 dark:text-[#8b949e]">
            Discover insightful articles from expert writers. Share your knowledge,
            build your audience, and join a community that values great writing.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-600/40"
            >
              Explore Blogs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] px-8 py-3.5 text-base font-semibold text-gray-800 dark:text-[#e6edf3] shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#1c2128] hover:-translate-y-0.5"
            >
              <PenSquare className="h-4 w-4 text-blue-500" />
              Start Writing
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: BookOpen, value: '1,200+', label: 'Articles Published', color: 'text-blue-500' },
              { icon: Users,    value: '500+',   label: 'Active Writers',     color: 'text-emerald-500' },
              { icon: TrendingUp, value: '50K+', label: 'Monthly Readers',    color: 'text-violet-500' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 dark:border-[#21262d] bg-gray-50/50 dark:bg-[#161b22]/50 px-4 py-5 transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#1c2128] shadow-sm ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-[#f0f6fc] tracking-tight">{value}</span>
                <span className="text-xs font-medium text-gray-500 dark:text-[#8b949e] text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {trending.length > 0 && (
        <section className="w-full bg-gray-50/50 dark:bg-[#161b22]/30 border-y border-gray-100 dark:border-[#21262d] py-20 px-4">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="label mb-2 text-orange-500 dark:text-orange-400">🔥 Hot right now</p>
                <h2 className="heading-xl text-gray-900 dark:text-[#f0f6fc]">Trending Stories</h2>
              </div>
              <Link href="/blogs?sort=-views" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trending.slice(0, 3).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="label mb-2">✦ Fresh content</p>
            <h2 className="heading-xl text-gray-900 dark:text-[#f0f6fc]">Latest Posts</h2>
          </div>
          <Link href="/blogs" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#21262d] py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
              <PenSquare className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-[#f0f6fc]">No stories yet</h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-[#8b949e]">Be the first to publish something amazing</p>
            <Link href="/write" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors">
              Write your first blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── WHY BLOGHUB ── */}
      <section className="w-full bg-gray-50 dark:bg-[#161b22]/50 border-t border-gray-100 dark:border-[#21262d] py-20 px-4">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="label mb-3">Why BlogHub</p>
            <h2 className="heading-xl text-gray-900 dark:text-[#f0f6fc] max-w-2xl mx-auto">
              Everything you need to write and grow
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '✍️', title: 'Rich Text Editor', desc: 'A powerful editor with formatting, images, links, and code blocks built in.' },
              { icon: '🔍', title: 'Built-in Discovery', desc: 'Your stories get surfaced to readers through categories, tags, and trending.' },
              { icon: '✅', title: 'Quality Reviewed', desc: 'Every post is reviewed before publishing to maintain high content standards.' },
              { icon: '📊', title: 'Author Analytics', desc: 'Track views, likes, and reader engagement on all your published posts.' },
              { icon: '💬', title: 'Community Comments', desc: 'Engage with your readers through threaded comments and reactions.' },
              { icon: '🔖', title: 'Save & Bookmark', desc: 'Readers can bookmark your articles to read later and come back for more.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-gray-200 dark:border-[#21262d] bg-white dark:bg-[#161b22] p-6 transition-all hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
                <div className="mb-4 text-3xl">{icon}</div>
                <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-[#f0f6fc]">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-[#8b949e]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative w-full overflow-hidden bg-blue-600 py-24 px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500 opacity-30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-700 opacity-30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100">
            <Zap className="h-4 w-4" /> Free forever for writers
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl font-serif leading-tight">
            Your story deserves<br />to be heard
          </h2>
          <p className="mb-10 text-lg text-blue-100 max-w-xl mx-auto">
            Join thousands of writers sharing their expertise and building their audience on BlogHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:-translate-y-0.5">
              Start writing for free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/blogs" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10">
              Browse stories
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
