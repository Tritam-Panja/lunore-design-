import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MoonHeroCanvasProps {
  className?: string;
}

export function MoonHeroCanvas({ className = '' }: MoonHeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 0. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - cinematic focal distance
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.2);

    // 3. Renderer setup - adaptive pixel ratio cap for GPU efficiency
    const maxPixelRatio = window.innerWidth < 768 ? 1.25 : 1.5;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Procedural High-Detail Lunar Surface Texture Generator (Adaptive resolution for mobile)
    const createLunarTextures = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? 1024 : 2048;
      const height = isMobile ? 512 : 1024;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return { map: null, bumpMap: null };

      // Base lunar ivory & pearl grey backdrop
      ctx.fillStyle = '#d5d2cb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Noise & Maria (lunar seas) details
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const u = ((i / 4) % canvas.width) / canvas.width;
        const v = Math.floor((i / 4) / canvas.width) / canvas.height;

        const mariaPattern = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 3) + Math.sin(u * Math.PI * 10) * 0.5;
        const noise = (Math.random() - 0.5) * 20;

        let tone = 210 + noise;
        if (mariaPattern > 0.3) {
          tone -= 45 * (mariaPattern - 0.3);
        }

        tone = Math.max(120, Math.min(240, tone));
        data[i] = tone;           // R
        data[i + 1] = tone - 4;   // G (slightly warm pearl)
        data[i + 2] = tone - 8;   // B (soft ivory warmth)
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      // Draw craters
      const drawCrater = (x: number, y: number, r: number) => {
        const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
        grad.addColorStop(0, 'rgba(110, 105, 98, 0.7)');
        grad.addColorStop(0.7, 'rgba(160, 155, 145, 0.4)');
        grad.addColorStop(0.85, 'rgba(240, 235, 225, 0.9)');
        grad.addColorStop(1, 'rgba(213, 210, 203, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const scale = width / 2048;
      drawCrater(1024 * scale, 512 * scale, 110 * scale);

      const craterCount = isMobile ? 60 : 110;
      for (let c = 0; c < craterCount; c++) {
        const cx = Math.random() * canvas.width;
        const cy = Math.random() * canvas.height;
        const radius = (Math.random() * 28 + 4) * scale;
        drawCrater(cx, cy, radius);
      }

      const textureMap = new THREE.CanvasTexture(canvas);

      // Bump map generation
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = width / 2;
      bumpCanvas.height = height / 2;
      const bCtx = bumpCanvas.getContext('2d');
      if (bCtx) {
        bCtx.drawImage(canvas, 0, 0, bumpCanvas.width, bumpCanvas.height);
      }
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);

      return { map: textureMap, bumpMap };
    };

    const { map, bumpMap } = createLunarTextures();

    // 5. Realistic Moon Mesh Geometry (48x48 segments for optimal mobile/desktop FPS balance)
    const sphereDetail = window.innerWidth < 768 ? 36 : 48;
    const geometry = new THREE.SphereGeometry(1.6, sphereDetail, sphereDetail);
    const material = new THREE.MeshStandardMaterial({
      map: map,
      bumpMap: bumpMap,
      bumpScale: 0.045,
      roughness: 0.88,
      metalness: 0.08,
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.y = -Math.PI / 4;
    scene.add(moon);

    // 6. Cinematic Lighting
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    keyLight.position.set(5, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb89865, 0.8);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc8ccce, 0.6);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x222426, 0.4);
    scene.add(ambientLight);

    // 7. Render Loop with Visibility Optimization (Pause RAF when Hero is out of viewport)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;
    let isCanvasVisible = true;

    // IntersectionObserver to pause rendering when hero scrolls out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isCanvasVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleScroll = () => {
      if (!isCanvasVisible) return;
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.9;
      targetScrollProgress = Math.max(0, Math.min(1, scrollY / heroHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip render calculations if canvas scrolled out of view or reduced motion is preferred
      if (!isCanvasVisible) return;

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

      // Ultra-slow, weightless base rotation
      const baseRotation = elapsedTime * 0.02;
      moon.rotation.y = -Math.PI / 4 + baseRotation + currentScrollProgress * 0.4;
      moon.rotation.x = currentScrollProgress * 0.15;

      // Camera approach towards feature crater
      const targetZ = 4.2 - currentScrollProgress * 2.45;
      camera.position.z = targetZ;

      // Subtle float motion dampens as camera approaches surface
      const floatFactor = 1 - currentScrollProgress;
      moon.position.y = Math.sin(elapsedTime * 0.4) * 0.04 * floatFactor;

      // Smooth opacity fade out of canvas as camera enters crater (> 70% scroll)
      if (containerRef.current) {
        const opacity = Math.max(0, 1 - (currentScrollProgress - 0.7) * 3.3);
        containerRef.current.style.opacity = `${opacity}`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive resize handling with debouncing
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (map) map.dispose();
      if (bumpMap) bumpMap.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
