import { useMemo } from 'react';
import { useReveal } from '@/lib/useReveal';
import { isAndroid } from '@/lib/device';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

/**
 * TextReveal — splits text into words that gracefully slide up from an overflow-hidden mask on scroll.
 */
export function TextReveal({
  text,
  as: Component = 'p',
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.035,
}: TextRevealProps) {
  const isAndroidDevice = isAndroid();
  const { ref, visible } = useReveal({ threshold: 0.1, once: true });

  const words = useMemo(() => text.split(' '), [text]);

  const effectiveDelay = isAndroidDevice ? Math.min(delay, 0.03) : delay;
  // On Android, use a smoothly clamped micro-stagger with a 0.52s fluid cubic ease to eliminate word stutter and trailing pauses
  const getWordDelay = (idx: number) =>
    isAndroidDevice ? effectiveDelay + Math.min(idx * 0.018, 0.16) : delay + idx * stagger;

  return (
    <Component
      ref={ref as any}
      className={`${visible ? 'word-mask-visible' : ''} ${className}`}
    >
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="word-mask-wrap">
          <span
            className={`word-mask-inner ${wordClassName}`}
            style={{
              transitionDelay: `${getWordDelay(idx)}s`,
              ...(isAndroidDevice
                ? {
                    transition: 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.46s ease-out',
                    willChange: 'auto',
                  }
                : {}),
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
