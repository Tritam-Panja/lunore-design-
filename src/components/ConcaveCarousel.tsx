import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useSyncExternalStore,
  useImperativeHandle
} from 'react';
import * as THREE from 'three';

export interface ConcaveCarouselItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface ConcaveCarouselHandle {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
}

export type ConcaveCarouselAutoplay = 'drift' | 'step' | 'off';

export interface ConcaveCarouselPreset {
  aspect: number;
  size: number;
  curvature: number;
  distance: number;
  tilt: number;
  gap: number;
  radius: number;
  reflection: number;
  dim: number;
}

export const CONCAVE_CAROUSEL_PRESETS: Record<string, ConcaveCarouselPreset> = {
  rotunda: {
    aspect: 1.25,
    size: 0.46,
    curvature: 0.72,
    distance: 4,
    tilt: 0,
    gap: 16,
    radius: 14,
    reflection: 0.06,
    dim: 0.35
  },
  panorama: {
    aspect: 2,
    size: 0.4,
    curvature: 0.9,
    distance: 3.2,
    tilt: 0,
    gap: 10,
    radius: 10,
    reflection: 0.06,
    dim: 0.3
  },
  gallery: {
    aspect: 0.75,
    size: 0.6,
    curvature: 0.45,
    distance: 5,
    tilt: 0,
    gap: 28,
    radius: 6,
    reflection: 0.04,
    dim: 0.2
  },
  cinema: {
    aspect: 2.39,
    size: 0.36,
    curvature: 0.6,
    distance: 3,
    tilt: 0,
    gap: 6,
    radius: 4,
    reflection: 0.08,
    dim: 0.45
  },
  seamless: {
    aspect: 1.6,
    size: 0.48,
    curvature: 0.85,
    distance: 3.6,
    tilt: 0,
    gap: 0,
    radius: 0,
    reflection: 0.08,
    dim: 0.4
  }
};

export interface ConcaveCarouselProps {
  items?: ConcaveCarouselItem[];
  startIndex?: number;
  aspect?: number;
  size?: number;
  curvature?: number;
  distance?: number;
  tilt?: number;
  gap?: number;
  radius?: number;
  reflection?: number;
  dim?: number;
  autoplay?: ConcaveCarouselAutoplay;
  speed?: number;
  interval?: number;
  snap?: boolean;
  inertia?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  captions?: boolean;
  controls?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  onIndexChange?: (index: number) => void;
  onSelect?: (item: ConcaveCarouselItem, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const RAD_52 = (52 * Math.PI) / 180;
const TWO_PI = 2 * Math.PI;

const DEFAULT_ITEMS: ConcaveCarouselItem[] = [
  { src: '/assets/images/imagetrail1.webp', alt: 'AUREXA Glimpse 1', title: 'The Glimpse I', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail2.webp', alt: 'AUREXA Glimpse 2', title: 'The Glimpse II', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail3.webp', alt: 'AUREXA Glimpse 3', title: 'The Glimpse III', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail4.webp', alt: 'AUREXA Glimpse 4', title: 'The Glimpse IV', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail5.webp', alt: 'AUREXA Glimpse 5', title: 'The Glimpse V', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail6.webp', alt: 'AUREXA Glimpse 6', title: 'The Glimpse VI', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail7.webp', alt: 'AUREXA Glimpse 7', title: 'The Glimpse VII', subtitle: 'Curated Exhibition' },
  { src: '/assets/images/imagetrail8.webp', alt: 'AUREXA Glimpse 8', title: 'The Glimpse VIII', subtitle: 'Curated Exhibition' }
];

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const subscribeReducedMotion = (handler: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
};

const getReducedMotionSnapshot = () =>
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

const parseHexColor = (hex: string): [number, number, number] | null => {
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(clean)) return null;
  const full = clean.length === 3 ? clean.replace(/./g, c => c + c) : clean;
  return [0, 2, 4].map(offset => parseInt(full.slice(offset, offset + 2), 16) / 255) as [number, number, number];
};

const isLightColor = (hex: string): boolean => {
  const rgb = parseHexColor(hex);
  return rgb ? 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] > 0.6 : false;
};

const srOnlyStyle: React.CSSProperties = {
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

const touchAreaStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  touchAction: 'pan-y',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none'
};

const baseButtonColor = 'color-mix(in oklch, currentColor 10%, transparent)';
const hoverButtonColor = 'color-mix(in oklch, currentColor 17%, transparent)';

const captionsContainerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none'
};

const navButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  display: 'grid',
  placeItems: 'center',
  padding: 0,
  borderRadius: 999,
  border: 0,
  background: baseButtonColor,
  color: 'inherit',
  cursor: 'pointer',
  pointerEvents: 'auto',
  transition: 'background-color 160ms ease, transform 160ms ease'
};

const VERTEX_SHADER = `
uniform float uCenter;
uniform float uWidth;
uniform float uK;
uniform float uFloor;
uniform float uMirror;
varying vec2 vUv;
varying float vLift;

void main() {
  vUv = uv;
  float s = uCenter + (uv.x - 0.5) * uWidth;
  float y = uv.y - 0.5;
  float x = s;
  float z = 0.0;
  if (uK > 1e-5) {
    float a = s * uK;
    float h = sin(a * 0.5);
    x = sin(a) / uK;
    z = 2.0 * h * h / uK;
  }
  vLift = y - uFloor;
  if (uMirror > 0.5) y = 2.0 * uFloor - y;
  gl_Position = projectionMatrix * viewMatrix * vec4(x, y, z, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform float uWidth;
uniform float uRadius;
uniform float uLoaded;
uniform float uAlpha;
uniform float uMirror;
uniform float uReflect;
uniform float uDim;
uniform float uHover;
uniform vec2 uResolution;
uniform vec3 uPlaceholder;
varying vec2 vUv;
varying float vLift;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 size = vec2(uWidth, 1.0);
  vec2 p = (vUv - 0.5) * size;
  float lift = max(vLift, 0.0);
  float mirror = step(0.5, uMirror);
  float soft = 1.0 + mirror * lift * 26.0;
  float d = roundBox(p, size * 0.5, min(uRadius, 0.5 * min(size.x, size.y)));
  float aa = max(fwidth(d), 1e-5) * 0.7 * soft;
  float mask = 1.0 - smoothstep(-aa, aa, d);

  float fade = mix(1.0, uReflect * pow(1.0 - clamp(lift / 0.62, 0.0, 1.0), 2.2), mirror);
  float edge = abs(gl_FragCoord.x / uResolution.x * 2.0 - 1.0);
  float vignette = 1.0 - uDim * smoothstep(0.18, 1.05, edge) * (1.0 - 0.85 * uHover);
  float alpha = mask * fade * vignette * uAlpha;
  if (alpha < 0.002) discard;

  float panelAspect = size.x / size.y;
  vec2 uv = vUv - 0.5;
  if (panelAspect > uImageAspect) {
    uv.y *= uImageAspect / panelAspect;
  } else {
    uv.x *= panelAspect / uImageAspect;
  }
  uv += 0.5;
  float blur = 1.0 + mirror * lift * 30.0;
  vec3 color = textureGrad(uImage, uv, dFdx(uv) * blur, dFdy(uv) * blur).rgb;

  float loaded = clamp(uLoaded, 0.0, 1.0);
  vec3 rgb = mix(uPlaceholder, color, loaded);
  alpha *= mix(0.08, 1.0, loaded);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export const ConcaveCarousel = forwardRef<ConcaveCarouselHandle, ConcaveCarouselProps>(function ConcaveCarousel(
  {
    items = DEFAULT_ITEMS,
    startIndex = 0,
    aspect = 1.25,
    size = 0.46,
    curvature = 0.72,
    distance = 4,
    tilt = 0,
    gap = 16,
    radius = 14,
    reflection = 0.06,
    dim = 0.35,
    autoplay = 'drift',
    speed = 0.16,
    interval = 4,
    snap = true,
    inertia = 0.5,
    pauseOnHover = true,
    draggable = true,
    wheel = true,
    captions = true,
    controls = true,
    backgroundColor = 'transparent',
    paused = false,
    dpr = 2,
    ariaLabel = 'Concave carousel. Drag, scroll or use the arrow keys to turn the wall. Space pauses the motion.',
    onIndexChange,
    onSelect,
    className = '',
    style
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchAreaRef = useRef<HTMLDivElement>(null);
  const captionsAreaRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<{
    sync: () => void;
    step: (delta: number) => void;
    goTo: (index: number) => void;
    destroy: () => void;
  } | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
  const safeItems = items.length ? items : DEFAULT_ITEMS;
  const itemsRef = useRef(safeItems);

  const [initialIndex] = useState(() => clamp(Math.round(startIndex), 0, Math.max(safeItems.length - 1, 0)));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isHeld, setIsHeld] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [controlsTop, setControlsTop] = useState<number | null>(null);

  const config = {
    aspect,
    size,
    curvature,
    distance,
    tilt,
    gap,
    radius,
    reflection,
    dim,
    autoplay,
    speed,
    interval,
    snap,
    inertia,
    pauseOnHover,
    draggable,
    wheel,
    captions,
    controls,
    backgroundColor,
    paused,
    dpr,
    reduced: reducedMotion,
    held: isHeld
  };

  const configRef = useRef(config);
  const callbacksRef = useRef({ onIndexChange, onSelect });

  useEffect(() => {
    configRef.current = config;
    itemsRef.current = safeItems;
    callbacksRef.current = { onIndexChange, onSelect };
    engineRef.current?.sync();
  });

  useEffect(() => {
    const container = containerRef.current;
    const touchArea = touchAreaRef.current;
    const captionsArea = captionsAreaRef.current;
    if (!container || !touchArea || !captionsArea) return;

    const setupEngine = (
      rootEl: HTMLDivElement,
      canvasWrapper: HTMLDivElement,
      labelsWrapper: HTMLDivElement,
      cfgRef: typeof configRef,
      itemArrayRef: typeof itemsRef,
      startIdx: number,
      handlers: {
        onActive: (idx: number) => void;
        onSelect: (idx: number) => void;
        onLayout: (top: number) => void;
      }
    ) => {
      let renderer: THREE.WebGLRenderer;
      const doc = rootEl.ownerDocument;
      const canvas = doc.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          powerPreference: 'high-performance'
        });
      } catch {
        return null;
      }

      canvasWrapper.appendChild(canvas);
      renderer.setClearColor(0, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 400);
      const planeGeom = new THREE.PlaneGeometry(1, 1, 72, 1);
      const placeholderTexture = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
      placeholderTexture.needsUpdate = true;

      const resolution = new THREE.Vector2(1, 1);
      const placeholderColor = new THREE.Color(1, 1, 1);
      const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      const createMaterial = (isMirror: boolean) =>
        new THREE.ShaderMaterial({
          uniforms: {
            uImage: { value: placeholderTexture },
            uImageAspect: { value: 1.5 },
            uCenter: { value: 0 },
            uWidth: { value: 1.3 },
            uK: { value: 0.3 },
            uFloor: { value: -0.535 },
            uMirror: { value: isMirror ? 1.0 : 0.0 },
            uRadius: { value: 0.04 },
            uLoaded: { value: 0 },
            uAlpha: { value: 1 },
            uReflect: { value: 0 },
            uDim: { value: 0 },
            uHover: { value: 0 },
            uResolution: { value: resolution },
            uPlaceholder: { value: placeholderColor }
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          premultipliedAlpha: true,
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide
        });

      // 28 mesh and mirror pairs
      const panelMeshes = Array.from({ length: 28 }, () => {
        const mirrorMesh = new THREE.Mesh(planeGeom, createMaterial(true));
        const mainMesh = new THREE.Mesh(planeGeom, createMaterial(false));
        mirrorMesh.frustumCulled = false;
        mainMesh.frustumCulled = false;
        mirrorMesh.visible = false;
        mainMesh.visible = false;
        mirrorMesh.renderOrder = 0;
        mainMesh.renderOrder = 1;
        scene.add(mirrorMesh);
        scene.add(mainMesh);
        return { mesh: mainMesh, mirror: mirrorMesh };
      });

      // 5 caption HTML nodes
      const captionNodes = Array.from({ length: 5 }, () => {
        const node = doc.createElement('div');
        node.setAttribute('aria-hidden', 'true');
        node.style.cssText =
          'position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;white-space:nowrap;opacity:0;pointer-events:none;will-change:transform,opacity';
        const titleEl = doc.createElement('span');
        titleEl.style.cssText =
          'font-size:14px;font-weight:600;line-height:1.3;letter-spacing:0.04em;text-transform:uppercase;color:#d9cbb2;font-family:serif';
        const subtitleEl = doc.createElement('span');
        subtitleEl.style.cssText =
          'font-size:11px;opacity:0.65;line-height:1.4;letter-spacing:0.15em;text-transform:uppercase;color:#c5a363';
        node.append(titleEl, subtitleEl);
        labelsWrapper.appendChild(node);
        return { node, title: titleEl, subtitle: subtitleEl, index: NaN, opacity: -1, x: NaN, y: NaN };
      });

      interface ImageEntry {
        image: HTMLImageElement;
        texture: THREE.Texture;
        aspect: number;
        ready: boolean;
        uploaded: boolean;
        fade: number;
      }

      let textures: ImageEntry[] = [];
      let lastSrcSignature = '';
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let isInitialized = false;
      let currentPosition = startIdx;
      let velocity = 0;
      let throwVelocity = 0;
      let targetPosition: number | null = startIdx;
      let autoplayFactor = 1;
      let autoplayResumeTime = 0;
      let stepNextTime = 0;
      let isWheelScrolled = false;
      let wheelTimestamp = 0;
      let introElapsed = 0;
      let introProgress = 0;
      let isIntroComplete = false;
      let introStartTime = 0;
      let rafId = 0;
      let stepTimer = 0;
      let isDestroyed = false;
      let isContextLost = false;
      let isPointerDown = false;
      let isDragging = false;
      let isHovering = false;
      let hoveredIndex: number | null = null;
      const hoverProgressMap = new Map<number, number>();
      let lastActiveIndex = NaN;
      let lastLayoutTop = NaN;
      let pointerState: {
        id: number;
        x: number;
        y: number;
        grab: number;
        origin: number;
        moved: boolean;
        samples: Array<{ t: number; p: number }>;
      } | null = null;

      const layoutMetrics = {
        labelGap: 28,
        controlsTop: 28,
        unit: 1,
        pitch: 1.3,
        width: 1.25,
        k: 0.3,
        distance: 2.2,
        lift: 0,
        radius: 0.04
      };

      const getCount = () => Math.max(itemArrayRef.current.length, 1);
      const wrapIndex = (idx: number) => ((idx % getCount()) + getCount()) % getCount();

      const loadTextures = () => {
        const currentItems = itemArrayRef.current;
        const sig = currentItems.map(item => item.src).join('\0');
        if (sig === lastSrcSignature) return;
        lastSrcSignature = sig;

        captionNodes.forEach(c => {
          c.index = NaN;
        });
        textures.forEach(t => {
          t.image.onload = null;
          t.texture.dispose();
        });

        const total = Math.max(currentItems.length, 1);
        const centerIdx = wrapIndex(Math.round(currentPosition));

        textures = currentItems.map((item, idx) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          const dist = Math.abs(idx - centerIdx) % total;
          img.fetchPriority = Math.min(dist, total - dist) <= 2 ? 'high' : 'low';

          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = maxAnisotropy;

          const entry: ImageEntry = {
            image: img,
            texture: tex,
            aspect: 1.5,
            ready: false,
            uploaded: false,
            fade: 0
          };

          img.onload = () => {
            if (isDestroyed) return;
            entry.aspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
            entry.ready = true;
            tex.needsUpdate = true;
            scheduleFrame();
          };

          img.src = item.src;
          return entry;
        });
      };

      const resize = () => {
        const cfg = cfgRef.current;
        const w = Math.round(rootEl.clientWidth);
        const h = Math.round(rootEl.clientHeight);
        if (w < 2 || h < 2) {
          isInitialized = false;
          return false;
        }
        const dprVal = Math.min(window.devicePixelRatio || 1, Math.max(cfg.dpr, 0.5));
        if (!isInitialized || w !== width || h !== height || dprVal !== pixelRatio) {
          isInitialized = true;
          width = w;
          height = h;
          pixelRatio = dprVal;
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(width, height, false);
          resolution.set(width * pixelRatio, height * pixelRatio);
          return true;
        }
        return false;
      };

      const updateLayout = () => {
        const cfg = cfgRef.current;
        const scale = clamp(height / 620, 0.72, 1.15);
        const labelGap = 28 * scale;
        const captionsHeight = cfg.captions ? labelGap + 42 + 34 * scale : labelGap;
        const bottomOffset = cfg.controls ? captionsHeight + 32 : cfg.captions ? labelGap + 42 : 0;
        layoutMetrics.labelGap = labelGap;
        layoutMetrics.controlsTop = captionsHeight;

        const availHeight = Math.max(height - bottomOffset, 0.55 * height);
        const panelAspect = clamp(cfg.aspect, 0.4, 3.5);
        let panelHeight = clamp(cfg.size, 0.15, 0.95) * availHeight;
        const camDistance = clamp(cfg.distance, 0.9, 12);
        const maxTan = Math.tan((62 * Math.PI) / 180);

        if (width / panelHeight / 2 / camDistance > maxTan) {
          panelHeight = width / 2 / camDistance / maxTan;
        }

        const normGap = Math.max(0, cfg.gap) / panelHeight;
        layoutMetrics.unit = panelHeight;
        layoutMetrics.width = panelAspect;
        layoutMetrics.pitch = panelAspect + normGap;
        layoutMetrics.k = (clamp(cfg.curvature, 0, 1) * RAD_52) / layoutMetrics.pitch;
        layoutMetrics.distance = camDistance;
        layoutMetrics.radius = Math.max(0, cfg.radius) / panelHeight;

        const tiltRad = (clamp(cfg.tilt, -30, 30) * Math.PI) / 180;
        camera.fov = (((2 * Math.atan(height / 2 / panelHeight / camDistance)) * 180) / Math.PI);
        camera.aspect = width / height;
        camera.near = Math.max(0.01, 0.02 * camDistance);
        camera.far = camDistance + 200;
        camera.position.set(0, Math.tan(tiltRad) * camDistance, camDistance);
        camera.lookAt(0, 0, 0);
        camera.clearViewOffset();
        camera.updateMatrixWorld();

        const topY = projectScreenY(0, 0.5);
        const bottomY = projectScreenY(0, -0.5);
        const centerHit = raycastScreenPoint(0.75, 0);
        const topBound = centerHit ? Math.min(projectScreenY(centerHit.s, 0.5), topY) : topY;
        const bottomBound = bottomOffset > 0 ? bottomY + bottomOffset : centerHit ? projectScreenY(centerHit.s, -0.5) : bottomY;

        layoutMetrics.lift = clamp((topBound - (height - bottomBound)) / 2, -(0.25 * height), 0.25 * height);
        camera.setViewOffset(width, height, 0, layoutMetrics.lift, width, height);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
      };

      const curvePoint = (s: number, y: number, out: THREE.Vector3) => {
        const k = layoutMetrics.k;
        if (k > 1e-5) {
          const a = s * k;
          const half = Math.sin(a / 2);
          out.set(Math.sin(a) / k, y, (2 * half * half) / k);
        } else {
          out.set(s, y, 0);
        }
        return out;
      };

      const tempVec = new THREE.Vector3();
      const isAngleVisible = (s: number) => {
        const k = layoutMetrics.k;
        if (k <= 1e-5) return true;
        const r = 1 / k;
        return r + (layoutMetrics.distance - r) * Math.cos(s * k) > 0.02 * r;
      };

      const projectScreenX = (s: number) => {
        curvePoint(s, 0, tempVec).project(camera);
        return tempVec.z > 1 ? NaN : tempVec.x;
      };

      const projectScreenY = (s: number, y: number) => {
        curvePoint(s, y, tempVec).project(camera);
        return ((1 - tempVec.y) / 2) * height;
      };

      const raycaster = new THREE.Raycaster();
      const screenCoord = new THREE.Vector2();

      const screenToCurve = (clientX: number, clientY: number) => {
        const rect = rootEl.getBoundingClientRect();
        return raycastScreenPoint(
          ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
          1 - ((clientY - rect.top) / Math.max(rect.height, 1)) * 2
        );
      };

      const raycastScreenPoint = (ndcX: number, ndcY: number) => {
        screenCoord.set(ndcX, ndcY);
        raycaster.setFromCamera(screenCoord, camera);
        const origin = raycaster.ray.origin;
        const dir = raycaster.ray.direction;
        const k = layoutMetrics.k;

        if (k <= 1e-5) {
          if (Math.abs(dir.z) < 1e-6) return null;
          const t = -origin.z / dir.z;
          return t <= 0 ? null : { s: origin.x + t * dir.x, y: origin.y + t * dir.y };
        }

        const r = 1 / k;
        const lx = origin.x;
        const lz = origin.z - r;
        const a = dir.x * dir.x + dir.z * dir.z;
        if (a < 1e-9) return null;

        const b = 2 * (lx * dir.x + lz * dir.z);
        const c = b * b - 4 * a * (lx * lx + lz * lz - r * r);
        if (c < 0) return null;

        const t = (-b + Math.sqrt(c)) / (2 * a);
        return t <= 0
          ? null
          : {
              s: Math.atan2(origin.x + t * dir.x, r - (origin.z + t * dir.z)) * r,
              y: origin.y + t * dir.y
            };
      };

      const getPanelIndexAt = (clientX: number, clientY: number) => {
        const hit = screenToCurve(clientX, clientY);
        if (!hit) return null;
        const itemIdx = Math.round(hit.s / layoutMetrics.pitch + currentPosition);
        return Math.abs(hit.s - (itemIdx - currentPosition) * layoutMetrics.pitch) > layoutMetrics.width / 2 ||
          Math.abs(hit.y) > 0.5 ||
          !isAngleVisible(hit.s)
          ? null
          : itemIdx;
      };

      let isIntersecting = true;
      const scheduleFrame = () => {
        if (isDestroyed || isContextLost || !isIntersecting || rafId) return;
        if (stepTimer) {
          window.clearTimeout(stepTimer);
          stepTimer = 0;
        }
        rafId = requestAnimationFrame(renderLoop);
      };

      const delayAutoplay = (seconds = 2.4) => {
        const now = performance.now() / 1000;
        autoplayResumeTime = Math.max(autoplayResumeTime, now + seconds);
        stepNextTime = Math.max(stepNextTime, now + Math.max(cfgRef.current.interval, seconds));
      };

      const goTo = (index: number) => {
        const count = getCount();
        const currentIdx = Math.round(targetPosition ?? currentPosition);
        const offset = ((((index - wrapIndex(currentIdx)) % count) + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
        targetPosition = currentIdx + offset;
        delayAutoplay();
        scheduleFrame();
      };

      const step = (delta: number) => {
        targetPosition = Math.round(targetPosition ?? currentPosition) + delta;
        delayAutoplay();
        scheduleFrame();
      };

      let lastTimestamp = 0;
      function renderLoop(time: number) {
        rafId = 0;
        if (isDestroyed || isContextLost) return;
        if (!isInitialized) {
          resize();
          if (!isInitialized) return;
          updateLayout();
        }

        const cfg = cfgRef.current;
        const dt =
          lastTimestamp && time - lastTimestamp < 100
            ? Math.min(Math.max((time - lastTimestamp) / 1000, 0), 0.05)
            : 1 / 60;
        lastTimestamp = time;

        const nowSec = performance.now() / 1000;
        const isReduced = cfg.reduced;
        let needsNextFrame = false;

        if (!isIntroComplete) {
          if (!introStartTime) introStartTime = nowSec;
          let readyCount = true;
          for (let i = -2; i <= 2; i++) {
            const entry = textures[wrapIndex(Math.round(currentPosition) + i)];
            if (entry && !entry.uploaded) readyCount = false;
          }
          if (readyCount || isReduced || nowSec - introStartTime > 1.6) {
            isIntroComplete = true;
            introProgress = isReduced ? 0 : -1.6;
            introElapsed = isReduced ? 1 : 0;
          } else {
            needsNextFrame = true;
          }
        }

        if (isIntroComplete && introElapsed < 1) {
          introElapsed = Math.min(1, introElapsed + dt / 2.2);
          needsNextFrame = true;
        }

        const introEasing = 1 - Math.pow(1 - introElapsed, 4);

        // Upload next texture to GPU
        (() => {
          const total = textures.length;
          const center = wrapIndex(Math.round(currentPosition));
          let candidate: ImageEntry | null = null;
          let minDistance = Infinity;

          for (let i = 0; i < total; i++) {
            const t = textures[i];
            if (!t.ready || t.uploaded) continue;
            const dist = Math.abs(i - center) % total;
            const shortest = Math.min(dist, total - dist);
            if (shortest < minDistance) {
              minDistance = shortest;
              candidate = t;
            }
          }

          if (candidate) {
            renderer.initTexture(candidate.texture);
            candidate.uploaded = true;
            needsNextFrame = true;
          }
        })();

        for (const t of textures) {
          if (t.uploaded && t.fade < 1) {
            t.fade = isReduced || !isIntroComplete ? 1 : Math.min(1, t.fade + dt / 0.5);
            needsNextFrame = true;
          }
        }

        const apMode = cfg.autoplay;
        const apInterval = Math.max(cfg.interval, 0.8);
        const isPaused = cfg.paused || cfg.held || isReduced || apMode === 'off';
        const isUserInteracting = Boolean(pointerState) || (cfg.pauseOnHover && isHovering);
        const isThrottled = isUserInteracting || nowSec < autoplayResumeTime;
        const shouldDrift = !isPaused && !isThrottled && apMode === 'drift';
        const targetDriftFactor = shouldDrift ? 1 : 0;
        const driftSmoothing = targetDriftFactor > autoplayFactor ? 0.9 : 0.32;

        autoplayFactor += (targetDriftFactor - autoplayFactor) * (1 - Math.exp(-dt / driftSmoothing));
        if (Math.abs(targetDriftFactor - autoplayFactor) > 0.001) {
          needsNextFrame = true;
        } else {
          autoplayFactor = targetDriftFactor;
        }

        if (apMode === 'step' && !isPaused && getCount() > 1) {
          if (isUserInteracting || stepNextTime === 0) {
            stepNextTime = Math.max(stepNextTime, nowSec + 0.6 * apInterval);
          } else if (nowSec >= stepNextTime && !isThrottled) {
            stepNextTime = nowSec + apInterval;
            targetPosition = Math.round(targetPosition ?? currentPosition) + (cfg.speed < 0 ? -1 : 1);
          }
        } else {
          stepNextTime = 0;
        }

        if (isWheelScrolled && nowSec - wheelTimestamp > 0.14) {
          isWheelScrolled = false;
          if (cfg.snap && targetPosition !== null) {
            targetPosition = Math.round(targetPosition);
          }
        }

        const driftSpeed = cfg.speed * autoplayFactor;
        if (pointerState && pointerState.moved) {
          needsNextFrame = true;
        } else if (targetPosition !== null) {
          // Spring physics to targetPosition
          const springOmega = TWO_PI / Math.max(isReduced ? 0.08 : isWheelScrolled ? 0.6 : 0.85, 0.02);
          const subSteps = Math.max(1, Math.ceil(dt / (1 / 240)));
          const subDt = dt / subSteps;
          let vel = velocity;
          let pos = currentPosition;

          for (let stepIdx = 0; stepIdx < subSteps; stepIdx++) {
            vel += (springOmega * springOmega * (targetPosition - pos) - 1.64 * springOmega * vel) * subDt;
            pos += vel * subDt;
          }

          currentPosition = pos;
          velocity = vel;

          if (Math.abs(currentPosition - targetPosition) < 1e-4 && Math.abs(velocity) < 1e-4) {
            currentPosition = targetPosition;
            velocity = 0;
            if (apMode !== 'drift' || isPaused || isThrottled) {
              targetPosition = null;
            }
          } else {
            needsNextFrame = true;
          }

          if (apMode === 'drift' && autoplayFactor > 0 && targetPosition !== null && Math.abs(currentPosition - targetPosition) < 0.02) {
            targetPosition = null;
          }
          if (targetPosition === null) {
            throwVelocity = velocity - driftSpeed;
          }
        } else {
          // Free drift / inertia
          const inertiaVal = clamp(cfg.inertia, 0, 1);
          throwVelocity *= Math.exp(-dt / (0.25 + 1.6 * inertiaVal));
          if (Math.abs(throwVelocity) < 1e-4) {
            throwVelocity = 0;
          } else {
            needsNextFrame = true;
          }
          velocity = driftSpeed + throwVelocity;
          currentPosition += velocity * dt;
        }

        const centerIndex = wrapIndex(Math.round(currentPosition));
        if (centerIndex !== lastActiveIndex) {
          lastActiveIndex = centerIndex;
          handlers.onActive(centerIndex);
        }

        resize();
        updateLayout();

        const animPosition = currentPosition + introProgress * (1 - introEasing);
        const dimVal = clamp(cfg.dim, 0, 1);
        const reflectVal = clamp(cfg.reflection, 0, 1);
        const centerPanel = Math.round(animPosition);
        let visibleCount = 0;

        for (let i = -14; i < 14 && visibleCount < 28; i++) {
          const panelIdx = centerPanel + i;
          const curveOffset = (panelIdx - animPosition) * layoutMetrics.pitch;

          if (
            (layoutMetrics.k > 1e-5 && Math.abs(curveOffset * layoutMetrics.k) > 0.98 * Math.PI) ||
            !isAngleVisible(curveOffset)
          ) {
            continue;
          }

          const screenLeft = projectScreenX(curveOffset - layoutMetrics.width / 2);
          const screenRight = projectScreenX(curveOffset + layoutMetrics.width / 2);

          if (
            Number.isNaN(projectScreenX(curveOffset)) ||
            Number.isNaN(screenLeft) ||
            Number.isNaN(screenRight) ||
            Math.max(screenLeft, screenRight) < -1.15 ||
            Math.min(screenLeft, screenRight) > 1.15
          ) {
            continue;
          }

          const pair = panelMeshes[visibleCount++];
          const texEntry = textures[wrapIndex(panelIdx)];
          const panelAlpha = isIntroComplete
            ? isReduced
              ? 1
              : clamp((1.6 * introEasing - 0.12 * Math.abs(i)) / 0.6, 0, 1)
            : 0;

          let hoverProg = hoverProgressMap.get(panelIdx) ?? 0;
          const targetHover = Number(hoveredIndex === panelIdx);
          hoverProg += (targetHover - hoverProg) * (1 - Math.exp(-dt / 0.18));
          if (Math.abs(hoverProg - targetHover) > 0.001) {
            needsNextFrame = true;
          } else {
            hoverProg = targetHover;
          }
          hoverProgressMap.set(panelIdx, hoverProg);

          for (const mesh of [pair.mesh, pair.mirror]) {
            const isMirror = mesh === pair.mirror;
            mesh.visible = !isMirror || reflectVal > 0.001;
            const u = (mesh.material as THREE.ShaderMaterial).uniforms;
            u.uCenter.value = curveOffset;
            u.uWidth.value = layoutMetrics.width;
            u.uK.value = layoutMetrics.k;
            u.uRadius.value = layoutMetrics.radius;
            u.uAlpha.value = panelAlpha;
            u.uReflect.value = reflectVal;
            u.uDim.value = dimVal;
            u.uHover.value = hoverProg;

            if (texEntry) {
              u.uImage.value = texEntry.uploaded ? texEntry.texture : placeholderTexture;
              u.uImageAspect.value = texEntry.aspect;
              u.uLoaded.value = texEntry.uploaded ? texEntry.fade : 0;
            }
          }
        }

        for (let i = visibleCount; i < 28; i++) {
          panelMeshes[i].mesh.visible = false;
          panelMeshes[i].mirror.visible = false;
        }

        for (const k of Array.from(hoverProgressMap.keys())) {
          if (Math.abs(k - currentPosition) > 28) hoverProgressMap.delete(k);
        }

        // Update Captions
        const currentItems = itemArrayRef.current;
        const centerCapIdx = Math.round(animPosition);

        for (let i = -2; i <= 2; i++) {
          const capIdx = centerCapIdx + i;
          const nodeEntry = captionNodes[((capIdx % 5) + 5) % 5];
          const curveOffset = (capIdx - animPosition) * layoutMetrics.pitch;
          let nodeAlpha = 0;

          if (cfg.captions && isAngleVisible(curveOffset)) {
            if (nodeEntry.index !== capIdx) {
              nodeEntry.index = capIdx;
              const itemData = currentItems[wrapIndex(capIdx)];
              nodeEntry.title.textContent = itemData ? itemData.title ?? itemData.alt ?? '' : '';
              nodeEntry.subtitle.textContent = itemData?.subtitle ?? '';
              nodeEntry.subtitle.style.display = itemData?.subtitle ? '' : 'none';
            }

            const distFraction = clamp((Math.abs(capIdx - animPosition) - 0.45) / 0.4, 0, 1);
            nodeAlpha =
              (1 - distFraction * distFraction * (3 - 2 * distFraction)) *
              (isIntroComplete ? (isReduced ? 1 : clamp((introEasing - 0.55) / 0.4, 0, 1)) : 0);

            curvePoint(curveOffset, -0.5, tempVec).project(camera);
            const posX = ((tempVec.x + 1) / 2) * width;
            const posY = ((1 - tempVec.y) / 2) * height + layoutMetrics.labelGap;

            if (
              Number.isNaN(nodeEntry.x) ||
              Math.abs(posX - nodeEntry.x) > 0.05 ||
              Math.abs(posY - nodeEntry.y) > 0.05
            ) {
              nodeEntry.x = posX;
              nodeEntry.y = posY;
              nodeEntry.node.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) translateX(-50%)`;
            }
          }

          if (Math.abs(nodeAlpha - nodeEntry.opacity) > 0.002) {
            nodeEntry.opacity = nodeAlpha;
            nodeEntry.node.style.opacity = nodeAlpha.toFixed(3);
          }
        }

        // Controls layout position
        curvePoint(0, -0.5, tempVec).project(camera);
        const controlsY = ((1 - tempVec.y) / 2) * height + layoutMetrics.controlsTop;
        if (Number.isNaN(lastLayoutTop) || Math.abs(controlsY - lastLayoutTop) > 0.5) {
          lastLayoutTop = controlsY;
          handlers.onLayout(controlsY);
        }

        renderer.render(scene, camera);

        if (needsNextFrame || pointerState || (apMode === 'drift' && autoplayFactor > 0.001)) {
          scheduleFrame();
        } else if (apMode === 'step' && !isPaused && !isUserInteracting && getCount() > 1) {
          stepTimer = window.setTimeout(
            () => {
              stepTimer = 0;
              lastTimestamp = 0;
              scheduleFrame();
            },
            1000 * Math.max(Math.max(stepNextTime, autoplayResumeTime) - nowSec, 0.02) + 16
          );
        } else if (apMode === 'drift' && !isPaused && !isUserInteracting && nowSec < autoplayResumeTime) {
          stepTimer = window.setTimeout(() => {
            stepTimer = 0;
            lastTimestamp = 0;
            scheduleFrame();
          }, (autoplayResumeTime - nowSec) * 1000 + 16);
        }
      }

      // Pointer Handlers
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') {
          isHovering = true;
          if (!pointerState) {
            const hitIdx = getPanelIndexAt(e.clientX, e.clientY);
            if (hitIdx !== hoveredIndex) hoveredIndex = hitIdx;
            rootEl.style.cursor = hitIdx !== null ? 'pointer' : cfgRef.current.draggable ? 'grab' : '';
          }
        }

        if (pointerState && pointerState.id === e.pointerId) {
          if (!pointerState.moved && Math.hypot(e.clientX - pointerState.x, e.clientY - pointerState.y) > 6) {
            pointerState.moved = true;
            hoveredIndex = null;
            targetPosition = null;
            velocity = 0;
            throwVelocity = 0;
            rootEl.style.cursor = 'grabbing';
            try {
              canvasWrapper.setPointerCapture(e.pointerId);
            } catch {}
          }

          if (pointerState.moved) {
            const hit = screenToCurve(e.clientX, e.clientY);
            if (hit) {
              currentPosition = pointerState.origin + (pointerState.grab - hit.s) / layoutMetrics.pitch;
              const now = performance.now();
              pointerState.samples.push({ t: now, p: currentPosition });
              while (pointerState.samples.length > 2 && now - pointerState.samples[0].t > 110) {
                pointerState.samples.shift();
              }
            }
          }
        }
        scheduleFrame();
      };

      const onPointerDown = (e: PointerEvent) => {
        if (!e.isPrimary || e.button > 0) return;
        if (!cfgRef.current.draggable) {
          pointerState = null;
          isDragging = false;
          return;
        }
        const hit = screenToCurve(e.clientX, e.clientY);
        pointerState = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          grab: hit ? hit.s : 0,
          origin: currentPosition,
          moved: false,
          samples: [{ t: performance.now(), p: currentPosition }]
        };
        isDragging = false;
        delayAutoplay();
        scheduleFrame();
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!pointerState || pointerState.id !== e.pointerId) return;
        const state = pointerState;
        pointerState = null;
        try {
          if (canvasWrapper.hasPointerCapture(e.pointerId)) {
            canvasWrapper.releasePointerCapture(e.pointerId);
          }
        } catch {}

        if (state.moved) {
          isDragging = true;
          const now = performance.now();
          const recentSamples = state.samples.filter(s => now - s.t < 110);
          let throwSpeed = 0;

          if (recentSamples.length > 1 && now - recentSamples[recentSamples.length - 1].t < 60) {
            const dtSample = Math.max((recentSamples[recentSamples.length - 1].t - recentSamples[0].t) / 1000, 1 / 120);
            throwSpeed = (recentSamples[recentSamples.length - 1].p - recentSamples[0].p) / dtSample;
          }

          const cfg = cfgRef.current;
          throwSpeed = cfg.reduced ? 0 : clamp(throwSpeed, -14, 14);
          velocity = throwSpeed;
          throwVelocity = throwSpeed;

          const inertiaVal = clamp(cfg.inertia, 0, 1);
          targetPosition = cfg.snap ? Math.round(currentPosition + throwSpeed * (0.14 + 0.46 * inertiaVal)) : null;
          delayAutoplay();
          rootEl.style.cursor = cfg.draggable ? 'grab' : '';
        }
        scheduleFrame();
      };

      const onClick = (e: MouseEvent) => {
        if (isDragging) {
          isDragging = false;
          return;
        }
        const hitIdx = getPanelIndexAt(e.clientX, e.clientY);
        if (hitIdx !== null) {
          const isCentered = hitIdx === Math.round(targetPosition ?? currentPosition) && Math.abs(currentPosition - Math.round(currentPosition)) < 0.2;
          if (isCentered) {
            handlers.onSelect(wrapIndex(hitIdx));
          } else {
            targetPosition = hitIdx;
            delayAutoplay();
            scheduleFrame();
          }
        }
      };

      const onPointerLeave = (e: PointerEvent) => {
        if (pointerState && pointerState.id === e.pointerId) return;
        isHovering = false;
        hoveredIndex = null;
        rootEl.style.cursor = '';
        delayAutoplay(0.6);
        scheduleFrame();
      };

      const onWheel = (e: WheelEvent) => {
        if (!cfgRef.current.wheel) return;
        e.preventDefault();
        const modeMultiplier = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
        const delta = clamp(
          (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * modeMultiplier,
          -240,
          240
        );
        const curTarget = targetPosition ?? (cfgRef.current.snap ? Math.round(currentPosition) : currentPosition);
        targetPosition = (isWheelScrolled ? curTarget : cfgRef.current.snap ? Math.round(curTarget) : curTarget) + delta / 100;
        isWheelScrolled = true;
        wheelTimestamp = performance.now() / 1000;
        delayAutoplay();
        scheduleFrame();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          step(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          step(-1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          goTo(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          goTo(getCount() - 1);
        } else if (e.key === 'Enter' && e.target === rootEl) {
          e.preventDefault();
          handlers.onSelect(wrapIndex(Math.round(targetPosition ?? currentPosition)));
        }
      };

      canvasWrapper.addEventListener('pointerdown', onPointerDown);
      canvasWrapper.addEventListener('pointermove', onPointerMove);
      canvasWrapper.addEventListener('pointerup', onPointerUp);
      canvasWrapper.addEventListener('pointercancel', onPointerUp);
      canvasWrapper.addEventListener('pointerleave', onPointerLeave);
      canvasWrapper.addEventListener('click', onClick);
      canvasWrapper.addEventListener('wheel', onWheel, { passive: false });
      rootEl.addEventListener('keydown', onKeyDown);

      const resizeObserver = new ResizeObserver(() => {
        if (resize()) {
          updateLayout();
          scheduleFrame();
        }
      });
      resizeObserver.observe(rootEl);

      const intersectionObserver =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                isIntersecting = entry.isIntersecting;
                if (isIntersecting) {
                  lastTimestamp = 0;
                  scheduleFrame();
                } else {
                  if (rafId) cancelAnimationFrame(rafId);
                  rafId = 0;
                  if (stepTimer) window.clearTimeout(stepTimer);
                  stepTimer = 0;
                }
              },
              { rootMargin: '80px' }
            );

      if (intersectionObserver) {
        intersectionObserver.observe(rootEl);
      } else {
        isIntersecting = true;
      }

      const onContextLost = (e: Event) => {
        e.preventDefault();
        isContextLost = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      const onContextRestored = () => {
        isContextLost = false;
        lastSrcSignature = '';
        loadTextures();
        scheduleFrame();
      };

      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);

      const updatePlaceholderColor = () => {
        const bg = cfgRef.current.backgroundColor;
        if (parseHexColor(bg)) {
          placeholderColor.set(0xffffff * Number(!isLightColor(bg)));
          return;
        }
        const computed = window.getComputedStyle(rootEl).color;
        if (computed) {
          placeholderColor.setStyle(computed, THREE.SRGBColorSpace);
        }
      };

      resize();
      if (isInitialized) updateLayout();
      updatePlaceholderColor();
      loadTextures();
      scheduleFrame();

      return {
        sync: () => {
          if (resize() || isInitialized) updateLayout();
          updatePlaceholderColor();
          loadTextures();
          scheduleFrame();
        },
        step,
        goTo,
        destroy: () => {
          isDestroyed = true;
          if (rafId) cancelAnimationFrame(rafId);
          if (stepTimer) window.clearTimeout(stepTimer);
          intersectionObserver?.disconnect();
          resizeObserver.disconnect();
          canvasWrapper.removeEventListener('pointerdown', onPointerDown);
          canvasWrapper.removeEventListener('pointermove', onPointerMove);
          canvasWrapper.removeEventListener('pointerup', onPointerUp);
          canvasWrapper.removeEventListener('pointercancel', onPointerUp);
          canvasWrapper.removeEventListener('pointerleave', onPointerLeave);
          canvasWrapper.removeEventListener('click', onClick);
          canvasWrapper.removeEventListener('wheel', onWheel);
          rootEl.removeEventListener('keydown', onKeyDown);
          rootEl.style.cursor = '';
          canvas.removeEventListener('webglcontextlost', onContextLost);
          canvas.removeEventListener('webglcontextrestored', onContextRestored);
          textures.forEach(t => {
            t.image.onload = null;
            t.texture.dispose();
          });
          panelMeshes.forEach(p => {
            (p.mesh.material as THREE.ShaderMaterial).dispose();
            (p.mirror.material as THREE.ShaderMaterial).dispose();
          });
          hoverProgressMap.clear();
          captionNodes.forEach(c => c.node.remove());
          placeholderTexture.dispose();
          planeGeom.dispose();
          renderer.dispose();
          if (!renderer.getContext().isContextLost()) {
            renderer.forceContextLoss();
          }
          canvas.remove();
        }
      };
    };

    const engine = setupEngine(
      container,
      touchArea,
      captionsArea,
      configRef,
      itemsRef,
      initialIndex,
      {
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
        },
        onLayout: top => setControlsTop(top)
      }
    );

    if (!engine) {
      const animFrame = requestAnimationFrame(() => setHasFailed(true));
      return () => cancelAnimationFrame(animFrame);
    }

    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [initialIndex]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => engineRef.current?.step(1),
      previous: () => engineRef.current?.step(-1),
      goTo: (idx: number) => engineRef.current?.goTo(idx)
    }),
    []
  );

  const cleanBg = backgroundColor.trim().toLowerCase();
  const isTransparent = cleanBg === 'transparent' || cleanBg === '';
  const isLight = !isTransparent && isLightColor(cleanBg);
  const currentItem = safeItems[activeIndex] ?? safeItems[0];

  return (
    <div
      ref={containerRef}
      className={`relative h-full min-h-[420px] w-full overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color-mix(in_oklch,currentColor_35%,transparent)] select-none ${className}`}
      style={{
        backgroundColor: isTransparent ? undefined : backgroundColor,
        color: isTransparent ? 'currentColor' : isLight ? '#0a0a0a' : '#fafafa',
        ...style
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === ' ' && e.target === e.currentTarget) {
          e.preventDefault();
          setIsHeld(h => !h);
        }
      }}
    >
      {/* 3D WebGL Canvas Area */}
      <div ref={touchAreaRef} style={touchAreaStyle} />

      {/* HTML Captions Projected from 3D */}
      <div ref={captionsAreaRef} style={captionsContainerStyle} />

      {/* Fallback image if WebGL fails */}
      {hasFailed && currentItem && (
        <div style={{ position: 'absolute', inset: '14%', display: 'grid', placeItems: 'center' }}>
          <img
            src={currentItem.src}
            alt={currentItem.alt || ''}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: radius }}
          />
        </div>
      )}

      {/* Screen reader list */}
      <ul style={srOnlyStyle}>
        {safeItems.map((item, idx) => (
          <li key={`${item.src}-${idx}`} aria-current={idx === activeIndex ? 'true' : undefined}>
            {item.title ? `${item.title}: ${item.alt}` : item.alt}
          </li>
        ))}
      </ul>

      <div aria-live="polite" style={srOnlyStyle}>
        {currentItem ? currentItem.title ?? currentItem.alt ?? '' : ''}
      </div>

      {/* Navigation Controls */}
      {controls && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: controlsTop ?? '82%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
            pointerEvents: 'none',
            fontSize: 12,
            fontVariantNumeric: 'tabular-nums',
            opacity: Number(controlsTop !== null),
            transition: 'opacity 400ms ease'
          }}
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={() => engineRef.current?.step(-1)}
            onPointerEnter={e => {
              e.currentTarget.style.background = hoverButtonColor;
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onPointerLeave={e => {
              e.currentTarget.style.background = baseButtonColor;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={navButtonStyle}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <span style={{ minWidth: 56, textAlign: 'center', letterSpacing: '0.04em', color: '#c5a363', fontFamily: 'serif' }}>
            <span style={{ opacity: 0.95, fontWeight: 600 }}>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span style={{ opacity: 0.45 }}> / {String(safeItems.length).padStart(2, '0')}</span>
          </span>

          <button
            type="button"
            aria-label="Next"
            onClick={() => engineRef.current?.step(1)}
            onPointerEnter={e => {
              e.currentTarget.style.background = hoverButtonColor;
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onPointerLeave={e => {
              e.currentTarget.style.background = baseButtonColor;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={navButtonStyle}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

ConcaveCarousel.displayName = 'ConcaveCarousel';
export default ConcaveCarousel;
