import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-[#21262d] bg-gray-50 dark:bg-[#161b22]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-3 flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              <PenSquare className="h-6 w-6" /> BlogHub
            </Link>
            <p className="max-w-xs text-sm text-gray-500 dark:text-[#8b949e]">
              A modern platform to share your stories, ideas, and expertise with the world.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-[#e6edf3]">Explore</h3>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Blogs', '/blogs'], ['Categories', '/categories']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-[#e6edf3]">Account</h3>
            <ul className="space-y-2.5">
              {[['Login', '/login'], ['Sign Up', '/register'], ['Write', '/write'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-[#21262d] pt-8 sm:flex-row">
          <p className="text-sm text-gray-400 dark:text-[#8b949e]">© {new Date().getFullYear()} BlogHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['GitHub', 'Twitter', 'LinkedIn'].map((name) => (
              <a key={name} href="#" className="text-sm text-gray-400 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
