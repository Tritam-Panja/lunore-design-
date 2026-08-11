import React, { useEffect, useRef, useState } from 'react';
import { useExperience } from './ExperienceContext';

interface ScrollLineProps {
  /** SVG path d string */
  path: string;
  /** SVG viewBox dimensions (default "0 0 1000 600") */
  viewBox?: string;
  /** Custom container class */
  className?: string;
  /** Custom SVG class */
  svgClassName?: string;
  /** Stroke color (default refined gold rgba(194, 166, 126, 0.45)) */
  strokeColor?: string;
  /** Stroke width in SVG coordinates (default 1.5) */
  strokeWidth?: number;
  /** Optional stroke dash pattern if desired */
  strokeDasharray?: string;
  /** Optional glow effect */
  glow?: boolean;
  /** Start trigger offset (0.0 to 1.0) */
  startOffset?: number;
  /** End trigger offset (0.0 to 1.0) */
  endOffset?: number;
  /** Preserve aspect ratio setting for SVG */
  preserveAspectRatio?: string;
}

export function ScrollLine({
  path,
  viewBox = "0 0 1000 600",
  className = "",
  svgClassName = "",
  strokeColor = "rgba(194, 166, 126, 0.45)",
  strokeWidth = 1.5,
  strokeDasharray,
  glow = false,
  startOffset = 0.1,
  endOffset = 0.9,
  preserveAspectRatio = "none",
}: ScrollLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState<number>(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
    }
  }, [path]);

  useEffect(() => {
    if (!pathLength) return;

    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startPos = windowHeight * (1 - startOffset);
      const endPos = windowHeight * (1 - endOffset);

      const totalDistance = rect.height + (startPos - endPos);
      const currentScroll = startPos - rect.top;

      let progress = currentScroll / totalDistance;
      progress = Math.max(0, Math.min(1, progress));

      const drawLength = pathLength * (1 - progress);
      pathRef.current.style.strokeDashoffset = `${drawLength}`;
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pathLength, startOffset, endOffset]);

  const { isExperienceActive } = useExperience();

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`w-full h-full overflow-visible ${svgClassName}`}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="gold-glow-intense" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <path
          ref={pathRef}
          d={path}
          stroke={isExperienceActive ? "rgba(224, 190, 140, 0.85)" : strokeColor}
          strokeWidth={isExperienceActive ? strokeWidth * 1.35 : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          filter={glow || isExperienceActive ? "url(#gold-glow-intense)" : undefined}
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.8s ease, stroke-width 0.8s ease',
            willChange: 'stroke-dashoffset, stroke, stroke-width',
          }}
        />
      </svg>
    </div>
  );
}
