import type { ReactNode } from 'react';
import { useReveal } from '@/lib/useReveal';

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'blur';

interface RevealProps {
  children: ReactNode;
  /** Animation direction */
  direction?: Direction;
  /** Transition delay in seconds */
  delay?: number;
  /** Extra className passed to the wrapper */
  className?: string;
  /** Wrapper element type */
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

/**
 * Reveal — wraps content and fades/slides it in when scrolled into view.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  as = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal();

  const Tag = as as 'div';
  const base = `reveal reveal-${direction}`;

  return (
    <Tag
      ref={ref}
      className={`${base} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

