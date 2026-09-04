import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { SmoothScroll } from './SmoothScroll';
import { ScrollProgress } from './ScrollProgress';
import { WhatsAppBubble } from './WhatsAppBubble';

// Only routes featuring scroll-linked scrubbers, flashlight/spotlight masks,
// and synchronized scroll-progress animations initialize the Lenis RAF loop.
const SMOOTH_SCROLL_ROUTES = ['/'];

export function Layout() {
  const { pathname } = useLocation();
  const needsSmoothScroll = SMOOTH_SCROLL_ROUTES.includes(pathname);

  const content = (
    <div className="min-h-screen flex flex-col bg-[#0d0e0e] text-[#f1eee7] transition-colors duration-500">
      <ScrollToTop />
      <ScrollProgress />
      <WhatsAppBubble />
      <Header />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  return needsSmoothScroll ? <SmoothScroll>{content}</SmoothScroll> : content;
}

