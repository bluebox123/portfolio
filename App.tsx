import React, { useState, useEffect, useRef } from 'react';
import BrutalistSection from './BrutalistSection';
import ScrollCourier from './ScrollCourier';
import SeasonAtmosphere from './SeasonAtmosphere';
import {
  ScrollProgress,
  Reveal,
  useTilt,
  Magnetic,
  CountUp,
} from './effects';
import {
  Cpu,
  Layers,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Award,
  Network,
  FileText,
  MapPin,
} from 'lucide-react';

// --- Types ---

interface Project {
  title: string;
  category: string;
  stack: string[];
  description: string;
  architecture: string[]; // The "Under the Hood" hover content
  link?: string;
  linkLabel?: string;
}

interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  bullets: string[];
  link?: string;
  linkLabel?: string;
}

// --- Components ---

const NavPill = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto max-w-fit">
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 shadow-2xl shadow-signal-orange/10 overflow-x-auto no-scrollbar">
      {['Identity', 'Capabilities', 'Experience', 'Projects', 'Contact'].map((item, i) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className={`px-4 md:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 whitespace-nowrap ${i === 0 ? 'bg-signal-orange text-black font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
        >
          {item}
        </a>
      ))}
    </div>
  </nav>
);

const BentoTile = ({
  children,
  className = "",
  title,
  icon: Icon,
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ElementType;
}) => {
  const tilt = useTilt(6);
  return (
    <div
      {...tilt}
      className={`tilt-3d group relative p-6 bg-neutral-900/40 border border-neutral-800/60 overflow-hidden hover:border-signal-orange/50 transition-colors duration-500 ${className}`}
    >
      <div className="tilt-glare" />
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-signal-orange rounded-full shadow-[0_0_10px_#FF4500]"></div>
      </div>
      {title && (
        <div className="flex items-center gap-2 mb-4 text-neutral-500 font-mono text-xs uppercase tracking-widest">
          {Icon && <Icon size={14} />}
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
};

const ExperienceCard = ({ role }: { role: Role }) => {
  const tilt = useTilt(5);
  return (
    <div
      {...tilt}
      className="tilt-3d group relative h-full p-6 md:p-8 bg-neutral-900/40 border border-neutral-800/60 overflow-hidden hover:border-signal-orange/50 transition-colors duration-500"
    >
      <div className="tilt-glare" />
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-xl md:text-2xl font-bold">{role.company}</h3>
        {role.link && (
          <a
            href={role.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-signal-orange transition-colors border border-neutral-800 hover:border-signal-orange rounded-full px-3 py-1"
          >
            {role.linkLabel ?? 'Link'} <ArrowUpRight size={11} />
          </a>
        )}
      </div>
      <p className="text-sm font-mono text-signal-orange mb-2">{role.title}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 font-mono text-[11px] text-neutral-500">
        <span>{role.period}</span>
        <span className="w-1 h-1 bg-neutral-700 rounded-full" />
        <span className="inline-flex items-center gap-1"><MapPin size={11} /> {role.location}</span>
      </div>
      <ul className="space-y-3.5 text-sm text-neutral-400">
        {role.bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-signal-orange shrink-0">→</span>
            <span dangerouslySetInnerHTML={{ __html: b }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tilt = useTilt(7);

  return (
    <div {...tilt} className="tilt-3d h-[460px] md:h-[420px]">
      <div
        className="group relative h-full w-full border-t border-neutral-800 hover:border-signal-orange transition-colors duration-300 overflow-hidden bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
      >
        {/* Default State */}
        <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between transition-transform duration-500 ${isHovered ? '-translate-y-full' : 'translate-y-0'}`}>
          <div>
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 text-[10px] font-mono border border-neutral-700 rounded-full text-neutral-400">
                {project.category}
              </span>
              <ArrowUpRight className="text-neutral-600 group-hover:text-signal-orange transition-colors" />
            </div>
            <h3 className="text-3xl md:text-4xl font-sans font-bold tracking-tight mb-2 leading-tight text-white group-hover:text-signal-orange transition-colors">
              {project.title}
            </h3>
            <p className="text-neutral-400 leading-relaxed max-w-md text-sm md:text-base">
              {project.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map(tech => (
              <span key={tech} className="text-xs font-mono text-neutral-500">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hover/Active State - Architecture View */}
        <div className={`absolute inset-0 p-6 md:p-8 bg-neutral-900 flex flex-col transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center gap-2 mb-6 text-signal-orange font-mono text-xs uppercase">
            <Network size={14} />
            <span>System Architecture</span>
          </div>

          <div className="flex-grow space-y-4 font-mono text-xs md:text-sm text-neutral-300">
            {project.architecture.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-neutral-600">0{i + 1}</span>
                <div className="h-px w-4 bg-neutral-700"></div>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-bold hover:text-signal-orange transition-colors">
              {project.linkLabel ?? 'VIEW SOURCE'} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Data ---

const ROLES: Role[] = [
  {
    company: 'Siemens Technology & Services',
    title: 'Software Engineer Intern · Full Stack & AI',
    period: 'Jul 2024 — Feb 2025',
    location: 'Hybrid',
    link: 'https://drive.google.com/file/d/1mRi3Bs8HOcErp_FS8yTC1ewy8kd3RKNv/view?usp=sharing',
    linkLabel: 'Certificate',
    bullets: [
      'Built <span class="text-neutral-200">SkillX</span>, an enterprise assessment platform for <span class="text-neutral-200">500+ daily users</span>, with a 3-tier RBAC system in Node.js, Express &amp; MySQL — cut batch-management overhead by 40%.',
      'Engineered real-time AI proctoring with <span class="text-neutral-200">TensorFlow.js &amp; BlazeFace</span>, flagging head movement &amp; fullscreen exits at <span class="text-neutral-200">&lt;200ms</span> latency.',
      'Hardened the backend with JWT auth and tuned connection pooling — held <span class="text-neutral-200">99.9% uptime</span> through peak exam load.',
    ],
  },
  {
    company: 'Centre for Neuroinformatics (CNI)',
    title: 'Research Intern · NVIDIA HPC & Neuro-QML Track',
    period: 'May 2026 — Jul 2026',
    location: 'SRIP · Remote',
    bullets: [
      'Selected from a national applicant pool for a research program pairing multimodal brain-signal analysis (<span class="text-neutral-200">EEG, NIRS</span>) with generative AI.',
      'Trained hybrid <span class="text-neutral-200">quantum-classical</span> models on terabyte-scale neurological datasets across an <span class="text-neutral-200">8× NVIDIA A100</span> GPU cluster for low-latency clinical inference.',
      'Built an agentic Neuro-QML platform on <span class="text-neutral-200">NVIDIA BioNeMo</span> biomedical LLMs with automated validation agents to raise explainability &amp; accuracy.',
    ],
  },
];

const PROJECTS: Project[] = [
  {
    title: 'Citadel',
    category: 'Zero-Trust LLM Security',
    stack: ['FastAPI', 'Next.js 14', 'Lark', 'Docker'],
    description:
      'A high-throughput security middleware that screens every prompt for injection & jailbreaks, signs payloads with HMAC-SHA256, and validates model output before it reaches the app — under 200ms overhead.',
    architecture: [
      'Prompt → Injection / Jailbreak Screen',
      'Payload → HMAC-SHA256 Signing',
      'Output → Lark LALR(1) Grammar (fail-closed)',
      '216 pytest cases · 100% pass · 1.37s',
    ],
    link: 'https://github.com/bluebox123/guardrail',
    linkLabel: 'VIEW SOURCE',
  },
  {
    title: 'LLM From Scratch',
    category: '71.5M-Param GPT',
    stack: ['PyTorch', 'Flask', 'tiktoken'],
    description:
      'Pretrained a 71.5M-parameter decoder-only GPT on ~0.7B FineWeb-Edu tokens across 2× A100 80GB GPUs in 84 minutes (3.49 val loss) — a modern transformer stack built from scratch.',
    architecture: [
      'RoPE · RMSNorm · ReLU² MLP · QK-norm',
      'Muon (hidden) + AdamW (embeddings)',
      'Pretrain → 0.7B FineWeb-Edu tokens (2× A100)',
      'SFT Dolly-15k → Flask chat + web retrieval',
    ],
    link: 'https://github.com/bluebox123/llm_from_scratch',
    linkLabel: 'VIEW SOURCE',
  },
  {
    title: 'AnnotedAI',
    category: 'Hybrid RAG',
    stack: ['FastAPI', 'React', 'FAISS', 'SymPy'],
    description:
      'A numerical platform using robust RAG over technical PDFs. Solves hallucinations via symbolic math verification and rules-based dual-highlighting of source passages.',
    architecture: [
      'Ingest → Vector Store (FAISS)',
      'Retrieval → Maximal Marginal Relevance',
      'Verification → LLM + SymPy (Symbolic Math)',
      'UI → Dual-Highlighting (PDF Coord Mapping)',
    ],
    link: 'https://annoted-ai.vercel.app/',
    linkLabel: 'VIEW DEPLOYMENT',
  },
];

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'stack' | 'cert'>('stack');
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade the hero video on scroll via direct style mutation (rAF-coalesced) so
    // scrolling never triggers a React re-render of the whole tree.
    let ticking = false;
    const apply = () => {
      ticking = false;
      const fadeDistance = window.innerHeight * 0.8;
      const opacity = Math.max(0, 1 - window.scrollY / fadeDistance);
      if (videoWrapRef.current) videoWrapRef.current.style.opacity = String(opacity);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-signal-orange selection:text-black font-sans">
      <ScrollProgress />
      <ScrollCourier />
      <SeasonAtmosphere />
      <NavPill />

      {/* ── Video Background ── */}
      <div
        ref={videoWrapRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: 1, willChange: 'opacity' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/Realistic_Looping_Animation_Generated.mp4"
        />
        {/* Dark gradient overlay so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Watermark Cover / Status Badge */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 px-3 py-1.5 bg-black border border-neutral-800 rounded-full z-20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10B981]"></div>
          <span className="font-mono text-[10px] text-neutral-500 tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Subtle Background Grid */}
      <div className="fixed inset-0 pointer-events-none swiss-grid opacity-20 z-0"></div>

      {/* Hero Section */}
      <section id="identity" className="relative z-10 pt-32 md:pt-40 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-signal-orange/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none float-y"></div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-xs text-neutral-400 tracking-widest">ONLINE / CHENNAI, INDIA</span>
          </div>

          <h1 className="text-[clamp(3rem,12vw,9rem)] leading-[0.85] font-black tracking-tighter mix-blend-difference break-words">
            SAMARTH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-800 outline-text">SAXENA</span>
          </h1>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
            <div>
              <p className="text-lg md:text-2xl text-neutral-300 font-light max-w-lg leading-relaxed">
                Full Stack & AI Engineer building <span className="text-white font-medium border-b border-signal-orange">LLMs from scratch</span>, <span className="text-white font-medium border-b border-signal-orange">zero-trust AI security</span>, and <span className="text-white font-medium border-b border-signal-orange">multi-agent systems</span>.
              </p>
            </div>
            <div className="flex justify-start md:justify-end gap-4 md:gap-6">
              <a href="https://github.com/bluebox123" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-3 md:p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300 hover:-translate-y-1">
                <Github size={20} className="md:w-6 md:h-6" />
              </a>
              <a href="https://www.linkedin.com/in/samarth-saxena-1734a628b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-3 md:p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300 hover:-translate-y-1">
                <Linkedin size={20} className="md:w-6 md:h-6" />
              </a>
              <a href="mailto:samarthsaxena52@gmail.com" aria-label="Email" className="p-3 md:p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300 hover:-translate-y-1">
                <Mail size={20} className="md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brutalist Luxury Capabilities Section ── */}
      <BrutalistSection />

      {/* Experience */}
      <section id="experience" className="relative z-10 py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <Reveal>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 md:mb-12 gap-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">EXPERIENCE<span className="text-signal-orange">.</span></h2>
            <span className="font-mono text-xs text-neutral-600">CAREER_LOG</span>
          </div>
        </Reveal>

        {/* Two experience roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {ROLES.map((role, i) => (
            <Reveal key={role.company} variant={i === 0 ? 'left' : 'right'} delay={i * 120}>
              <ExperienceCard role={role} />
            </Reveal>
          ))}
        </div>

        {/* Profile bento: education / toolkit / metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Education Tile */}
          <Reveal variant="up" className="md:col-span-2">
            <BentoTile className="h-full" title="EDUCATION" icon={Award}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 h-full">
                <div>
                  <div className="text-lg font-bold">Vellore Institute of Technology</div>
                  <div className="text-xs font-mono text-neutral-500">B.Tech Computer Science (AI &amp; Robotics)</div>
                  <div className="text-xs font-mono text-neutral-600 mt-1">Chennai · Sept 2023 — May 2027</div>
                </div>
                <div className="text-3xl font-bold text-neutral-200 whitespace-nowrap">
                  <CountUp value={8.41} />
                  <span className="text-sm text-neutral-600">/10</span>
                </div>
              </div>
            </BentoTile>
          </Reveal>

          {/* Stack & Certs Toggle Tile */}
          <Reveal variant="up" delay={80} className="md:col-span-1">
            <BentoTile className="h-full" title="TOOLKIT" icon={Layers}>
              <div className="flex gap-2 mb-4 border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setActiveTab('stack')}
                  className={`text-xs font-mono transition-colors ${activeTab === 'stack' ? 'text-white' : 'text-neutral-600'}`}
                >
                  STACK
                </button>
                <button
                  onClick={() => setActiveTab('cert')}
                  className={`text-xs font-mono transition-colors ${activeTab === 'cert' ? 'text-white' : 'text-neutral-600'}`}
                >
                  CERTS
                </button>
              </div>

              {activeTab === 'stack' ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-neutral-600 mb-1">LANGUAGES</div>
                    <div className="flex flex-wrap gap-1">
                      {['Python', 'TypeScript', 'C++', 'Java', 'SQL'].map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-600 mb-1">AI / ML</div>
                    <div className="flex flex-wrap gap-1">
                      {['PyTorch', 'Transformers', 'RAG', 'LangChain', 'FAISS'].map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-600 mb-1">BACKEND / SEC</div>
                    <div className="flex flex-wrap gap-1">
                      {['FastAPI', 'Node.js', 'JWT', 'HMAC', 'Zero-Trust'].map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-600 mb-1">INFRA / FE</div>
                    <div className="flex flex-wrap gap-1">
                      {['Docker', 'NVIDIA Triton', 'AWS', 'Next.js 14'].map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-2 border border-neutral-800 bg-neutral-900/50">
                    <div className="text-xs font-bold text-signal-orange">1st Place · 200+ teams</div>
                    <div className="text-[10px] text-neutral-400">ThinkBridge Hackathon</div>
                  </div>
                  <div className="p-2 border border-neutral-800 bg-neutral-900/50">
                    <div className="text-xs font-bold text-white">Oracle Certified</div>
                    <div className="text-[10px] text-neutral-400">Generative AI Professional (2025)</div>
                  </div>
                  <div className="p-2 border border-neutral-800 bg-neutral-900/50">
                    <div className="text-xs font-bold text-white">AWS Solutions Architect</div>
                    <div className="text-[10px] text-neutral-400">Associate · Expected Jun 2026</div>
                  </div>
                </div>
              )}
            </BentoTile>
          </Reveal>

          {/* Quick Stats Tile */}
          <Reveal variant="up" delay={160} className="md:col-span-1">
            <BentoTile className="h-full flex flex-col justify-center" title="METRICS" icon={Cpu}>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-mono font-light">
                    <CountUp value={71.5} suffix="M" />
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase">GPT Params Pretrained</div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-light">
                    <CountUp value={500} suffix="+" />
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase">Daily Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-light">
                    <CountUp value={99.9} suffix="%" />
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase">Platform Uptime</div>
                </div>
              </div>
            </BentoTile>
          </Reveal>
        </div>
      </section>

      {/* Architecture / Projects */}
      <section id="projects" className="relative z-10 py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 md:mb-12 gap-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">PROJECTS<span className="text-signal-orange">.</span></h2>
            <span className="font-mono text-xs text-neutral-600">SELECTED_WORKS · HOVER FOR ARCHITECTURE</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} variant="scale" delay={i * 110}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4 md:px-6 border-t border-neutral-900 bg-neutral-950/55">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal variant="scale">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8">
              OPEN TO <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">WORK</span>?
            </h2>
            <p className="text-neutral-400 mb-12 text-base md:text-lg">
              Actively looking for full-time AI / Software Engineering roles (Remote / On-site). <br className="hidden md:block" />
              Let's build meaningful full-stack, LLM, and agentic systems.
            </p>
          </Reveal>

          <Reveal variant="up" delay={120}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Magnetic>
                <a href="mailto:samarthsaxena52@gmail.com" className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-signal-orange transition-colors">
                  <Mail size={20} />
                  <span>Get in Touch</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="/Samarth_Saxena_Resume.pdf" download="Samarth_Saxena_Resume.pdf" className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-neutral-800 bg-black text-white rounded-full font-medium hover:border-signal-orange transition-colors">
                  <FileText size={20} />
                  <span>Download Resume</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <footer className="mt-20 md:mt-32 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-xs font-mono text-neutral-700 text-center md:text-left">
            <div>
              &copy; 2025 SAMARTH SAXENA<br />
              BUILT WITH REACT + TAILWIND
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/bluebox123" target="_blank" rel="noopener noreferrer" className="hover:text-signal-orange transition-colors">GITHUB</a>
              <a href="https://www.linkedin.com/in/samarth-saxena-1734a628b" target="_blank" rel="noopener noreferrer" className="hover:text-signal-orange transition-colors">LINKEDIN</a>
              <a href="mailto:samarthsaxena52@gmail.com" className="hover:text-signal-orange transition-colors">EMAIL</a>
            </div>
            <div className="md:text-right">
              +91 70668 30353<br />
              CHENNAI, IN
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
