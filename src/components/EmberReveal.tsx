import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useSyncExternalStore
} from 'react';
import * as THREE from 'three';

export interface EmberRevealImage {
  src: string;
  alt?: string;
}

export type EmberRevealImageItem = string | EmberRevealImage;

export interface EmberRevealHandle {
  ignite: (x?: number, y?: number) => void;
  next: () => void;
  reset: () => void;
}

export interface EmberRevealProps {
  images?: EmberRevealImageItem[];
  aspectRatio?: number;
  radius?: number;
  emberColor?: string;
  charColor?: string;
  glow?: number;
  edge?: number;
  roughness?: number;
  detail?: number;
  scorch?: number;
  smoke?: number;
  sparks?: number;
  shimmer?: number;
  burnDuration?: number;
  pocketSize?: number;
  heal?: number;
  follow?: number;
  hover?: boolean;
  clickToBurn?: boolean;
  autoplay?: boolean;
  interval?: number;
  idleDelay?: number;
  loop?: boolean;
  onChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_IMAGES: EmberRevealImage[] = [
  {
    src: '/assets/images/imagetrail1.webp',
    alt: 'Curated Glimpse 1'
  },
  {
    src: '/assets/images/imagetrail2.webp',
    alt: 'Curated Glimpse 2'
  },
  {
    src: '/assets/images/imagetrail3.webp',
    alt: 'Curated Glimpse 3'
  }
];

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

let canvas2dContext: CanvasRenderingContext2D | null = null;
const parseColor = (colorStr: string, fallback: [number, number, number]): [number, number, number] => {
  if (typeof document === 'undefined') return fallback;
  if (!canvas2dContext) {
    const c = document.createElement('canvas');
    canvas2dContext = c.getContext('2d');
  }
  if (!canvas2dContext) return fallback;
  canvas2dContext.fillStyle = '#010203';
  canvas2dContext.fillStyle = colorStr;
  const normalized = String(canvas2dContext.fillStyle);
  if (normalized === '#010203' && colorStr.trim().toLowerCase() !== '#010203') return fallback;
  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  }
  const nums = normalized.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return fallback;
  return [Number(nums[0]) / 255, Number(nums[1]) / 255, Number(nums[2]) / 255];
};

const VERTEX_QUAD = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const NOISE_GLSL = `vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash2(i), f);
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.55;
  mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    sum += amp * gradientNoise(p);
    p = turn * p * 2.03 + 11.7;
    amp *= 0.5;
  }
  return sum;
}

float fbm3(vec2 p) {
  float sum = 0.0;
  float amp = 0.6;
  mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    sum += amp * gradientNoise(p);
    p = turn * p * 2.07 + 5.3;
    amp *= 0.5;
  }
  return sum;
}

vec4 bicubic(sampler2D map, vec2 uv, vec2 size) {
  vec2 st = uv * size - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0;
  vec2 w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0;
  vec2 w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (w1 / g0 - 1.0 + i + 0.5) / size;
  vec2 h1 = (w3 / g1 + 1.0 + i + 0.5) / size;
  return g0.y * (g0.x * texture2D(map, vec2(h0.x, h0.y)) + g1.x * texture2D(map, vec2(h1.x, h0.y))) +
    g1.y * (g0.x * texture2D(map, vec2(h0.x, h1.y)) + g1.x * texture2D(map, vec2(h1.x, h1.y)));
}`;

const FIELD_FRAGMENT = `uniform sampler2D uPrevious;
uniform vec2 uAspect;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uPocket;
uniform float uPocketOn;
uniform float uHeal;
uniform vec2 uOrigin;
uniform float uRadius;
uniform float uBurning;
uniform float uClear;
uniform float uFade;
uniform float uLobes;
uniform float uSeed;
varying vec2 vUv;
${NOISE_GLSL}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  vec4 previous = texture2D(uPrevious, vUv);
  vec2 p = (vUv - 0.5) * uAspect;
  float reach = segment(p, (uFrom - 0.5) * uAspect, (uTo - 0.5) * uAspect);
  float stamp = uPocketOn * (1.0 - smoothstep(0.0, uPocket, reach));
  stamp = stamp * stamp * (3.0 - 2.0 * stamp);
  float pocket = max(previous.r * uHeal, stamp);
  vec2 away = p - (uOrigin - 0.5) * uAspect;
  float lobes = fbm(away * 2.2 + uSeed) * uLobes;
  float front = uBurning * (1.0 - smoothstep(uRadius - 0.16, uRadius + 0.16, length(away) * (1.0 + lobes)));
  float burn = uClear > 0.5 ? 0.0 : max(previous.g, front);
  float before = max(previous.r, previous.g);
  float heat = max(pocket, burn);
  float activity = max(previous.b * uFade, clamp((heat - before) * 24.0, 0.0, 1.0));
  if (uClear > 0.5) activity = 0.0;
  gl_FragColor = vec4(pocket, burn, activity, 1.0);
}`;

const SMOKE_FRAGMENT = `uniform sampler2D uSmoke;
uniform sampler2D uField;
uniform vec2 uAspect;
uniform vec2 uTexel;
uniform float uDt;
uniform float uTime;
uniform float uDecay;
uniform float uClear;
varying vec2 vUv;
${NOISE_GLSL}

void main() {
  vec2 p = vUv * uAspect * 2.6;
  float t = uTime * 0.12;
  float e = 0.02;
  float up = gradientNoise(p + vec2(0.0, e) + t);
  float down = gradientNoise(p - vec2(0.0, e) + t);
  float right = gradientNoise(p + vec2(e, 0.0) - t);
  float left = gradientNoise(p - vec2(e, 0.0) - t);
  vec2 curl = vec2(up - down, left - right) / (2.0 * e);
  vec2 velocity = (vec2(0.0, 0.11) + curl * 0.028) / uAspect;
  vec2 back = vUv - velocity * uDt;
  float centre = texture2D(uSmoke, back).r;
  float spread = (texture2D(uSmoke, back + vec2(uTexel.x, 0.0)).r + texture2D(uSmoke, back - vec2(uTexel.x, 0.0)).r + texture2D(uSmoke, back + vec2(0.0, uTexel.y)).r + texture2D(uSmoke, back - vec2(0.0, uTexel.y)).r) * 0.25;
  float smoke = mix(centre, spread, 0.35) * uDecay;
  smoke += texture2D(uField, vUv).b * uDt * 2.4;
  if (uClear > 0.5) smoke = 0.0;
  gl_FragColor = vec4(min(smoke, 1.2), 0.0, 0.0, 1.0);
}`;

const COMPOSITE_FRAGMENT = `uniform sampler2D uField;
uniform sampler2D uSmokeMap;
uniform vec2 uFieldSize;
uniform sampler2D uImageA;
uniform sampler2D uImageB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uEmber;
uniform vec3 uChar;
uniform float uGlow;
uniform float uEdge;
uniform float uRough;
uniform float uDetail;
uniform float uScorch;
uniform float uSmoke;
uniform float uShimmer;
uniform float uSeed;
uniform float uPixelRatio;
varying vec2 vUv;
${NOISE_GLSL}

vec2 cover(vec2 uv, vec2 size) {
  float view = uResolution.x / uResolution.y;
  float image = size.x / max(size.y, 1.0);
  vec2 scale = view > image ? vec2(1.0, image / view) : vec2(view / image, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

vec3 emberRamp(float t) {
  vec3 deep = uEmber * vec3(0.55, 0.22, 0.12);
  vec3 hot = mix(uEmber, vec3(1.0, 0.93, 0.78), 0.75);
  return mix(mix(deep, uEmber, smoothstep(0.0, 0.45, t)), hot, smoothstep(0.45, 1.0, t));
}

void main() {
  vec2 pixel = vUv * uResolution;
  float unit = min(uResolution.x, uResolution.y);
  vec2 q = pixel / unit * uDetail + uSeed;
  vec4 field = bicubic(uField, vUv, uFieldSize);
  float heat = clamp(max(field.r, field.g), 0.0, 1.0);
  float touched = smoothstep(0.0005, 0.04, heat);
  float w = max(0.3, uEdge) * uPixelRatio * clamp(unit / uPixelRatio / 520.0, 0.6, 1.6);
  float shape = 0.0;
  vec2 warp = vec2(0.0);
  if (heat > 0.0004) {
    warp = vec2(fbm3(q * 0.6 + 3.1), fbm3(q * 0.6 - 5.3));
    shape = fbm3(q + warp * 1.1);
  }
  float v = heat + uRough * shape * touched - 0.5;
  float slope = max(fwidth(v), 1e-5);
  float d = v / slope;
  float jag = gradientNoise(q * 8.0 + warp * 2.0) * 0.65 + gradientNoise(q * 19.0 + warp) * 0.35;
  d += jag * (2.0 + 5.0 * uRough) * w * (1.0 - smoothstep(20.0 * w, 60.0 * w, abs(d)));
  float shimmerZone = exp(-abs(d + 6.0 * w) / (12.0 * w)) * touched;
  vec2 wobble = vec2(gradientNoise(q * 2.4 + vec2(0.0, -uTime * 1.8)), gradientNoise(q * 2.4 + vec2(7.3, -uTime * 2.1)));
  vec2 bend = wobble * uShimmer * shimmerZone * 2.2 * uPixelRatio / uResolution;
  vec3 a = texture2D(uImageA, cover(vUv + bend, uSizeA)).rgb;
  vec3 b = texture2D(uImageB, cover(vUv + bend * 0.3, uSizeB)).rgb;
  float toast = pow(smoothstep(-0.22, 0.0, v), 2.0) * (1.0 - smoothstep(0.0, 0.02, v)) * touched;
  toast = max(toast, (1.0 - smoothstep(0.0, 16.0 * w, max(-d, 0.0))) * step(d, 0.5) * touched * 0.8);
  float luma = dot(a, vec3(0.299, 0.587, 0.114));
  vec3 browned = vec3(luma) * vec3(1.0, 0.68, 0.4) * 0.8 + vec3(0.05, 0.025, 0.0);
  vec3 paper = mix(a, browned, toast * uScorch * 0.9);
  paper *= 1.0 - toast * uScorch * 0.4;
  float mottle = 0.55 + 0.9 * (0.5 + 0.5 * gradientNoise(q * 12.0 + warp * 4.0));
  float charZone = smoothstep(-10.0 * w, -2.2 * w, d);
  paper = mix(paper, uChar * mottle, charZone * 0.96);
  float cut = smoothstep(-0.6 * uPixelRatio, 0.6 * uPixelRatio, d);
  float soot = max(exp(-max(d, 0.0) / (5.0 * w)), 1.0 - smoothstep(0.0, 0.14, v)) * touched;
  vec3 hole = b * (1.0 - soot * 0.55);
  vec3 color = mix(paper, hole, cut);
  float crawl = gradientNoise(q * 1.4 + vec2(uTime * 0.7, -uTime * 1.1)) + 0.5 * gradientNoise(q * 3.7 - vec2(uTime * 1.9, 0.0));
  float flicker = smoothstep(-0.6, 0.7, crawl);
  float burning = 0.12 + 1.25 * flicker * flicker;
  float thick = 0.7 + 0.7 * smoothstep(-0.4, 0.6, gradientNoise(q * 3.3 - vec2(uTime * 0.5, 0.0)));
  float line = exp(-pow((d + 1.4 * w) / (1.5 * w * thick), 2.0)) * burning;
  float core = exp(-pow((d + 1.1 * w) / (0.7 * w * thick), 2.0)) * burning;
  float embers = smoothstep(0.55, 0.85, gradientNoise(q * 18.0 + warp * 3.0 + vec2(0.0, uTime * 0.4))) * charZone * (1.0 - cut) * smoothstep(-8.0 * w, -3.5 * w, d);
  float halo = exp(-abs(d + 1.5 * w) / (11.0 * w));
  vec3 hot = mix(uEmber, vec3(1.0, 0.9, 0.66), 0.8);
  vec3 deep = uEmber * vec3(0.75, 0.32, 0.16);
  vec3 emit = uEmber * line * 1.1 + hot * core * 0.95 + deep * halo * (0.25 + 0.5 * flicker) + mix(uEmber, hot, 0.4) * embers * (0.35 + 0.65 * flicker);
  emit *= uGlow * touched;
  color = 1.0 - (1.0 - color) * (1.0 - clamp(emit, 0.0, 1.0));
  float smoke = texture2D(uSmokeMap, vUv).r;
  float haze = (1.0 - exp(-smoke * 1.6)) * uSmoke;
  vec3 smokeTone = mix(uChar, vec3(0.56, 0.54, 0.52), 0.7);
  color = mix(color, smokeTone, clamp(haze * 0.55, 0.0, 0.6));
  gl_FragColor = vec4(color, 1.0);
}`;

const SPARKS_VERTEX = `uniform sampler2D uField;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPocketAt;
uniform float uPocketReach;
uniform vec2 uOrigin;
uniform float uRadius;
uniform float uBurning;
uniform vec2 uAspect;
uniform float uAmount;
uniform float uScale;
attribute float aSeed;
varying float vAlpha;
varying float vHeat;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  float period = 0.55 + hash(aSeed * 3.1) * 0.6;
  float phase = hash(aSeed * 7.7);
  float clock = uTime / period + phase;
  float cycle = floor(clock);
  float age = fract(clock);
  float seed = aSeed * 13.1 + cycle * 1.618;
  vec2 spawn = vec2(-1.0);
  float best = 0.0;
  bool pocketSide = hash(seed + 2.0) < 0.5 || uBurning < 0.5;
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    float angle = hash(seed + fk * 3.7) * 6.2831853;
    vec2 candidate;
    if (pocketSide) {
      float r = uPocketReach * (0.4 + 0.8 * hash(seed + 4.0 + fk));
      candidate = uPocketAt + vec2(cos(angle), sin(angle)) * r / uAspect;
    } else {
      float r = uRadius * (0.62 + 0.76 * hash(seed + 4.0 + fk));
      candidate = uOrigin + vec2(cos(angle), sin(angle)) * r / uAspect;
    }
    vec4 probe = texture2D(uField, candidate);
    float edge = 1.0 - smoothstep(0.08, 0.2, abs(max(probe.r, probe.g) - 0.5));
    float score = probe.b * edge * step(0.0, candidate.x) * step(candidate.x, 1.0) * step(0.0, candidate.y) * step(candidate.y, 1.0);
    if (score > best) {
      best = score;
      spawn = candidate;
    }
  }
  float live = smoothstep(0.25, 0.7, best);
  float keep = step(hash(seed + 9.0), uAmount);
  vec2 velocity = vec2((hash(seed + 5.0) - 0.5) * 0.16, 0.08 + hash(seed + 6.0) * 0.2);
  vec2 drift = vec2(sin(age * 9.0 + seed) * 0.012, 0.0);
  vec2 at = spawn + (velocity * age - vec2(0.0, 0.1) * age * age + drift) * vec2(1.0 / uAspect.x, 1.0);
  vAlpha = live * keep * smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.35, 1.0, age));
  vHeat = 1.0 - age;
  gl_Position = vec4(at * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = vAlpha > 0.0 ? (2.0 + 2.6 * hash(seed + 8.0)) * uScale * (1.0 - age * 0.55) : 0.0;
}`;

const SPARKS_FRAGMENT = `uniform vec3 uEmber;
varying float vAlpha;
varying float vHeat;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float falloff = exp(-dot(c, c) * 18.0);
  vec3 hot = mix(uEmber, vec3(1.0, 0.86, 0.52), vHeat * 0.55);
  gl_FragColor = vec4(hot * 1.2, falloff * vAlpha);
}`;

export const EmberReveal = forwardRef<EmberRevealHandle, EmberRevealProps>(function EmberReveal(
  {
    images,
    aspectRatio = 4 / 3,
    radius = 16,
    emberColor = '#FF7A1F',
    charColor = '#1C120C',
    glow = 1,
    edge = 1,
    roughness = 0.5,
    detail = 5,
    scorch = 0.7,
    smoke = 0.4,
    sparks = 0.5,
    shimmer = 0.6,
    burnDuration = 1.8,
    pocketSize = 90,
    heal = 0.3,
    follow = 0.12,
    hover = true,
    clickToBurn = true,
    autoplay = false,
    interval = 3.5,
    idleDelay = 2.5,
    loop = true,
    onChange,
    className = '',

    style
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<{
    sync: () => void;
    destroy: () => void;
    ignite: (x?: number, y?: number) => void;
    reset: () => void;
  } | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const rawList = images && images.length ? images : DEFAULT_IMAGES;
  const normalizedSources: EmberRevealImage[] = rawList.map((item, i) =>
    typeof item === 'string' ? { src: item, alt: `Image ${i + 1}` } : { src: item.src, alt: item.alt ?? `Image ${i + 1}` }
  );
  const sources = normalizedSources.length === 1 ? [normalizedSources[0], normalizedSources[0]] : normalizedSources;
  const sourcesKey = sources.map(s => s.src).join('|');

  const configRef = useRef({
    sources,
    emberColor,
    charColor,
    glow,
    edge,
    roughness,
    detail,
    scorch,
    smoke,
    sparks,
    shimmer,
    burnDuration,
    pocketSize,
    heal,
    follow,
    hover,
    clickToBurn,
    autoplay,
    interval,
    idleDelay,
    loop,
    reduced: reducedMotion,
    onChange
  });

  useEffect(() => {
    configRef.current = {
      sources,
      emberColor,
      charColor,
      glow,
      edge,
      roughness,
      detail,
      scorch,
      smoke,
      sparks,
      shimmer,
      burnDuration,
      pocketSize,
      heal,
      follow,
      hover,
      clickToBurn,
      autoplay,
      interval,
      idleDelay,
      loop,
      reduced: reducedMotion,
      onChange
    };
    engineRef.current?.sync();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 240ms ease';
    container.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance'
      });
    } catch {
      canvas.remove();
      setHasFailed(true);
      return;
    }
    renderer.autoClear = true;

    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const planeGeom = new THREE.PlaneGeometry(2, 2);

    const renderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false
    };

    let fieldTargets = [
      new THREE.WebGLRenderTarget(4, 4, renderTargetOptions),
      new THREE.WebGLRenderTarget(4, 4, renderTargetOptions)
    ];
    let smokeTargets = [
      new THREE.WebGLRenderTarget(4, 4, renderTargetOptions),
      new THREE.WebGLRenderTarget(4, 4, renderTargetOptions)
    ];

    const fieldMat = new THREE.ShaderMaterial({
      uniforms: {
        uPrevious: { value: null },
        uAspect: { value: new THREE.Vector2(1, 1) },
        uFrom: { value: new THREE.Vector2(0.5, 0.5) },
        uTo: { value: new THREE.Vector2(0.5, 0.5) },
        uPocket: { value: 0.1 },
        uPocketOn: { value: 0 },
        uHeal: { value: 1 },
        uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0 },
        uBurning: { value: 0 },
        uClear: { value: 0 },
        uFade: { value: 1 },
        uLobes: { value: 0.3 },
        uSeed: { value: 40 * Math.random() }
      },
      vertexShader: VERTEX_QUAD,
      fragmentShader: FIELD_FRAGMENT,
      depthTest: false,
      depthWrite: false
    });

    const smokeMat = new THREE.ShaderMaterial({
      uniforms: {
        uSmoke: { value: null },
        uField: { value: null },
        uAspect: { value: new THREE.Vector2(1, 1) },
        uTexel: { value: new THREE.Vector2(0.01, 0.01) },
        uDt: { value: 0.016 },
        uTime: { value: 0 },
        uDecay: { value: 0.98 },
        uClear: { value: 0 }
      },
      vertexShader: VERTEX_QUAD,
      fragmentShader: SMOKE_FRAGMENT,
      depthTest: false,
      depthWrite: false
    });

    const compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        uField: { value: null },
        uSmokeMap: { value: null },
        uFieldSize: { value: new THREE.Vector2(1, 1) },
        uImageA: { value: null },
        uImageB: { value: null },
        uSizeA: { value: new THREE.Vector2(1, 1) },
        uSizeB: { value: new THREE.Vector2(1, 1) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uEmber: { value: new THREE.Color(1, 0.42, 0.1) },
        uChar: { value: new THREE.Color(0.1, 0.06, 0.04) },
        uGlow: { value: 1 },
        uEdge: { value: 1 },
        uRough: { value: 0.35 },
        uDetail: { value: 5 },
        uScorch: { value: 0.7 },
        uSmoke: { value: 0.4 },
        uShimmer: { value: 0.6 },
        uPixelRatio: { value: 1 }
      },
      vertexShader: VERTEX_QUAD,
      fragmentShader: COMPOSITE_FRAGMENT,
      depthTest: false,
      depthWrite: false
    });

    const sparkCount = 220;
    const aSeed = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) aSeed[i] = i + 1;

    const sparksGeo = new THREE.BufferGeometry();
    sparksGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(sparkCount * 3), 3));
    sparksGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(aSeed, 1));

    const sparksMat = new THREE.ShaderMaterial({
      uniforms: {
        uField: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uPocketAt: { value: new THREE.Vector2(-1, -1) },
        uPocketReach: { value: 0.1 },
        uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0 },
        uBurning: { value: 0 },
        uAspect: { value: new THREE.Vector2(1, 1) },
        uAmount: { value: 0.5 },
        uScale: { value: 1 },
        uEmber: { value: new THREE.Color(1, 0.42, 0.1) }
      },
      vertexShader: SPARKS_VERTEX,
      fragmentShader: SPARKS_FRAGMENT,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    });

    const fieldScene = new THREE.Scene();
    fieldScene.add(new THREE.Mesh(planeGeom, fieldMat));

    const smokeScene = new THREE.Scene();
    smokeScene.add(new THREE.Mesh(planeGeom, smokeMat));

    const compositeScene = new THREE.Scene();
    const compositeMesh = new THREE.Mesh(planeGeom, compositeMat);
    compositeMesh.frustumCulled = false;

    const sparksPoints = new THREE.Points(sparksGeo, sparksMat);
    sparksPoints.frustumCulled = false;
    sparksPoints.renderOrder = 1;
    compositeScene.add(compositeMesh, sparksPoints);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const textureCache = new Map<string, THREE.Texture | 'loading' | 'failed'>();
    let destroyed = false;
    let rafId = 0;
    let lastTime = 0;
    let totalElapsedTime = 0;
    let isIntersecting = true;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let localIndex = 0;
    let isReady = false;
    let canvasVisible = false;

    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointerPos = { x: 0.5, y: 0.5 };
    const pointerVel = { x: 0, y: 0 };
    const prevPointerPos = { x: 0.5, y: 0.5 };
    let isPointerOver = false;
    let pocketOn = 0;
    let pocketActivity = 0;
    let isBurning = false;
    let burnRadius = 0;
    let burnTime = 0;
    let maxBurnRadius = 1;
    const burnOrigin = { x: 0.5, y: 0.5 };
    let clearField = false;
    let lastInteractionTime = -1e9;
    let nextAutoplayTime = performance.now() + 1600;
    const autoplayState = { active: false, time: 0, seed: 10 * Math.random() };

    const getTexture = (offset: number): THREE.Texture | null => {
      const list = configRef.current.sources;
      const src = list[(localIndex + offset + 4 * list.length) % list.length].src;
      let cached = textureCache.get(src);
      if (!cached) {
        textureCache.set(src, 'loading');
        textureLoader.load(
          src,
          tex => {
            if (destroyed) {
              tex.dispose();
              return;
            }
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
            textureCache.set(src, tex);
            scheduleRender();
          },
          undefined,
          () => {
            textureCache.set(src, 'failed');
            if (configRef.current.sources.every(s => textureCache.get(s.src) === 'failed')) {
              setHasFailed(true);
            }
          }
        );
        cached = 'loading';
      }
      return cached instanceof THREE.Texture ? cached : null;
    };

    const getImgDims = (tex: THREE.Texture) => {
      const img = tex.image as HTMLImageElement | undefined;
      return { x: img?.width || 1, y: img?.height || 1 };
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);

      const scale = Math.min(1, 640 / Math.max(width, height));
      const fw = Math.max(8, Math.round(width * scale));
      const fh = Math.max(8, Math.round(height * scale));

      fieldTargets.forEach(t => t.dispose());
      smokeTargets.forEach(t => t.dispose());

      fieldTargets = [
        new THREE.WebGLRenderTarget(fw, fh, renderTargetOptions),
        new THREE.WebGLRenderTarget(fw, fh, renderTargetOptions)
      ];

      const sw = Math.max(8, Math.round(fw / 2));
      const sh = Math.max(8, Math.round(fh / 2));
      smokeTargets = [
        new THREE.WebGLRenderTarget(sw, sh, renderTargetOptions),
        new THREE.WebGLRenderTarget(sw, sh, renderTargetOptions)
      ];

      [...fieldTargets, ...smokeTargets].forEach(rt => {
        renderer.setRenderTarget(rt);
        renderer.clear();
      });

      compositeMat.uniforms.uFieldSize.value.set(fw, fh);
      smokeMat.uniforms.uTexel.value.set(1 / sw, 1 / sh);
      renderer.setRenderTarget(null);

      const aspect = width / height;
      const aspectVec = aspect >= 1 ? new THREE.Vector2(aspect, 1) : new THREE.Vector2(1, 1 / aspect);
      fieldMat.uniforms.uAspect.value.copy(aspectVec);
      smokeMat.uniforms.uAspect.value.copy(aspectVec);
      sparksMat.uniforms.uAspect.value.copy(aspectVec);

      compositeMat.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
      sparksMat.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
      sparksMat.uniforms.uScale.value = pixelRatio;
      compositeMat.uniforms.uPixelRatio.value = pixelRatio;

      scheduleRender();
    };

    let queuedBurn: { x: number; y: number } | null = null;
    const triggerBurn = (x = 0.5, y = 0.5) => {
      const cfg = configRef.current;
      if (!isReady) {
        queuedBurn = { x, y };
        return;
      }
      if (isBurning) {
        if (cfg.loop) queuedBurn = { x, y };
        return;
      }
      if (!cfg.loop && localIndex >= cfg.sources.length - 1) {
        return;
      }
      if (cfg.reduced) {
        localIndex = (localIndex + 1) % cfg.sources.length;
        setCurrentIndex(localIndex);
        cfg.onChange?.(localIndex);
        scheduleRender();
        return;
      }
      burnOrigin.x = clamp(x, 0, 1);
      burnOrigin.y = clamp(y, 0, 1);
      isBurning = true;
      burnTime = 0;
      burnRadius = 0;

      const asp = fieldMat.uniforms.uAspect.value;
      let maxDist = 0;
      for (const corner of [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ]) {
        maxDist = Math.max(maxDist, Math.hypot((corner.x - burnOrigin.x) * asp.x, (corner.y - burnOrigin.y) * asp.y));
      }
      maxBurnRadius = maxDist + 0.25 + 0.4 * cfg.roughness;
      scheduleRender();
    };

    let idleTimeout = 0;
    let activityWindow = 0;

    const animate = (now: number) => {
      rafId = 0;
      if (destroyed) return;

      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      // Update simulation physics
      (() => {
        const cfg = configRef.current;
        totalElapsedTime += dt;
        const isIdle = now - lastInteractionTime > 1000 * cfg.idleDelay;
        autoplayState.active = cfg.autoplay && !cfg.reduced && !isPointerOver && isIdle && isIntersecting;

        let activeTarget = isPointerOver ? pointerTarget : null;
        if (autoplayState.active) {
          autoplayState.time += dt;
          const t = 0.32 * autoplayState.time + autoplayState.seed;
          activeTarget = {
            x: 0.5 + 0.3 * Math.sin(1.3 * t) * Math.cos(0.41 * t),
            y: 0.5 + 0.26 * Math.sin(0.9 * t + 1.1)
          };
          if (!isBurning && now >= nextAutoplayTime && isReady) {
            triggerBurn(activeTarget.x, activeTarget.y);
            nextAutoplayTime = now + 1000 * cfg.interval + 1000 * cfg.burnDuration;
          }
        }

        const hoverActive = !!activeTarget && cfg.hover && !cfg.reduced && cfg.pocketSize > 0;
        pocketOn += (Number(hoverActive) - pocketOn) * (1 - Math.exp(-dt / 0.12));

        prevPointerPos.x = pointerPos.x;
        prevPointerPos.y = pointerPos.y;

        if (activeTarget) {
          const spring = 2 / Math.max(0.01, cfg.follow);
          const subSteps = Math.max(1, Math.ceil(dt / (1 / 240)));
          const subDt = dt / subSteps;
          for (let i = 0; i < subSteps; i++) {
            pointerVel.x += (spring * spring * (activeTarget.x - pointerPos.x) - 2 * spring * pointerVel.x) * subDt;
            pointerVel.y += (spring * spring * (activeTarget.y - pointerPos.y) - 2 * spring * pointerVel.y) * subDt;
            pointerPos.x += pointerVel.x * subDt;
            pointerPos.y += pointerVel.y * subDt;
          }
          if (pocketOn < 0.02) {
            pointerPos.x = activeTarget.x;
            pointerPos.y = activeTarget.y;
            prevPointerPos.x = activeTarget.x;
            prevPointerPos.y = activeTarget.y;
            pointerVel.x = 0;
            pointerVel.y = 0;
          }
        }

        pocketActivity = Math.max(pocketOn, pocketActivity * Math.exp(-dt / Math.max(0.05, cfg.heal)));
        if (isBurning || pocketOn > 0.01) {
          activityWindow = now + 2600;
        }

        if (isBurning) {
          burnTime += dt;
          const burnSpeed = maxBurnRadius / Math.max(0.3, cfg.burnDuration);
          burnRadius += burnSpeed * dt * Math.min(1, 0.25 + burnTime / 0.35);

          if (burnRadius >= maxBurnRadius) {
            isBurning = false;
            burnRadius = 0;
            clearField = true;
            if (cfg.loop || localIndex < cfg.sources.length - 1) {
              localIndex = (localIndex + 1) % cfg.sources.length;
            }
            setCurrentIndex(localIndex);
            cfg.onChange?.(localIndex);

            if (queuedBurn && cfg.loop) {
              const q = queuedBurn;
              queuedBurn = null;
              window.setTimeout(() => {
                if (!destroyed) triggerBurn(q.x, q.y);
              }, 60);
            }
          }
        }
      })();

      // Render step
      (() => {
        const cfg = configRef.current;
        const texA = getTexture(0);
        const texB = getTexture(1);
        getTexture(2); // preload next

        if (!texA || !texB) return;
        if (!isReady) {
          isReady = true;
          setCurrentIndex(localIndex);
          if (queuedBurn) {
            const q = queuedBurn;
            queuedBurn = null;
            triggerBurn(q.x, q.y);
          }
        }

        const minDim = Math.min(width, height);
        const emberRgb = parseColor(cfg.emberColor, [1, 0.42, 0.1]);
        const charRgb = parseColor(cfg.charColor, [0.1, 0.06, 0.04]);

        // 1. Pass 1: Burn Field
        const fu = fieldMat.uniforms;
        fu.uPrevious.value = fieldTargets[0].texture;
        fu.uFrom.value.set(prevPointerPos.x, 1 - prevPointerPos.y);
        fu.uTo.value.set(pointerPos.x, 1 - pointerPos.y);
        fu.uPocket.value = (clamp(cfg.pocketSize, 0, 400) / minDim) * 1.35;
        fu.uPocketOn.value = pocketOn;
        fu.uHeal.value = Math.exp(-dt / Math.max(0.05, cfg.heal));
        fu.uOrigin.value.set(burnOrigin.x, 1 - burnOrigin.y);
        fu.uRadius.value = burnRadius;
        fu.uBurning.value = Number(isBurning);
        fu.uClear.value = Number(clearField);
        fu.uFade.value = Math.exp(-dt / 0.45);

        renderer.setRenderTarget(fieldTargets[1]);
        renderer.render(fieldScene, orthoCamera);
        renderer.setRenderTarget(null);
        fieldTargets = [fieldTargets[1], fieldTargets[0]];

        // 2. Pass 2: Smoke Map
        const su = smokeMat.uniforms;
        su.uSmoke.value = smokeTargets[0].texture;
        su.uField.value = fieldTargets[0].texture;
        su.uDt.value = dt;
        su.uTime.value = totalElapsedTime;
        su.uDecay.value = Math.exp(-dt / 1.1);
        su.uClear.value = cfg.smoke > 0 && !cfg.reduced ? 0 : 1;

        renderer.setRenderTarget(smokeTargets[1]);
        renderer.render(smokeScene, orthoCamera);
        renderer.setRenderTarget(null);
        smokeTargets = [smokeTargets[1], smokeTargets[0]];
        clearField = false;

        // 3. Pass 3: Composite Image
        const cu = compositeMat.uniforms;
        cu.uField.value = fieldTargets[0].texture;
        cu.uSmokeMap.value = smokeTargets[0].texture;
        cu.uImageA.value = texA;
        cu.uImageB.value = texB;

        const dimsA = getImgDims(texA);
        const dimsB = getImgDims(texB);
        cu.uSizeA.value.set(dimsA.x, dimsA.y);
        cu.uSizeB.value.set(dimsB.x, dimsB.y);
        cu.uTime.value = totalElapsedTime;
        cu.uEmber.value.set(emberRgb[0], emberRgb[1], emberRgb[2]);
        cu.uChar.value.set(charRgb[0], charRgb[1], charRgb[2]);
        cu.uGlow.value = clamp(cfg.glow, 0, 3);
        cu.uEdge.value = clamp(cfg.edge, 0.2, 4);
        cu.uRough.value = 1.1 * clamp(cfg.roughness, 0, 1);
        fu.uLobes.value = 0.55 * clamp(cfg.roughness, 0, 1);
        cu.uDetail.value = clamp(cfg.detail, 0.5, 20);
        cu.uScorch.value = clamp(cfg.scorch, 0, 1);
        cu.uSmoke.value = cfg.reduced ? 0 : clamp(cfg.smoke, 0, 1);
        cu.uShimmer.value = cfg.reduced ? 0 : clamp(cfg.shimmer, 0, 1);

        // 4. Pass 4: Sparks Particles
        const spu = sparksMat.uniforms;
        spu.uField.value = fieldTargets[0].texture;
        spu.uTime.value = totalElapsedTime;
        spu.uPocketAt.value.set(pointerPos.x, 1 - pointerPos.y);
        spu.uPocketReach.value = (clamp(cfg.pocketSize, 0, 400) / minDim) * 1.0;
        spu.uOrigin.value.set(burnOrigin.x, 1 - burnOrigin.y);
        spu.uRadius.value = burnRadius;
        spu.uBurning.value = Number(isBurning);
        spu.uAmount.value = cfg.reduced ? 0 : clamp(cfg.sparks, 0, 1);
        spu.uEmber.value.set(emberRgb[0], emberRgb[1], emberRgb[2]);
        sparksPoints.visible = spu.uAmount.value > 0;

        renderer.render(compositeScene, orthoCamera);
        if (!canvasVisible) {
          canvasVisible = true;
          canvas.style.opacity = '1';
        }
      })();

      // Check if continuous animation frames are needed
      if (
        isIntersecting &&
        (isBurning ||
          pocketOn > 0.001 ||
          pocketActivity > 0.002 ||
          autoplayState.active ||
          isPointerOver ||
          !isReady ||
          performance.now() < activityWindow)
      ) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Otherwise schedule next autoplay wake-up
      const cfg = configRef.current;
      if (cfg.autoplay && !cfg.reduced && isIntersecting) {
        const delay = Math.max(lastInteractionTime + 1000 * cfg.idleDelay, nextAutoplayTime) - now;
        window.clearTimeout(idleTimeout);
        idleTimeout = window.setTimeout(scheduleRender, Math.max(30, Math.min(delay, 2000)));
      }
    };

    const scheduleRender = () => {
      if (!destroyed && !rafId && isIntersecting) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    };

    const getNormalizedPointer = (ev: PointerEvent | MouseEvent) => {
      const rect = container.getBoundingClientRect();
      return {
        x: clamp((ev.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
        y: clamp((ev.clientY - rect.top) / Math.max(1, rect.height), 0, 1)
      };
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch') return;
      const pt = getNormalizedPointer(ev);
      pointerTarget.x = pt.x;
      pointerTarget.y = pt.y;
      if (!isPointerOver) {
        pointerPos.x = pt.x;
        pointerPos.y = pt.y;
      }
      isPointerOver = true;
      lastInteractionTime = performance.now();
      scheduleRender();
    };

    const onPointerLeave = () => {
      isPointerOver = false;
      lastInteractionTime = performance.now();
      scheduleRender();
    };

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const cfg = configRef.current;
      lastInteractionTime = performance.now();
      nextAutoplayTime = performance.now() + 1000 * cfg.interval;
      if (!cfg.clickToBurn) return;
      const pt = getNormalizedPointer(ev);
      triggerBurn(pt.x, pt.y);
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        lastInteractionTime = performance.now();
        if (configRef.current.clickToBurn) {
          triggerBurn(0.5, 0.5);
        }
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('keydown', onKeyDown);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      entries => {
        isIntersecting = entries.some(e => e.isIntersecting);
        if (isIntersecting) scheduleRender();
      },
      { rootMargin: '100px' }
    );
    intersectionObserver.observe(container);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setHasFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    resize();

    engineRef.current = {
      sync: () => {
        const cfg = configRef.current;
        if (localIndex >= cfg.sources.length) {
          localIndex = 0;
        }
        scheduleRender();
      },
      destroy: () => {
        destroyed = true;
        cancelAnimationFrame(rafId);
        window.clearTimeout(idleTimeout);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        textureCache.forEach(t => {
          if (t instanceof THREE.Texture) t.dispose();
        });
        textureCache.clear();
        fieldTargets.forEach(t => t.dispose());
        smokeTargets.forEach(t => t.dispose());
        planeGeom.dispose();
        sparksGeo.dispose();
        fieldMat.dispose();
        smokeMat.dispose();
        compositeMat.dispose();
        sparksMat.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      },
      ignite: (x, y) => {
        lastInteractionTime = performance.now();
        triggerBurn(x ?? 0.5, y ?? 0.5);
      },
      reset: () => {
        isBurning = false;
        burnRadius = 0;
        clearField = true;
        localIndex = 0;
        setCurrentIndex(0);
        scheduleRender();
      }
    };

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [sourcesKey]);

  useImperativeHandle(
    ref,
    () => ({
      ignite: (x, y) => engineRef.current?.ignite(x, y),
      next: () => {
        if (engineRef.current) {
          engineRef.current.ignite(0.5, 0.5);
        } else {
          setCurrentIndex(i => (i + 1) % sources.length);
        }
      },
      reset: () => {
        engineRef.current?.reset();
        setCurrentIndex(0);
      }
    }),
    [sources.length]
  );

  const currentItem = sources[currentIndex % sources.length];
  const nextItem = sources[(currentIndex + 1) % sources.length];

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={`${currentItem.alt}. Press to burn through to ${nextItem.alt}.`}
      className={`relative isolate w-full cursor-crosshair touch-manipulation select-none overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${className}`}
      style={{
        aspectRatio: aspectRatio > 0 ? String(aspectRatio) : undefined,
        height: aspectRatio > 0 ? undefined : '100%',
        borderRadius: radius,
        background: '#0a0a0a',
        ...style
      }}
      onClick={() => {
        if (hasFailed) {
          setCurrentIndex(i => (i + 1) % sources.length);
        }
      }}
    >
      <img
        src={currentItem.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
});

EmberReveal.displayName = 'EmberReveal';
export default EmberReveal;
