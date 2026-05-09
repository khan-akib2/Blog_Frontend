import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
