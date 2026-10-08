'use client';

import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { isMobileDevice } from '@/lib/device';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => {
  const hasHeight = itemClassName.includes('h-');
  const hasPadding = itemClassName.includes('p-');
  const hasMargin = itemClassName.includes('my-') || itemClassName.includes('m-');
  const hasRadius = itemClassName.includes('rounded-');

  return (
    <div
      className={`scroll-stack-card relative w-full ${!hasHeight ? 'h-80' : ''} ${!hasMargin ? 'my-8' : ''} ${!hasPadding ? 'p-12' : ''} ${!hasRadius ? 'rounded-[40px]' : ''} shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
      style={{
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
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

      // Stable subpixel precision (snapping to 0.5px grid eliminates edge antialiasing crawl)
      const snapY = Math.round(translateY * 2) / 2;
      const snapScale = Math.round(scale * 1000) / 1000;
      const snapRotation = Math.round(rotation * 100) / 100;
      const snapBlur = Math.round(blur * 100) / 100;

      const newTransform = {
        translateY: snapY,
        scale: snapScale,
        rotation: snapRotation,
        blur: snapBlur,
      };

      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) >= 0.5 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

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

  // =========================================================================
  // iOS + ANDROID: Lightweight Deterministic Target-Position Animation
  // - Zero continuous collision physics or floating-point velocity noise.
  // - Overscroll clamped: prevents iOS elastic rubber-band bounce from shaking the stack.
  // - Deterministic sequential easing into assigned target position.
  // - Firm resting lock: once reached, cards freeze completely with ZERO micro-movement.
  // =========================================================================
  const updateMobileMarbles = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scroller = scrollerRef.current;
    const rawScrollTop = useWindowScroll ? window.scrollY : (scroller ? scroller.scrollTop : 0);
    const containerHeight = useWindowScroll ? window.innerHeight : (scroller ? scroller.clientHeight : 0);
    const scrollContainer = useWindowScroll ? document.documentElement : scroller;
    const maxScroll = Math.max(0, (scrollContainer ? scrollContainer.scrollHeight - containerHeight : 0));

    // Clamped against iOS and Android elastic bounce: completely stops rubber-band vibration
    const scrollTop = Math.min(maxScroll, Math.max(0, rawScrollTop));

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
      const targetStackOffset = stackPositionPx + itemStackDistance * i;
      const triggerStart = cardTop - targetStackOffset;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const targetScale = Math.min(1, baseScale + i * itemScale);

      let translateY = 0;
      let scale = 1;

      // 1. Before Entrance: card is in natural scroll position
      if (scrollTop < triggerStart) {
        translateY = 0;
        scale = 1;
      }
      // 2. Sequential/Cinematic Entrance toward assigned target position
      else if (scrollTop < triggerEnd) {
        const rawProgress = (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart);
        const progress = Math.min(1, Math.max(0, rawProgress));
        // Smooth cubic ease-out for deterministic cinematic feel
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        scale = 1.0 - easeProgress * (1.0 - targetScale);
        translateY = Math.round(scrollTop - cardTop + targetStackOffset);
      }
      // 3. Reached Target Position in Stack: firmly locked into target state with zero micro-movement
      else {
        scale = targetScale;
        if (scrollTop <= pinEnd) {
          translateY = Math.round(scrollTop - cardTop + targetStackOffset);
        } else {
          // Beyond stack completion: resting stably at final pinEnd
          translateY = Math.round(pinEnd - cardTop + targetStackOffset);
        }
      }

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

      const snapScale = Math.round(scale * 1000) / 1000;
      const snapBlur = Math.round(blur * 10) / 10;
      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        lastTransform.translateY !== translateY ||
        lastTransform.scale !== snapScale ||
        lastTransform.blur !== snapBlur;

      if (hasChanged) {
        const transform = `translate3d(0, ${translateY}px, 0) scale(${snapScale})`;
        const filter = snapBlur > 0 ? `blur(${snapBlur}px)` : '';

        card.style.transform = transform;
        if (card.style.filter !== filter) {
          card.style.filter = filter;
        }

        lastTransformsRef.current.set(i, {
          translateY,
          scale: snapScale,
          rotation: 0,
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
    stackPosition,
    scaleEndPosition,
    baseScale,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    parsePercentage,
  ]);

  const handleScroll = useCallback(() => {
    if (isMobileDeviceRef.current) {
      updateMobileMarbles();
    } else {
      updateDesktopMarbles();
    }
  }, [updateMobileMarbles, updateDesktopMarbles]);

  // LOCAL SCROLLSTACK SINGLE-FRAME UPDATE SCHEDULER
  // Collapses multiple scroll events within the same frame into ONE calculation.
  const scheduleStackUpdate = useCallback(() => {
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      handleScroll();
    });
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
    isMobileDeviceRef.current = isMobileDevice();

    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    cardOffsetsRef.current = cards.map((card) => getElementOffset(card));
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
  ]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'auto',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
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
