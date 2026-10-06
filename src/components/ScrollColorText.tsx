import React, { useEffect, useRef } from 'react';
import { scrollCoordinator } from '@/lib/scrollCoordinator';

interface ScrollColorTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'h2' | 'h3' | 'span' | 'div';
  scrollDistance?: number;
  once?: boolean;
}

/**
 * ScrollColorText Component
 * Word-by-word scroll-driven color illumination effect.
 * As the user scrolls down, words smoothly transition from dimmed to radiant champagne gold.
 * Once revealed, words remain revealed and do not reverse when scrolling backwards.
 * Revealed completely in ~2 scrolls (~220px scroll distance).
 */
export function ScrollColorText({
  text,
  className = '',
  style = {},
  as: Component = 'p',
  scrollDistance = 220,
  once = true,
}: ScrollColorTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const maxProgressRef = useRef(0);

  const words = text.split(' ');
  const totalWords = words.length;

  useEffect(() => {
    let animationFrameId: number;

    const updateWords = (progress: number) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-progress', progress.toFixed(4));
      }

      const spans = wordsRef.current;
      for (let i = 0; i < totalWords; i++) {
        const span = spans[i];
        if (!span) continue;

        const wordStart = (i / totalWords) * 0.86;
        const wordEnd = Math.min(1, wordStart + 0.14);
        const wordProgress =
          progress >= 1
            ? 1
            : Math.min(
                1,
                Math.max(0, (progress - wordStart) / (wordEnd - wordStart))
              );

        const isHighlighted = wordProgress > 0.45;
        const targetColor = isHighlighted ? '#f5ebd2' : 'rgba(241, 238, 231, 0.22)';
        const targetOpacity = (0.25 + wordProgress * 0.75).toFixed(3);
        const targetShadow = isHighlighted
          ? '0 0 16px rgba(230, 203, 151, 0.55), 0 2px 8px rgba(0, 0, 0, 0.8)'
          : 'none';
        const targetTransform = `translateY(${((1 - wordProgress) * 2).toFixed(2)}px)`;

        if (span.style.color !== targetColor) span.style.color = targetColor;
        if (span.style.opacity !== targetOpacity) span.style.opacity = targetOpacity;
        if (span.style.textShadow !== targetShadow) span.style.textShadow = targetShadow;
        if (span.style.transform !== targetTransform) span.style.transform = targetTransform;
      }
    };

    let isNear = false;

    let unsubscribe: (() => void) | null = null;

    const removeListener = () => {
      cancelAnimationFrame(animationFrameId);
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (once && maxProgressRef.current >= 1) {
        removeListener();
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = scrollCoordinator.getViewportHeight();

      // Start illuminating when element enters comfortable view (78% from top)
      const start = windowHeight * 0.78;
      // Complete illumination within ~2 scrolls (~220px)
      const rawProgress = Math.min(1, Math.max(0, (start - rect.top) / scrollDistance));

      if (once) {
        if (rawProgress > maxProgressRef.current) {
          maxProgressRef.current = rawProgress;
          updateWords(rawProgress);
          if (maxProgressRef.current >= 1) {
            removeListener();
          }
        }
      } else {
        updateWords(rawProgress);
      }
    };

    const onScroll = () => {
      if (!isNear && (!once || maxProgressRef.current < 1)) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNear = entry.isIntersecting;
        if (isNear) {
          handleScroll();
        }
      },
      { rootMargin: '150px 0px 150px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    unsubscribe = scrollCoordinator.subscribe(onScroll);

    handleScroll();

    return () => {
      observer.disconnect();
      removeListener();
    };
  }, [scrollDistance, once, totalWords]);

  return (
    <Component
      ref={containerRef as any}
      className={`leading-relaxed select-none ${className}`}
      style={style}
    >
      {words.map((word, index) => {
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordsRef.current[index] = el;
            }}
            className="inline-block transition-all duration-300 ease-out"
            style={{
              marginRight: '0.26em',
              color: 'rgba(241, 238, 231, 0.22)',
              opacity: 0.25,
              textShadow: 'none',
              transform: 'translateY(2px)',
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
