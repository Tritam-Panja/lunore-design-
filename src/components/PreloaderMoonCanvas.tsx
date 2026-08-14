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
      
      // Initialize heights with base noise (5-octave fractal noise for lunar highlands & plains)
      for (let i = 0; i < heights.length; i++) {
        const u = (i % width) / width;
        const v = Math.floor(i / width) / height;
        
        let noise = 0;
        noise += Math.sin(u * Math.PI * 6) * Math.cos(v * Math.PI * 4) * 0.025;
        noise += Math.sin(u * Math.PI * 18) * Math.cos(v * Math.PI * 14) * 0.012;
        noise += Math.sin(u * Math.PI * 48) * Math.cos(v * Math.PI * 36) * 0.005;
        noise += Math.sin(u * Math.PI * 120) * Math.cos(v * Math.PI * 90) * 0.002;
        noise += (Math.random() - 0.5) * 0.006; // micro-roughness grit
        
        heights[i] = 0.5 + noise;
      }

      // Draw craters on the heightmap with geological realism (irregular shape, terraced walls)
      const carveCrater = (cx: number, cy: number, r: number, depth: number, rimHeight: number, hasCentralPeak: boolean) => {
        const startX = Math.max(0, Math.floor(cx - r * 1.9));
        const endX = Math.min(width - 1, Math.ceil(cx + r * 1.9));
        const startY = Math.max(0, Math.floor(cy - r * 1.9));
        const endY = Math.min(height - 1, Math.ceil(cy + r * 1.9));

        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            let dx = x - cx;
            // Handle wrapping for equirectangular seam
            if (dx > width / 2) dx -= width;
            if (dx < -width / 2) dx += width;
            const dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            
            if (d > r * 1.8) continue;

            // Perturb the radius using sine/cosine harmonics based on polar angle to create irregular rims
            const angle = Math.atan2(dy, dx);
            const noiseFactor = 1.0 + Math.sin(angle * 5.0) * 0.04 + Math.cos(angle * 3.0) * 0.02 + Math.sin(angle * 12.0) * 0.01;
            const perturbedR = r * noiseFactor;

            const t = d / perturbedR;
            if (t > 1.8) continue;

            const idx = y * width + x;
            let hChange = 0;

            // 1. Terraced bowl depression
            if (t < 1.0) {
              let bowlDepression = Math.cos(t * Math.PI * 0.5);
              // Concentric terraces
              if (t > 0.2 && t < 0.85) {
                const terrace = Math.sin((t - 0.2) / 0.65 * Math.PI * 3.0) * 0.025;
                bowlDepression += terrace;
              }
              hChange -= depth * bowlDepression;
            }
            // 2. Raised rim
            if (t > 0.7 && t < 1.6) {
              const rimT = (t - 0.7) / 0.9; // 0 to 1
              hChange += rimHeight * Math.sin(rimT * Math.PI);
            }
            // 3. Central peak
            if (hasCentralPeak && t < 0.15) {
              hChange += depth * 0.38 * Math.cos((t / 0.15) * Math.PI * 0.5);
            }

            heights[idx] += hChange;
          }
        }
      };

      // Carve the main transition crater right in the middle (U=0.5, V=0.5)
      carveCrater(width * 0.5, height * 0.5, 95, 0.15, 0.06, true);

      // Carve random background craters of various sizes
      for (let c = 0; c < 180; c++) {
        const cx = Math.random() * width;
        const cy = 0.15 * height + Math.random() * height * 0.7; // avoid poles
        const r = 6 + Math.random() * 30;
        const depth = 0.015 + Math.random() * 0.045;
        const rim = depth * 0.35;
        const peak = r > 18 && Math.random() > 0.5;
        
        let dx = cx - width * 0.5;
        if (dx > width / 2) dx -= width;
        if (dx < -width / 2) dx += width;
        const dy = cy - height * 0.5;
        const distToHero = Math.sqrt(dx * dx + dy * dy);

        // Prevent large background craters from obliterating the Hero Crater,
        // but allow small micro-impacts (r <= 12) to cross it for physical realism.
        if (distToHero < 180 && r > 12) continue;

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

          const hL = getH(x - 1, y);
          const hR = getH(x + 1, y);
          const hU = getH(x, y - 1);
          const hD = getH(x, y + 1);

          // 1. Color Map (Realistic gray tone with baked slope ambient occlusion)
          let baseColor = 175;
          if (h < 0.48) {
            baseColor = 100 + (h - 0.3) * 190; // Maria: darker gray
          } else {
            baseColor = 155 + (h - 0.48) * 140; // Highlands: lighter gray
          }

          // Bake slope AO: steeper terrain (cliffs, crater interior walls) gets darker
          const slope = Math.abs(hL - hR) + Math.abs(hU - hD);
          baseColor -= slope * 750; // darken slopes
          
          // Add micro color noise
          baseColor += (Math.random() - 0.5) * 10;
          baseColor = Math.max(25, Math.min(255, baseColor));

          cImg.data[idx] = baseColor;
          cImg.data[idx + 1] = baseColor - 2;
          cImg.data[idx + 2] = baseColor - 5;
          cImg.data[idx + 3] = 255;

          // 2. Normal Map computation using central difference
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
    const geometry = new THREE.SphereGeometry(1.6, 256, 256);
    const material = new THREE.MeshStandardMaterial({
      map: textures.map,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: textures.roughnessMap,
      displacementMap: textures.displacementMap,
      displacementScale: 0.06,
      displacementBias: -0.02,
      roughness: 0.95,
      metalness: 0.0,
    });

    const moon = new THREE.Mesh(geometry, material);
    // Align texture so that main crater (U=0.5) faces Z > 0 (front) when rotation.y = Math.PI
    moon.rotation.y = Math.PI - 0.3; 
    scene.add(moon);

    // 6. Realistic Cinematic Lighting
    // Warm champagne-gold rim light positioned behind and to the side of the Moon
    const goldRimLight = new THREE.DirectionalLight(0xe8c580, 0.0);
    goldRimLight.position.set(-12, 5, -10);
    scene.add(goldRimLight);

    // Strong directional sun light to create crisp shadows at the terminator (ivory fill)
    // Refined to a restrained champagne / warm ivory light (0xf4ebd0)
    const keyLight = new THREE.DirectionalLight(0xf4ebd0, 0.0);
    keyLight.position.set(10, 4, 8);
    scene.add(keyLight);

    // Restrained ambient light to keep shadowed regions dark
    const ambientLight = new THREE.AmbientLight(0x0a0a0b, 0.005);
    scene.add(ambientLight);

    // 7. Render Loop with Cinematic Choreography (Golden Eclipse)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Show container immediately for seamless transition
      container.style.opacity = '1';

      // Lighting progression timeline for Golden Eclipse
      let currentAmbient = 0.005;
      let currentGoldRim = 0.0;
      let currentKey = 0.0;
      const keyLightPos = new THREE.Vector3(10, 4, 8);

      if (elapsed <= 0.5) {
        // 0.0s - 0.5s: Almost complete darkness, silhouette barely perceptible
        currentAmbient = 0.005;
        currentGoldRim = 0.0;
        currentKey = 0.0;
      } else if (elapsed <= 1.0) {
        // 0.5s - 1.0s: Tiny champagne rim begins appearing
        const p = (elapsed - 0.5) / 0.5; // 0 to 1
        currentAmbient = 0.005 + p * 0.01;
        currentGoldRim = p * 0.8;
        currentKey = 0.0;
      } else if (elapsed <= 2.5) {
        // 1.0s - 2.5s: Rim gradually becomes more visible (reaches full rim brightness)
        const p = (elapsed - 1.0) / 1.5; // 0 to 1
        currentAmbient = 0.015 + p * 0.015;
        currentGoldRim = 0.8 + p * 2.7; // Go up to 3.5
        currentKey = 0.0;
      } else if (elapsed <= 3.5) {
        // 2.5s - 3.5s: Moon surface begins emerging
        const p = (elapsed - 2.5) / 1.0; // 0 to 1
        currentAmbient = 0.03 + p * 0.05; // Go up to 0.08
        currentGoldRim = 3.5;
        currentKey = p * 1.8; // Key light fades in to 1.8
      } else {
        // 3.5s+: STAGE 2: Warm champagne light slowly travels across the Moon
        // The transition takes about 3 seconds (from 3.5s to 6.5s) and then settles.
        currentAmbient = 0.08;
        currentGoldRim = 3.5;
        currentKey = 1.8;

        const p = Math.min(1.0, (elapsed - 3.5) / 3.0);
        const s = p * p * p * (p * (p * 6 - 15) + 10); // Quintic smootherstep for extremely smooth movement

        // Start position is the initial emergence direction (10, 4, 8)
        // End position sweeps to the left/front ( -4, 3, 11) to gradually reveal craters and surface details
        const startPos = new THREE.Vector3(10, 4, 8);
        const endPos = new THREE.Vector3(-4, 3, 11);
        keyLightPos.lerpVectors(startPos, endPos, s);
      }

      // Physical Crater Darkness dimming (Stage 5: Phase 3 & 4)
      // As the camera dives deep into the crater (8.2s to 10.2s), light and exposure fade into crater darkness
      if (elapsed > 8.2) {
        const tDark = Math.min(1.0, (elapsed - 8.2) / 2.0);
        // Smooth cubic ease-in for physical shadow plunge
        const darkFactor = 1.0 - (tDark * tDark * tDark);
        currentAmbient *= darkFactor;
        currentGoldRim *= darkFactor;
        currentKey *= darkFactor;
        renderer.toneMappingExposure = 1.2 * darkFactor;
      } else {
        renderer.toneMappingExposure = 1.2;
      }

      // Apply animated lighting intensities and position
      ambientLight.intensity = currentAmbient;
      goldRimLight.intensity = currentGoldRim;
      keyLight.intensity = currentKey;
      keyLight.position.copy(keyLightPos);

      // Extremely subtle, slow physical Moon rotation to communicate physical presence
      moon.rotation.y = (Math.PI - 0.3) + elapsed * 0.012;

      // Hero crater direction tracks the Moon's rotation about the Y axis
      const angle = moon.rotation.y - Math.PI;
      const dx = Math.sin(angle);
      const dz = Math.cos(angle);
      const craterDir = new THREE.Vector3(dx, 0.0, dz).normalize();

      // Camera position interpolation across Stages 3, 4 & 5 (100% continuous 3D camera trajectory)
      let currentX = 0;
      let currentY = 0;
      let currentZ = 16;

      if (elapsed <= 5.0) {
        // Stage 1 & 2: Camera distant at (0, 0, 16)
        currentX = 0;
        currentY = 0;
        currentZ = 16;
      } else if (elapsed <= 8.0) {
        // Stage 3 & 4: Camera approach towards Hero Crater (5.0s to 8.0s)
        const tCam = (elapsed - 5.0) / 3.0;
        const easeCam = tCam * tCam * tCam * (tCam * (tCam * 6 - 15) + 10); // Quintic smootherstep
        
        const targetPos = craterDir.clone().multiplyScalar(2.8);
        targetPos.y = -0.05;

        currentX = THREE.MathUtils.lerp(0.0, targetPos.x, easeCam);
        currentY = THREE.MathUtils.lerp(0.0, targetPos.y, easeCam);
        currentZ = THREE.MathUtils.lerp(16.0, targetPos.z, easeCam);
      } else {
        // Stage 5: Hero Crater Dive (8.0s to 10.2s)
        const tDive = Math.min(1.0, (elapsed - 8.0) / 2.2);
        // Smooth cubic ease-in-out for heavy cinematic momentum into crater
        const easeDive = tDive < 0.5 ? 4 * tDive * tDive * tDive : 1 - Math.pow(-2 * tDive + 2, 3) / 2;

        const startDivePos = craterDir.clone().multiplyScalar(2.8);
        startDivePos.y = -0.05;

        // Plunge past the crater rim (1.6) into the crater interior (1.25)
        const endDivePos = craterDir.clone().multiplyScalar(1.25);
        endDivePos.y = -0.02;

        currentX = THREE.MathUtils.lerp(startDivePos.x, endDivePos.x, easeDive);
        currentY = THREE.MathUtils.lerp(startDivePos.y, endDivePos.y, easeDive);
        currentZ = THREE.MathUtils.lerp(startDivePos.z, endDivePos.z, easeDive);
      }

      camera.position.set(currentX, currentY, currentZ);
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
