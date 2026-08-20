import { useEffect, useRef, useState } from 'react';

export interface UseRevealOptions extends IntersectionObserverInit {
  once?: boolean;
}

/**
 * useReveal — returns a ref + boolean flag that tracks viewport intersection.
 * Supports smooth forward and reversible "undo" motion on reverse scroll.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = { threshold: 0.12, once: false }
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const { once = false, ...observerOptions } = options;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else {
          if (!once) {
            setVisible(false);
          }
        }
      });
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold, options.once]);

  return { ref, visible };
}

