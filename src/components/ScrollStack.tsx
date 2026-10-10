'use client';

import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { isMobileDevice, isAndroid } from '@/lib/device';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => {
  const isAndroidDevice = isAndroid();
  const hasHeight = itemClassName.includes('h-');
  const hasPadding = itemClassName.includes('p-');
  const hasMargin = itemClassName.includes('my-') || itemClassName.includes('m-');
  const hasRadius = itemClassName.includes('rounded-');

  return (
    <div
      className={`scroll-stack-card relative w-full ${!hasHeight ? 'h-80' : ''} ${!hasMargin ? 'my-8' : ''} ${!hasPadding ? 'p-12' : ''} ${!hasRadius ? 'rounded-[40px]' : ''} ${isAndroidDevice ? '' : 'shadow-[0_0_30px_rgba(0,0,0,0.1)] will-change-transform'} box-border origin-top ${itemClassName}`.trim()}
      style={{
        backfaceVisibility: isAndroidDevice ? 'visible' : 'hidden',
        transformStyle: 'flat',
      }}
    >
      {children}
    </div>
  );
};

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
  footer?: ReactNode;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
  footer,
}) => {
  const isAndroidDevice = isAndroid();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);
  const layoutMetricsRef = useRef<{
    containerHeight: number;
    stackPositionPx: number;
    scaleEndPositionPx: number;
  }>({
    containerHeight: 0,
    stackPositionPx: 0,
    scaleEndPositionPx: 0,
  });
  const lastTransformsRef = useRef<Map<number, { y: number; scale: number; rotation: number; blur: number }>>(new Map());
  const isUpdatingRef = useRef(false);
  const isMobileDeviceRef = useRef<boolean>(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (end <= start) return scrollTop >= start ? 1 : 0;
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  // =========================================================================
  // DESKTOP: Deterministic continuous scroll-following stack calculation
  // Uses pre-cached geometry metrics to avoid layout reads in the per-frame loop.
  // =========================================================================
  const updateDesktopMarbles = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop } = getScrollData();
    const { stackPositionPx, scaleEndPositionPx } = layoutMetricsRef.current;
    const cardOffsets = cardOffsetsRef.current;
    const lastCardIndex = cardsRef.current.length - 1;
    const lastCardTop = cardOffsets[lastCardIndex] ?? 0;
    const lastCardPinStart = lastCardTop - stackPositionPx - itemStackDistance * lastCardIndex;
    const pinEnd = lastCardPinStart;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOffsets[i] ?? 0;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerStart = pinStart;
      const triggerEnd = cardTop - scaleEndPositionPx;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = Math.min(1, baseScale + i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardOffsets[j] ?? 0;
          const jPinStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jPinStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - pinStart;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - pinStart;
      }

      // Smooth continuous subpixel precision without stair-stepping or threshold suppression jumps
      const subpixelY = Math.round(translateY * 100) / 100;
      const snapScale = Math.round(scale * 10000) / 10000;
      const snapRotation = rotationAmount ? Math.round(rotation * 100) / 100 : 0;
      const snapBlur = blurAmount ? Math.round(blur * 100) / 100 : 0;

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        lastTransform.y !== subpixelY ||
        lastTransform.scale !== snapScale ||
        lastTransform.rotation !== snapRotation ||
        lastTransform.blur !== snapBlur;

      if (hasChanged) {
        const transform = `translate3d(0, ${subpixelY}px, 0) scale(${snapScale})${snapRotation ? ` rotate(${snapRotation}deg)` : ''}`;
        card.style.transform = transform;

        if (blurAmount) {
          const filter = snapBlur > 0 ? `blur(${snapBlur}px)` : '';
          card.style.filter = filter;
        }

        lastTransformsRef.current.set(i, {
          y: subpixelY,
          scale: snapScale,
          rotation: snapRotation,
          blur: snapBlur,
        });
      }

      if (i === lastCardIndex) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    getScrollData,
  ]);

  // LOCAL SCROLLSTACK RAF-COALESCED FRAME UPDATE SCHEDULER
  // Coalesces multiple scroll events within the same frame into ONE single calculation before paint.
  const scheduleStackUpdate = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (!isMobileDeviceRef.current) {
        updateDesktopMarbles();
      }
    });
  }, [updateDesktopMarbles]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: false,
        syncTouchLerp: 0.075,
      });

      lenis.on('scroll', scheduleStackUpdate);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      // In container mode (inside modal), native browser scrolling on the container with overflow-y-auto
      // is 100% reliable across all mice, trackpads, and touch devices without Lenis event collisions.
      return null;
    }
  }, [scheduleStackUpdate, useWindowScroll]);

  useLayoutEffect(() => {
    const isMobile = isMobileDevice();
    const isAndroidDevice = isAndroid();
    isMobileDeviceRef.current = isMobile;

    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];

    if (!cards.length) return;
    cardsRef.current = cards;

    // =========================================================================
    // MOBILE BRANCH: Lightweight Document-Flow IntersectionObserver Reveal
    // - Native browser scrolling with normal document-flow cards
    // - NO continuous scroll-linked transform calculations
    // - NO pinning or forced repositioning
    // - NO scroll event listeners or RAF loops
    // - Stable one-time CSS transition when entering viewport
    // =========================================================================
    if (isMobile) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const lastCard = cards[cards.length - 1];

      // Prepare cards in normal document flow
      cards.forEach((card, i) => {
        card.style.marginBottom = i < cards.length - 1 ? `${itemDistance}px` : '48px';
        card.style.zIndex = `${i + 1}`;
        if (!isAndroidDevice) {
          card.style.willChange = 'transform, opacity';
        }
        card.style.backfaceVisibility = isAndroidDevice ? 'visible' : 'hidden';
        card.style.transformOrigin = 'center top';
        card.style.perspective = 'none';
        (card.style as any).webkitPerspective = 'none';

        if (prefersReducedMotion || isAndroidDevice) {
          card.style.opacity = '1';
          card.style.transform = 'none';
          card.style.transition = 'none';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(24px) scale(0.985)';
          card.style.transition = 'opacity 550ms cubic-bezier(0.22, 1, 0.36, 1), transform 550ms cubic-bezier(0.22, 1, 0.36, 1)';
        }
      });

      if (prefersReducedMotion || isAndroidDevice) {
        stackCompletedRef.current = true;
        onStackComplete?.();
        return () => {
          cardsRef.current = [];
        };
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.style.opacity = '1';
              target.style.transform = 'translateY(0) scale(1)';
              observer.unobserve(target);

              if (target === lastCard && !stackCompletedRef.current) {
                stackCompletedRef.current = true;
                onStackComplete?.();
              }
            }
          });
        },
        {
          root: useWindowScroll ? null : scrollerRef.current,
          threshold: isAndroidDevice ? 0.02 : 0.12,
          rootMargin: isAndroidDevice ? '120px 0px 60px 0px' : '0px 0px -8% 0px',
        }
      );

      cards.forEach((card) => {
        observer.observe(card);
      });

      return () => {
        observer.disconnect();
        stackCompletedRef.current = false;
        cardsRef.current = [];
      };
    }

    // =========================================================================
    // DESKTOP BRANCH: Stable Hardware-Synced Desktop ScrollStack
    // - Continuous subpixel transform tracking without layout reads per frame
    // - Proactive offset refresh on resize, image load, font settle, and layout shifts
    // - Coalesced RAF scheduling eliminating frame tearing and compositor shiver
    // =========================================================================
    const updateCardMetrics = () => {
      const { containerHeight } = getScrollData();
      layoutMetricsRef.current = {
        containerHeight,
        stackPositionPx: parsePercentage(stackPosition, containerHeight),
        scaleEndPositionPx: parsePercentage(scaleEndPosition, containerHeight),
      };
      cardOffsetsRef.current = cards.map((card) => getElementOffset(card));
    };

    cards.forEach((card, i) => {
      card.style.marginBottom = i < cards.length - 1 ? `${itemDistance}px` : '64px';
      card.style.zIndex = `${i + 1}`;
      card.style.willChange = blurAmount > 0 ? 'transform, filter' : 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translate3d(0, 0px, 0) scale(1)';
    });

    updateCardMetrics();

    setupLenis();

    const handleResize = () => {
      isMobileDeviceRef.current = isMobileDevice();
      updateCardMetrics();
      scheduleStackUpdate();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCardMetrics();
        scheduleStackUpdate();
      });
      if (scrollerRef.current) {
        resizeObserver.observe(scrollerRef.current);
      }
      const inner = scrollerRef.current?.querySelector('.scroll-stack-inner');
      if (inner) {
        resizeObserver.observe(inner);
      }
    }

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          updateCardMetrics();
          scheduleStackUpdate();
        })
        .catch(() => {});
    }

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', scheduleStackUpdate, { passive: true });
    }
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial render
    updateDesktopMarbles();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (scroller) {
        scroller.removeEventListener('scroll', scheduleStackUpdate);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    setupLenis,
    updateDesktopMarbles,
    scheduleStackUpdate,
    getElementOffset,
    getScrollData,
    parsePercentage,
    onStackComplete,
  ]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'auto',
      }}
    >
      <div className="scroll-stack-inner pt-[6vh] sm:pt-[10vh] px-3 sm:px-10 md:px-20 pb-[45vh] min-h-screen">
        {children}
        {footer && <div className="scroll-stack-footer w-full mt-8 sm:mt-14 mb-8 sm:mb-12 relative z-20">{footer}</div>}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
