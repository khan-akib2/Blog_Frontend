import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

async function getBlog(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${baseUrl}/blogs/${slug}`, { next: { revalidate: 30 } });
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

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();
  return <BlogPostClient blog={blog} />;
}
