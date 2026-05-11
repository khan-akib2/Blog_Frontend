'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link.');
      return;
    }
    api.get(`/newsletter/unsubscribe?token=${token}`)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Something went wrong.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Processing your request...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-5"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unsubscribed</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Link href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              Back to BlogHub
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-5"
              style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Link href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              Back to BlogHub
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
