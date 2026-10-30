'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent
} from 'react';

export interface FlowingMenuItem {
  text: string;
  link?: string;
  image?: string;
  marquee?: string;
  meta?: string;
  icon?: 'arrow-up-right' | 'arrow-right' | 'chevron-down' | 'none';
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

export interface FlowingMenuProps {
  items?: FlowingMenuItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'alternate';
  followCursor?: number;
  duration?: number;
  stretch?: number;
  magnet?: number;
  bandInset?: number;
  bandRadius?: number;
  carryContent?: boolean;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  dividers?: boolean;
  dimInactive?: boolean;
  align?: 'center' | 'left';
  showIndex?: boolean;
  showArrow?: boolean;
  imageShape?: 'pill' | 'rounded' | 'circle';
  intro?: boolean;
  activeIndex?: number;
  onItemClick?: (item: FlowingMenuItem, index: number, event: ReactMouseEvent<HTMLElement>) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function FlowingMenu({
  items = [],
  speed = 60,
  direction = 'left',
  followCursor = 0.4,
  textColor = '#ffffff',
  bgColor = 'transparent',
  marqueeBgColor = '#ffffff',
  marqueeTextColor = '#120F17',
  borderColor = 'rgba(255, 255, 255, 0.12)',
  dividers = true,
  align = 'center',
  imageShape = 'pill',
  onItemClick,
  ariaLabel = 'Navigation Menu',
  className = '',
  style
}: FlowingMenuProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const partRefs = useRef<(HTMLDivElement | null)[]>([]);
  const positions = useRef<number[]>([]);
  const partWidths = useRef<number[]>([]);
  const cursor = useRef<{ x: number; t: number; vx: number }>({ x: 0, t: 0, vx: 0 });
  const rafRef = useRef<number>(0);
  const lastTime = useRef<number>(0);

  // Initialize positions and widths for each item
  useEffect(() => {
    positions.current = items.map(() => 0);
    partWidths.current = items.map(() => 0);
  }, [items]);

  // Animation Loop for Smooth Horizontal Marquee
  useEffect(() => {
    lastTime.current = performance.now();

    const updateMarquee = (now: number) => {
      const dt = clamp((now - lastTime.current) / 1000, 0, 0.05);
      lastTime.current = now;

      const c = cursor.current;
      c.vx *= Math.exp(-dt / 0.25);
      const push = clamp(c.vx * followCursor * 0.45, -800, 800);

      items.forEach((_, index) => {
        const track = trackRefs.current[index];
        if (!track) return;

        // Measure part width dynamically if not cached or resized
        if (!partWidths.current[index] || partWidths.current[index] <= 0) {
          const firstPart = partRefs.current[index];
          if (firstPart && firstPart.offsetWidth > 0) {
            partWidths.current[index] = firstPart.offsetWidth;
          }
        }

        const width = partWidths.current[index] || 450;
        const dir = direction === 'right' ? 1 : direction === 'alternate' ? (index % 2 === 0 ? -1 : 1) : -1;
        const move = (dir * speed + push) * dt;

        positions.current[index] = (positions.current[index] ?? 0) + move;

        // Seamless wrap around
        while (positions.current[index] <= -width) {
          positions.current[index] += width;
        }
        while (positions.current[index] >= 0) {
          positions.current[index] -= width;
        }

        track.style.transform = `translate3d(${positions.current[index].toFixed(2)}px, 0, 0)`;
      });

      rafRef.current = requestAnimationFrame(updateMarquee);
    };

    rafRef.current = requestAnimationFrame(updateMarquee);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items, speed, direction, followCursor]);

  // Track cursor velocity for physical inertia on hover/move
  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const c = cursor.current;
    const now = performance.now();
    const gap = (now - c.t) / 1000;
    if (gap > 0 && gap < 0.1) {
      const instant = (e.clientX - c.x) / gap;
      c.vx += (instant - c.vx) * 0.4;
    }
    c.x = e.clientX;
    c.t = now;
  };

  const handleItemHover = (index: number) => {
    setActiveRow(index);
  };

  const handleItemLeave = () => {
    setActiveRow(null);
  };

  const handleTouch = (index: number) => {
    setActiveRow(prev => (prev === index ? null : index));
  };

  const handleClick = (item: FlowingMenuItem, index: number, e: ReactMouseEvent<HTMLElement>) => {
    if (onItemClick) {
      onItemClick(item, index, e);
    }
  };

  return (
    <nav
      className={`relative w-full h-full select-none ${className}`}
      style={{ backgroundColor: bgColor, color: textColor, ...style }}
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleItemLeave}
    >
      <ul className="relative m-0 p-0 flex flex-col h-full w-full list-none justify-stretch">
        {items.map((item, index) => {
          const isActive = activeRow === index;
          const repeatedParts = Array.from({ length: 6 });

          return (
            <li
              key={`${item.text}-${index}`}
              className="group/item relative flex-1 flex items-center justify-center overflow-hidden min-h-[64px] sm:min-h-[78px] md:min-h-[92px] border-b border-white/10 last:border-b-0 cursor-pointer"
              onMouseEnter={() => handleItemHover(index)}
              onPointerEnter={() => handleItemHover(index)}
              onTouchStart={() => handleTouch(index)}
            >
              {/* Thin Divider Line if dividers prop is true */}
              {dividers && index > 0 && (
                <div
                  className="pointer-events-none absolute top-0 inset-x-0 h-px"
                  style={{ backgroundColor: borderColor }}
                />
              )}

              {/* IDLE CONTENT (Black background, centered elegant text) */}
              <div
                onClick={(e) => handleClick(item, index, e)}
                className={`relative z-0 w-full h-full flex items-center ${
                  align === 'left' ? 'justify-start px-8 sm:px-16' : 'justify-center px-4'
                } transition-all duration-300 ${isActive ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}
              >
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] uppercase text-[#f1eee7] group-hover/item:text-white transition-colors text-center"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.text}
                </span>
              </div>

              {/* ACTIVE MARQUEE BAND (Solid White Background with Flowing Content & Images) */}
              <div
                onClick={(e) => handleClick(item, index, e)}
                className="absolute inset-0 z-10 overflow-hidden flex items-center transition-all duration-400 ease-[cubic-bezier(0.2,0.9,0.2,1)]"
                style={{
                  backgroundColor: marqueeBgColor,
                  color: marqueeTextColor,
                  clipPath: isActive ? 'inset(0% 0 0% 0)' : 'inset(50% 0 50% 0)',
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  visibility: isActive ? 'visible' : 'hidden'
                }}
              >
                <div
                  ref={node => {
                    trackRefs.current[index] = node;
                  }}
                  className="flex h-full w-max items-center will-change-transform"
                >
                  {repeatedParts.map((_, copy) => (
                    <div
                      key={copy}
                      ref={copy === 0 ? node => { partRefs.current[index] = node; } : undefined}
                      className="flex h-full shrink-0 items-center px-3 sm:px-6"
                    >
                      <span
                        className="px-3 sm:px-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.02em] uppercase whitespace-nowrap text-[#120F17]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {item.marquee ?? item.text}
                      </span>
                      {item.image && (
                        <span
                          className={`mx-3 sm:mx-6 block aspect-[2.2/1] h-9 sm:h-12 md:h-14 lg:h-16 shrink-0 bg-cover bg-center shadow-md ${
                            imageShape === 'circle' ? 'rounded-full aspect-square' : 'rounded-full'
                          }`}
                          style={{ backgroundImage: `url("${item.image}")` }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default FlowingMenu;
