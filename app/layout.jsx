import { Plus_Jakarta_Sans, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import GoogleAuthProvider from '@/components/GoogleAuthProvider';
import { Toaster } from 'react-hot-toast';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: { default: 'BlogHub — Where Great Ideas Come to Life', template: '%s | BlogHub' },
  description: 'A next-generation publishing platform. Discover insightful articles from expert writers, share your knowledge, and join a community that values great writing.',
  keywords: ['blog', 'writing', 'stories', 'articles', 'technology', 'knowledge', 'NIT'],
  openGraph: { type: 'website', siteName: 'BlogHub by NIT' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${jakarta.variable} ${cormorant.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <GoogleAuthProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { borderRadius: '12px', fontSize: '14px' },
                  duration: 3000,
                }}
              />
            </AuthProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
