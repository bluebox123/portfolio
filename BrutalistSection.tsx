import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowRight, Zap, ShieldCheck, Cpu, Server } from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        num: '01',
        icon: Cpu,
        title: 'LLM Pretraining & Fine-Tuning',
        desc: 'Decoder-only GPTs from scratch — RoPE, RMSNorm, Muon optimizer. Pretrained on billions of tokens across A100 clusters.',
        stat: '71.5M',
        statLabel: 'Parameters Trained',
    },
    {
        num: '02',
        icon: ShieldCheck,
        title: 'Zero-Trust LLM Security',
        desc: 'Middleware screening every prompt for injection & jailbreaks with HMAC signing and fail-closed grammar validation.',
        stat: '<200ms',
        statLabel: 'Added Latency',
    },
    {
        num: '03',
        icon: Server,
        title: 'Full Stack Engineering',
        desc: 'End-to-end platforms with React, Node.js & FastAPI. Real-time systems with WebSockets and message queues.',
        stat: '500+',
        statLabel: 'Daily Users',
    },
    {
        num: '04',
        icon: Zap,
        title: 'Hybrid RAG Pipelines',
        desc: 'FAISS vector search paired with symbolic math verification to eliminate hallucinations in technical answers.',
        stat: '100%',
        statLabel: 'Pytest Pass Rate',
    },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const GoldDivider = () => (
    <div className="h-px w-full" style={{ background: '#C9A962', opacity: 0.3 }} />
);

// ─── MAIN SECTION ────────────────────────────────────────────────────────────

export default function BrutalistSection() {
    return (
        <section
            id="capabilities"
            className="relative z-10 w-full"
            style={{ background: 'rgba(10,10,10,0.5)' }}
        >
            {/* ── Top Gold Banner ────────────────────────────────────────────── */}
            <div
                className="flex items-center justify-between px-4 md:px-14 py-4"
                style={{ borderBottom: '1px solid #C9A962' }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2" style={{ background: '#C9A962' }} />
                    <span
                        className="text-[10px] md:text-[11px] uppercase tracking-[1px]"
                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#C9A962' }}
                    >
                        CAPABILITIES · SAMARTH SAXENA · 2025
                    </span>
                </div>
                <span
                    className="text-[11px] uppercase tracking-[1px] hidden md:block"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#C9A962' }}
                >
                    AVAILABLE FOR HIRE
                </span>
            </div>

            {/* ── Section Header ─────────────────────────────────────────────── */}
            <div className="px-4 md:px-14 pt-12 md:pt-16 pb-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p
                            className="text-[10px] md:text-[12px] uppercase tracking-[2px] mb-4"
                            style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#777777' }}
                        >
                            WHAT I BUILD
                        </p>
                        <h2
                            className="text-[32px] md:text-[56px] lg:text-[72px] font-bold leading-none uppercase"
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                letterSpacing: '-1px',
                                color: '#FFFFFF',
                            }}
                        >
                            CORE
                            <br />
                            <span style={{ color: '#C9A962' }}>CAPABILITIES</span>
                            <span style={{ color: '#FFFFFF' }}>.</span>
                        </h2>
                    </div>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-3 px-6 py-3 text-[12px] uppercase tracking-[1px] transition-all duration-300 group whitespace-nowrap"
                        style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontWeight: 600,
                            background: '#FFFFFF',
                            color: '#0A0A0A',
                            flexShrink: 0,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <span>ENGAGE NOW</span>
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>

            <GoldDivider />

            {/* ── Services Grid ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.num}
                            className="group relative flex flex-col justify-between p-6 md:p-8 transition-colors duration-300 hover:bg-[#C9A962]/5"
                            style={{
                                borderRight: i < 3 ? '1px solid #333333' : 'none',
                                borderBottom: '1px solid #333333',
                                minHeight: 280,
                            }}
                        >
                            {/* Number + Icon row */}
                            <div className="flex items-start justify-between mb-6">
                                <span
                                    className="text-[20px] md:text-[24px] font-semibold"
                                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#333333' }}
                                >
                                    {s.num}
                                </span>
                                <Icon
                                    size={20}
                                    className="transition-colors duration-300"
                                    style={{ color: '#C9A962' }}
                                />
                            </div>

                            {/* Title */}
                            <h3
                                className="text-[16px] font-semibold mb-3 leading-snug uppercase"
                                style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}
                            >
                                {s.title}
                            </h3>

                            {/* Description */}
                            <p
                                className="text-[13px] leading-relaxed mb-8"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#777777' }}
                            >
                                {s.desc}
                            </p>

                            {/* Stat */}
                            <div className="mt-auto">
                                <div
                                    className="h-px w-8 mb-4"
                                    style={{ background: '#C9A962' }}
                                />
                                <div
                                    className="text-[32px] md:text-[36px] font-bold"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#C9A962' }}
                                >
                                    {s.stat}
                                </div>
                                <div
                                    className="text-[10px] md:text-[11px] uppercase tracking-[1px]"
                                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#777777' }}
                                >
                                    {s.statLabel}
                                </div>
                            </div>

                            {/* Gold bottom-border reveal on hover */}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                                style={{ background: '#C9A962' }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ── Hero Metric Bar ────────────────────────────────────────────── */}
            <div
                className="grid grid-cols-1 md:grid-cols-3"
                style={{ borderTop: '1px solid #333333' }}
            >
                {[
                    { label: 'FLAGSHIP PROJECTS', value: '3', sub: 'CITADEL · LLM · RAG', icon: TrendingUp },
                    { label: 'PROD UPTIME', value: '99.9%', sub: 'PEAK EXAM LOAD', icon: Zap },
                    { label: 'OPEN TO FULL-TIME', value: 'NOW', sub: 'REMOTE / ON-SITE · NOT INTERN', icon: ArrowUpRight },
                ].map((m, i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between p-6 md:p-10 relative"
                        style={{
                            background: i === 0 ? '#C9A962' : 'rgba(10,10,10,0.4)',
                            borderRight: i < 2 ? '1px solid #333333' : 'none',
                        }}
                    >
                        <p
                            className="text-[10px] md:text-[12px] uppercase tracking-[2px] mb-4"
                            style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                color: i === 0 ? '#0A0A0A' : '#777777',
                            }}
                        >
                            {m.label}
                        </p>
                        <p
                            className="text-[48px] md:text-[64px] font-bold leading-none mb-4"
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                color: i === 0 ? '#0A0A0A' : '#FFFFFF',
                            }}
                        >
                            {m.value}
                        </p>
                        <div className="flex items-center gap-2">
                            <m.icon size={14} color={i === 0 ? '#0A0A0A' : '#C9A962'} />
                            <span
                                className="text-[10px] md:text-[12px] uppercase tracking-[1px]"
                                style={{
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    color: i === 0 ? '#0A0A0A' : '#C9A962',
                                }}
                            >
                                {m.sub}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Bottom Border ──────────────────────────────────────────────── */}
            <div style={{ borderBottom: '1px solid #333333' }} />
        </section>
    );
}
