import Link from 'next/link';
import {
  ArrowRight, TrendingUp, PenSquare, Users, BookOpen, Flame,
  CheckCircle, BarChart2, MessageSquare, Bookmark, Shield, Star,
  Globe, Cpu, Rocket, Sparkles, Layers, Eye, Clock, Heart,
  FileCheck, Workflow, Zap, Lock
} from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import HeroVisual from '@/components/HeroVisual';

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

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="lp-hero">
        {/* Background */}
        <div className="lp-hero-bg" />
        <div className="lp-hero-grid" />

        <div className="lp-hero-inner">
          {/* LEFT — Text */}
          <div className="lp-hero-text">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              Open publishing platform
            </div>

            <h1 className="lp-headline">
              Where great<br />
              <span className="lp-headline-accent">ideas get published</span>
            </h1>

            <p className="lp-subheadline">
              Write, submit, and publish high-quality content to an audience that values great writing.
              Built for serious creators with a curated editorial process.
            </p>

            <div className="lp-cta-row">
              <Link href="/register" className="lp-btn-primary">
                Start writing free
                <ArrowRight className="lp-btn-icon" />
              </Link>
              <Link href="/blogs" className="lp-btn-secondary">
                <Eye className="lp-btn-icon-sm" />
                Explore stories
              </Link>
            </div>

            <div className="lp-trust-row">
              {[
                { val: '1,200+', label: 'Articles' },
                { val: '500+', label: 'Writers' },
                { val: '50K+', label: 'Readers' },
              ].map(({ val, label }) => (
                <div key={label} className="lp-trust-item">
                  <span className="lp-trust-val">{val}</span>
                  <span className="lp-trust-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard Visual */}
          <div className="lp-hero-visual-col">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Cpu className="w-3.5 h-3.5" /> Platform
          </div>
          <h2 className="lp-section-heading">Everything for serious writers</h2>
          <p className="lp-section-sub">
            A focused set of tools built for quality — not quantity.
          </p>

          <div className="lp-features-grid">
            {[
              {
                icon: PenSquare, title: 'Rich Editor',
                desc: 'A distraction-free writing experience with Markdown, code blocks, image uploads, and formatting tools.',
                accent: '#3b82f6'
              },
              {
                icon: FileCheck, title: 'Editorial Review',
                desc: 'Every post is reviewed by our editorial team before going live, ensuring consistent quality.',
                accent: '#10b981'
              },
              {
                icon: Globe, title: 'Built-in Discovery',
                desc: 'Your stories are surfaced through categories, tags, trending feeds, and intelligent recommendations.',
                accent: '#8b5cf6'
              },
              {
                icon: BarChart2, title: 'Author Analytics',
                desc: 'Understand your audience with per-post view counts, engagement rates, and reader behavior insights.',
                accent: '#f59e0b'
              },
              {
                icon: MessageSquare, title: 'Community',
                desc: 'Readers engage through threaded comments and reactions, building real dialogue around your ideas.',
                accent: '#ec4899'
              },
              {
                icon: Bookmark, title: 'Reading Lists',
                desc: 'Readers can save and organize posts into collections, driving repeat traffic to your content.',
                accent: '#06b6d4'
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ '--feature-accent': accent }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <h3 className="lp-feature-title">{title}</h3>
                <p className="lp-feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Workflow className="w-3.5 h-3.5" /> Process
          </div>
          <h2 className="lp-section-heading">From draft to published in 3 steps</h2>
          <p className="lp-section-sub">
            A simple, transparent workflow that ensures every published piece meets our quality bar.
          </p>

          <div className="lp-steps-grid">
            {[
              {
                num: '01',
                icon: PenSquare,
                title: 'Write your story',
                desc: 'Use our distraction-free rich editor. Add images, code blocks, and links. Save drafts automatically.',
                color: '#3b82f6',
                bg: 'rgba(59,130,246,0.08)',
                border: 'rgba(59,130,246,0.15)'
              },
              {
                num: '02',
                icon: Shield,
                title: 'Submit for review',
                desc: 'Our editorial team reviews your post for quality, accuracy, and originality. Usually within 24 hours.',
                color: '#8b5cf6',
                bg: 'rgba(139,92,246,0.08)',
                border: 'rgba(139,92,246,0.15)'
              },
              {
                num: '03',
                icon: Rocket,
                title: 'Published & discovered',
                desc: 'Your post goes live instantly, featured on the homepage, category pages, and reader feeds.',
                color: '#10b981',
                bg: 'rgba(16,185,129,0.08)',
                border: 'rgba(16,185,129,0.15)'
              },
            ].map(({ num, icon: Icon, title, desc, color, bg, border }, i) => (
              <div key={num} className="lp-step-card">
                <div className="lp-step-num" style={{ color: color, fontFamily: 'var(--font-mono)' }}>{num}</div>
                <div className="lp-step-icon-wrap" style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="lp-step-title">{title}</h3>
                <p className="lp-step-desc">{desc}</p>
                {i < 2 && <div className="lp-step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRENDING BLOGS
      ══════════════════════════════════════ */}
      {trending.length > 0 && (
        <section className="lp-section lp-section-alt">
          <div className="lp-section-inner">
            <div className="lp-section-label">
              <Flame className="w-3.5 h-3.5 text-orange-400" style={{ color: '#f97316' }} /> Trending
            </div>
            <div className="lp-section-row">
              <h2 className="lp-section-heading mb-0">Popular this week</h2>
              <Link href="/blogs?sort=-views" className="lp-text-link">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="lp-blog-grid">
              {trending.slice(0, 3).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          LATEST POSTS
      ══════════════════════════════════════ */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Sparkles className="w-3.5 h-3.5" /> Latest
          </div>
          <div className="lp-section-row">
            <h2 className="lp-section-heading mb-0">Fresh from the editors</h2>
            <Link href="/blogs" className="lp-text-link">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latest.length > 0 ? (
            <div className="lp-blog-grid">
              {latest.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          ) : (
            <div className="lp-empty-state">
              <div className="lp-empty-icon">
                <PenSquare className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="lp-empty-title">No stories yet</h3>
              <p className="lp-empty-sub">Be the first to publish something remarkable</p>
              <Link href="/write" className="lp-btn-primary mt-4">
                Write your first blog <ArrowRight className="lp-btn-icon" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <div className="lp-section-label">
            <Star className="w-3.5 h-3.5 text-yellow-400" style={{ color: '#facc15' }} /> Community
          </div>
          <h2 className="lp-section-heading">What our writers say</h2>

          <div className="lp-testimonials-grid">
            {[
              {
                quote: 'BlogHub gave me the platform to reach thousands of technical readers. The editorial process actually makes my writing better.',
                name: 'Arjun Sharma', role: 'Senior Software Engineer', initial: 'A', color: '#3b82f6'
              },
              {
                quote: 'The review process is what sets this apart. I know every article here has been vetted — it makes the platform feel trustworthy.',
                name: 'Priya Nair', role: 'Data Scientist & Writer', initial: 'P', color: '#8b5cf6'
              },
              {
                quote: 'Sharing my startup journey here connected me with investors and collaborators I never would have found otherwise.',
                name: 'Rahul Verma', role: 'Founder, TechLaunch', initial: 'R', color: '#10b981'
              },
            ].map(({ quote, name, role, initial, color }) => (
              <div key={name} className="lp-testimonial-card">
                <div className="lp-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="lp-testimonial-quote">"{quote}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar" style={{ background: color }}>
                    {initial}
                  </div>
                  <div>
                    <p className="lp-testimonial-name">{name}</p>
                    <p className="lp-testimonial-role">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="lp-cta-section">
        <div className="lp-cta-bg" />
        <div className="lp-cta-inner">
          <div className="lp-section-label lp-label-light">
            <Rocket className="w-3.5 h-3.5" /> Get started
          </div>
          <h2 className="lp-cta-heading">
            Your story deserves<br />to be read.
          </h2>
          <p className="lp-cta-sub">
            Join a growing community of writers. Free forever.
          </p>
          <div className="lp-cta-btns">
            <Link href="/register" className="lp-btn-primary lp-btn-lg">
              Create free account
              <ArrowRight className="lp-btn-icon" />
            </Link>
            <Link href="/blogs" className="lp-btn-ghost">
              Read the latest
            </Link>
          </div>
          <div className="lp-cta-divider">
            <div className="lp-cta-divider-line" />
            <Link href="/admin-login" className="lp-admin-link">
              <Shield className="w-3 h-3" /> Admin Portal
            </Link>
            <div className="lp-cta-divider-line" />
          </div>
        </div>
      </section>

    </div>
  );
}
