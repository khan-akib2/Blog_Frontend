import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: { default: 'BlogHub - Share Your Stories', template: '%s | BlogHub' },
  description: 'A modern platform to read, write, and share amazing blog posts.',
  keywords: ['blog', 'writing', 'stories', 'articles'],
  openGraph: { type: 'website', siteName: 'BlogHub' },
};

// Root layout has NO navbar/footer — each route group adds its own
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                duration: 3000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
