'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CinematicDataLayer
 * Three.js overlay — floating data nodes with warm-orange + white glowing
 * particles connected by faint low-opacity network edges.
 * Mouse parallax camera movement included.
 * All resources are disposed on unmount.
 */
export default function CinematicDataLayer({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 80;

    // ── Particle data ──
    const NODE_COUNT    = 160;
    const MAX_EDGE_DIST = 70;
    const TARGET_EDGES  = 90;

    const positions = [];
    const sizes     = [];
    const nodeData  = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 220;
      const y = (Math.random() - 0.5) * 130;
      const z = (Math.random() - 0.5) * 80;
      positions.push(x, y, z);
      sizes.push(Math.random() * 2.8 + 0.5);
      nodeData.push({
        ox: x, oy: y, oz: z,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speedX: 0.18 + Math.random() * 0.22,
        speedY: 0.12 + Math.random() * 0.18,
        speedZ: 0.08 + Math.random() * 0.12,
        ampX:   4 + Math.random() * 7,
        ampY:   3 + Math.random() * 5,
        ampZ:   2 + Math.random() * 4,
      });
    }

    // ── Points geometry ──
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    pGeo.setAttribute('size',     new THREE.BufferAttribute(new Float32Array(sizes), 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(0xFF8C42) },
        uWhite: { value: new THREE.Color(0xFFEDD8) },
      },
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uTime;
        varying float vWhiteFactor;
        void main() {
          vWhiteFactor = clamp(position.z / 40.0 + 0.5, 0.0, 1.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (180.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColor;
        uniform vec3 uWhite;
        varying float vWhiteFactor;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float alpha = pow(1.0 - d, 2.2) * 0.75;
          vec3 col = mix(uColor, uWhite, vWhiteFactor * 0.55);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Edge geometry ──
    const edgeVertices = [];
    const usedPairs    = new Set();
    let attempts = 0;

    while (edgeVertices.length / 6 < TARGET_EDGES && attempts < 2000) {
      attempts++;
      const a = Math.floor(Math.random() * NODE_COUNT);
      const b = Math.floor(Math.random() * NODE_COUNT);
      if (a === b) continue;
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (usedPairs.has(key)) continue;
      const { ox: ax, oy: ay, oz: az } = nodeData[a];
      const { ox: bx, oy: by, oz: bz } = nodeData[b];
      if (Math.hypot(ax - bx, ay - by, az - bz) > MAX_EDGE_DIST) continue;
      usedPairs.add(key);
      edgeVertices.push(ax, ay, az, bx, by, bz);
    }

    const pairList = [...usedPairs].map(k => k.split('_').map(Number));

    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeVertices), 3));

    const eMat = new THREE.LineBasicMaterial({
      color: 0xFF8C42,
      opacity: 0.07,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.LineSegments(eGeo, eMat));

    // ── Bokeh depth spheres ──
    const bokehGroup = new THREE.Group();
    for (let i = 0; i < 18; i++) {
      const r  = 0.35 + Math.random() * 1.4;
      const bm = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0xFF7020 : 0x3080FF,
        opacity: 0.04 + Math.random() * 0.06,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 6), bm);
      mesh.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60 - 20
      );
      mesh.userData = { phase: Math.random() * Math.PI * 2, speed: 0.08 + Math.random() * 0.12 };
      bokehGroup.add(mesh);
    }
    scene.add(bokehGroup);

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ──
    const resize = () => {
      const w = canvas.parentElement?.clientWidth  || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Render loop ──
    let rafId;
    const posAttr = pGeo.attributes.position;
    const eAttr   = eGeo.attributes.position;

    const animate = (t) => {
      rafId = requestAnimationFrame(animate);
      const time = t * 0.001;

      pMat.uniforms.uTime.value = time;

      // Animate particle positions
      for (let i = 0; i < NODE_COUNT; i++) {
        const d = nodeData[i];
        posAttr.setXYZ(i,
          d.ox + Math.sin(time * d.speedX + d.phaseX) * d.ampX,
          d.oy + Math.sin(time * d.speedY + d.phaseY) * d.ampY,
          d.oz + Math.sin(time * d.speedZ + d.phaseZ) * d.ampZ
        );
      }
      posAttr.needsUpdate = true;

      // Sync edges with nodes
      pairList.forEach(([a, b], i) => {
        eAttr.setXYZ(i * 2,     posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
        eAttr.setXYZ(i * 2 + 1, posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
      });
      eAttr.needsUpdate = true;

      // Bokeh drift
      bokehGroup.children.forEach((b) => {
        b.position.y += Math.sin(time * b.userData.speed + b.userData.phase) * 0.015;
      });

      // Smooth mouse parallax
      targetX += (mouseX * 6   - targetX) * 0.04;
      targetY += (-mouseY * 3.5 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate(0);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);

      pGeo.dispose();
      pMat.dispose();
      eGeo.dispose();
      eMat.dispose();
      bokehGroup.children.forEach(m => {
        m.geometry.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
