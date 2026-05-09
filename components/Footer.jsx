import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-3 flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              <PenSquare className="h-6 w-6" />
              BlogHub
            </Link>
            <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
              A modern platform to share your stories, ideas, and expertise with the world.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Explore</h3>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Blogs', '/blogs'], ['Categories', '/categories']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Account</h3>
            <ul className="space-y-2.5">
              {[['Login', '/login'], ['Sign Up', '/register'], ['Write', '/write'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} BlogHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['GitHub', 'Twitter', 'LinkedIn'].map((name) => (
              <a key={name} href="#" className="text-sm text-gray-400 transition-colors hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400">
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
