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

    // Set initial opacity of the container to 0 for a smooth fade-in
    container.style.opacity = '0';

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Start far away for Shot 1)
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Procedural High-Detail Lunar Surface Texture
    const createLunarTextures = () => {
      const width = 2048;
      const height = 1024;

      // Create a heightmap array
      const heights = new Float32Array(width * height);
      
      // Initialize heights with base noise (lunar highlands & plains roughness)
      for (let i = 0; i < heights.length; i++) {
        const u = (i % width) / width;
        const v = Math.floor(i / width) / height;
        // Multi-frequency noise for base rocky detail
        const n1 = Math.sin(u * Math.PI * 8) * Math.cos(v * Math.PI * 6) * 0.02;
        const n2 = Math.sin(u * Math.PI * 32) * Math.cos(v * Math.PI * 24) * 0.005;
        const n3 = (Math.random() - 0.5) * 0.008; // micro-roughness
        heights[i] = 0.5 + n1 + n2 + n3;
      }

      // Draw craters on the heightmap
      const carveCrater = (cx: number, cy: number, r: number, depth: number, rimHeight: number, hasCentralPeak: boolean) => {
        const startX = Math.max(0, Math.floor(cx - r * 1.8));
        const endX = Math.min(width - 1, Math.ceil(cx + r * 1.8));
        const startY = Math.max(0, Math.floor(cy - r * 1.8));
        const endY = Math.min(height - 1, Math.ceil(cy + r * 1.8));

        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            let dx = x - cx;
            // Handle wrapping for equirectangular seam
            if (dx > width / 2) dx -= width;
            if (dx < -width / 2) dx += width;
            const dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            
            if (d > r * 1.6) continue;

            const t = d / r;
            const idx = y * width + x;

            let hChange = 0;
            // Bowl depression
            if (t < 1.0) {
              hChange -= depth * Math.cos(t * Math.PI * 0.5);
            }
            // Raised rim
            if (t > 0.7 && t < 1.5) {
              const rimT = (t - 0.7) / 0.8; // 0 to 1
              hChange += rimHeight * Math.sin(rimT * Math.PI);
            }
            // Central peak
            if (hasCentralPeak && t < 0.12) {
              hChange += depth * 0.35 * Math.cos((t / 0.12) * Math.PI * 0.5);
            }

            heights[idx] += hChange;
          }
        }
      };

      // Carve the main transition crater right in the middle (U=0.5, V=0.5)
      carveCrater(width * 0.5, height * 0.5, 95, 0.14, 0.05, true);

      // Carve random background craters of various sizes
      for (let c = 0; c < 150; c++) {
        const cx = Math.random() * width;
        const cy = 0.15 * height + Math.random() * height * 0.7; // avoid poles
        const r = 8 + Math.random() * 32;
        const depth = 0.02 + Math.random() * 0.04;
        const rim = depth * 0.35;
        const peak = r > 18 && Math.random() > 0.5;
        // Don't overwrite the main transition crater area
        let dx = cx - width * 0.5;
        if (dx > width / 2) dx -= width;
        if (dx < -width / 2) dx += width;
        const dy = cy - height * 0.5;
        if (Math.sqrt(dx * dx + dy * dy) < 180) continue;

        carveCrater(cx, cy, r, depth, rim, peak);
      }

      // Convert heightmap to maps (Diffuse, Normal, Roughness, Displacement)
      const colorCanvas = document.createElement('canvas');
      colorCanvas.width = width;
      colorCanvas.height = height;
      const cCtx = colorCanvas.getContext('2d')!;
      const cImg = cCtx.createImageData(width, height);

      const normalCanvas = document.createElement('canvas');
      normalCanvas.width = width;
      normalCanvas.height = height;
      const nCtx = normalCanvas.getContext('2d')!;
      const nImg = nCtx.createImageData(width, height);

      const roughnessCanvas = document.createElement('canvas');
      roughnessCanvas.width = width;
      roughnessCanvas.height = height;
      const rCtx = roughnessCanvas.getContext('2d')!;
      const rImg = rCtx.createImageData(width, height);

      const dispCanvas = document.createElement('canvas');
      dispCanvas.width = width;
      dispCanvas.height = height;
      const dCtx = dispCanvas.getContext('2d')!;
      const dImg = dCtx.createImageData(width, height);

      const getH = (x: number, y: number) => {
        const tx = (x + width) % width;
        const ty = Math.max(0, Math.min(height - 1, y));
        return heights[ty * width + tx];
      };

      const normalStrength = 12.0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const h = heights[y * width + x];

          // 1. Color Map (Realistic gray tone with subtle maria shading and bright ejecta)
          let baseColor = 190;
          if (h < 0.48) {
            baseColor = 115 + (h - 0.3) * 220; // Maria: darker gray
          } else {
            baseColor = 175 + (h - 0.48) * 160; // Highlands: lighter gray
          }
          // Add micro color noise
          baseColor += (Math.random() - 0.5) * 8;
          baseColor = Math.max(30, Math.min(255, baseColor));

          cImg.data[idx] = baseColor;
          cImg.data[idx + 1] = baseColor - 2;
          cImg.data[idx + 2] = baseColor - 5;
          cImg.data[idx + 3] = 255;

          // 2. Normal Map computation using central difference
          const hL = getH(x - 1, y);
          const hR = getH(x + 1, y);
          const hU = getH(x, y - 1);
          const hD = getH(x, y + 1);

          const nx = -(hR - hL) * normalStrength;
          const ny = -(hD - hU) * normalStrength;
          const nz = 1.0;
          const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

          nImg.data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
          nImg.data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
          nImg.data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
          nImg.data[idx + 3] = 255;

          // 3. Roughness Map (Maria is smoother, highlands/rims rougher)
          const roughness = h < 0.48 ? 0.72 : 0.92;
          rImg.data[idx] = roughness * 255;
          rImg.data[idx + 1] = roughness * 255;
          rImg.data[idx + 2] = roughness * 255;
          rImg.data[idx + 3] = 255;

          // 4. Displacement Map
          const dispVal = Math.max(0, Math.min(255, (h - 0.3) * 255));
          dImg.data[idx] = dispVal;
          dImg.data[idx + 1] = dispVal;
          dImg.data[idx + 2] = dispVal;
          dImg.data[idx + 3] = 255;
        }
      }

      // Add bright ejecta rays around the main crater on the color map
      cCtx.putImageData(cImg, 0, 0);
      cCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
        const length = 120 + Math.random() * 220;
        const targetX = width * 0.5 + Math.cos(angle) * length;
        const targetY = height * 0.5 + Math.sin(angle) * length;
        cCtx.beginPath();
        cCtx.moveTo(width * 0.5, height * 0.5);
        cCtx.lineTo(targetX, targetY);
        cCtx.lineWidth = 2 + Math.random() * 6;
        cCtx.stroke();
      }

      nCtx.putImageData(nImg, 0, 0);
      rCtx.putImageData(rImg, 0, 0);
      dCtx.putImageData(dImg, 0, 0);

      return {
        map: new THREE.CanvasTexture(colorCanvas),
        normalMap: new THREE.CanvasTexture(normalCanvas),
        roughnessMap: new THREE.CanvasTexture(roughnessCanvas),
        displacementMap: new THREE.CanvasTexture(dispCanvas),
      };
    };

    const textures = createLunarTextures();

    // 5. Realistic Moon Geometry (high detail for displacement mapping) & Material
    const geometry = new THREE.SphereGeometry(1.6, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: textures.map,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: textures.roughnessMap,
      displacementMap: textures.displacementMap,
      displacementScale: 0.05,
      displacementBias: -0.02,
      roughness: 0.85,
      metalness: 0.05,
    });

    const moon = new THREE.Mesh(geometry, material);
    // Align texture so that main crater (U=0.5) faces Z > 0 (front) when rotation.y = Math.PI
    moon.rotation.y = Math.PI - 0.3; 
    scene.add(moon);

    // 6. Realistic Cinematic Lighting
    // Strong directional sun light to create crisp shadows at the terminator
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    keyLight.position.set(10, 4, 8);
    scene.add(keyLight);

    // Very subtle cold rim backlight from deep space
    const rimLight = new THREE.DirectionalLight(0xaaccff, 0.8);
    rimLight.position.set(-10, -4, -10);
    scene.add(rimLight);

    // Restrained ambient light to keep shadowed regions dark
    const ambientLight = new THREE.AmbientLight(0x0a0a0b, 0.1);
    scene.add(ambientLight);

    // 7. Render Loop with Cinematic Choreography
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Fade in the canvas opacity during the first 1.5 seconds
      if (elapsed <= 1.5) {
        container.style.opacity = `${elapsed / 1.5}`;
      } else {
        container.style.opacity = '1';
      }

      // Eased Camera Dolly & Easing Timings
      // Discovery Phase: 0 to 1.5s -> stays at Z = 16, rotates slowly.
      // Dolly Phase: 1.5 to 7.5s -> dolly from Z = 16 to Z = 1.7.
      // Entry Phase: 7.5s to 9.0s -> dive into crater (Z goes to 1.58), fade lights/exposure.
      let targetZ = 16;
      let easeP = 0;

      if (elapsed > 1.5) {
        const dollyElapsed = Math.min(6.0, elapsed - 1.5);
        const p = dollyElapsed / 6.0; // 0 to 1
        // Cubic ease-in-out curve
        easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        targetZ = 16 - easeP * (16 - 1.7);
      }

      if (elapsed > 7.5) {
        const entryElapsed = Math.min(1.5, elapsed - 7.5);
        const p2 = entryElapsed / 1.5; // 0 to 1
        targetZ = 1.7 - p2 * (1.7 - 1.58);

        // Gradually fade out exposure and lights to simulate entering the dark crater
        const fadeFactor = 1.0 - p2;
        renderer.toneMappingExposure = 1.2 * fadeFactor;
        keyLight.intensity = 3.2 * fadeFactor;
        rimLight.intensity = 0.8 * fadeFactor;
        ambientLight.intensity = 0.1 * fadeFactor;
      }

      // Slow, physical Moon rotation ending up aligned with the crater at the end of the dolly
      moon.rotation.y = (Math.PI - 0.3) + easeP * 0.3;

      camera.position.set(0, 0, targetZ);
      camera.lookAt(moon.position);

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
      textures.map.dispose();
      textures.normalMap.dispose();
      textures.roughnessMap.dispose();
      textures.displacementMap.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-500"
      aria-hidden="true"
    />
  );
}
