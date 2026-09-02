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

  private getRect() {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

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

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          scale: 0.8,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.6,
          ease: 'power2.inOut',
          opacity: 0,
          scale: 0.3
        },
        0.5
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

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

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          scale: 0.4,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2.2, filter: 'brightness(180%)' },
        {
          duration: 0.5,
          ease: 'power2.out',
          scale: 1,
          filter: 'brightness(100%)'
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.55,
          ease: 'power2.inOut',
          opacity: 0,
          scale: 0.3
        },
        0.5
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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

class ImageTrailVariant3 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

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

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          scale: 0.5,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 1.15 },
        {
          duration: 0.5,
          ease: 'power2.out',
          scale: 1
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.7,
          ease: 'power2.inOut',
          opacity: 0,
          scale: 0.3,
          xPercent: () => gsap.utils.random(-25, 25),
          yPercent: -150
        },
        0.5
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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

class ImageTrailVariant4 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          scale: 0.5,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        {
          scale: 1.6,
          filter: `brightness(${Math.max((300 * distance) / 100, 100)}%) contrast(${Math.max(
            (300 * distance) / 100,
            100
          )}%)`
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          scale: 1,
          filter: 'brightness(100%) contrast(100%)'
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.5,
          ease: 'power2.inOut',
          opacity: 0
        },
        0.5
      )
      .to(
        img.DOM.el,
        {
          duration: 1.4,
          ease: 'power3.out',
          x: `+=${dx * 100}`,
          y: `+=${dy * 100}`
        },
        0.05
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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

class ImageTrailVariant5 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;
  private lastAngle: number;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.lastAngle = 0;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    let startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 150;
    dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          filter: 'brightness(85%)',
          scale: 0.3,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
          rotation: startAngle
        },
        {
          duration: 0.8,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          filter: 'brightness(100%)',
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2 + dx * 60,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2 + dy * 60,
          rotation: this.lastAngle
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.5,
          ease: 'power2.inOut',
          opacity: 0
        },
        0.6
      )
      .to(
        img.DOM.el,
        {
          duration: 1.4,
          ease: 'power3.out',
          x: `+=${dx * 100}`,
          y: `+=${dy * 100}`
        },
        0.05
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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
    if (this.activeImagesCount === 0) this.isIdle = true;
  }
}

class ImageTrailVariant6 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.15);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.15);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private mapSpeedToSize(speed: number, minSize: number, maxSize: number) {
    const maxSpeed = 200;
    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToBrightness(speed: number, minB: number, maxB: number) {
    const maxSpeed = 70;
    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToBlur(speed: number, minBlur: number, maxBlur: number) {
    const maxSpeed = 90;
    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToGrayscale(speed: number, minG: number, maxG: number) {
    const maxSpeed = 90;
    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  private showNextImage() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    const scaleFactor = this.mapSpeedToSize(speed, 0.5, 1.6);
    const brightnessValue = this.mapSpeedToBrightness(speed, 0.3, 1.2);
    const blurValue = this.mapSpeedToBlur(speed, 12, 0);
    const grayscaleValue = this.mapSpeedToGrayscale(speed, 400, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          scale: 0.4,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.65,
          ease: 'power2.out',
          opacity: 1,
          scale: scaleFactor,
          filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 1.6 },
        {
          duration: 0.65,
          ease: 'power2.out',
          scale: 1
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.5,
          ease: 'power2.inOut',
          opacity: 0,
          scale: 0.3
        },
        0.5
      );
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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

function getNewPosition(position: number, offset: number, arr: ImageItem[]) {
  const realOffset = Math.abs(offset) % arr.length;
  if (position - realOffset >= 0) {
    return position - realOffset;
  } else {
    return arr.length - (realOffset - position);
  }
}

class ImageTrailVariant7 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;
  private visibleImagesCount: number;
  private visibleImagesTotal: number;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLDivElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 55;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.visibleImagesCount = 0;
    this.visibleImagesTotal = 8;
    this.visibleImagesTotal = Math.min(this.visibleImagesTotal, this.imagesTotal - 1);

    let lastRect: DOMRect | null = null;
    let lastRectTime = 0;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (!lastRect || now - lastRectTime > 300) {
        lastRect = container.getBoundingClientRect();
        lastRectTime = now;
      }
      this.mousePos = getLocalPointerPos(ev, lastRect);
      if (this.rafId === null && !this.destroyed) {
        this.rafId = requestAnimationFrame(() => this.render());
      }
    };
    container.addEventListener('mousemove', handlePointerMove, { passive: true } as any);
    container.addEventListener('touchmove', handlePointerMove, { passive: true } as any);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      lastRect = container.getBoundingClientRect();
      lastRectTime = performance.now();
      this.mousePos = getLocalPointerPos(ev, lastRect);
      this.cacheMousePos = { ...this.mousePos };
      if (this.rafId === null && !this.destroyed) {
        this.rafId = requestAnimationFrame(() => this.render());
      }
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener, { passive: true } as any);
    container.addEventListener('touchmove', initRender as EventListener, { passive: true } as any);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    // Smooth lerp factor for silky fluid trailing
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;

    const isMoving =
      Math.abs(this.mousePos.x - this.cacheMousePos.x) > 0.2 ||
      Math.abs(this.mousePos.y - this.cacheMousePos.y) > 0.2 ||
      !this.isIdle;

    if (isMoving) {
      this.rafId = requestAnimationFrame(() => this.render());
    } else {
      this.rafId = null;
    }
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;

    gsap.killTweensOf(img.DOM.el);
    if (img.DOM.inner) gsap.killTweensOf(img.DOM.inner);

    const targetScale = gsap.utils.random(0.85, 1.25);
    const targetRotation = gsap.utils.random(-4, 4);

    const tl = gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .fromTo(
        img.DOM.el,
        {
          scale: targetScale * 0.7,
          rotationZ: targetRotation * 0.5,
          opacity: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
        },
        {
          duration: 0.65,
          ease: 'power2.out',
          opacity: 1,
          scale: targetScale,
          rotationZ: targetRotation,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2
        },
        0
      );

    if (img.DOM.inner) {
      tl.fromTo(
        img.DOM.inner,
        { scale: 1.18 },
        {
          duration: 0.65,
          ease: 'power2.out',
          scale: 1
        },
        0
      );
    }

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(this.imgPosition, this.visibleImagesTotal, this.images);
      const oldImg = this.images[lastInQueue];
      gsap.to(oldImg.DOM.el, {
        duration: 0.7,
        ease: 'power2.out',
        opacity: 0,
        scale: 0.85,
        onComplete: () => {
          if (this.activeImagesCount === 0) {
            this.isIdle = true;
          }
        }
      });
    }
  }

  public destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
    this.images.forEach(img => {
      gsap.killTweensOf(img.DOM.el);
      if (img.DOM.inner) gsap.killTweensOf(img.DOM.inner);
      img.destroy();
    });
  }

  private onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  private onImageDeactivated() {
    this.activeImagesCount--;
  }
}

class ImageTrailVariant8 {
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
  private handlePointerMove!: (ev: MouseEvent | TouchEvent) => void;
  private initRender!: (ev: MouseEvent | TouchEvent) => void;
  private rotation: { x: number; y: number };
  private cachedRotation: { x: number; y: number };
  private zValue: number;
  private cachedZValue: number;

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
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.cachedRotation = { x: 0, y: 0 };
    this.zValue = 0;
    this.cachedZValue = 0;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
    this.handlePointerMove = handlePointerMove;
    this.initRender = initRender;
  }

  private render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12);

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
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 24;
    this.rotation.y = (relX / centerX) * 24;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = distanceFromCenter / maxDistance;
    this.zValue = proportion * 900 - 450;
    this.cachedZValue = this.zValue;
    const normalizedZ = (this.zValue + 450) / 900;
    const brightness = 0.5 + normalizedZ * 1.5;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated()
      })
      .set(this.DOM.el, { perspective: 1000 }, 0)
      .fromTo(
        img.DOM.el,
        {
          opacity: 0,
          z: -100,
          scale: 0.6 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`
        },
        {
          duration: 0.8,
          ease: 'power2.out',
          opacity: 1,
          scale: 1 + this.zValue / 1000,
          z: 0,
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y
        },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.5,
          ease: 'power2.inOut',
          opacity: 0,
          z: -500
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
    this.container.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.container.removeEventListener('mousemove', this.initRender as EventListener);
    this.container.removeEventListener('touchmove', this.initRender as EventListener);
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
  | typeof ImageTrailVariant2
  | typeof ImageTrailVariant3
  | typeof ImageTrailVariant4
  | typeof ImageTrailVariant5
  | typeof ImageTrailVariant6
  | typeof ImageTrailVariant7
  | typeof ImageTrailVariant8;

const variantMap: Record<number, ImageTrailConstructor> = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8
};

interface ImageTrailProps {
  items?: string[];
  variant?: number | string;
}

export default function ImageTrail({ items = [], variant = 7 }: ImageTrailProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const vKey = typeof variant === 'string' ? parseInt(variant, 10) : Number(variant);
    const Cls = variantMap[vKey] || variantMap[7] || variantMap[1];
    const instance = new Cls(containerRef.current);

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, items]);

  return (
    <div
      className="w-full h-full relative z-[100] rounded-lg bg-transparent overflow-visible"
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className="content__img w-[190px] sm:w-[220px] aspect-[1.1] rounded-[18px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter,opacity] pointer-events-none"
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
