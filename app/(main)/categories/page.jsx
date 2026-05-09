import Link from 'next/link';
import { CATEGORIES } from '@/utils/helpers';

const categoryEmojis = {
  Technology: '💻', Science: '🔬', Health: '🏥', Business: '💼', Travel: '✈️',
  Food: '🍕', Lifestyle: '🌟', Education: '📚', Entertainment: '🎬', Sports: '⚽', Other: '📝',
};

const categoryColors = [
  'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-green-500 to-teal-600',
  'from-orange-500 to-red-600', 'from-cyan-500 to-blue-600', 'from-yellow-500 to-orange-600',
  'from-pink-500 to-rose-600', 'from-indigo-500 to-purple-600', 'from-teal-500 to-green-600',
  'from-red-500 to-pink-600', 'from-gray-500 to-gray-700',
];

export const metadata = { title: 'Categories' };

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse by Category</h1>
        <p className="text-gray-500 dark:text-gray-400">Find articles that match your interests</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((category, i) => (
          <Link
            key={category}
            href={`/blogs?category=${category}`}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryColors[i]} p-6 text-white hover:shadow-xl hover:scale-105 transition-all duration-300`}
          >
            <div className="text-4xl mb-3">{categoryEmojis[category]}</div>
            <h2 className="font-bold text-lg">{category}</h2>
            <p className="text-white/70 text-sm mt-1">Explore articles →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
