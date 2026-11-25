'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactElement
} from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface PrismCarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface PrismCarouselHandle {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
}

export interface PrismCarouselProps {
  items?: PrismCarouselItem[];
  startIndex?: number;
  aspect?: number;
  size?: number;
  neighborScale?: number;
  gap?: number;
  radius?: number;
  saturation?: number;
  dim?: number;
  sweep?: number;
  sweepDuration?: number;
  dispersion?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  captions?: boolean;
  controls?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  pauseOnHover?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  onIndexChange?: (index: number) => void;
  onSelect?: (item: PrismCarouselItem, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

export const PRISM_CAROUSEL_PRESETS = {
  prism: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0, dim: 0.2, sweep: 1, sweepDuration: 1.1, dispersion: 1 },
  vivid: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 1, dim: 0.15, sweep: 0.7, sweepDuration: 1, dispersion: 1 },
  cinema: { aspect: 2.1, size: 0.56, neighborScale: 0.7, saturation: 0, dim: 0.35, sweep: 1, sweepDuration: 1.3, dispersion: 0.8 },
  portrait: { aspect: 0.75, size: 0.74, neighborScale: 0.74, saturation: 0, dim: 0.2, sweep: 1, sweepDuration: 1.1, dispersion: 1 },
  quiet: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0.25, dim: 0.25, sweep: 0, sweepDuration: 1.1, dispersion: 0 },
  spectrum: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0, dim: 0.2, sweep: 1.7, sweepDuration: 1.5, dispersion: 2 }
} as const;

const TWO_PI = 2 * Math.PI;

const DEFAULT_ITEMS: PrismCarouselItem[] = [
  {
    src: '/demo-media/architecture-courtyard.webp',
    alt: 'Two round pines beside a white stone wall in soft, hazy light',
    title: 'Courtyard',
    subtitle: 'Two pines, one wall'
  },
  {
    src: '/demo-media/architecture-pool.webp',
    alt: 'Figure in black crossing a shallow pool before a tall cream wall',
    title: 'Reflecting pool',
    subtitle: 'A figure crossing still water'
  },
  {
    src: '/demo-media/architecture-stair.webp',
    alt: 'Cream stair rising along a sunlit courtyard wall under a slice of blue sky',
    title: 'Sunlit stair',
    subtitle: 'Light climbing a quiet wall'
  },
  {
    src: '/demo-media/architecture-monolith.webp',
    alt: 'Stepped board-formed concrete towers against a pale teal sky',
    title: 'Monolith',
    subtitle: 'Concrete in rhythm'
  },
  {
    src: '/demo-media/architecture-ribbons.webp',
    alt: 'White facade ribbons flowing in parallel waves',
    title: 'Ribbons',
    subtitle: 'One continuous curve'
  },
  {
    src: '/demo-media/architecture-wave.webp',
    alt: 'Navy and white striped towers curving together around a patch of blue sky',
    title: 'Wave',
    subtitle: 'Two towers leaning in'
  },
  {
    src: '/demo-media/architecture-twist.webp',
    alt: 'White balconies twisting in an S-curve down a tiled facade against pale sky',
    title: 'Twist',
    subtitle: 'A facade in motion'
  },
  {
    src: '/demo-media/architecture-whitewash.webp',
    alt: 'Whitewashed plaster block against a soft cloudy sky',
    title: 'Whitewash',
    subtitle: 'Plaster against the sky'
  }
];

const clamp = (val: number, min: number, max: number): number => Math.min(max, Math.max(min, val));

const smoothstep = (val: number): number => {
  const t = clamp(val, 0, 1);
  return t * t * (3 - 2 * t);
};

const softSign = (val: number): number => {
  return val >= 1 ? 0.5 : val <= -1 ? -0.5 : val - (val * Math.abs(val)) / 2;
};

const softKernel = (val: number): number => {
  return (softSign(val + 0.35) - softSign(val - 0.35)) / 0.7;
};

const subscribeReducedMotion = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const integrateSpring = (
  pos: number,
  vel: number,
  target: number,
  dt: number,
  period: number,
  damping = 1
): [number, number] => {
  const omega = TWO_PI / Math.max(period, 0.02);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const subDt = dt / steps;
  let v = vel;
  let x = pos;
  for (let i = 0; i < steps; i++) {
    v += (omega * omega * (target - x) - 2 * damping * omega * v) * subDt;
    x += v * subDt;
  }
  return [x, v];
};

const SR_ONLY_STYLE: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const CANVAS_WRAPPER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  touchAction: 'pan-y',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none'
};

const BTN_BG_DEFAULT = 'rgba(3, 8, 20, 0.75)';
const BTN_BG_HOVER = 'rgba(197, 163, 99, 0.25)';

const BTN_STYLE: CSSProperties = {
  width: 36,
  height: 36,
  display: 'grid',
  placeItems: 'center',
  padding: 0,
  borderRadius: 999,
  border: '1px solid rgba(197, 163, 99, 0.45)',
  background: BTN_BG_DEFAULT,
  color: '#c5a363',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  cursor: 'pointer',
  transition: 'all 200ms ease',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
};

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform vec2 uSize;
uniform float uRadius;
uniform float uLoaded;
uniform float uBase;
uniform float uReveal;
uniform float uDirection;
uniform float uBand;
uniform float uSweep;
uniform float uSpreadPx;
uniform float uBright;
uniform float uAlpha;
varying vec2 vUv;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 spectrum(float t) {
  return clamp(0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67))), 0.0, 1.0);
}

vec3 sampleImage(vec2 uv) {
  float spread = uSpreadPx / max(uSize.x, uSize.y * uImageAspect);
  if (abs(spread) < 0.0004) return texture2D(uImage, uv).rgb;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec3 total = vec3(0.0);
  vec3 weights = vec3(0.0);
  for (int k = 0; k < 9; k++) {
    float t = (float(k) + jitter) / 9.0;
    vec3 w = spectrum(t * 0.82);
    total += texture2D(uImage, uv + vec2((t - 0.5) * spread, 0.0)).rgb * w;
    weights += w;
  }
  return total / weights;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = roundBox(p, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float aa = max(fwidth(d), 1e-3) * 0.75;
  float mask = 1.0 - smoothstep(-aa, aa, d);
  if (mask * uAlpha < 0.002) discard;

  float cardAspect = uSize.x / max(uSize.y, 1.0);
  vec2 uv = vUv - 0.5;
  if (cardAspect > uImageAspect) {
    uv.y *= uImageAspect / cardAspect;
  } else {
    uv.x *= cardAspect / uImageAspect;
  }
  uv += 0.5;

  vec3 full = sampleImage(uv);
  float luma = dot(full, vec3(0.2126, 0.7152, 0.0722));
  vec3 gray = vec3(luma);

  float along = uDirection > 0.0 ? vUv.x : 1.0 - vUv.x;
  float front = uReveal;
  float behind = uReveal < -0.5 ? 0.0 : 1.0 - smoothstep(front - uBand, front, along);
  float amount = max(uBase, behind);
  vec3 color = mix(gray, full, amount);
  if (uReveal > -0.5) {
    float mid = front - uBand * 0.5;
    float bandShape = exp(-pow((along - mid) / (uBand * 0.42), 2.0));
    vec3 light = spectrum(clamp((along - front + uBand) / uBand, 0.0, 1.0) * 0.82);
    color += light * bandShape * uSweep * 0.28 * (1.0 - uBase);
  }
  color *= uBright;

  vec3 placeholder = vec3(0.5);
  float loaded = clamp(uLoaded, 0.0, 1.0);
  vec3 rgb = mix(placeholder, color, loaded);
  float alpha = mask * uAlpha * mix(0.12, 1.0, loaded);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

interface TextureRecord {
  image: HTMLImageElement;
  texture: THREE.Texture;
  aspect: number;
  ready: boolean;
  fade: number;
}

interface MeshSlot {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
}

interface SaturationState {
  value: number;
  velocity: number;
}

interface PointerSample {
  t: number;
  d: number;
}

interface PointerState {
  id: number;
  x: number;
  lastX: number;
  moved: boolean;
  samples: PointerSample[];
}

export const PrismCarousel = forwardRef<PrismCarouselHandle, PrismCarouselProps>(function PrismCarousel(
  {
    items = DEFAULT_ITEMS,
    startIndex = 0,
    aspect = 1.5,
    size = 0.62,
    neighborScale = 0.66,
    gap = 14,
    radius = 18,
    saturation = 0,
    dim = 0.2,
    sweep = 1,
    sweepDuration = 1.1,
    dispersion = 1,
    autoplay = true,
    interval = 4.5,
    loop = true,
    captions = true,
    controls = true,
    draggable = true,
    wheel = true,
    pauseOnHover = true,
    backgroundColor = 'transparent',
    paused = false,
    dpr = 2,
    ariaLabel = 'Prism carousel. Scroll, drag or use the arrow keys to move between images.',
    onIndexChange,
    onSelect,
    className,
    style
  },
  forwardedRef
): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<{ sync: () => void; step: (dir: number) => void; goTo: (idx: number) => void; destroy: () => void } | null>(null);

  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);

  const carouselItems = items.length ? items : DEFAULT_ITEMS;
  const itemsRef = useRef(carouselItems);

  const [initialIndex] = useState(() => clamp(Math.round(startIndex), 0, Math.max(carouselItems.length - 1, 0)));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [webglFailed, setWebglFailed] = useState(false);

  const settings = {
    items: carouselItems,
    aspect,
    size,
    neighborScale,
    gap,
    radius,
    saturation,
    dim,
    sweep,
    sweepDuration,
    dispersion,
    autoplay,
    interval,
    loop,
    captions,
    controls,
    draggable,
    wheel,
    pauseOnHover,
    backgroundColor,
    paused,
    dpr,
    reduced
  };

  const settingsRef = useRef(settings);
  const callbacksRef = useRef({ onIndexChange, onSelect });

  useEffect(() => {
    settingsRef.current = settings;
    itemsRef.current = carouselItems;
    callbacksRef.current = { onIndexChange, onSelect };
    engineRef.current?.sync();
  });

  useEffect(() => {
    const rootEl = rootRef.current;
    const mountEl = mountRef.current;
    if (!rootEl || !mountEl) return;

    const createEngine = (
      container: HTMLDivElement,
      stage: HTMLDivElement,
      sRef: typeof settingsRef,
      iRef: typeof itemsRef,
      startIdx: number,
      events: { onActive: (idx: number) => void; onSelect: (idx: number) => void }
    ) => {
      const canvas = container.ownerDocument.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          premultipliedAlpha: true,
          powerPreference: 'high-performance'
        });
      } catch {
        return null;
      }

      stage.appendChild(canvas);
      renderer.setClearColor(0, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
      const quadGeo = new THREE.PlaneGeometry(1, 1);

      const placeholderData = new Uint8Array([128, 128, 128, 255]);
      const defaultTexture = new THREE.DataTexture(placeholderData, 1, 1);
      defaultTexture.needsUpdate = true;

      const slots: MeshSlot[] = Array.from({ length: 11 }, () => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uImage: { value: defaultTexture },
            uImageAspect: { value: 1.5 },
            uSize: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: 16 },
            uLoaded: { value: 0 },
            uBase: { value: 0 },
            uReveal: { value: -1 },
            uDirection: { value: 1 },
            uBand: { value: 0.24 },
            uSweep: { value: 1 },
            uSpreadPx: { value: 0 },
            uBright: { value: 1 },
            uAlpha: { value: 1 }
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          premultipliedAlpha: true,
          depthTest: false,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(quadGeo, mat);
        mesh.frustumCulled = false;
        mesh.visible = false;
        scene.add(mesh);

        return {
          mesh,
          index: 0,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          visible: false
        };
      });

      let textureRecords: TextureRecord[] = [];
      let lastSrcList = '';
      let width = 1;
      let height = 1;
      let pixelRatio = 1;
      let currentPos = startIdx;
      let velocity = 0;
      let targetPos = startIdx;
      let isDragging = false;
      let isWheelScrolling = false;
      let wheelTime = 0;
      let lastIntPos = Math.round(startIdx);
      let lastReportedIndex = NaN;
      let sweepTargetIndex = lastIntPos;
      let lastSweepTime = -10;
      let sweepDirection = 1;
      let hoveredIndex: number | null = null;
      let isHovered = false;
      let elapsedTime = 0;
      let autoplayAccum = 0;
      let rafId = 0;
      let timerId = 0;
      let lastFrameTime = 0;
      let isVisible = false;
      let isDestroyed = false;
      let isContextLost = false;
      let dragMoved = false;

      const saturationMap = new Map<number, SaturationState>();
      const layoutX = new Float64Array(12);
      const layoutW = new Float64Array(12);
      let stepDistance = 1;
      let activeCardH = 1;
      let neighborCardH = 1;
      let layoutKey = '';
      let lastSampleTime = 0;
      let pointerState: PointerState | null = null;

      const itemCount = () => Math.max(iRef.current.length, 1);
      const wrapIndex = (idx: number) => ((idx % itemCount()) + itemCount()) % itemCount();

      const syncTextures = () => {
        const curItems = iRef.current;
        const srcList = curItems.map(item => item.src).join('\0');
        if (srcList === lastSrcList) return;
        lastSrcList = srcList;

        textureRecords.forEach(rec => {
          rec.image.onload = null;
          rec.texture.dispose();
        });

        textureRecords = curItems.map(item => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';

          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.NoColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const record: TextureRecord = {
            image: img,
            texture: tex,
            aspect: 1.5,
            ready: false,
            fade: 0
          };

          img.onload = () => {
            if (isDestroyed) return;
            record.aspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
            record.ready = true;
            tex.needsUpdate = true;
            requestFrame();
          };

          img.src = item.src;
          return record;
        });
      };

      const resize = (): boolean => {
        const cfg = sRef.current;
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, Math.max(cfg.dpr, 0.5));
        const newW = Math.max(1, Math.round(rect.width));
        const newH = Math.max(1, Math.round(rect.height));

        if (newW !== width || newH !== height || dpr !== pixelRatio) {
          width = newW;
          height = newH;
          pixelRatio = dpr;
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(width, height, false);
          camera.left = -width / 2;
          camera.right = width / 2;
          camera.top = height / 2;
          camera.bottom = -height / 2;
          camera.updateProjectionMatrix();
          return true;
        }
        return false;
      };

      const computeLayoutMetrics = () => {
        const cfg = sRef.current;
        const aspectVal = clamp(cfg.aspect, 0.5, 3);
        const captionSpace = 46 * (cfg.captions ? 1 : 0) + 46 * (cfg.controls ? 1 : 0);
        const availH = Math.max(height - captionSpace, 0.5 * height);
        const responsiveFactor = 0.62 + 0.22 * smoothstep((900 - width) / 500);
        const activeH = Math.min(availH * clamp(cfg.size, 0.2, 0.98), (width * responsiveFactor) / aspectVal);
        const neighborH = activeH * clamp(cfg.neighborScale, 0.3, 1);

        return {
          activeH,
          neighborH,
          widths: [activeH * aspectVal, 0.72 * neighborH, 0.24 * neighborH, 0.08 * neighborH, 0],
          gap: Math.max(cfg.gap, 0),
          lift: (height - availH) / 2
        };
      };

      const updateLayoutTables = () => {
        const { activeH, neighborH, widths, gap: curGap } = computeLayoutMetrics();
        activeCardH = activeH;
        neighborCardH = neighborH;

        const key = `${activeH}|${neighborH}|${widths.join(',')}|${curGap}`;
        if (key !== layoutKey) {
          layoutKey = key;
          for (let i = 0; i <= 11; i++) layoutW[i] = widths[i] ?? 0;

          for (let pass = 0; pass < 60; pass++) {
            for (let i = 0; i <= 10; i++) {
              const target = widths[i] ?? 0;
              const neighbor = i === 0 ? layoutW[1] : layoutW[i - 1];
              layoutW[i] = Math.max(0, (target - 0.0875 * (neighbor + layoutW[i + 1])) / 0.825);
            }
          }

          layoutW[11] = 0;
          layoutX[0] = 0;
          for (let i = 1; i <= 11; i++) {
            layoutX[i] = layoutX[i - 1] + (layoutW[i - 1] + layoutW[i]) / 2 + curGap;
          }
          stepDistance = layoutX[1];
        }
      };

      const evaluateSpline = (table: Float64Array, offset: number, signed: boolean): number => {
        let sum = 0;
        const start = Math.ceil(offset - 1 - 0.35);
        const end = Math.floor(offset + 1 + 0.35);

        for (let i = start; i <= end; i++) {
          const weight = softKernel(offset - i);
          if (weight <= 0) continue;
          const val = table[Math.min(Math.abs(i), 11)];
          sum += weight * (signed && i < 0 ? -val : val);
        }
        return sum;
      };

      const computeCardPose = (offset: number) => {
        const t = smoothstep(Math.abs(offset));
        return {
          x: evaluateSpline(layoutX, offset, true),
          w: Math.max(evaluateSpline(layoutW, offset, false), 0),
          h: activeCardH + (neighborCardH - activeCardH) * t
        };
      };

      const getStepDistance = (): number => {
        updateLayoutTables();
        return stepDistance;
      };

      const clampTarget = (val: number): number => {
        return sRef.current.loop ? val : clamp(val, 0, itemCount() - 1);
      };

      const step = (delta: number) => {
        targetPos = clampTarget(Math.round(targetPos) + delta);
        autoplayAccum = 0;
        requestFrame();
      };

      const requestFrame = () => {
        if (isDestroyed || isContextLost || !isVisible || rafId) return;
        if (timerId) {
          window.clearTimeout(timerId);
          timerId = 0;
        }
        rafId = requestAnimationFrame(animate);
      };

      const getSaturationRecord = (index: number): SaturationState => {
        let rec = saturationMap.get(index);
        if (!rec) {
          rec = { value: sRef.current.saturation, velocity: 0 };
          saturationMap.set(index, rec);
        }
        return rec;
      };

      function animate(time: number) {
        rafId = 0;
        if (isDestroyed || isContextLost) return;

        const cfg = sRef.current;
        const dt = lastFrameTime ? Math.min(Math.max((time - lastFrameTime) / 1000, 0), 0.05) : 1 / 60;
        lastFrameTime = time;
        elapsedTime += dt;

        const isReduced = cfg.reduced;
        let needsNextFrame = false;
        const isPausedByHover = cfg.pauseOnHover && isHovered;

        if (cfg.autoplay && !cfg.paused && !isReduced && !isPausedByHover && !pointerState && itemCount() > 1) {
          autoplayAccum += dt;
          if (autoplayAccum >= Math.max(cfg.interval, 1)) {
            autoplayAccum = 0;
            targetPos = !cfg.loop && Math.round(targetPos) >= itemCount() - 1 ? 0 : clampTarget(Math.round(targetPos) + 1);
          }
        }

        if (isWheelScrolling && !pointerState && time - wheelTime > 140) {
          isWheelScrolling = false;
          targetPos = clampTarget(Math.round(targetPos));
        }

        if (isDragging) {
          velocity *= Math.exp(-6 * dt);
          needsNextFrame = true;
        } else {
          [currentPos, velocity] = integrateSpring(currentPos, velocity, targetPos, dt, isReduced ? 0.05 : 0.62, 0.92);
          if (Math.abs(currentPos - targetPos) < 1e-4 && Math.abs(velocity) < 1e-4) {
            currentPos = targetPos;
            velocity = 0;
          } else {
            needsNextFrame = true;
          }
        }

        const centerInt = Math.round(currentPos);
        if (centerInt !== lastIntPos) {
          sweepDirection = centerInt > lastIntPos ? 1 : -1;
          const prevRec = getSaturationRecord(lastIntPos);
          const sweepProg = clamp((elapsedTime - lastSweepTime) / Math.max(cfg.sweepDuration, 0.1), 0, 1);
          prevRec.value = Math.max(prevRec.value, sweepProg);
          sweepTargetIndex = lastIntPos = centerInt;
          lastSweepTime = elapsedTime;
        }

        const activeWrapped = wrapIndex(lastIntPos);
        if (activeWrapped !== lastReportedIndex) {
          lastReportedIndex = activeWrapped;
          events.onActive(activeWrapped);
        }

        const { activeH, lift } = computeLayoutMetrics();
        updateLayoutTables();

        const curInt = Math.round(currentPos);
        const duration = Math.max(cfg.sweepDuration, 0.1);
        const sweepFactor = isReduced ? 2 : (elapsedTime - lastSweepTime) / duration;
        if (sweepFactor < 1.4) needsNextFrame = true;

        const dispSpread = Math.abs(velocity) * getStepDistance();
        const dispersionPx = isReduced
          ? 0
          : clamp(0.006 * dispSpread * Math.max(cfg.dispersion, 0), 0, 22) * Math.sign(velocity);

        for (let i = 0; i < 11; i++) {
          const slot = slots[i];
          const slotIndex = curInt - 5 + i;
          const offset = slotIndex - currentPos;
          const pose = computeCardPose(offset);
          const w = pose.w;
          const h = pose.h;
          const isValidSlot = cfg.loop || (slotIndex >= 0 && slotIndex < itemCount());
          const alphaFade = smoothstep((3.6 - Math.abs(offset)) / 0.8);

          slot.visible = isValidSlot && w > 0.5 && alphaFade > 0.002 && textureRecords.length > 0;
          slot.mesh.visible = slot.visible;
          slot.index = slotIndex;

          if (!slot.visible) continue;

          slot.x = pose.x;
          slot.y = lift;
          slot.w = w;
          slot.h = h;
          slot.mesh.position.set(pose.x, lift, 0);
          slot.mesh.scale.set(w, h, 1);

          const texRecord = textureRecords[wrapIndex(slotIndex)];
          const uniforms = slot.mesh.material.uniforms;

          if (texRecord) {
            uniforms.uImage.value = texRecord.texture;
            uniforms.uImageAspect.value = texRecord.aspect;
            if (texRecord.ready && texRecord.fade < 1) {
              texRecord.fade = isReduced ? 1 : Math.min(1, texRecord.fade + dt / 0.45);
              needsNextFrame = true;
            }
            uniforms.uLoaded.value = texRecord.ready ? texRecord.fade : 0;
          }

          uniforms.uSize.value.set(w, h);
          uniforms.uRadius.value = clamp(cfg.radius, 0, 200) * (h / activeH);
          uniforms.uAlpha.value = alphaFade;
          uniforms.uBright.value = 1 - clamp(cfg.dim, 0, 1) * smoothstep(Math.abs(offset));
          uniforms.uSpreadPx.value = dispersionPx * (1 - smoothstep((Math.abs(offset) - 0.5) / 1.5));
          uniforms.uSweep.value = clamp(cfg.sweep, 0, 3);
          uniforms.uBand.value = 0.26;
          uniforms.uDirection.value = sweepDirection;

          const satRecord = getSaturationRecord(slotIndex);
          const hoverBonus = 0.6 * (hoveredIndex === slotIndex && slotIndex !== lastIntPos ? 1 : 0);
          const baseSat = clamp(cfg.saturation, 0, 1);

          if (slotIndex === sweepTargetIndex && slotIndex === lastIntPos) {
            uniforms.uBase.value = Math.max(Math.min(satRecord.value, 1), baseSat);
            if (sweepFactor >= 1.26 || cfg.sweep <= 0) {
              satRecord.value = 1;
              satRecord.velocity = 0;
              uniforms.uReveal.value = -1;
              uniforms.uBase.value = 1;
            } else {
              uniforms.uReveal.value = 1.26 * sweepFactor;
            }
          } else {
            const targetSat = Math.max(baseSat, hoverBonus);
            [satRecord.value, satRecord.velocity] = integrateSpring(
              satRecord.value,
              satRecord.velocity,
              targetSat,
              dt,
              isReduced ? 0.05 : hoverBonus > 0 ? 0.45 : 0.7
            );
            if (Math.abs(satRecord.value - targetSat) > 0.001) needsNextFrame = true;
            uniforms.uBase.value = clamp(satRecord.value, 0, 1);
            uniforms.uReveal.value = -1;
          }
        }

        for (const k of Array.from(saturationMap.keys())) {
          if (Math.abs(k - currentPos) > 8) saturationMap.delete(k);
        }

        container.style.setProperty('--prism-caption-y', `${height / 2 - lift + activeH / 2 + 16}px`);
        renderer.render(scene, camera);

        if (needsNextFrame || isDragging || pointerState || isHovered) {
          requestFrame();
        } else if (cfg.autoplay && !cfg.paused && !isReduced && itemCount() > 1) {
          const remain = Math.max(cfg.interval - autoplayAccum, 0);
          timerId = window.setTimeout(() => {
            timerId = 0;
            lastFrameTime = 0;
            autoplayAccum = cfg.interval;
            requestFrame();
          }, remain * 1000);
        }
      }

      const hitTest = (clientX: number, clientY: number): number | null => {
        const rect = container.getBoundingClientRect();
        const localX = clientX - rect.left - width / 2;
        const localY = -(clientY - rect.top - height / 2);
        let bestIndex: number | null = null;
        let bestDist = Infinity;

        for (const slot of slots) {
          if (slot.visible && slot.w >= 6 && Math.abs(localX - slot.x) <= slot.w / 2 && Math.abs(localY - slot.y) <= slot.h / 2) {
            const dist = Math.abs(slot.index - currentPos);
            if (dist < bestDist) {
              bestDist = dist;
              bestIndex = slot.index;
            }
          }
        }
        return bestIndex;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') {
          isHovered = true;
          const hit = hitTest(e.clientX, e.clientY);
          if (hit !== hoveredIndex) {
            hoveredIndex = hit;
            container.style.cursor = hit !== null ? 'pointer' : sRef.current.draggable ? 'grab' : '';
          }
        }

        if (pointerState && pointerState.id === e.pointerId) {
          const dx = e.clientX - pointerState.lastX;
          if (!pointerState.moved && Math.abs(e.clientX - pointerState.x) > 6) {
            pointerState.moved = true;
            isDragging = true;
            hoveredIndex = null;
            container.style.cursor = 'grabbing';
            try {
              stage.setPointerCapture(e.pointerId);
            } catch {}
          }

          if (pointerState.moved) {
            const stepDist = getStepDistance();
            const deltaPos = -dx / stepDist;
            let nextPos = currentPos + deltaPos;

            if (!sRef.current.loop) {
              const overscroll = nextPos < 0 ? nextPos : nextPos > itemCount() - 1 ? nextPos - (itemCount() - 1) : 0;
              if (overscroll !== 0) nextPos = currentPos + 0.35 * deltaPos;
            }

            const now = performance.now();
            const dtSec = Math.max((now - lastSampleTime) / 1000, 1 / 240);
            lastSampleTime = now;
            velocity += ((nextPos - currentPos) / dtSec - velocity) * 0.5;

            pointerState.samples.push({ t: now, d: nextPos - currentPos });
            while (pointerState.samples.length && now - pointerState.samples[0].t > 100) {
              pointerState.samples.shift();
            }
            currentPos = nextPos;
          }
          pointerState.lastX = e.clientX;
        }
        requestFrame();
      };

      const onPointerDown = (e: PointerEvent) => {
        if (!sRef.current.draggable || !e.isPrimary || e.button > 0) return;
        pointerState = {
          id: e.pointerId,
          x: e.clientX,
          lastX: e.clientX,
          moved: false,
          samples: []
        };
        dragMoved = false;
        velocity = 0;
        requestFrame();
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!pointerState || pointerState.id !== e.pointerId) return;
        const curPointer = pointerState;
        pointerState = null;

        try {
          if (stage.hasPointerCapture(e.pointerId)) {
            stage.releasePointerCapture(e.pointerId);
          }
        } catch {}

        if (curPointer.moved) {
          dragMoved = true;
          isDragging = false;
          const now = performance.now();
          const recentSamples = curPointer.samples.filter(s => now - s.t < 100);
          let vel = 0;
          if (recentSamples.length > 1) {
            const duration = Math.max((recentSamples[recentSamples.length - 1].t - recentSamples[0].t) / 1000, 1 / 60);
            vel = recentSamples.reduce((acc, s) => acc + s.d, 0) / duration;
          }

          velocity = clamp(vel, -12, 12);
          targetPos = clampTarget(Math.round(currentPos + 0.18 * clamp(vel, -12, 12)));
          autoplayAccum = 0;
          container.style.cursor = '';
        }
        requestFrame();
      };

      const onClick = (e: MouseEvent) => {
        if (dragMoved) {
          dragMoved = false;
          return;
        }
        const hit = hitTest(e.clientX, e.clientY);
        if (hit !== null) {
          if (hit === Math.round(targetPos)) {
            events.onSelect(wrapIndex(hit));
          } else {
            targetPos = clampTarget(hit);
            autoplayAccum = 0;
            requestFrame();
          }
        }
      };

      const onPointerLeave = (e: PointerEvent) => {
        if (!pointerState || pointerState.id !== e.pointerId) {
          isHovered = false;
          hoveredIndex = null;
          container.style.cursor = '';
          requestFrame();
        }
      };

      const onWheel = (e: WheelEvent) => {
        if (!sRef.current.wheel) return;
        e.preventDefault();
        const multiplier = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
        const delta = clamp((e.deltaY + e.deltaX) * multiplier, -240, 240);
        targetPos = clampTarget((isWheelScrolling ? targetPos : Math.round(targetPos)) + delta / 100);
        isWheelScrolling = true;
        wheelTime = performance.now();
        autoplayAccum = 0;
        requestFrame();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          step(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          step(-1);
        } else if (e.key === 'Enter' && e.target === container) {
          e.preventDefault();
          events.onSelect(wrapIndex(Math.round(targetPos)));
        }
      };

      stage.addEventListener('pointerdown', onPointerDown);
      stage.addEventListener('pointermove', onPointerMove);
      stage.addEventListener('pointerup', onPointerUp);
      stage.addEventListener('pointercancel', onPointerUp);
      stage.addEventListener('pointerleave', onPointerLeave);
      stage.addEventListener('click', onClick);
      stage.addEventListener('wheel', onWheel, { passive: false });
      container.addEventListener('keydown', onKeyDown);

      const resizeObserver = new ResizeObserver(() => {
        if (resize()) requestFrame();
      });
      resizeObserver.observe(container);

      const intersectionObserver =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                  lastFrameTime = 0;
                  requestFrame();
                } else {
                  if (rafId) cancelAnimationFrame(rafId);
                  rafId = 0;
                  if (timerId) window.clearTimeout(timerId);
                  timerId = 0;
                }
              },
              { rootMargin: '80px' }
            );

      if (intersectionObserver) {
        intersectionObserver.observe(container);
      } else {
        isVisible = true;
      }

      const onContextLost = (e: Event) => {
        e.preventDefault();
        isContextLost = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      const onContextRestored = () => {
        isContextLost = false;
        lastSrcList = '';
        syncTextures();
        requestFrame();
      };

      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);

      resize();
      syncTextures();
      lastSweepTime = sRef.current.reduced ? -10 : 0.35;
      requestFrame();

      return {
        sync: () => {
          resize();
          syncTextures();
          if (!sRef.current.loop) {
            targetPos = clampTarget(targetPos);
          }
          lastFrameTime = 0;
          requestFrame();
        },
        step,
        goTo: (idx: number) => {
          if (sRef.current.loop) {
            const count = itemCount();
            const curRound = Math.round(targetPos);
            const wrappedDelta = (((idx - wrapIndex(curRound)) % count) + count + Math.floor(count / 2)) % count - Math.floor(count / 2);
            targetPos = curRound + wrappedDelta;
          } else {
            targetPos = clamp(idx, 0, itemCount() - 1);
          }
          autoplayAccum = 0;
          requestFrame();
        },
        destroy: () => {
          isDestroyed = true;
          if (rafId) cancelAnimationFrame(rafId);
          if (timerId) window.clearTimeout(timerId);
          intersectionObserver?.disconnect();
          resizeObserver.disconnect();
          stage.removeEventListener('pointerdown', onPointerDown);
          stage.removeEventListener('pointermove', onPointerMove);
          stage.removeEventListener('pointerup', onPointerUp);
          stage.removeEventListener('pointercancel', onPointerUp);
          stage.removeEventListener('pointerleave', onPointerLeave);
          stage.removeEventListener('click', onClick);
          stage.removeEventListener('wheel', onWheel);
          container.removeEventListener('keydown', onKeyDown);
          container.style.cursor = '';
          canvas.removeEventListener('webglcontextlost', onContextLost);
          canvas.removeEventListener('webglcontextrestored', onContextRestored);

          textureRecords.forEach(rec => {
            rec.image.onload = null;
            rec.texture.dispose();
          });
          slots.forEach(slot => slot.mesh.material.dispose());
          defaultTexture.dispose();
          quadGeo.dispose();
          renderer.dispose();
          if (!renderer.getContext().isContextLost()) {
            renderer.forceContextLoss();
          }
          canvas.remove();
        }
      };
    };

    const engine = createEngine(rootEl, mountEl, settingsRef, itemsRef, initialIndex, {
      onActive: idx => {
        setActiveIndex(idx);
        callbacksRef.current.onIndexChange?.(idx);
      },
      onSelect: idx => {
        const item = itemsRef.current[idx];
        if (item) {
          callbacksRef.current.onSelect?.(item, idx);
          if (item.href) window.location.assign(item.href);
        }
      }
    });

    if (!engine) {
      const fallbackTimer = requestAnimationFrame(() => setWebglFailed(true));
      return () => cancelAnimationFrame(fallbackTimer);
    }

    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [initialIndex]);

  useEffect(() => {
    const captionEl = captionRef.current;
    if (captionEl && !reduced) {
      captionEl.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }
  }, [activeIndex, reduced]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      next: () => engineRef.current?.step(1),
      previous: () => engineRef.current?.step(-1),
      goTo: (idx: number) => engineRef.current?.goTo(idx)
    }),
    []
  );

  const bgTrim = backgroundColor.trim().toLowerCase();
  const isTransparent = bgTrim === 'transparent' || bgTrim === '';
  const isLightBg =
    !isTransparent &&
    (() => {
      const cleanHex = bgTrim.replace('#', '');
      if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(cleanHex)) return false;
      const fullHex = cleanHex.length === 3 ? cleanHex.replace(/./g, c => c + c) : cleanHex;
      const r = Number.parseInt(fullHex.slice(0, 2), 16);
      const g = Number.parseInt(fullHex.slice(2, 4), 16);
      const b = Number.parseInt(fullHex.slice(4, 6), 16);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
    })();

  const currentItem = carouselItems[activeIndex] ?? carouselItems[0];

  return (
    <div
      ref={rootRef}
      className={cn('relative h-full min-h-[420px] w-full overflow-hidden select-none outline-none', className)}
      style={{
        backgroundColor: isTransparent ? undefined : backgroundColor,
        color: isTransparent ? 'currentColor' : isLightBg ? '#0a0a0a' : '#fafafa',
        ...style
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div ref={mountRef} style={CANVAS_WRAPPER_STYLE} />

      {webglFailed && currentItem ? (
        <div style={{ position: 'absolute', inset: '12%', display: 'grid', placeItems: 'center' }}>
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: radius }}
          />
        </div>
      ) : null}

      <ul style={SR_ONLY_STYLE}>
        {carouselItems.map((item, idx) => (
          <li key={item.src + idx} aria-current={idx === activeIndex ? 'true' : undefined}>
            {item.title ? `${item.title}: ${item.alt}` : item.alt}
          </li>
        ))}
      </ul>

      {captions || controls ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'var(--prism-caption-bottom, 20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            pointerEvents: 'none'
          }}
        >
          {captions && currentItem ? (
            <div
              ref={captionRef}
              aria-live="polite"
              onClick={() => onSelect?.(currentItem, activeIndex)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                textAlign: 'center',
                pointerEvents: 'auto',
                cursor: onSelect ? 'pointer' : 'default'
              }}
              className="group/caption"
            >
              <span className="font-serif text-lg sm:text-2xl font-light tracking-[0.14em] uppercase text-white drop-shadow-md group-hover/caption:text-[#f3e5c8] transition-colors">
                {currentItem.title ?? currentItem.alt}
              </span>
              {currentItem.subtitle ? (
                <span className="text-xs sm:text-sm text-[#c5a363] tracking-widest uppercase font-light drop-shadow-sm flex items-center gap-1.5">
                  {currentItem.subtitle}
                </span>
              ) : null}
            </div>
          ) : null}

          {controls ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                pointerEvents: 'auto',
                fontSize: 12,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => engineRef.current?.step(-1)}
                onPointerEnter={e => {
                  e.currentTarget.style.background = BTN_BG_HOVER;
                  e.currentTarget.style.borderColor = 'rgba(197, 163, 99, 0.85)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onPointerLeave={e => {
                  e.currentTarget.style.background = BTN_BG_DEFAULT;
                  e.currentTarget.style.borderColor = 'rgba(197, 163, 99, 0.45)';
                  e.currentTarget.style.color = '#c5a363';
                }}
                style={BTN_STYLE}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <span className="text-[11px] uppercase tracking-[0.22em] text-[#d1c6b2]/80 font-mono min-w-[56px] text-center">
                {String(activeIndex + 1).padStart(2, '0')} / {String(carouselItems.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                aria-label="Next image"
                onClick={() => engineRef.current?.step(1)}
                onPointerEnter={e => {
                  e.currentTarget.style.background = BTN_BG_HOVER;
                  e.currentTarget.style.borderColor = 'rgba(197, 163, 99, 0.85)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onPointerLeave={e => {
                  e.currentTarget.style.background = BTN_BG_DEFAULT;
                  e.currentTarget.style.borderColor = 'rgba(197, 163, 99, 0.45)';
                  e.currentTarget.style.color = '#c5a363';
                }}
                style={BTN_STYLE}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

PrismCarousel.displayName = 'PrismCarousel';

export default PrismCarousel;
