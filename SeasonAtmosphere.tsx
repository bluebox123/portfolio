import React, { useEffect, useRef } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SECTION_IDS = ['identity', 'capabilities', 'experience', 'projects', 'contact'];
type Kind = 'rain' | 'autumn' | 'winter' | 'spring' | 'summer';
const KINDS: Kind[] = ['rain', 'autumn', 'winter', 'spring', 'summer'];

const COUNT: Record<Kind, number> = { rain: 60, autumn: 40, winter: 80, spring: 40, summer: 20 };
const SWEEP = 820;
const BASE_DENS = 0.3;
const INTENSITY_DECAY = 0.28;
const FPS_CAP = 34; // ~30fps — halves draw work vs 60fps

const BG_TOP: [number, number, number][] = [
  [12,16,22],[24,15,8],[10,16,24],[20,11,18],[24,18,9],
];
const BG_BOT: [number, number, number][] = [
  [4,6,9],[9,5,3],[4,7,11],[8,4,8],[9,7,4],
];

const AUTUMN = ['#9A3412','#B45309','#C2410C','#C9A962','#D97706'];
const SPRING  = ['#F472B6','#F4A6C0','#F9A8C4','#FCA5A5','#FBCFE8'];

interface P {
  x: number; y: number; vx: number; vy: number;
  s: number; rot: number; vrot: number; ph: number; sw: number;
  a: number; len: number; col: string;
  sinPh: number; cosPh: number; // precomputed — saves Math.sin per particle per frame
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = (arr: string[]) => arr[(Math.random() * arr.length) | 0];

function spawn(kind: Kind, w: number, h: number, seed = false): P {
  const ph = rnd(0, Math.PI * 2);
  const sp = Math.sin(ph), cp = Math.cos(ph);
  switch (kind) {
    case 'rain':
      return { x: rnd(-0.1*w, 1.1*w), y: seed ? rnd(0,h) : -rnd(0,h),
        vx: rnd(-90,-40), vy: rnd(820,1250), s:0, rot:0, vrot:0,
        ph, sw:0, a: rnd(0.12,0.34), len: rnd(12,26), col:'#A9CCE3', sinPh:sp, cosPh:cp };
    case 'autumn':
      return { x: rnd(0,w), y: seed ? rnd(0,h) : rnd(-40,-10),
        vx: rnd(-12,8), vy: rnd(45,95), s: rnd(5,11),
        rot: rnd(0, Math.PI*2), vrot: rnd(-1.3,1.3), ph, sw: rnd(22,52),
        a: rnd(0.55,0.92), len:0, col: pick(AUTUMN), sinPh:sp, cosPh:cp };
    case 'winter':
      return { x: rnd(0,w), y: seed ? rnd(0,h) : rnd(-40,-10),
        vx:0, vy: rnd(28,62), s: rnd(1.3,3.8),
        rot:0, vrot:0, ph, sw: rnd(8,20),
        a: rnd(0.45,0.85), len:0, col:'#EAF2FB', sinPh:sp, cosPh:cp };
    case 'spring':
      return { x: rnd(0,w), y: seed ? rnd(0,h) : rnd(-40,-10),
        vx: rnd(-10,10), vy: rnd(38,78), s: rnd(4,9),
        rot: rnd(0, Math.PI*2), vrot: rnd(-1.6,1.6), ph, sw: rnd(26,58),
        a: rnd(0.5,0.85), len:0, col: pick(SPRING), sinPh:sp, cosPh:cp };
    default: // summer
      return { x: rnd(0,w), y: seed ? rnd(0,h) : rnd(h,h+40),
        vx: rnd(-14,14), vy: rnd(-46,-16), s: rnd(1.3,2.6),
        rot:0, vrot:0, ph, sw: rnd(10,22),
        a: rnd(0.45,0.9), len:0,
        col: Math.random() < 0.5 ? '#FFD27A' : '#C9A962', sinPh:sp, cosPh:cp };
  }
}

export default function SeasonAtmosphere() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = prefersReduced();

    let W = window.innerWidth  || 1;
    let H = window.innerHeight || 1;

    const pools: Record<Kind, P[]> = { rain:[], autumn:[], winter:[], spring:[], summer:[] };

    const build = () => {
      for (const k of KINDS) {
        pools[k] = Array.from({ length: COUNT[k] }, () => spawn(k, W, H, true));
        // sort by color so autumn/spring batch-draw per color without per-particle fillStyle changes
        pools[k].sort((a, b) => (a.col < b.col ? -1 : 1));
      }
    };

    const reseed = (p: P, kind: Kind) => {
      p.x = rnd(0, W);
      p.y = kind === 'summer' ? rnd(H+10, H*1.6) : rnd(-H*0.7, -10);
      p.ph = rnd(0, 6.28);
      p.sinPh = Math.sin(p.ph);
      p.cosPh = Math.cos(p.ph);
    };
    const enter = (kind: Kind) => { for (const p of pools[kind]) reseed(p, kind); };

    let centers: number[] = [];
    let lastScrollH = -1;
    const measure = () => {
      centers = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return NaN;
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
      lastScrollH = document.documentElement.scrollHeight;
    };

    const resize = () => {
      W = window.innerWidth || 1; H = window.innerHeight || 1;
      // DPR=1 — soft particles look fine at CSS resolution; halves fill-rate vs retina
      canvas.width  = W; canvas.height = H;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      measure();
    };
    resize();
    build();
    window.addEventListener('resize', resize);

    // Cache sp — only recompute when the user actually scrolls, not every rAF tick
    let scrollDirty = true;
    let cachedSp    = 0;
    const onScroll  = () => { scrollDirty = true; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const seasonPos = () => {
      const sh = document.documentElement.scrollHeight;
      if (sh !== lastScrollH) measure();
      const vc = window.scrollY + H / 2;
      const c  = centers;
      if (c.length < 5 || c.some(Number.isNaN)) {
        const docH = sh - H;
        return docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) * 4 : 0;
      }
      if (vc <= c[0]) return 0;
      if (vc >= c[4]) return 4;
      for (let i = 0; i < 4; i++) {
        if (vc >= c[i] && vc <= c[i+1])
          return i + (vc - c[i]) / Math.max(1, c[i+1] - c[i]);
      }
      return 0;
    };

    let last        = performance.now();
    let lastFrameMs = 0;
    let raf         = 0;
    let lastSp      = 0;
    let dirSign     = 1;
    let lastBgSp    = -999;
    const prevW     = [0,0,0,0,0];
    const intensity = [0,0,0,0,0];
    let primed      = false;

    const draw = (now: number) => {
      if (!reduce) raf = requestAnimationFrame(draw);

      // 30fps cap — skip all work when the budget isn't up yet
      if (now - lastFrameMs < FPS_CAP) return;
      lastFrameMs = now;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const el = now / 1000;

      if (scrollDirty) { cachedSp = seasonPos(); scrollDirty = false; }
      const sp = cachedSp;

      const dv = sp - lastSp;
      lastSp = sp;
      if (dv > 0.0008) dirSign = 1; else if (dv < -0.0008) dirSign = -1;

      // Backdrop — only rewrite when season meaningfully shifts
      if (backdropRef.current && Math.abs(sp - lastBgSp) > 0.01) {
        const i0 = Math.max(0, Math.min(4, Math.floor(sp)));
        const i1 = Math.min(4, i0+1);
        const fr = sp - i0;
        const mx = (a: number, b: number) => Math.round(a + (b-a)*fr);
        const tt = `rgb(${mx(BG_TOP[i0][0],BG_TOP[i1][0])},${mx(BG_TOP[i0][1],BG_TOP[i1][1])},${mx(BG_TOP[i0][2],BG_TOP[i1][2])})`;
        const bb = `rgb(${mx(BG_BOT[i0][0],BG_BOT[i1][0])},${mx(BG_BOT[i0][1],BG_BOT[i1][1])},${mx(BG_BOT[i0][2],BG_BOT[i1][2])})`;
        backdropRef.current.style.background = `linear-gradient(180deg,${tt} 0%,${bb} 100%)`;
        lastBgSp = sp;
      }

      ctx.clearRect(0, 0, W, H);

      // 4 trig calls per frame instead of COUNT[k] calls per particle per frame
      const s11 = Math.sin(el * 1.1), c11 = Math.cos(el * 1.1);
      const s14 = Math.sin(el * 1.4), c14 = Math.cos(el * 1.4);
      const s08 = Math.sin(el * 0.8), c08 = Math.cos(el * 0.8);

      for (let ki = 0; ki < 5; ki++) {
        const kind    = KINDS[ki];
        const d       = sp - ki;
        const ad      = Math.abs(d);
        const weight  = Math.max(0, 1 - ad);
        const exiting = (dirSign >= 0 && d > 0) || (dirSign < 0 && d < 0);
        const sweep   = exiting ? Math.min(1, ad) ** 2 : 0;

        if (primed && weight >= 0.04 && prevW[ki] < 0.04 && !exiting) {
          if (kind !== 'rain') enter(kind);
          intensity[ki] = 1;
        }
        prevW[ki] = weight;
        if (intensity[ki] > 0) intensity[ki] = Math.max(0, intensity[ki] - dt * INTENSITY_DECAY);

        const vis = Math.min(1, weight + intensity[ki]);
        if (vis <= 0.01) continue;

        const arr       = pools[kind];
        const drawCount = Math.max(1, Math.floor(arr.length * (BASE_DENS + (1-BASE_DENS)*intensity[ki])));

        // ── RAIN — single path, uniform alpha ────────────────────────────────
        if (kind === 'rain') {
          ctx.strokeStyle = '#A9CCE3';
          ctx.lineCap     = 'round';
          ctx.lineWidth   = 1.1;
          ctx.globalAlpha = vis * 0.22;
          ctx.beginPath();
          for (let pi = 0; pi < drawCount; pi++) {
            const p = arr[pi];
            p.x += p.vx * dt; p.y += p.vy * dt;
            if (p.y > H+20) { p.y = -20; p.x = rnd(-0.1*W, 1.1*W); }
            if (p.x < -40) p.x = W + 40;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 0.018, p.y - p.len);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;

        // ── WINTER — single path, single fill ────────────────────────────────
        } else if (kind === 'winter') {
          ctx.fillStyle   = '#EAF2FB';
          ctx.globalAlpha = vis * 0.65;
          ctx.beginPath();
          for (let pi = 0; pi < drawCount; pi++) {
            const p    = arr[pi];
            const side = p.x < W*0.5 ? -1 : 1;
            p.x += ((s11*p.cosPh + c11*p.sinPh)*p.sw + side*SWEEP*sweep) * dt;
            p.y += p.vy * (1 - sweep*0.5) * dt;
            if (p.x < -50 || p.x > W+50 || p.y > H+10) reseed(p, kind);
            ctx.arc(p.x, p.y, p.s, 0, 6.2832);
          }
          ctx.fill();
          ctx.globalAlpha = 1;

        // ── SUMMER — single path, no double-draw halo ────────────────────────
        } else if (kind === 'summer') {
          ctx.fillStyle   = '#FFD27A';
          ctx.globalAlpha = vis * 0.78;
          ctx.beginPath();
          for (let pi = 0; pi < drawCount; pi++) {
            const p    = arr[pi];
            const side = p.x < W*0.5 ? -1 : 1;
            p.x += ((s08*p.cosPh + c08*p.sinPh)*p.sw + p.vx + side*SWEEP*sweep) * dt;
            p.y += p.vy * dt;
            if (p.x < -50 || p.x > W+50 || p.y < -20) reseed(p, kind);
            ctx.arc(p.x, p.y, p.s * 1.5, 0, 6.2832);
          }
          ctx.fill();
          ctx.globalAlpha = 1;

        // ── AUTUMN + SPRING — pre-sorted by color, batch per color group ─────
        } else {
          const ry = kind === 'spring' ? 0.42 : 0.58;
          ctx.globalAlpha = vis * 0.78;
          let curCol = '';
          for (let pi = 0; pi < drawCount; pi++) {
            const p    = arr[pi];
            const side = p.x < W*0.5 ? -1 : 1;
            p.x += ((s14*p.cosPh + c14*p.sinPh)*p.sw + p.vx + side*SWEEP*sweep) * dt;
            p.y += p.vy * (1 - sweep*0.5) * dt;
            p.rot += (p.vrot + side*sweep*3) * dt;
            if (p.x < -50 || p.x > W+50 || p.y > H+20) reseed(p, kind);
            if (p.col !== curCol) {
              if (curCol !== '') ctx.fill();
              curCol = p.col;
              ctx.fillStyle = curCol;
              ctx.beginPath();
            }
            ctx.ellipse(p.x, p.y, p.s, p.s*ry, p.rot, 0, 6.2832);
          }
          if (curCol !== '') ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      primed = true;
    };

    if (reduce) {
      draw(performance.now());
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', onScroll);
      };
    }

    raf = requestAnimationFrame(draw);

    const healId = window.setInterval(() => {
      if ((window.innerWidth && window.innerWidth !== W) ||
          (window.innerHeight && window.innerHeight !== H)) {
        resize(); build();
      }
    }, 600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(healId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div ref={backdropRef} className="season-backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} className="season-canvas" aria-hidden="true" />
    </>
  );
}
