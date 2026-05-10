'use client';
import { usePathname } from 'next/navigation';

// Auth pages — no navbar, no footer
// The key on the wrapper re-mounts it on every route change, triggering the animation
export default function AuthLayout({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
