import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  minHeight?: string | number;
}

export function LazySection({
  children,
  fallback,
  rootMargin = '600px',
  threshold = 0.01,
  className = '',
  minHeight = '100px',
}: LazySectionProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsIntersected(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={!isIntersected ? { minHeight } : undefined}
    >
      {isIntersected ? children : fallback || null}
    </div>
  );
}

export default LazySection;
