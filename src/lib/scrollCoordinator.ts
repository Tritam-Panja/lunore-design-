import { useEffect, useRef } from 'react';
import type Lenis from 'lenis';

export type ScrollCallback = (scrollY: number) => void;

class ScrollCoordinator {
  private subscribers = new Set<ScrollCallback>();
  private lenis: Lenis | null = null;
  private isListeningNative = false;
  private rafId = 0;
  private cachedScrollY = 0;
  private cachedViewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  private cachedViewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  private isResizeListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.cachedScrollY = window.scrollY;
      this.cachedViewportHeight = window.innerHeight;
      this.cachedViewportWidth = window.innerWidth;
      this.setupResizeListener();
    }
  }

  private setupResizeListener() {
    if (this.isResizeListening || typeof window === 'undefined') return;
    this.isResizeListening = true;
    window.addEventListener(
      'resize',
      () => {
        this.cachedViewportHeight = window.innerHeight;
        this.cachedViewportWidth = window.innerWidth;
      },
      { passive: true }
    );
  }

  public getViewportHeight(): number {
    return this.cachedViewportHeight;
  }

  public getViewportWidth(): number {
    return this.cachedViewportWidth;
  }

  public getScrollY(): number {
    return this.cachedScrollY;
  }

  public setLenis(instance: Lenis | null) {
    if (this.lenis === instance) return;

    if (this.lenis) {
      this.lenis.off('scroll', this.handleLenisScroll);
    }

    this.lenis = instance;

    if (this.lenis) {
      // Desktop: Lenis is active. Tear down native window listener to prevent duplicate firing
      this.teardownNativeListener();
      this.lenis.on('scroll', this.handleLenisScroll);
    } else {
      // Mobile or touch: Lenis is null. Engage native passive listener if subscribers exist
      if (this.subscribers.size > 0) {
        this.setupNativeListener();
      }
    }
  }

  private handleLenisScroll = (e: { scroll: number }) => {
    this.cachedScrollY = e.scroll;
    this.notifySubscribers(e.scroll);
  };

  private handleNativeScroll = () => {
    if (this.rafId === 0) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = 0;
        this.cachedScrollY = window.scrollY;
        this.notifySubscribers(this.cachedScrollY);
      });
    }
  };

  private setupNativeListener() {
    if (this.isListeningNative || typeof window === 'undefined' || this.lenis) return;
    this.isListeningNative = true;
    window.addEventListener('scroll', this.handleNativeScroll, { passive: true });
  }

  private teardownNativeListener() {
    if (!this.isListeningNative || typeof window === 'undefined') return;
    this.isListeningNative = false;
    window.removeEventListener('scroll', this.handleNativeScroll);
    if (this.rafId !== 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private notifySubscribers(scrollY: number) {
    this.subscribers.forEach((cb) => {
      try {
        cb(scrollY);
      } catch (err) {
        console.error('Error in scroll subscriber:', err);
      }
    });
  }

  public subscribe(cb: ScrollCallback): () => void {
    this.subscribers.add(cb);
    // Immediately call once with current position to ensure correct initial state
    cb(this.cachedScrollY);

    if (!this.lenis && !this.isListeningNative) {
      this.setupNativeListener();
    }

    return () => {
      this.subscribers.delete(cb);
      if (this.subscribers.size === 0 && !this.lenis) {
        this.teardownNativeListener();
      }
    };
  }
}

export const scrollCoordinator = new ScrollCoordinator();

/**
 * React hook to subscribe to the unified, single-source scroll coordinator.
 * - On desktop: Driven by Lenis exclusively (zero duplicate native listeners).
 * - On mobile: Driven by a single passive native scroll listener coalesced via RAF.
 */
export function useScrollSubscriber(callback: ScrollCallback, deps: any[] = []) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const unsub = scrollCoordinator.subscribe((scrollY) => {
      cbRef.current(scrollY);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
