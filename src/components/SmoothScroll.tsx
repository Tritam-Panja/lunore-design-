import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { scrollCoordinator, useScrollSubscriber, type ScrollCallback } from '@/lib/scrollCoordinator';
import { isIOS } from '@/lib/device';

export { useScrollSubscriber, scrollCoordinator, type ScrollCallback };

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, any>) => void;
  isMounted: boolean;
}

const defaultScrollTo = (target: string | HTMLElement) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: defaultScrollTo,
  isMounted: false,
});

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // iOS uses native browser scrolling; do NOT instantiate the primary Lenis instance
    if (isIOS()) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1,
      syncTouch: false,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = instance;
    setLenis(instance);
    scrollCoordinator.setLenis(instance);

    // Apply lenis class to html root
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    return () => {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      scrollCoordinator.setLenis(null);
    };
  }, []);

  // Handle route and hash changes: ensure page is unlocked and scrollable
  useEffect(() => {
    // Always unlock document overflow and start Lenis on any route change
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('lenis-stopped');

    if (lenisRef.current) {
      lenisRef.current.start();
    }

    if (location.hash) {
      const targetId = location.hash;
      const scrollToElement = () => {
        const el = document.querySelector(targetId);
        if (el) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el as HTMLElement, { offset: 0 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        const interval = setInterval(() => {
          if (scrollToElement()) {
            clearInterval(interval);
          }
        }, 50);
        const timeout = setTimeout(() => clearInterval(interval), 2000);
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
        scrollCoordinator.resetScroll(0);
      }
    }
  }, [location.pathname, location.hash]);

  const scrollTo = (target: string | HTMLElement, options = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el as HTMLElement, { offset: -70, ...options });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo, isMounted: true }}>
      {children}
    </LenisContext.Provider>
  );
}
