import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from './SmoothScroll';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { isMounted } = useLenis();

  useEffect(() => {
    // When SmoothScroll is mounted, SmoothScroll is the central owner of route-change scrolling
    if (isMounted) return;

    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash, isMounted]);
  return null;
}
