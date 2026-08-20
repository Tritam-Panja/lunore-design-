import React, { useEffect, useRef, useState } from 'react';
import { useLenis } from './SmoothScroll';

interface ScrollColorTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'h2' | 'h3' | 'span' | 'div';
}

/**
 * ScrollColorText Component
 * Word-by-word scroll-driven color illumination effect.
 * As the user scrolls down, words smoothly transition from dimmed/muted to radiant champagne gold,
 * and seamlessly reverse when scrolling back up.
 */
export function ScrollColorText({
  text,
  className = '',
  style = {},
  as: Component = 'p',
}: ScrollColorTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { lenis } = useLenis();

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start highlighting when element enters viewport (80% from top),
      // reach 100% illumination when it reaches the upper-middle (30% from top)
      const start = windowHeight * 0.82;
      const end = windowHeight * 0.28;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      setScrollProgress(progress);
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
  }, [lenis]);

  const words = text.split(' ');
  const totalWords = words.length;

  return (
    <Component
      ref={containerRef as any}
      className={`leading-relaxed select-none ${className}`}
      style={style}
    >
      {words.map((word, index) => {
        // Calculate each word's individual highlight progress
        const wordStart = index / totalWords;
        const wordEnd = (index + 1.2) / totalWords;
        const wordProgress = Math.min(
          1,
          Math.max(0, (scrollProgress - wordStart) / (wordEnd - wordStart))
        );

        // Word illumination interpolation
        const isHighlighted = wordProgress > 0.5;

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
