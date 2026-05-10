import Link from 'next/link';
import {
  Monitor, FlaskConical, HeartPulse, Briefcase, Plane,
  UtensilsCrossed, Sparkles, GraduationCap, Clapperboard,
  Trophy, FileText, ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '@/utils/helpers';

const categoryConfig = {
  Technology:    { icon: Monitor,         accent: '#3b82f6', glow: 'rgba(59,130,246,0.35)',  from: '#1e3a5f', to: '#1e40af' },
  Science:       { icon: FlaskConical,    accent: '#a855f7', glow: 'rgba(168,85,247,0.35)',  from: '#3b0764', to: '#7e22ce' },
  Health:        { icon: HeartPulse,      accent: '#f43f5e', glow: 'rgba(244,63,94,0.35)',   from: '#4c0519', to: '#be123c' },
  Business:      { icon: Briefcase,       accent: '#f59e0b', glow: 'rgba(245,158,11,0.35)',  from: '#451a03', to: '#b45309' },
  Travel:        { icon: Plane,           accent: '#06b6d4', glow: 'rgba(6,182,212,0.35)',   from: '#083344', to: '#0e7490' },
  Food:          { icon: UtensilsCrossed, accent: '#f97316', glow: 'rgba(249,115,22,0.35)',  from: '#431407', to: '#c2410c' },
  Lifestyle:     { icon: Sparkles,        accent: '#ec4899', glow: 'rgba(236,72,153,0.35)',  from: '#500724', to: '#be185d' },
  Education:     { icon: GraduationCap,   accent: '#6366f1', glow: 'rgba(99,102,241,0.35)',  from: '#1e1b4b', to: '#4338ca' },
  Entertainment: { icon: Clapperboard,    accent: '#14b8a6', glow: 'rgba(20,184,166,0.35)',  from: '#042f2e', to: '#0f766e' },
  Sports:        { icon: Trophy,          accent: '#22c55e', glow: 'rgba(34,197,94,0.35)',   from: '#052e16', to: '#15803d' },
  Other:         { icon: FileText,        accent: '#94a3b8', glow: 'rgba(148,163,184,0.25)', from: '#1e293b', to: '#334155' },
};

export const metadata = { title: 'Categories' };

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">Explore Topics</p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Browse by Category</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Dive into the topics that spark your curiosity</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => {
          const cfg = categoryConfig[category] || categoryConfig.Other;
          const Icon = cfg.icon;
          return (
            <Link
              key={category}
              href={`/blogs?category=${category}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d1117] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10"
              style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04)` }}
            >
              {/* Glow blob */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: cfg.glow }}
              />
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${cfg.from}22 0%, transparent 60%)` }}
              />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Icon */}
                <div
                  className="inline-flex w-10 h-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.accent }} />
                </div>

                {/* Text */}
                <div>
                  <h2 className="font-semibold text-white text-sm mb-1.5">{category}</h2>
                  <p className="text-xs font-medium flex items-center gap-1 text-gray-500 group-hover:text-gray-300 transition-colors">
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
}
