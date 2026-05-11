'use client';
import { useState, useCallback } from 'react';
import BlogCard from '@/components/BlogCard';
import BlogModal from '@/components/BlogModal';
import api from '@/services/api';

export default function BlogGridWithModal({ blogs }) {
  const [modalBlog, setModalBlog] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const handleOpenModal = useCallback(async (cardBlog) => {
    setModalLoading(true);
    try {
      const { data } = await api.get(`/blogs/${cardBlog.slug}`);
      setModalBlog(data.blog);
    } catch {
      setModalBlog(cardBlog);
    } finally {
      setModalLoading(false);
    }
  }, []);

  return (
    <>
      <div className="lp-blog-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} onOpenModal={handleOpenModal} />
        ))}
      </div>

      {/* Loading spinner */}
      {modalLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Modal */}
      {modalBlog && (
        <BlogModal blog={modalBlog} onClose={() => setModalBlog(null)} />
      )}
    </>
  );
}
