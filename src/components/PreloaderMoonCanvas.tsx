import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PreloaderMoonCanvasProps {
  active: boolean;
  onSequenceComplete?: () => void;
}

export function PreloaderMoonCanvas({ active }: PreloaderMoonCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Shot 1: Distant start position Z=6.5)
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 6.5);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Procedural High-Detail Lunar Surface Texture
    const createLunarTextures = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? 1024 : 2048;
      const height = isMobile ? 512 : 1024;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return { map: null, bumpMap: null };

      ctx.fillStyle = '#d0cdcf';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const u = ((i / 4) % canvas.width) / canvas.width;
        const v = Math.floor((i / 4) / canvas.width) / canvas.height;

        const mariaPattern = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 3) + Math.sin(u * Math.PI * 10) * 0.5;
        const noise = (Math.random() - 0.5) * 22;

        let tone = 205 + noise;
        if (mariaPattern > 0.3) tone -= 45 * (mariaPattern - 0.3);

        tone = Math.max(110, Math.min(235, tone));
        data[i] = tone;
        data[i + 1] = tone - 4;
        data[i + 2] = tone - 8;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      const drawCrater = (x: number, y: number, r: number) => {
        const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
        grad.addColorStop(0, 'rgba(100, 95, 88, 0.75)');
        grad.addColorStop(0.7, 'rgba(150, 145, 135, 0.45)');
        grad.addColorStop(0.85, 'rgba(235, 230, 220, 0.95)');
        grad.addColorStop(1, 'rgba(208, 205, 197, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const scale = width / 2048;
      drawCrater(1024 * scale, 512 * scale, 115 * scale);

      const craterCount = isMobile ? 65 : 120;
      for (let c = 0; c < craterCount; c++) {
        const cx = Math.random() * canvas.width;
        const cy = Math.random() * canvas.height;
        const radius = (Math.random() * 28 + 4) * scale;
        drawCrater(cx, cy, radius);
      }

      const textureMap = new THREE.CanvasTexture(canvas);

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = width / 2;
      bumpCanvas.height = height / 2;
      const bCtx = bumpCanvas.getContext('2d');
      if (bCtx) bCtx.drawImage(canvas, 0, 0, bumpCanvas.width, bumpCanvas.height);
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);

      return { map: textureMap, bumpMap };
    };

    const { map, bumpMap } = createLunarTextures();

    // 5. Realistic Moon Geometry & Material
    const geometry = new THREE.SphereGeometry(1.6, 56, 56);
    const material = new THREE.MeshStandardMaterial({
      map: map,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 0.88,
      metalness: 0.06,
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.y = -Math.PI / 4;
    scene.add(moon);

    // 6. Soft Cinematic Lighting Setup
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    keyLight.position.set(6, 3.5, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb89a62, 0.85); // Champagne Gold reflected fill
    fillLight.position.set(-4.5, -2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc8ccce, 0.65);
    rimLight.position.set(-3.5, 4.5, -4.5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x181917, 0.35);
    scene.add(ambientLight);

    // 7. Shot 1, 2, 3 & Stage 5 Crater Approach and Entry Timeline
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Slow base rotational drift
      moon.rotation.y = -Math.PI / 4 + elapsed * 0.035;

      // Parallax camera orbit
      const orbitX = Math.sin(elapsed * 0.2) * 0.35;
      const orbitY = Math.cos(elapsed * 0.18) * 0.2 + 0.15;

      // Camera approach towards feature crater projection (Z=6.5 -> 1.65)
      const targetZ = Math.max(1.65, 6.5 - elapsed * 1.15);

      camera.position.x = orbitX;
      camera.position.y = orbitY;
      camera.position.z = targetZ;
      camera.lookAt(moon.position);

      // As camera enters the crater interior (Z < 2.0), tone mapping exposure and fill lighting decrease into crater shadow darkness
      if (targetZ < 2.2) {
        const shadowFactor = Math.max(0, (targetZ - 1.65) / 0.55);
        renderer.toneMappingExposure = 0.2 + shadowFactor * 0.95;
        fillLight.intensity = shadowFactor * 0.85;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
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
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
