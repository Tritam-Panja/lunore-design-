import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full ${!itemClassName.includes('h-') ? 'h-80' : ''} ${!itemClassName.includes('p-') ? 'p-0 sm:p-4 md:p-8' : ''} ${!itemClassName.includes('rounded-') ? 'rounded-2xl sm:rounded-[36px] md:rounded-[40px]' : ''} ${!itemClassName.includes('my-') ? 'my-2.5 sm:my-6 md:my-8' : ''} box-border origin-top will-change-transform transform-gpu ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'translate3d(0, 0, 0)',
      contain: 'paint layout',
    }}
  >
    {children}
  </div>
);

export interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface LayoutMetrics {
  cardTops: number[];
  cardHeights: number[];
  pinStarts: number[];
  endElementTop: number;
  footerElementTop: number;
  containerHeight: number;
  stackPositionPx: number;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  footer,
  className = '',
  itemDistance = 480,
  itemScale = 0.035,
  itemStackDistance = 0,
  stackPosition = '4%',
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, { y: number; s: number; o: number; v: boolean }>>(new Map());
  const isUpdatingRef = useRef(false);

  const layoutMetricsRef = useRef<LayoutMetrics>({
    cardTops: [],
    cardHeights: [],
    pinStarts: [],
    endElementTop: 0,
    footerElementTop: 0,
    containerHeight: 0,
    stackPositionPx: 0,
  });

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  // Pre-measure layout & precalculate pin boundaries ONCE on layout/resize (zero DOM reads during scroll)
  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current;
    const containerHeight = useWindowScroll
      ? window.innerHeight
      : (scroller?.clientHeight || window.innerHeight);

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scroller?.querySelector('.scroll-stack-end') as HTMLElement | null);

    const footerElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-footer') as HTMLElement | null)
      : (scroller?.querySelector('.scroll-stack-footer') as HTMLElement | null);

    const getOffset = (el: HTMLElement) => {
      if (useWindowScroll) {
        return el.getBoundingClientRect().top + window.scrollY;
      } else {
        return el.offsetTop;
      }
    };

    const endElementTop = endElement ? getOffset(endElement) : 0;
    const footerElementTop = footerElement ? getOffset(footerElement) : 0;
    const cards = cardsRef.current;
    const cardTops = cards.map((card) => (card ? getOffset(card) : 0));
    const cardHeights = cards.map((card) => (card ? card.offsetHeight : 0));

    // Precalculate pinStart for every card to eliminate redundant math in the hot animation loop
    const pinStarts: number[] = [];
    for (let i = 0; i < cards.length; i++) {
      pinStarts.push(cardTops[i] - stackPositionPx + itemStackDistance * i);
    }

    layoutMetricsRef.current = {
      cardTops,
      cardHeights,
      pinStarts,
      endElementTop,
      footerElementTop,
      containerHeight,
      stackPositionPx,
    };
  }, [useWindowScroll, stackPosition, itemStackDistance, parsePercentage]);

  // Ultra-smooth 60/120fps hardware-accelerated transform updater:
  // Pure array lookups, occlusion culling, and zero layout thrashing
  const updateCardTransforms = useCallback((customScroll?: number) => {
    const cards = cardsRef.current;
    const cardsCount = cards.length;
    if (!cardsCount || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    if (!layoutMetricsRef.current.containerHeight) {
      measureLayout();
    }

    const { cardHeights, pinStarts, endElementTop, footerElementTop, containerHeight, stackPositionPx } = layoutMetricsRef.current;
    const scrollTop = typeof customScroll === 'number'
      ? customScroll
      : (useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop ?? 0));

    const lastCardHeight = (cardHeights && cardHeights[cardsCount - 1]) || 500;
    const desiredGap = 24;

    let pinEnd = endElementTop - containerHeight / 2;
    if (footerElementTop > 0) {
      pinEnd = footerElementTop - stackPositionPx - lastCardHeight - desiredGap;
    }

    for (let i = 0; i < cardsCount; i++) {
      const card = cards[i];
      if (!card) continue;

      const pinStart = pinStarts[i] ?? 0;

      // Pinned translateY calculation
      const translateY = Math.max(0, Math.min(scrollTop - pinStart, pinEnd - pinStart));

      // Fast check: how many cards have stacked above this card?
      let cardsAbove = 0;
      for (let k = i + 1; k < cardsCount; k++) {
        if (scrollTop >= (pinStarts[k] ?? 0)) {
          cardsAbove++;
        } else {
          break;
        }
      }

      // Occlusion culling: cards covered by 2+ opaque cards are culled from GPU compositor
      const isVisible = cardsAbove < 2;

      let scale = 1;
      let opacity = 1;

      if (i < cardsCount - 1) {
        const nextPinStart = pinStarts[i + 1] ?? 0;
        const transitionDistance = Math.min(containerHeight * 0.55, 360);

        if (cardsAbove > 0) {
          scale = Math.max(0.88, 1 - cardsAbove * itemScale);
          opacity = Math.max(0.80, 1 - cardsAbove * 0.04);
        } else if (scrollTop > nextPinStart - transitionDistance) {
          const progress = calculateProgress(scrollTop, nextPinStart - transitionDistance, nextPinStart);
          scale = 1 - progress * itemScale;
          opacity = 1 - progress * 0.04;
        }
      }

      // High-precision subpixel transforms for silky 120fps motion
      const last = lastTransformsRef.current.get(i);
      const needsUpdate =
        !last ||
        Math.abs(last.y - translateY) > 0.05 ||
        Math.abs(last.s - scale) > 0.0005 ||
        Math.abs(last.o - opacity) > 0.005 ||
        last.v !== isVisible;

      if (needsUpdate) {
        card.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

        if (opacity < 1) {
          card.style.opacity = opacity.toFixed(3);
        } else if (last && last.o < 1) {
          card.style.opacity = '1';
        }

        if (!isVisible && (!last || last.v)) {
          card.style.visibility = 'hidden';
        } else if (isVisible && last && !last.v) {
          card.style.visibility = 'visible';
        }

        lastTransformsRef.current.set(i, { y: translateY, s: scale, o: opacity, v: isVisible });
      }

      if (i === cardsCount - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    }

    isUpdatingRef.current = false;
  }, [
    itemScale,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    measureLayout,
  ]);

  const updateCardTransformsRef = useRef(updateCardTransforms);
  updateCardTransformsRef.current = updateCardTransforms;

  const measureLayoutRef = useRef(measureLayout);
  measureLayoutRef.current = measureLayout;

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;

    // Responsive item distance: tighter spacing on mobile for seamless continuous stacking
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const effectiveItemDistance = isMobile ? Math.min(itemDistance, 240) : itemDistance;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${effectiveItemDistance}px`;
      } else {
        card.style.marginBottom = `${footer ? 48 : 0}px`;
      }
      card.style.zIndex = `${i + 1}`;
      card.style.willChange = 'transform, opacity';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.webkitBackfaceVisibility = 'hidden';
      card.style.transform = 'translate3d(0, 0, 0)';
    });

    measureLayout();

    const scroller = scrollerRef.current;
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );

    // On touch/mobile devices: Use native momentum scroll + hardware V-Sync RAF loop
    // This delivers authentic 60/120Hz ProMotion touch fidelity with ZERO touch-lag
    let nativeScrollScheduled = false;
    const handleNativeScroll = () => {
      if (!nativeScrollScheduled) {
        nativeScrollScheduled = true;
        requestAnimationFrame(() => {
          nativeScrollScheduled = false;
          const currentScroll = useWindowScroll ? window.scrollY : (scroller?.scrollTop ?? 0);
          updateCardTransformsRef.current(currentScroll);
        });
      }
    };

    const targetEl = useWindowScroll ? window : scroller;
    if (targetEl) {
      targetEl.addEventListener('scroll', handleNativeScroll, { passive: true });
    }

    // On desktop: Use Lenis for mouse wheel smoothing
    if (!isTouch && scroller) {
      const lenis = new Lenis(
        useWindowScroll
          ? {
              duration: 0.65,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              syncTouch: false,
              wheelMultiplier: 1.0,
            }
          : {
              wrapper: scroller,
              content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
              duration: 0.65,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              syncTouch: false,
              gestureOrientation: 'vertical',
              wheelMultiplier: 1.0,
            }
      );

      lenis.on('scroll', (e: { scroll: number }) => {
        updateCardTransformsRef.current(e.scroll);
      });

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    }

    // Initial render tick
    updateCardTransformsRef.current(useWindowScroll ? window.scrollY : (scroller?.scrollTop ?? 0));

    const handleResize = () => {
      measureLayoutRef.current();
      updateCardTransformsRef.current();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (targetEl) {
        targetEl.removeEventListener('scroll', handleNativeScroll);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, footer, useWindowScroll, measureLayout]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'auto',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position',
      }}
    >
      <div className="scroll-stack-inner pt-[2vh] sm:pt-[4vh] md:pt-[4.5vh] px-3 sm:px-8 md:px-16 pb-[8rem] sm:pb-[12rem] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px pointer-events-none" />
        {footer && <div className="scroll-stack-footer w-full pt-4 sm:pt-6 pb-16 sm:pb-24">{footer}</div>}
      </div>
    </div>
  );
};

export default ScrollStack;
