import React, { useEffect, useRef, useState } from 'react';
import { useLenis } from './SmoothScroll';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const maxProgressRef = useRef(0);
  const { lenis } = useLenis();

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (once && maxProgressRef.current >= 1) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start illuminating when element enters comfortable view (78% from top)
      const start = windowHeight * 0.78;
      // Complete illumination within ~2 scrolls (~220px)
      const rawProgress = Math.min(1, Math.max(0, (start - rect.top) / scrollDistance));

      if (once) {
        if (rawProgress > maxProgressRef.current) {
          maxProgressRef.current = rawProgress;
          setScrollProgress(rawProgress);
        }
      } else {
        setScrollProgress(rawProgress);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (lenis) {
        lenis.off('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [lenis, scrollDistance, once]);

  const words = text.split(' ');
  const totalWords = words.length;

  return (
    <Component
      ref={containerRef as any}
      className={`leading-relaxed select-none ${className}`}
      style={style}
    >
      {words.map((word, index) => {
        // Calculate each word's individual highlight progress across [0, 1]
        const wordStart = (index / totalWords) * 0.86;
        const wordEnd = Math.min(1, wordStart + 0.14);
        const wordProgress =
          scrollProgress >= 1
            ? 1
            : Math.min(
                1,
                Math.max(0, (scrollProgress - wordStart) / (wordEnd - wordStart))
              );

        // Word illumination interpolation
        const isHighlighted = wordProgress > 0.45;

        return (
          <span
            key={`${word}-${index}`}
            className="inline-block transition-all duration-300 ease-out will-change-[color,opacity,transform]"
            style={{
              marginRight: '0.26em',
              color: isHighlighted ? '#f5ebd2' : 'rgba(241, 238, 231, 0.22)',
              opacity: 0.25 + wordProgress * 0.75,
              textShadow: isHighlighted
                ? '0 0 16px rgba(230, 203, 151, 0.55), 0 2px 8px rgba(0, 0, 0, 0.8)'
                : 'none',
              transform: `translateY(${(1 - wordProgress) * 2}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
