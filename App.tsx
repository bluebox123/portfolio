import React, { useState, useEffect, useRef } from 'react';
import BrutalistSection from './BrutalistSection';
import {
  Terminal,
  Cpu,
  Database,
  Layers,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Award,
  Code,
  Network
} from 'lucide-react';

// --- Types ---

interface Project {
  title: string;
  category: string;
  stack: string[];
  description: string;
  architecture: string[]; // The "Under the Hood" hover content
  link?: string;
}

// --- Components ---

const NavPill = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 shadow-2xl shadow-signal-orange/10">
      {['Identity', 'Capabilities', 'Engineering', 'Projects', 'Contact'].map((item, i) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className={`px-5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 ${i === 0 ? 'bg-signal-orange text-black font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
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
  icon: Icon
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ElementType;
}) => (
  <div className={`group relative p-6 bg-neutral-900/40 border border-neutral-800/60 overflow-hidden hover:border-signal-orange/50 transition-colors duration-500 ${className}`}>
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

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group relative h-[400px] w-full border-t border-neutral-800 hover:border-signal-orange transition-colors duration-300 overflow-hidden bg-black">
      {/* Default State */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between transition-transform duration-500 group-hover:-translate-y-full">
        <div>
          <div className="flex items-start justify-between mb-4">
            <span className="px-3 py-1 text-[10px] font-mono border border-neutral-700 rounded-full text-neutral-400">
              {project.category}
            </span>
            <ArrowUpRight className="text-neutral-600 group-hover:text-signal-orange transition-colors" />
          </div>
          <h3 className="text-4xl font-sans font-bold tracking-tight mb-2 leading-tight text-white group-hover:text-signal-orange transition-colors">
            {project.title}
          </h3>
          <p className="text-neutral-400 leading-relaxed max-w-md">
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

      {/* Hover State - Architecture View */}
      <div className="absolute inset-0 p-8 bg-neutral-900 flex flex-col translate-y-full transition-transform duration-500 group-hover:translate-y-0">
        <div className="flex items-center gap-2 mb-6 text-signal-orange font-mono text-xs uppercase">
          <Network size={14} />
          <span>System Architecture</span>
        </div>

        <div className="flex-grow space-y-4 font-mono text-sm text-neutral-300">
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
            VIEW DEPLOYMENT <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'stack' | 'cert'>('stack');
  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Fade out over the first 80vh of scroll
      const fadeDistance = window.innerHeight * 0.8;
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / fadeDistance);
      setVideoOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-signal-orange selection:text-black">
      <NavPill />

      {/* ── Video Background ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: videoOpacity, transition: 'opacity 0.05s linear' }}
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
        <div className="absolute bottom-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-black border border-neutral-800 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10B981]"></div>
          <span className="font-mono text-[10px] text-neutral-500 tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Subtle Background Grid */}
      <div className="fixed inset-0 pointer-events-none swiss-grid opacity-20 z-0"></div>

      {/* Hero Section */}
      <section id="identity" className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-signal-orange/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-xs text-neutral-400 tracking-widest">ONLINE / CHENNAI, INDIA</span>
          </div>

          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter mix-blend-difference">
            SAMARTH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-800 outline-text">SAXENA</span>
          </h1>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-lg leading-relaxed">
                Full Stack & AI Engineer focused on <span className="text-white font-medium border-b border-signal-orange">Generative AI</span> and <span className="text-white font-medium border-b border-signal-orange">Multi-agent Systems</span>.
                Building production-ready distributed applications.
              </p>
            </div>
            <div className="flex justify-start md:justify-end gap-6">
              <a href="https://github.com/bluebox123" target="_blank" rel="noopener noreferrer" className="p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/samarth-saxena-1734a628b" target="_blank" rel="noopener noreferrer" className="p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300">
                <Linkedin size={24} />
              </a>
              <a href="mailto:samarthsaxena52@gmail.com" className="p-4 border border-neutral-800 rounded-full hover:bg-signal-orange hover:text-black hover:border-signal-orange transition-all duration-300">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brutalist Luxury Capabilities Section ── */}
      <BrutalistSection />

      {/* Engineering / Bento Grid */}
      <section id="engineering" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-4xl font-bold tracking-tight">EXPERIENCE<span className="text-signal-orange">.</span></h2>
          <span className="font-mono text-xs text-neutral-600">SYS_OVERVIEW</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 h-auto md:h-[600px]">

          {/* Main Experience Tile */}
          <BentoTile className="md:col-span-2 md:row-span-2 bg-neutral-900" title="EXPERIENCE" icon={Terminal}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">SIEMENS</h3>
                <p className="text-sm font-mono text-signal-orange mb-6">Software Engineer Intern (Full Stack & AI)</p>
                <ul className="space-y-4 text-sm text-neutral-400">
                  <li className="flex gap-3">
                    <span className="text-signal-orange">→</span>
                    <span>Built SkillX (Enterprise Assessment) for 500+ daily users using Node.js & MySQL.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-signal-orange">→</span>
                    <span>Engineered real-time AI malpractice detection (TensorFlow.js) with &lt;200ms latency.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-signal-orange">→</span>
                    <span>Optimized DB pooling & JWT auth for 99.9% uptime during peak loads.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pb-2 font-mono text-xs text-neutral-400">JULY 2024 — FEB 2025</div>
            </div>
          </BentoTile>

          {/* Education Tile */}
          <BentoTile className="md:col-span-2 md:row-span-1" title="EDUCATION" icon={Award}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-bold">Vellore Institute of Technology</div>
                <div className="text-xs font-mono text-neutral-500">B.Tech Computer Science (AI & Robotics)</div>
              </div>
              <div className="text-3xl font-bold text-neutral-200">8.37<span className="text-sm text-neutral-600">/10</span></div>
            </div>
          </BentoTile>

          {/* Stack & Certs Toggle Tile */}
          <BentoTile className="md:col-span-1 md:row-span-2" title="TOOLKIT" icon={Layers}>
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
                    {['Python', 'TypeScript', 'C++', 'SQL'].map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 mb-1">AI & INFRA</div>
                  <div className="flex flex-wrap gap-1">
                    {['RAG', 'LangChain', 'Docker', 'AWS', 'RabbitMQ'].map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 mb-1">FRAMEWORKS</div>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Next.js', 'FastAPI', 'PyTorch'].map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-neutral-800 text-[10px] rounded text-neutral-300">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2 border border-neutral-800 bg-neutral-900/50">
                  <div className="text-xs font-bold text-signal-orange">1st Place</div>
                  <div className="text-[10px] text-neutral-400">ThinkBridge Hackathon</div>
                </div>
                <div className="p-2 border border-neutral-800 bg-neutral-900/50">
                  <div className="text-xs font-bold text-white">Oracle Certified</div>
                  <div className="text-[10px] text-neutral-400">Generative AI Professional (2025)</div>
                </div>
              </div>
            )}
          </BentoTile>

          {/* Quick Stats Tile */}
          <BentoTile className="md:col-span-1 md:row-span-2 flex flex-col justify-end" title="METRICS" icon={Cpu}>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-mono font-light">200<span className="text-sm text-signal-orange">ms</span></div>
                <div className="text-[10px] text-neutral-500 uppercase">Detection Latency</div>
              </div>
              <div>
                <div className="text-3xl font-mono font-light">500<span className="text-sm text-signal-orange">+</span></div>
                <div className="text-[10px] text-neutral-500 uppercase">Daily Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-mono font-light">99.9<span className="text-sm text-signal-orange">%</span></div>
                <div className="text-[10px] text-neutral-500 uppercase">Platform Uptime</div>
              </div>
            </div>
          </BentoTile>

        </div>
      </section>

      {/* Architecture / Projects */}
      <section id="projects" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-4xl font-bold tracking-tight">PROJECTS<span className="text-signal-orange">.</span></h2>
          <span className="font-mono text-xs text-neutral-600">SELECTED_WORKS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard
            project={{
              title: "Distributed Multi-Agent Workflow",
              category: "Agentic AI System",
              stack: ["React 19", "RabbitMQ", "Python", "WebSockets"],
              description: "A production-grade orchestration engine that converts NLP instructions into executable DAGs. Features fault-tolerant queues and live telemetry.",
              architecture: [
                "User Input (NLP) -> Orchestrator (DAG Gen)",
                "Task Queue -> RabbitMQ (Dead Letter Queues)",
                "Execution -> Python Workers (Async)",
                "Telemetry -> WebSocket -> React Flow UI"
              ],
              link: "https://github.com/bluebox123/agentic-team-workflow"
            }}
          />
          <ProjectCard
            project={{
              title: "AnnotedAI Platform",
              category: "Hybrid RAG",
              stack: ["FastAPI", "React", "FAISS", "SymPy"],
              description: "A numerical platform utilizing robust RAG for technical PDFs. Solves hallucinations via symbolic math verification and rules-based dual-highlighting.",
              architecture: [
                "Ingest -> Vector Store (FAISS)",
                "Retrieval -> Maximal Marginal Relevance",
                "Verification -> LLM + SymPy (Symbolic Math)",
                "UI -> Dual-Highlighting (PDF Coordinate Mapping)"
              ],
              link: "https://annoted-ai.vercel.app/"
            }}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 px-6 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
            OPEN TO <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">WORK</span>?
          </h2>
          <p className="text-neutral-400 mb-12 text-lg">
            Actively looking for AI Engineering internships (Remote / On-site). <br />
            Let's build meaningful full-stack and agentic projects.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a href="mailto:samarthsaxena52@gmail.com" className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-signal-orange transition-colors">
              <Mail size={20} />
              <span>Get in Touch</span>
            </a>
            <a href="resume_samarth_i.pdf" download className="flex items-center gap-3 px-8 py-4 border border-neutral-800 bg-black text-white rounded-full font-medium hover:border-signal-orange transition-colors">
              <Code size={20} />
              <span>Download Resume</span>
            </a>
          </div>

          <footer className="mt-32 flex justify-between items-end text-xs font-mono text-neutral-700">
            <div>
              &copy; 2025 SAMARTH SAXENA<br />
              BUILT WITH REACT + TAILWIND
            </div>
            <div className="text-right">
              +91 70668 30353<br />
              CHENNAI, IN
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}