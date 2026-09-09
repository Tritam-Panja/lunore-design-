import { useEffect, useRef, useState } from 'react';

export interface UseRevealOptions extends IntersectionObserverInit {
  once?: boolean;
}

/**
 * useReveal — returns a ref + boolean flag that tracks viewport intersection.
 * Supports smooth forward and reversible "undo" motion on reverse scroll.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = { threshold: 0.12, once: true }
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { once = true, ...observerOptions } = options;
    if (once && revealedRef.current) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      revealedRef.current = true;
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealedRef.current = true;
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

  return { ref, visible: visible || (options.once ?? true ? revealedRef.current : false) };
}

