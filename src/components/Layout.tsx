import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { SmoothScroll } from './SmoothScroll';
import { ScrollProgress } from './ScrollProgress';
import { WhatsAppBubble } from './WhatsAppBubble';

// Content routes initialize smooth scrolling on desktop, preserving native scroll on iOS
const FULLSCREEN_ROUTES = [
  '/the-engawa-line',
  '/amber-and-olive',
  '/the-skyline-residence',
  '/the-olive-grove-residence',
  '/clay-and-sage',
  '/the-canopy-house',
  '/marble-stack',
  '/sculptures-carousel',
  '/sanctuary-residences',
  '/skyline-penthouses',
  '/executive-suites',
  '/boutique-lounges',
  '/interiors/sanctuary-residences',
  '/interiors/skyline-penthouses',
  '/interiors/executive-suites',
  '/interiors/boutique-lounges',
  '/coming-soon',
  '/aurexa',
];

export function Layout() {
  const { pathname } = useLocation();
  const isFullScreenRoute = FULLSCREEN_ROUTES.includes(pathname);
  const needsSmoothScroll = !isFullScreenRoute;

  if (isFullScreenRoute) {
    return (
      <div className="w-full h-[100dvh] overflow-hidden bg-[#090a0b] text-[#f1eee7]">
        <ScrollToTop />
        <Outlet />
      </div>
    );
  }

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

