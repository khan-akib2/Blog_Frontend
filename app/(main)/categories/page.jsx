import Link from 'next/link';
import {
  Monitor, FlaskConical, HeartPulse, Briefcase, Plane,
  UtensilsCrossed, Sparkles, GraduationCap, Clapperboard,
  Trophy, FileText, ArrowRight, Layers, Code2, Brain,
  ShieldCheck, Smartphone, Compass, BookOpen
} from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

export const metadata = {
  title: 'Categories | BlogHub',
  description: 'Browse articles by category — Technology, AI, Cybersecurity, Education, and more.',
};

const categoryConfig = {
  Technology:              { icon: Monitor,         accent: '#4f8ef7', glow: 'rgba(79,142,247,0.3)',   from: '#0d1a3a', to: '#1a2a5a' },
  Science:                 { icon: FlaskConical,    accent: '#a78bfa', glow: 'rgba(167,139,250,0.3)',  from: '#1a0a3a', to: '#2d1a5a' },
  Health:                  { icon: HeartPulse,      accent: '#f87171', glow: 'rgba(248,113,113,0.3)',  from: '#2a0a1a', to: '#4a1a2a' },
  Business:                { icon: Briefcase,       accent: '#fbbf24', glow: 'rgba(251,191,36,0.3)',   from: '#2a1a00', to: '#4a2a00' },
  Travel:                  { icon: Plane,           accent: '#34d399', glow: 'rgba(52,211,153,0.3)',   from: '#002a1a', to: '#004a2a' },
  Food:                    { icon: UtensilsCrossed, accent: '#fb923c', glow: 'rgba(251,146,60,0.3)',   from: '#2a1000', to: '#4a1a00' },
  Lifestyle:               { icon: Sparkles,        accent: '#f472b6', glow: 'rgba(244,114,182,0.3)',  from: '#2a0a1a', to: '#4a1a3a' },
  Education:               { icon: GraduationCap,   accent: '#818cf8', glow: 'rgba(129,140,248,0.3)',  from: '#0a0a2a', to: '#1a1a4a' },
  Entertainment:           { icon: Clapperboard,    accent: '#2dd4bf', glow: 'rgba(45,212,191,0.3)',   from: '#002a2a', to: '#004a4a' },
  Sports:                  { icon: Trophy,          accent: '#4ade80', glow: 'rgba(74,222,128,0.3)',   from: '#002a0a', to: '#004a1a' },
  'Web Development':       { icon: Code2,           accent: '#60a5fa', glow: 'rgba(96,165,250,0.3)',   from: '#0a1a2a', to: '#1a2a4a' },
  'AI & Machine Learning': { icon: Brain,           accent: '#c084fc', glow: 'rgba(192,132,252,0.3)',  from: '#1a0a2a', to: '#2d1a4a' },
  Cybersecurity:           { icon: ShieldCheck,     accent: '#34d399', glow: 'rgba(52,211,153,0.3)',   from: '#002a1a', to: '#003a2a' },
  'Mobile Apps':           { icon: Smartphone,      accent: '#fb923c', glow: 'rgba(251,146,60,0.3)',   from: '#2a1500', to: '#3a2000' },
  'Career Guidance':       { icon: Compass,         accent: '#fbbf24', glow: 'rgba(251,191,36,0.3)',   from: '#2a1a00', to: '#3a2a00' },
  'Study Tips':            { icon: BookOpen,        accent: '#818cf8', glow: 'rgba(129,140,248,0.3)',  from: '#0a0a2a', to: '#1a1a3a' },
  Other:                   { icon: FileText,        accent: '#94a3b8', glow: 'rgba(148,163,184,0.2)',  from: '#0d1526', to: '#111d35' },
};

// Group categories for display
const categoryGroups = [
  {
    label: 'Tech & Development',
    icon: Code2,
    color: '#60a5fa',
    items: ['Technology', 'Web Development', 'AI & Machine Learning', 'Cybersecurity', 'Mobile Apps'],
  },
  {
    label: 'Education',
    icon: GraduationCap,
    color: '#818cf8',
    items: ['Education', 'Career Guidance', 'Study Tips', 'Science'],
  },
  {
    label: 'Lifestyle & More',
    icon: Sparkles,
    color: '#f472b6',
    items: ['Health', 'Business', 'Travel', 'Food', 'Lifestyle', 'Entertainment', 'Sports', 'Other'],
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-3 flex items-center justify-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Browse Topics
        </p>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.025em' }}>
          Explore by Category
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
          Dive into the topics that spark your curiosity and fuel your growth
        </p>
      </div>

      {/* Grouped sections */}
      {categoryGroups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div key={group.label} className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: `${group.color}18`, border: `1px solid ${group.color}30` }}>
                <GroupIcon className="w-4 h-4" style={{ color: group.color }} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{group.label}</h2>
              <div className="flex-1 h-px bg-gray-100 dark:bg-[#1a2744] ml-2" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((category) => {
                const cfg = categoryConfig[category] || categoryConfig.Other;
                const Icon = cfg.icon;
                return (
                  <Link
                    key={category}
                    href={`/blogs?category=${encodeURIComponent(category)}`}
                    className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Glow blob */}
                    <div
                      className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: cfg.glow }}
                    />
                    <div className="relative z-10 flex flex-col gap-4">
                      <div
                        className="inline-flex w-11 h-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}35` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cfg.accent }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1.5">{category}</h3>
                        <p className="text-xs font-semibold flex items-center gap-1 text-white/40 group-hover:text-white/70 transition-colors">
                          Explore articles
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
