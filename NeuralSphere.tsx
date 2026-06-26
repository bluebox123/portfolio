import React, { useEffect, useRef, useMemo } from 'react';

/* ───────────────────────────────────────────────────────────────────────────
   NEURAL SPHERE — the scroll-driven 3D hero.
   A constellation of nodes on a sphere (Fibonacci distribution), wired into a
   neural mesh with light pulses traveling the edges. Scrolling rotates the
   whole sphere through a full revolution and flies the camera inward; the
   mouse adds parallax. Pure SVG + math projection — no WebGL, no deps.
   ─────────────────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface P3 { x: number; y: number; z: number; }

const VB = 1000;            // viewBox size
const CX = VB / 2;
const CY = VB / 2;
const N = 66;               // node count
const K_NEIGHBORS = 4;      // each node wires to its K nearest (even, elegant mesh)
const CAM_DIST = 2.6;       // camera distance (sphere radius = 1)
const FOCAL = 1.9;          // perspective focal length
const BASE_R = 340;         // projected sphere radius in viewBox units
const ACCENT_EVERY = 6;     // every Nth node burns orange

export default function NeuralSphere() {
  const nodeEls = useRef<(SVGCircleElement | null)[]>([]);
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const pulseEls = useRef<(SVGCircleElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // ── geometry, generated once ──────────────────────────────────────────────
  const { nodes, edges, pulses } = useMemo(() => {
    const nodes: P3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * golden;
      nodes.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
    }
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < N; i++) {
      const dists: [number, number][] = [];
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        dists.push([dx * dx + dy * dy + dz * dz, j]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      for (let m = 0; m < K_NEIGHBORS; m++) {
        const j = dists[m][1];
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
      }
    }
    const pulses = Array.from({ length: Math.min(16, edges.length) }, () => ({
      e: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.18 + Math.random() * 0.28,
    }));
    return { nodes, edges, pulses };
  }, []);

  useEffect(() => {
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const so = new Float32Array(N); // opacity by depth
    const ss = new Float32Array(N); // screen scale by depth

    const onMouse = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const draw = (spin: number, dt: number) => {
      // ease mouse toward target
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.06;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.06;

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const sp = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;

      // scroll drives a full revolution + tilt; mouse adds parallax
      const aY = spin + sp * Math.PI * 2 + mouse.current.x * 0.55;
      const aX = 0.35 + sp * 0.9 + mouse.current.y * 0.4;
      const cosY = Math.cos(aY), sinY = Math.sin(aY);
      const cosX = Math.cos(aX), sinX = Math.sin(aX);

      // gentle fly-in: camera pulls closer + sphere grows a touch with scroll
      const camD = CAM_DIST - sp * 0.55;
      const R = BASE_R * (1 + sp * 0.12);

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        const y1 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;

        const scale = FOCAL / (camD - z2);
        sx[i] = CX + x1 * R * scale;
        sy[i] = CY + y1 * R * scale;
        ss[i] = scale;
        so[i] = 0.22 + (z2 + 1) * 0.5 * 0.78; // back dim, front bright

        const el = nodeEls.current[i];
        if (el) {
          const isAccent = i % ACCENT_EVERY === 0;
          el.setAttribute('cx', sx[i].toFixed(1));
          el.setAttribute('cy', sy[i].toFixed(1));
          el.setAttribute('r', ((isAccent ? 3.4 : 2.3) * scale).toFixed(2));
          el.setAttribute('opacity', so[i].toFixed(2));
        }
      }

      for (let k = 0; k < edges.length; k++) {
        const [a, b] = edges[k];
        const el = edgeEls.current[k];
        if (!el) continue;
        el.setAttribute('x1', sx[a].toFixed(1));
        el.setAttribute('y1', sy[a].toFixed(1));
        el.setAttribute('x2', sx[b].toFixed(1));
        el.setAttribute('y2', sy[b].toFixed(1));
        el.setAttribute('opacity', (Math.min(so[a], so[b]) * 0.32).toFixed(2));
      }

      for (let p = 0; p < pulses.length; p++) {
        const pl = pulses[p];
        pl.t += pl.speed * dt;
        if (pl.t > 1) { pl.t -= 1; pl.e = Math.floor(Math.random() * edges.length); }
        const [a, b] = edges[pl.e];
        const el = pulseEls.current[p];
        if (!el) continue;
        const t = pl.t;
        el.setAttribute('cx', (sx[a] + (sx[b] - sx[a]) * t).toFixed(1));
        el.setAttribute('cy', (sy[a] + (sy[b] - sy[a]) * t).toFixed(1));
        el.setAttribute('r', (2.1 * (ss[a] + (ss[b] - ss[a]) * t)).toFixed(2));
        el.setAttribute('opacity', (Math.sin(t * Math.PI) * 0.9).toFixed(2));
      }
    };

    // one synchronous frame so it looks right even before/without animation
    draw(0, 0);

    if (prefersReduced()) {
      window.removeEventListener('mousemove', onMouse);
      return;
    }

    let raf = 0;
    let spin = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spin += dt * 0.05; // slow ambient rotation so it's alive at rest
      draw(spin, dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [nodes, edges, pulses]);

  return (
    <div className="neural-sphere-wrap hidden md:block" aria-hidden="true">
      <svg
        className="neural-sphere"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="ns-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#C9A962" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft core glow for depth */}
        <circle cx={CX} cy={CY} r={BASE_R * 1.15} fill="url(#ns-core)" />

        <g className="ns-edges" stroke="#C9A962" strokeWidth={0.8}>
          {edges.map((_, i) => (
            <line key={i} ref={(el) => { edgeEls.current[i] = el; }} />
          ))}
        </g>

        <g className="ns-nodes">
          {nodes.map((_, i) => (
            <circle
              key={i}
              ref={(el) => { nodeEls.current[i] = el; }}
              fill={i % ACCENT_EVERY === 0 ? '#FF4500' : '#C9A962'}
            />
          ))}
        </g>

        <g className="ns-pulses" fill="#FF6A2B">
          {pulses.map((_, i) => (
            <circle key={i} ref={(el) => { pulseEls.current[i] = el; }} />
          ))}
        </g>
      </svg>
    </div>
  );
}
