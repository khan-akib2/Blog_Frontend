import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117] text-gray-900 dark:text-[#e6edf3] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
