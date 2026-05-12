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
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.slug);
  if (!blog) return { title: 'Blog Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blogs/${blog.slug}`;
  const description = blog.excerpt || blog.title;
  const image = blog.thumbnail || `${siteUrl}/og-default.png`;

  return {
    title: blog.title,
    description,
    keywords: blog.tags?.join(', '),
    authors: [{ name: blog.author?.name }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: blog.title,
      description,
      url: canonicalUrl,
      siteName: 'BlogHub',
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.createdAt,
      authors: [blog.author?.name],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams?.preview === 'true';
  const blog = await getBlog(resolvedParams.slug, preview);
  if (!blog) notFound();

  // JSON-LD structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.thumbnail,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlogHub',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blogs/${blog.slug}`,
    },
    keywords: blog.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient blog={blog} />
    </>
  );
}
