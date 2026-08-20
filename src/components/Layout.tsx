import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { SmoothScroll } from './SmoothScroll';
import { ScrollProgress } from './ScrollProgress';

export function Layout() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#0d0e0e] text-[#f1eee7] transition-colors duration-500">
        <ScrollToTop />
        <ScrollProgress />
        <Header />
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

