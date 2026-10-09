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
        transformStyle: isAndroidDevice ? 'flat' : 'preserve-3d',
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
  const lastTransformsRef = useRef<Map<number, any>>(new Map());
  const isUpdatingRef = useRef(false);
  const isMobileDeviceRef = useRef<boolean>(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
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
  // =========================================================================
  // DESKTOP: Continuous scroll-following stack calculation
  // =========================================================================
  const updateDesktopMarbles = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const cardOffsets = cardOffsetsRef.current;
    const lastCardIndex = cardsRef.current.length - 1;
    const lastCardTop = cardOffsets[lastCardIndex] ?? 0;
    const lastCardPinStart = lastCardTop - stackPositionPx - itemStackDistance * lastCardIndex;
    const pinEnd = lastCardPinStart;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOffsets[i] ?? 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = Math.min(1, baseScale + i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardOffsets[j] ?? 0;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Smooth continuous subpixel precision (0.01px resolution eliminates 0.5px stair-stepping without jitter)
      const subpixelY = Math.round(translateY * 100) / 100;
      const snapScale = Math.round(scale * 10000) / 10000;
      const snapRotation = rotationAmount ? Math.round(rotation * 100) / 100 : 0;
      const snapBlur = blurAmount ? Math.round(blur * 100) / 100 : 0;

      const newTransform = {
        translateY: subpixelY,
        scale: snapScale,
        rotation: snapRotation,
        blur: snapBlur,
      };

      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.005 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.0001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.05 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.05;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})${newTransform.rotation ? ` rotate(${newTransform.rotation}deg)` : ''}`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        if (card.style.filter !== filter) {
          card.style.filter = filter;
        }

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
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
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
  ]);

  const handleScroll = useCallback(() => {
    if (isMobileDeviceRef.current) return;
    updateDesktopMarbles();
  }, [updateDesktopMarbles]);

  // LOCAL SCROLLSTACK SINGLE-FRAME UPDATE SCHEDULER
  // Synchronous scroll-linked calculation guarantees zero frame latency between native scroll and card transforms.
  const scheduleStackUpdate = useCallback(() => {
    handleScroll();
  }, [handleScroll]);

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
    // DESKTOP BRANCH: Existing Desktop ScrollStack Implementation (LOCKED)
    // =========================================================================
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      } else {
        card.style.marginBottom = '64px';
      }
      card.style.zIndex = `${i + 1}`;
      card.style.willChange = blurAmount > 0 ? 'transform, filter' : 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    // Compute card offsets AFTER applying layout margins so offsets accurately reflect the layout
    cardOffsetsRef.current = cards.map((card) => getElementOffset(card));

    setupLenis();

    const handleResize = () => {
      isMobileDeviceRef.current = isMobileDevice();
      cardOffsetsRef.current = cardsRef.current.map((card) => getElementOffset(card));
      handleScroll();
    };

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', scheduleStackUpdate, { passive: true });
    }
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial render
    handleScroll();

    return () => {
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
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    blurAmount,
    useWindowScroll,
    setupLenis,
    handleScroll,
    scheduleStackUpdate,
    getElementOffset,
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
        WebkitTransform: isAndroidDevice ? 'none' : 'translateZ(0)',
        transform: isAndroidDevice ? 'none' : 'translateZ(0)',
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
