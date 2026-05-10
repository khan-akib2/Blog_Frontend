import Link from 'next/link';
import {
  ArrowRight, TrendingUp, PenSquare, Users, BookOpen, Zap, Flame,
  CheckCircle, BarChart2, MessageSquare, Bookmark, Shield, Star,
  Code2, Globe, Cpu, Database, Lock, Rocket
} from 'lucide-react';
import BlogCard from '@/components/BlogCard';

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const [latestRes, trendingRes] = await Promise.all([
      fetch(`${baseUrl}/blogs?limit=6&sort=-createdAt`, { next: { revalidate: 10 } }),
      fetch(`${baseUrl}/blogs/trending`, { next: { revalidate: 10 } }),
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
      <section className="relative w-full overflow-hidden bg-white dark:bg-[#060b18] pt-24 pb-32 px-4">
        {/* Tech grid */}
        <div className="absolute inset-0 tech-grid opacity-60" />

        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-[0.12] dark:opacity-[0.18]"
            style={{ background: 'radial-gradient(ellipse, #2563eb 0%, #7c3aed 40%, transparent 70%)' }} />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.1]"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)' }} />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05] dark:opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 65%)' }} />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Eyebrow badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#4f8ef7'
            }}>
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            The home for curious minds
          </div>

          {/* Headline */}
          <h1 className="display-xl mb-6 text-gray-900 dark:text-white">
            Where great ideas<br />
            <span className="gradient-text">come to life</span>
          </h1>

          {/* Subheading */}
          <p className="body-lg mx-auto mb-10 max-w-2xl">
            Discover insightful articles from expert writers. Share your knowledge,
            build your audience, and join a community that values great writing.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: '0 8px 32px rgba(37,99,235,0.35)'
              }}
            >
              Explore Blogs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] px-8 py-3.5 text-base font-bold text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#111d35] hover:-translate-y-1"
            >
              <PenSquare className="h-4 w-4 text-blue-500" />
              Start Writing
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: BookOpen, value: '1,200+', label: 'Articles Published', color: '#4f8ef7', glow: 'rgba(37,99,235,0.2)' },
              { icon: Users,    value: '500+',   label: 'Active Writers',     color: '#a78bfa', glow: 'rgba(124,58,237,0.2)' },
              { icon: TrendingUp, value: '50K+', label: 'Monthly Readers',    color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
            ].map(({ icon: Icon, value, label, color, glow }) => (
              <div key={label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-white/80 dark:bg-[#0d1526]/80 px-4 py-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.05)` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${glow}`, border: `1px solid ${color}30` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>{value}</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {trending.length > 0 && (
        <section className="w-full bg-gray-50/80 dark:bg-[#0d1526]/60 border-y border-gray-100 dark:border-[#1a2744] py-20 px-4">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="label mb-2 flex items-center gap-1.5" style={{ color: '#f97316' }}>
                  <Flame className="w-3.5 h-3.5" /> Hot right now
                </p>
                <h2 className="heading-xl text-gray-900 dark:text-white">Trending Stories</h2>
              </div>
              <Link href="/blogs?sort=-views"
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
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
            <p className="label mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" style={{ color: '#4f8ef7' }} /> Fresh content
            </p>
            <h2 className="heading-xl text-gray-900 dark:text-white">Latest Posts</h2>
          </div>
          <Link href="/blogs"
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#1a2744] py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))' }}>
              <PenSquare className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">No stories yet</h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Be the first to publish something amazing</p>
            <Link href="/write"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              Write your first blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section className="w-full bg-gray-50 dark:bg-[#060b18] border-t border-gray-100 dark:border-[#1a2744] py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="label mb-3 flex items-center justify-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" style={{ color: '#4f8ef7' }} /> Platform Features
            </p>
            <h2 className="heading-xl text-gray-900 dark:text-white max-w-2xl mx-auto mb-4">
              Everything you need to write and grow
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Built with modern technology to give writers and readers the best experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: PenSquare, title: 'Rich Text Editor',    desc: 'A powerful editor with formatting, images, links, and code blocks built in.', color: '#4f8ef7', glow: 'rgba(37,99,235,0.15)' },
              { icon: Globe,     title: 'Built-in Discovery',  desc: 'Your stories get surfaced to readers through categories, tags, and trending.', color: '#a78bfa', glow: 'rgba(124,58,237,0.15)' },
              { icon: CheckCircle, title: 'Quality Reviewed',  desc: 'Every post is reviewed before publishing to maintain high content standards.', color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
              { icon: BarChart2,  title: 'Author Analytics',   desc: 'Track views, likes, and reader engagement on all your published posts.', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
              { icon: MessageSquare, title: 'Community Comments', desc: 'Engage with your readers through threaded comments and reactions.', color: '#f472b6', glow: 'rgba(244,114,182,0.15)' },
              { icon: Bookmark,  title: 'Save & Bookmark',     desc: 'Readers can bookmark your articles to read later and come back for more.', color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
            ].map(({ icon: Icon, title, desc, color, glow }) => (
              <div key={title}
                className="group relative rounded-2xl border border-gray-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at top left, ${glow}, transparent 60%)` }} />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: glow, border: `1px solid ${color}30` }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK STRIP ── */}
      <section className="w-full border-y border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] py-10 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-8">
            Powered by modern technology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: 'Next.js 16', icon: Code2, color: '#e2e8f0' },
              { name: 'React 19', icon: Cpu, color: '#61dafb' },
              { name: 'Node.js', icon: Database, color: '#68a063' },
              { name: 'MongoDB', icon: Database, color: '#47a248' },
              { name: 'Cloudinary', icon: Globe, color: '#3448c5' },
              { name: 'JWT Auth', icon: Lock, color: '#f59e0b' },
            ].map(({ name, icon: Icon, color }) => (
              <div key={name} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-sm font-semibold text-gray-600 dark:text-gray-400">
                <Icon className="h-4 w-4" style={{ color }} />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS / TRUST ── */}
      <section className="w-full py-20 px-4 bg-white dark:bg-[#060b18]">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="label mb-3 flex items-center justify-center gap-1.5">
              <Star className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} /> Trusted by writers
            </p>
            <h2 className="heading-xl text-gray-900 dark:text-white">What our community says</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { quote: 'BlogHub gave me the platform to share my tech insights with thousands of readers. The editor is incredibly powerful.', name: 'Arjun Sharma', role: 'Software Engineer', initial: 'A', color: '#4f8ef7' },
              { quote: 'The review process ensures quality content. I love that every article here is worth reading — no fluff, just substance.', name: 'Priya Nair', role: 'Data Scientist', initial: 'P', color: '#a78bfa' },
              { quote: 'As a startup founder, sharing my journey on BlogHub helped me connect with investors and like-minded entrepreneurs.', name: 'Rahul Verma', role: 'Startup Founder', initial: 'R', color: '#34d399' },
            ].map(({ quote, name, role, initial, color }) => (
              <div key={name} className="rounded-2xl border border-gray-100 dark:border-[#1a2744] bg-gray-50 dark:bg-[#0d1526] p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative w-full overflow-hidden py-28 px-4"
        style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1a3a 40%, #1a0a3a 100%)' }}>
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(79,142,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        {/* Orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#93c5fd' }}>
            <Rocket className="h-4 w-4" /> Free forever for writers
          </div>
          <h2 className="mb-5 text-white" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Your story deserves<br />to be heard
          </h2>
          <p className="mb-10 text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#93c5fd' }}>
            Join thousands of writers sharing their expertise and building their audience on BlogHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-700 shadow-xl transition-all hover:bg-blue-50 hover:-translate-y-1"
              style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.15)' }}>
              Start writing for free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/blogs"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
              Browse stories
            </Link>
          </div>
          {/* Admin login hint */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <Link href="/admin-login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
              <Shield className="h-3.5 w-3.5" />
              Admin Portal
            </Link>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </section>

    </div>
  );
}
