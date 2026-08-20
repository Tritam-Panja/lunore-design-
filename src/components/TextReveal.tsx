import { useMemo } from 'react';
import { useReveal } from '@/lib/useReveal';

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
  const { ref, visible } = useReveal({ threshold: 0.1 });

  const words = useMemo(() => text.split(' '), [text]);

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
              transitionDelay: `${delay + idx * stagger}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
