import { gsap } from 'gsap';
import { type JSX, useEffect, useRef } from 'react';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function isInsideRect(pos: { x: number; y: number }, rect: DOMRect): boolean {
  return pos.x >= -60 && pos.x <= rect.width + 60 && pos.y >= -60 && pos.y <= rect.height + 60;
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null
  };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resize!: () => void;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.getRect();
    this.initEvents();
  }

  private initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  public getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  public destroy() {
    window.removeEventListener('resize', this.resize);
  }
}

class ImageTrailVariant1 {
  private container: HTMLDivElement;
  private DOM: { el: HTMLDivElement };
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number;
  private zIndexVal: number;
  private activeImagesCount: number;
  private isIdle: boolean;
  private threshold: number;
  private mousePos: { x: number; y: number };
  private lastMousePos: { x: number; y: number };
  private cacheMousePos: { x: number; y: number };
  private rafId: number | null = null;
  private destroyed = false;
  private handlePointerMove: (ev: MouseEvent | TouchEvent) => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLDivElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 60;
    
    const rect = container.getBoundingClientRect();
    this.mousePos = { x: rect.width / 2, y: rect.height / 2 };
    this.lastMousePos = { ...this.mousePos };
    this.cacheMousePos = { ...this.mousePos };

    this.handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const curRect = this.container.getBoundingClientRect();
      const pos = getLocalPointerPos(ev, curRect);
      if (isInsideRect(pos, curRect)) {
        this.mousePos = pos;
      }
    };

    window.addEventListener('mousemove', this.handlePointerMove, { passive: true });
    window.addEventListener('touchmove', this.handlePointerMove, { passive: true });

    this.rafId = requestAnimationFrame(() => this.render());
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    if (!img) return;

    const imgWidth = img.rect?.width || 200;
    const imgHeight = img.rect?.height || 200;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - imgWidth / 2,
          y: this.cacheMousePos.y - imgHeight / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          x: this.mousePos.x - imgWidth / 2,
          y: this.mousePos.y - imgHeight / 2
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.4,
          ease: 'power3',
          opacity: 0,
          scale: 0.2
        },
        0.4
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    window.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.images.forEach(img => {
      gsap.killTweensOf(img.DOM.el);
      img.destroy();
    });
  }

  private onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  private onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant2 {
  private container: HTMLDivElement;
  private DOM: { el: HTMLDivElement };
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number;
  private zIndexVal: number;
  private activeImagesCount: number;
  private isIdle: boolean;
  private threshold: number;
  private mousePos: { x: number; y: number };
  private lastMousePos: { x: number; y: number };
  private cacheMousePos: { x: number; y: number };
  private rafId: number | null = null;
  private destroyed = false;
  private handlePointerMove: (ev: MouseEvent | TouchEvent) => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLDivElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 60;

    const rect = container.getBoundingClientRect();
    this.mousePos = { x: rect.width / 2, y: rect.height / 2 };
    this.lastMousePos = { ...this.mousePos };
    this.cacheMousePos = { ...this.mousePos };

    this.handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const curRect = this.container.getBoundingClientRect();
      const pos = getLocalPointerPos(ev, curRect);
      if (isInsideRect(pos, curRect)) {
        this.mousePos = pos;
      }
    };

    window.addEventListener('mousemove', this.handlePointerMove, { passive: true });
    window.addEventListener('touchmove', this.handlePointerMove, { passive: true });

    this.rafId = requestAnimationFrame(() => this.render());
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    if (!img) return;

    const imgWidth = img.rect?.width || 200;
    const imgHeight = img.rect?.height || 200;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - imgWidth / 2,
          y: this.cacheMousePos.y - imgHeight / 2
        },
        {
          duration: 0.45,
          ease: 'power1.out',
          scale: 1,
          x: this.mousePos.x - imgWidth / 2,
          y: this.mousePos.y - imgHeight / 2
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2.5, filter: 'brightness(200%)' },
        {
          duration: 0.45,
          ease: 'power1.out',
          scale: 1,
          filter: 'brightness(100%)'
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.45,
          ease: 'power2.inOut',
          opacity: 0,
          scale: 0.3
        },
        0.45
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    window.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.images.forEach(img => {
      gsap.killTweensOf(img.DOM.el);
      img.destroy();
    });
  }

  private onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  private onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

type ImageTrailConstructor =
  | typeof ImageTrailVariant1
  | typeof ImageTrailVariant2;

const variantMap: Record<number, ImageTrailConstructor> = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
};

interface ImageTrailProps {
  items?: string[];
  variant?: number;
}

export default function ImageTrail({ items = [], variant = 2 }: ImageTrailProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const Cls = variantMap[variant] || variantMap[2];
    const instance = new Cls(containerRef.current);

    return () => {
      instance.destroy();
    };
  }, [variant, items]);

  return (
    <div
      className="w-full h-full relative z-[5] bg-transparent overflow-hidden pointer-events-none"
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className="content__img w-[190px] sm:w-[220px] aspect-[1.1] rounded-[18px] border border-white/25 shadow-[0_20px_40px_rgba(0,0,0,0.9)] absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter] pointer-events-none"
          key={i}
        >
          <div
            className="content__img-inner bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
