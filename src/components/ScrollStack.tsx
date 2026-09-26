import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full ${!itemClassName.includes('h-') ? 'h-80' : ''} ${!itemClassName.includes('p-') ? 'p-0 sm:p-4 md:p-8' : ''} ${!itemClassName.includes('rounded-') ? 'rounded-2xl sm:rounded-[36px] md:rounded-[40px]' : ''} ${!itemClassName.includes('my-') ? 'my-2.5 sm:my-6 md:my-8' : ''} box-border origin-top transform-gpu ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      isolation: 'isolate',
      touchAction: 'pan-y',
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
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const scheduledRafRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, { y: number; s: number; b: number }>());

  const layoutMetricsRef = useRef<LayoutMetrics>({
    cardTops: [],
    cardHeights: [],
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
    const cardTops = cardsRef.current.map((card) => (card ? getOffset(card) : 0));
    const cardHeights = cardsRef.current.map((card) => (card ? card.offsetHeight : 0));

    layoutMetricsRef.current = {
      cardTops,
      cardHeights,
      endElementTop,
      footerElementTop,
      containerHeight,
      stackPositionPx,
    };
  }, [useWindowScroll, stackPosition, parsePercentage]);

  // Ultra-optimized 60/120fps transform updater: Pure arithmetic, ZERO DOM layout reads during scroll
  const updateCardTransforms = useCallback((customScroll?: number) => {
    const cards = cardsRef.current;
    const cardsCount = cards.length;
    if (!cardsCount) return;

    if (!layoutMetricsRef.current.containerHeight) {
      measureLayout();
    }

    const { cardTops, cardHeights, endElementTop, footerElementTop, containerHeight, stackPositionPx } = layoutMetricsRef.current;
    const scrollTop = typeof customScroll === 'number'
      ? customScroll
      : (useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop ?? 0));

    const lastCardHeight = (cardHeights && cardHeights[cardsCount - 1]) || 540;
    const desiredGap = 28; // Clean, luxury 28px gap between bottom of 10th card and top of footer card

    // As soon as the footer reaches 28px below the last card, release pin so they glide together seamlessly with zero dead scroll
    let pinEnd = endElementTop - containerHeight / 2;
    if (footerElementTop > 0) {
      pinEnd = footerElementTop - stackPositionPx - lastCardHeight - desiredGap;
    }

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

      // Smooth depth scale & brightness dimming:
      // Active foreground card is ALWAYS full scale 1.0 and brightness 1.0.
      // Underneath cards smoothly scale and dim via CSS brightness (preserving GPU compositing textures
      // and preventing the violent alpha-blend layer reallocations that cause mobile flickering).
      let scale = 1;
      let brightness = 1;

      if (i < cardsCount - 1) {
        const nextCardTop = cardTops[i + 1] ?? 0;
        const nextPinStart = nextCardTop - stackPositionPx + itemStackDistance * (i + 1);
        const transitionDistance = Math.min(containerHeight * 0.55, 360);

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
          brightness = Math.max(0.72, 1 - cardsAbove * 0.06);
        } else if (scrollTop > nextPinStart - transitionDistance) {
          const progress = calculateProgress(scrollTop, nextPinStart - transitionDistance, nextPinStart);
          scale = 1 - progress * itemScale;
          brightness = 1 - progress * 0.06;
        }
      }

      const roundedTranslateY = Math.round(translateY * 10) / 10;
      const roundedScale = Math.round(scale * 1000) / 1000;
      const roundedBrightness = Math.round(brightness * 100) / 100;

      const last = lastTransformsRef.current.get(i);
      const needsUpdate =
        !last ||
        Math.abs(last.y - roundedTranslateY) > 0.1 ||
        Math.abs(last.s - roundedScale) > 0.001 ||
        Math.abs(last.b - roundedBrightness) > 0.01;

      if (needsUpdate) {
        // Micro Z-depth offset (${i * 2}px) completely eliminates GPU coplanar Z-fighting when cards overlap
        card.style.transform = `translate3d(0, ${roundedTranslateY}px, ${i * 2}px) scale(${roundedScale})`;

        if (roundedBrightness < 1) {
          card.style.filter = `brightness(${roundedBrightness})`;
        } else if (last && last.b < 1) {
          card.style.filter = 'none';
        }

        lastTransformsRef.current.set(i, { y: roundedTranslateY, s: roundedScale, b: roundedBrightness });
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
  }, [
    itemScale,
    itemStackDistance,
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

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      } else {
        card.style.marginBottom = `${footer ? 48 : 0}px`;
      }
      card.style.zIndex = `${i + 1}`;
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.webkitBackfaceVisibility = 'hidden';
      card.style.transform = `translate3d(0, 0, ${i * 2}px)`;
    });

    measureLayout();

    // Detect mobile touch device: on mobile, native touch momentum scrolling runs
    // directly on the GPU compositor. Decoupling Lenis from touch eliminates dual-engine
    // scroll fighting and touch jitter.
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

    const scroller = scrollerRef.current;
    let lenis: Lenis | null = null;

    // Single unified RAF scheduler: guarantees updates happen once per display refresh (60/120Hz)
    const scheduleUpdate = (customScroll?: number) => {
      if (scheduledRafRef.current !== null) return;
      scheduledRafRef.current = requestAnimationFrame(() => {
        scheduledRafRef.current = null;
        updateCardTransformsRef.current(customScroll);
      });
    };

    if (!isTouchDevice) {
      lenis = new Lenis(
        useWindowScroll
          ? {
              duration: 0.6,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              syncTouch: false,
              wheelMultiplier: 1.15,
            }
          : {
              wrapper: scroller!,
              content: scroller!.querySelector('.scroll-stack-inner') as HTMLElement,
              duration: 0.6,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              syncTouch: false,
              gestureOrientation: 'vertical',
              wheelMultiplier: 1.15,
            }
      );

      lenis.on('scroll', (e: { scroll: number }) => {
        scheduleUpdate(e.scroll);
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    }

    // Native scroll event listener with RAF coalescing for immediate, zero-lag touch responses
    const handleNativeScroll = () => {
      const currentScroll = useWindowScroll ? window.scrollY : (scroller?.scrollTop ?? 0);
      scheduleUpdate(currentScroll);
    };

    const targetEl = useWindowScroll ? window : scroller;
    if (targetEl) {
      targetEl.addEventListener('scroll', handleNativeScroll, { passive: true });
    }

    // Initial render tick
    updateCardTransformsRef.current(0);

    const handleResize = () => {
      measureLayoutRef.current();
      scheduleUpdate();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (targetEl) {
        targetEl.removeEventListener('scroll', handleNativeScroll);
      }
      if (scheduledRafRef.current !== null) {
        cancelAnimationFrame(scheduledRafRef.current);
        scheduledRafRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, useWindowScroll]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        scrollBehavior: 'auto',
      }}
    >
      <div className="scroll-stack-inner pt-[2vh] sm:pt-[4vh] md:pt-[4.5vh] px-3 sm:px-8 md:px-16 pb-[8rem] sm:pb-[12rem] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
        {footer && <div className="scroll-stack-footer w-full pt-4 sm:pt-6 pb-16 sm:pb-24">{footer}</div>}
      </div>
    </div>
  );
};

export default ScrollStack;
