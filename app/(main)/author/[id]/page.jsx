import { notFound } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import { formatDate } from '@/utils/helpers';

async function getAuthorData(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const [blogsRes, userRes] = await Promise.all([
      fetch(`${baseUrl}/blogs/author/${id}`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/auth/me`, { cache: 'no-store' }),
    ]);
    const blogsData = blogsRes.ok ? await blogsRes.json() : { blogs: [] };
    return { blogs: blogsData.blogs || [] };
  } catch {
    return { blogs: [] };
  }
}

export default async function AuthorPage({ params }) {
  const { blogs } = await getAuthorData(params.id);
  const author = blogs[0]?.author;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Author header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
        {author?.avatar ? (
          <img src={author.avatar} alt={author.name} className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {author?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{author?.name || 'Author'}</h1>
          {author?.bio && <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg">{author.bio}</p>}
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{blogs.length} published articles</p>
        </div>
      </div>

      {/* Blogs */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Published Articles</h2>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-600 py-12">No published articles yet.</p>
      )}
    </div>
  );
}
