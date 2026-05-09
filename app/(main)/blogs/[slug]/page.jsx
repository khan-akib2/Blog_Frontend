import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

// Force dynamic rendering so approved blogs show immediately
export const dynamic = 'force-dynamic';

async function getBlog(slug, preview = false) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const url = `${baseUrl}/blogs/${slug}${preview ? '?preview=true' : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: 'Blog Not Found' };
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: { title: blog.title, description: blog.excerpt, images: blog.thumbnail ? [blog.thumbnail] : [] },
  };
}

export default async function BlogPage({ params, searchParams }) {
  const preview = searchParams?.preview === 'true';
  const blog = await getBlog(params.slug, preview);
  if (!blog) notFound();
  return <BlogPostClient blog={blog} />;
}
