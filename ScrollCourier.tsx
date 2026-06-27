import React, { useEffect, useRef } from 'react';

/* ───────────────────────────────────────────────────────────────────────────
   SCROLL COURIER — a gold paper-glider that surfs the NEGATIVE SPACE.
   It rides a smooth loop that threads the empty margins/gaps around the main
   content, banking to face its direction of travel and trailing a comet tail.
   Driven by *damped* scroll (eased follow) so it glides instead of snapping —
   buttery even with chunky wheel scrolls. Sits behind content (z-5), so your
   cards occlude it and it naturally peeks out only in the negative space.
   ─────────────────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const TRAIL = 6;

// Waypoints as fractions of the viewport — a loop hugging the screen's edges
// (the negative-space frame around the centered content column).
const WP: [number, number][] = [
  [0.91, 0.12],
  [0.95, 0.40],
  [0.86, 0.72],
  [0.55, 0.89],
  [0.18, 0.85],
  [0.05, 0.55],
  [0.10, 0.20],
  [0.42, 0.08],
  [0.74, 0.16],
  [0.91, 0.40],
];

// Catmull-Rom spline through WP; t in [0,1] → {x,y} in pixels.
function sample(t: number, W: number, H: number) {
  const n = WP.length - 1;
  const ft = Math.min(0.99999, Math.max(0, t)) * n;
  const i = Math.floor(ft);
  const u = ft - i;
  const p0 = WP[Math.max(0, i - 1)];
  const p1 = WP[i];
  const p2 = WP[Math.min(n, i + 1)];
  const p3 = WP[Math.min(n, i + 2)];
  const u2 = u * u, u3 = u2 * u;
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
  return { x: cr(p0[0], p1[0], p2[0], p3[0]) * W, y: cr(p0[1], p1[1], p2[1], p3[1]) * H };
}

export default function ScrollCourier() {
  const svgRef = useRef<SVGSVGElement>(null);
  const railRef = useRef<SVGPathElement>(null);
  const craftRef = useRef<SVGGElement>(null);
  const flameOuterRef = useRef<SVGPolygonElement>(null);
  const flameInnerRef = useRef<SVGPolygonElement>(null);
  const flameCoreRef = useRef<SVGPolygonElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    let W = window.innerWidth;
    let H = window.innerHeight;
    const hist: { x: number; y: number }[] = [];
    const reduce = prefersReduced();

    const buildRail = () => {
      // faint dotted track for the eye to follow
      let d = '';
      for (let s = 0; s <= 120; s++) {
        const p = sample(s / 120, W, H);
        d += (s === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' ';
      }
      railRef.current?.setAttribute('d', d);
    };
    const setSize = () => {
      W = window.innerWidth; H = window.innerHeight;
      svgRef.current?.setAttribute('viewBox', `0 0 ${W} ${H}`);
      buildRail();
    };
    setSize();
    window.addEventListener('resize', setSize);

    let prog = 0;
    let raf = 0;

    const frame = (now: number) => {
      // read viewport fresh each tick so it self-heals if it mounted at 0×0
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      if (w !== W || h !== H) {
        W = w; H = h;
        svgRef.current?.setAttribute('viewBox', `0 0 ${W} ${H}`);
        buildRail();
      }
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const target = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      const speed = Math.abs(target - prog);
      // damped follow — the source of the smoothness
      prog += (target - prog) * (reduce ? 1 : 0.09);

      const bob = reduce ? 0 : Math.sin(now * 0.0012) * 7;
      const here = sample(prog, W, H);
      const ahead = sample(prog + 0.005, W, H);
      here.y += bob;
      const angle = (Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI;

      craftRef.current?.setAttribute(
        'transform',
        `translate(${here.x.toFixed(1)} ${here.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
      );
      glowRef.current?.setAttribute('cx', here.x.toFixed(1));
      glowRef.current?.setAttribute('cy', here.y.toFixed(1));

      // publish live position so SeasonAtmosphere can blow each season's gust from the rocket
      (window as unknown as { __courierPos?: { x: number; y: number } }).__courierPos = {
        x: here.x,
        y: here.y,
      };

      // flickering flame exhaust — stretches when you scroll faster
      const flick = reduce ? 0 : Math.random() * 7;
      const len = 22 + Math.sin(now * 0.02) * 4 + flick + Math.min(130, speed * 950);
      const TX = -19; // rocket tail in local space
      flameOuterRef.current?.setAttribute('points', `${TX},-7 ${(TX - len).toFixed(1)},0 ${TX},7`);
      flameInnerRef.current?.setAttribute('points', `${TX},-3.5 ${(TX - len * 0.6).toFixed(1)},0 ${TX},3.5`);
      flameCoreRef.current?.setAttribute('points', `${TX},-1.8 ${(TX - len * 0.32).toFixed(1)},0 ${TX},1.8`);
      hist.unshift({ x: here.x, y: here.y });
      if (hist.length > TRAIL) hist.pop();
      for (let i = 0; i < TRAIL; i++) {
        const el = trailRefs.current[i];
        if (!el) continue;
        const h = hist[i] || hist[hist.length - 1] || here;
        const k = 1 - i / TRAIL;
        el.setAttribute('cx', h.x.toFixed(1));
        el.setAttribute('cy', h.y.toFixed(1));
        el.setAttribute('r', (1 + k * 3.6).toFixed(2));
        el.setAttribute('opacity', (k * 0.45).toFixed(2));
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <div className="scroll-courier-wrap hidden md:block" aria-hidden="true">
      <svg ref={svgRef} className="scroll-courier" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="sc-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
          </radialGradient>

          {/* metallic fuselage — top highlight → gold → bottom shadow */}
          <linearGradient id="sc-body" x1="0" y1="-10" x2="0" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F7E9C2" />
            <stop offset="0.45" stopColor="#C9A962" />
            <stop offset="1" stopColor="#6E5326" />
          </linearGradient>
          {/* nose cone */}
          <linearGradient id="sc-nose" x1="0" y1="-9" x2="0" y2="9" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF8A55" />
            <stop offset="0.5" stopColor="#FF4500" />
            <stop offset="1" stopColor="#962600" />
          </linearGradient>
          {/* fin */}
          <linearGradient id="sc-fin" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#B5923F" />
            <stop offset="1" stopColor="#5C461F" />
          </linearGradient>
          {/* glass porthole */}
          <radialGradient id="sc-window" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#CDEBFF" />
            <stop offset="0.5" stopColor="#3C7FB0" />
            <stop offset="1" stopColor="#0A2233" />
          </radialGradient>
          {/* flame layers (objectBoundingBox: 0 = tip, 1 = nozzle) */}
          <linearGradient id="sc-flame-out" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FF6A1A" stopOpacity="0.95" />
            <stop offset="0.6" stopColor="#FF4500" stopOpacity="0.65" />
            <stop offset="1" stopColor="#FF4500" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sc-flame-in" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FFE08A" />
            <stop offset="1" stopColor="#FFB347" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sc-flame-core" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#BFE0FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* faint track through the negative space */}
        <path
          ref={railRef}
          fill="none"
          stroke="#C9A962"
          strokeWidth={1}
          strokeOpacity={0.08}
          strokeDasharray="1 9"
          strokeLinecap="round"
        />

        {/* comet trail */}
        <g className="sc-trail" fill="#C9A962">
          {Array.from({ length: TRAIL }).map((_, i) => (
            <circle key={i} ref={(el) => { trailRefs.current[i] = el; }} />
          ))}
        </g>

        {/* glow under the craft */}
        <circle ref={glowRef} r={28} fill="url(#sc-glow-grad)" />

        {/* the rocket, drawn pointing +x. Flame + glow stay upright; body barrel-rolls */}
        <g ref={craftRef} className="sc-craft">
          {/* exhaust plume — three stacked layers: orange → gold → white-blue core */}
          <polygon ref={flameOuterRef} fill="url(#sc-flame-out)" opacity="0.8" />
          <polygon ref={flameInnerRef} fill="url(#sc-flame-in)" opacity="0.9" />
          <polygon ref={flameCoreRef} fill="url(#sc-flame-core)" opacity="0.95" />
          <g>
            {/* swept fins (behind the hull) */}
            <path d="M-9 -6 L-21 -19 L-21 -12 L-13 -3 Z" fill="url(#sc-fin)" />
            <path d="M-9 6 L-21 19 L-21 12 L-13 3 Z" fill="url(#sc-fin)" />
            {/* engine nozzle bell */}
            <path d="M-15 -6 L-22 -8.5 L-22 8.5 L-15 6 Z" fill="#4A3B1C" />
            <path d="M-19 -6.5 L-23 -8.5 L-23 8.5 L-19 6.5 Z" fill="#2A2110" />
            {/* main hull */}
            <path d="M14 -9 C 2 -10, -10 -10, -16 -8 L-19 -6.5 L-19 6.5 L-16 8 C -10 10, 2 10, 14 9 Z" fill="url(#sc-body)" />
            {/* nose cone */}
            <path d="M33 0 C 26 -7, 20 -9, 14 -9 L14 9 C 20 9, 26 7, 33 0 Z" fill="url(#sc-nose)" />
            {/* nose tip glint */}
            <path d="M33 0 C 28 -3, 24 -4.5, 21 -4.5 L21 4.5 C 24 4.5, 28 3, 33 0 Z" fill="#FFC59A" opacity="0.55" />
            {/* red collar where nose meets hull */}
            <path d="M14 -9 L14 9" stroke="#8A2300" strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />
            {/* long top specular highlight */}
            <path d="M11 -6.2 C 1 -7.2, -10 -7.2, -16 -5.2" fill="none" stroke="#FFF6DC" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            {/* panel seams */}
            <path d="M3 -9.4 L3 9.4" stroke="#5C461F" strokeWidth="0.7" opacity="0.5" />
            <path d="M-9 -9.2 L-9 9.2" stroke="#5C461F" strokeWidth="0.7" opacity="0.5" />
            {/* porthole: frame, glass, rim, reflection */}
            <circle cx="-2" cy="0" r="5.3" fill="#6E5326" />
            <circle cx="-2" cy="0" r="4.3" fill="url(#sc-window)" />
            <circle cx="-2" cy="0" r="4.3" fill="none" stroke="#FFE6B0" strokeWidth="1" opacity="0.85" />
            <ellipse cx="-3.4" cy="-1.7" rx="1.7" ry="1" fill="#FFFFFF" opacity="0.7" transform="rotate(-32 -3.4 -1.7)" />
            {/* rivets */}
            <circle cx="9" cy="-7.6" r="0.6" fill="#4A3B1C" />
            <circle cx="9" cy="7.6" r="0.6" fill="#4A3B1C" />
            <circle cx="-13" cy="-7.6" r="0.6" fill="#4A3B1C" />
            <circle cx="-13" cy="7.6" r="0.6" fill="#4A3B1C" />
          </g>
        </g>
      </svg>
    </div>
  );
}
