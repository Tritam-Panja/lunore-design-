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
      transformStyle: 'preserve-3d',
    }}
  >
    {children}
  </div>
);

export interface ScrollStackProps {
  className?: string;
  children: ReactNode;
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
  endElementTop: number;
  containerHeight: number;
  stackPositionPx: number;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
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
  const lastTransformsRef = useRef(new Map<number, { y: number; s: number; o: number }>());
  const isUpdatingRef = useRef(false);

  const layoutMetricsRef = useRef<LayoutMetrics>({
    cardTops: [],
    endElementTop: 0,
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

  // Pre-measure all card offsets ONCE on layout/resize to avoid layout thrashing during scroll frames
  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current;
    const containerHeight = useWindowScroll
      ? window.innerHeight
      : (scroller?.clientHeight || window.innerHeight);

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scroller?.querySelector('.scroll-stack-end') as HTMLElement | null);

    const getOffset = (el: HTMLElement) => {
      if (useWindowScroll) {
        return el.getBoundingClientRect().top + window.scrollY;
      } else {
        return el.offsetTop;
      }
    };

    const endElementTop = endElement ? getOffset(endElement) : 0;
    const cardTops = cardsRef.current.map((card) => (card ? getOffset(card) : 0));

    layoutMetricsRef.current = {
      cardTops,
      endElementTop,
      containerHeight,
      stackPositionPx,
    };
  }, [useWindowScroll, stackPosition, parsePercentage]);

  // Ultra-optimized 60/120fps transform updater: Pure arithmetic, ZERO DOM layout reads during scroll
  const updateCardTransforms = useCallback((customScroll?: number) => {
    const cards = cardsRef.current;
    const cardsCount = cards.length;
    if (!cardsCount || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    if (!layoutMetricsRef.current.containerHeight) {
      measureLayout();
    }

    const { cardTops, endElementTop, containerHeight, stackPositionPx } = layoutMetricsRef.current;
    const scrollTop = typeof customScroll === 'number'
      ? customScroll
      : (useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop ?? 0));

    const pinEnd = endElementTop - containerHeight / 2;

    for (let i = 0; i < cardsCount; i++) {
      const card = cards[i];
      if (!card) continue;

      const cardTop = cardTops[i] ?? 0;
      const pinStart = cardTop - stackPositionPx + itemStackDistance * i;

      // Pinned translateY calculation
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Smooth depth scale & opacity:
      // The active foreground card is ALWAYS full scale 1.0 and opacity 1.0.
      // As the next card arrives, the underneath card smoothly scales to (1 - itemScale) and slightly dims.
      let scale = 1;
      let opacity = 1;

      if (i < cardsCount - 1) {
        const nextCardTop = cardTops[i + 1] ?? 0;
        const nextPinStart = nextCardTop - stackPositionPx + itemStackDistance * (i + 1);
        const transitionDistance = Math.min(containerHeight * 0.6, 400);

        let cardsAbove = 0;
        for (let k = i + 1; k < cardsCount; k++) {
          const kTop = cardTops[k] ?? 0;
          const kPin = kTop - stackPositionPx + itemStackDistance * k;
          if (scrollTop >= kPin) {
            cardsAbove++;
          }
        }

        if (cardsAbove > 0) {
          scale = Math.max(0.88, 1 - cardsAbove * itemScale);
          opacity = Math.max(0.65, 1 - cardsAbove * 0.08);
        } else if (scrollTop > nextPinStart - transitionDistance) {
          const progress = calculateProgress(scrollTop, nextPinStart - transitionDistance, nextPinStart);
          scale = 1 - progress * itemScale;
          opacity = 1 - progress * 0.08;
        }
      }

      const roundedTranslateY = Math.round(translateY * 10) / 10;
      const roundedScale = Math.round(scale * 1000) / 1000;
      const roundedOpacity = Math.round(opacity * 100) / 100;

      const last = lastTransformsRef.current.get(i);
      const needsUpdate =
        !last ||
        Math.abs(last.y - roundedTranslateY) > 0.1 ||
        Math.abs(last.s - roundedScale) > 0.001 ||
        Math.abs(last.o - roundedOpacity) > 0.01;

      if (needsUpdate) {
        card.style.transform = `translate3d(0, ${roundedTranslateY}px, 0) scale(${roundedScale})`;
        if (roundedOpacity < 1) {
          card.style.opacity = `${roundedOpacity}`;
        } else if (last && last.o < 1) {
          card.style.opacity = '1';
        }
        lastTransformsRef.current.set(i, { y: roundedTranslateY, s: roundedScale, o: roundedOpacity });
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
    itemStackDistance,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    measureLayout,
  ]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.zIndex = `${i + 1}`;
      card.style.willChange = 'transform, opacity';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.webkitBackfaceVisibility = 'hidden';
      card.style.transform = 'translate3d(0, 0, 0)';
    });

    measureLayout();

    // High performance Lenis instance with RAF loop
    const scroller = scrollerRef.current;
    const lenis = new Lenis(
      useWindowScroll
        ? {
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
            wheelMultiplier: 1.0,
            lerp: 0.1,
          }
        : {
            wrapper: scroller!,
            content: scroller!.querySelector('.scroll-stack-inner') as HTMLElement,
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
            gestureOrientation: 'vertical',
            wheelMultiplier: 1.0,
            lerp: 0.1,
          }
    );

    lenis.on('scroll', (e: { scroll: number }) => {
      updateCardTransforms(e.scroll);
    });

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // Initial render tick
    updateCardTransforms(0);

    const handleResize = () => {
      measureLayout();
      updateCardTransforms();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    measureLayout,
    updateCardTransforms,
  ]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position',
      }}
    >
      <div className="scroll-stack-inner pt-[2vh] sm:pt-[4vh] md:pt-[4.5vh] px-3 sm:px-8 md:px-16 pb-[30rem] sm:pb-[35rem] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
