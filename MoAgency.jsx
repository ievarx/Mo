import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   PARTICLE CANVAS BACKGROUND
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const PARTICLE_COUNT = 90;
    const CONNECTION_DIST = 140;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
    }));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100,160,255,0.55)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(80,140,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.55,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MO LOGO SVG (refined from the uploaded image)
───────────────────────────────────────────── */
function MoLogo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* fluid wave "M" path */}
      <path
        d="M10 42 C20 18, 34 18, 42 36 C50 54, 58 54, 66 36 C74 18, 86 22, 96 38 C104 50, 112 52, 118 48"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* dot */}
      <circle cx="52" cy="65" r="5.5" fill="white" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SCROLL-REVEAL HOOK
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Services", "About", "Portfolio", "Contact"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.4s ease",
        background: scrolled
          ? "rgba(6,9,20,0.78)"
          : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(80,140,255,0.12)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MoLogo size={42} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 18,
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            Mo<span style={{ color: "#4d9fff" }}>Agency</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.08em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#4d9fff")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              padding: "9px 22px",
              background: "linear-gradient(135deg,#1a6fff,#7c3aed)",
              borderRadius: 8,
              color: "#fff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.06em",
              boxShadow: "0 0 18px rgba(77,159,255,0.35)",
              transition: "box-shadow 0.25s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 32px rgba(77,159,255,0.65)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 18px rgba(77,159,255,0.35)")
            }
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        position: "relative",
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: "absolute", top: "20%", left: "10%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle,rgba(77,159,255,0.12) 0%,transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "8%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.10) 0%,transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 860, position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 18px",
            background: "rgba(77,159,255,0.10)",
            border: "1px solid rgba(77,159,255,0.25)",
            borderRadius: 100,
            marginBottom: 36,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s ease 0.1s",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4d9fff", display: "block", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em" }}>
            AI-POWERED SOFTWARE AGENCY
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Syne', 'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(42px, 6.5vw, 88px)",
            lineHeight: 1.05,
            color: "#fff",
            margin: "0 0 28px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease 0.25s",
          }}
        >
          Transforming Logic<br />
          <span style={{
            background: "linear-gradient(135deg,#4d9fff 0%,#a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            into Intelligence.
          </span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(15px, 2vw, 20px)",
            color: "rgba(255,255,255,0.55)",
            maxWidth: 580,
            margin: "0 auto 48px",
            lineHeight: 1.7,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.4s",
          }}
        >
          Custom Software, Seamless Automation, and Next-Gen AI Solutions built for the era of machine intelligence.
        </p>

        {/* CTA */}
        <div
          style={{
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.55s",
          }}
        >
          <GlowButton href="#services" primary>Explore Our Work</GlowButton>
          <GlowButton href="#contact">Talk to Us →</GlowButton>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
            marginTop: 72,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease 0.75s",
          }}
        >
          {[["50+", "Projects Shipped"], ["99%", "Client Satisfaction"], ["5x", "Avg. ROI"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', monospace", fontSize: 36, fontWeight: 800, color: "#4d9fff" }}>{n}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlowButton({ href, children, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        padding: "14px 32px",
        borderRadius: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 14,
        textDecoration: "none",
        letterSpacing: "0.05em",
        transition: "all 0.25s ease",
        ...(primary
          ? {
              background: hov
                ? "linear-gradient(135deg,#2979ff,#9c27b0)"
                : "linear-gradient(135deg,#1a6fff,#7c3aed)",
              color: "#fff",
              boxShadow: hov
                ? "0 0 40px rgba(77,159,255,0.75), 0 0 80px rgba(124,58,237,0.3)"
                : "0 0 22px rgba(77,159,255,0.4)",
            }
          : {
              background: hov ? "rgba(77,159,255,0.1)" : "transparent",
              color: hov ? "#fff" : "rgba(255,255,255,0.65)",
              border: "1px solid rgba(77,159,255,0.35)",
            }),
      }}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
const SERVICES = [
  {
    icon: "⬡",
    title: "Custom Software Development",
    desc: "From concept to deployment — bespoke web, mobile, and desktop applications engineered for scale, speed, and security.",
    tag: "Full-Stack · Cloud · DevOps",
    color: "#4d9fff",
  },
  {
    icon: "⌬",
    title: "System Integration",
    desc: "Unify your tech stack. We bridge legacy systems, third-party APIs, and modern platforms into one coherent ecosystem.",
    tag: "APIs · Microservices · Data Pipelines",
    color: "#a855f7",
  },
  {
    icon: "⟳",
    title: "Workflow Automation",
    desc: "Eliminate bottlenecks. Intelligent bots and automated pipelines that reclaim hours and eliminate human error.",
    tag: "RPA · Bots · Scheduling",
    color: "#22d3ee",
  },
  {
    icon: "◈",
    title: "AI & Machine Learning",
    desc: "Deploy models that learn, adapt, and predict. Computer vision, NLP, generative AI, and custom LLM solutions.",
    tag: "LLMs · CV · NLP · Agents",
    color: "#f59e0b",
  },
];

function ServiceCard({ svc, delay }) {
  const [ref, visible] = useReveal();
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? "rgba(20,28,55,0.9)"
          : "rgba(12,17,38,0.75)",
        border: `1px solid ${hov ? svc.color + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18,
        padding: "36px 30px",
        backdropFilter: "blur(20px)",
        boxShadow: hov ? `0 0 40px ${svc.color}22` : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, border 0.3s, box-shadow 0.3s, background 0.3s`,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow corner */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 160, height: 160,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${svc.color}18 0%, transparent 70%)`,
        pointerEvents: "none",
        transition: "opacity 0.3s",
        opacity: hov ? 1 : 0.4,
      }} />

      <div style={{ fontSize: 28, marginBottom: 20, color: svc.color }}>{svc.icon}</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700, fontSize: 20, color: "#fff",
        margin: "0 0 14px", lineHeight: 1.3,
      }}>
        {svc.title}
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14, color: "rgba(255,255,255,0.5)",
        lineHeight: 1.75, margin: "0 0 24px",
      }}>
        {svc.desc}
      </p>
      <div style={{
        display: "inline-block",
        padding: "5px 12px",
        background: `${svc.color}14`,
        border: `1px solid ${svc.color}30`,
        borderRadius: 100,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        color: svc.color,
        letterSpacing: "0.08em",
      }}>
        {svc.tag}
      </div>
    </div>
  );
}

function Services() {
  const [ref, visible] = useReveal();
  return (
    <section id="services" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>What We Build</SectionLabel>
        <h2
          ref={ref}
          style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 56px)", color: "#fff",
            margin: "12px 0 60px", lineHeight: 1.15,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s ease",
          }}
        >
          Our Core<br />
          <span style={{ color: "#4d9fff" }}>Capabilities</span>
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const [ref, visible] = useReveal();
  const [ref2, visible2] = useReveal();

  return (
    <section id="about" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 64, alignItems: "center",
        }}
          className="about-grid"
        >
          {/* Visual panel */}
          <div
            ref={ref}
            style={{
              background: "rgba(12,17,38,0.7)",
              border: "1px solid rgba(77,159,255,0.15)",
              borderRadius: 24,
              padding: 40,
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease",
              minHeight: 340,
            }}
          >
            {/* Big logo centered */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
              <div style={{
                background: "radial-gradient(circle,rgba(77,159,255,0.18) 0%,transparent 70%)",
                borderRadius: "50%", padding: 40,
              }}>
                <MoLogo size={100} />
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em",
                textAlign: "center",
              }}>
                // HUMAN × MACHINE<br />// CREATIVITY × PRECISION
              </div>
            </div>

            {/* Decorative corner lines */}
            <div style={{ position: "absolute", top: 16, left: 16, width: 40, height: 40, borderTop: "2px solid #4d9fff33", borderLeft: "2px solid #4d9fff33" }} />
            <div style={{ position: "absolute", bottom: 16, right: 16, width: 40, height: 40, borderBottom: "2px solid #4d9fff33", borderRight: "2px solid #4d9fff33" }} />
          </div>

          {/* Text */}
          <div
            ref={ref2}
            style={{
              opacity: visible2 ? 1 : 0,
              transform: visible2 ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.15s",
            }}
          >
            <SectionLabel>About Mo Agency</SectionLabel>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 46px)", color: "#fff",
              margin: "12px 0 24px", lineHeight: 1.2,
            }}>
              Where Human Creativity Meets Machine Precision
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15,
              color: "rgba(255,255,255,0.55)", lineHeight: 1.8,
              margin: "0 0 20px",
            }}>
              Mo Agency is a boutique tech studio built on one conviction: the best software emerges at the intersection of deep human empathy and ruthless engineering discipline.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15,
              color: "rgba(255,255,255,0.55)", lineHeight: 1.8,
              margin: "0 0 36px",
            }}>
              We don't just write code — we architect intelligent systems that adapt, scale, and evolve alongside your business. From startups to enterprises, our solutions are engineered to outlast the hype.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["Agile", "AI-First", "Security-Minded", "Scalable"].map((tag) => (
                <span key={tag} style={{
                  padding: "6px 16px",
                  background: "rgba(77,159,255,0.10)",
                  border: "1px solid rgba(77,159,255,0.22)",
                  borderRadius: 100,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: "#4d9fff", letterSpacing: "0.06em",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PORTFOLIO
───────────────────────────────────────────── */
const PROJECTS = [
  { title: "NeuralCart", cat: "E-Commerce AI", desc: "AI-powered product recommendation engine boosting conversions by 340%.", color: "#4d9fff" },
  { title: "FlowBridge", cat: "Automation", desc: "Enterprise workflow orchestrator replacing 3 legacy tools.", color: "#a855f7" },
  { title: "VisionIQ", cat: "Computer Vision", desc: "Real-time defect detection system for manufacturing lines.", color: "#22d3ee" },
  { title: "SynthCore API", cat: "AI Platform", desc: "Unified LLM gateway serving 2M+ requests per day.", color: "#f59e0b" },
  { title: "DataLoom", cat: "Analytics", desc: "Self-serve BI platform with natural language query interface.", color: "#ec4899" },
  { title: "SecureVault", cat: "Cybersecurity", desc: "Zero-trust authentication framework for fintech clients.", color: "#10b981" },
];

function PortfolioCard({ proj, delay }) {
  const [ref, visible] = useReveal(0.1);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(20,28,55,0.95)" : "rgba(12,17,38,0.7)",
        border: `1px solid ${hov ? proj.color + "44" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "28px 26px",
        backdropFilter: "blur(16px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, border 0.25s, background 0.25s`,
        cursor: "pointer",
        boxShadow: hov ? `0 8px 40px ${proj.color}18` : "none",
      }}
    >
      <div style={{
        height: 4, borderRadius: 4,
        background: `linear-gradient(90deg,${proj.color},transparent)`,
        marginBottom: 22,
      }} />
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: proj.color, letterSpacing: "0.12em", marginBottom: 10,
      }}>
        {proj.cat}
      </div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 20, color: "#fff", margin: "0 0 12px",
      }}>
        {proj.title}
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 13,
        color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0,
      }}>
        {proj.desc}
      </p>
    </div>
  );
}

function Portfolio() {
  const [ref, visible] = useReveal();
  return (
    <section id="portfolio" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Our Work</SectionLabel>
        <h2
          ref={ref}
          style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 56px)", color: "#fff",
            margin: "12px 0 56px", lineHeight: 1.15,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease",
          }}
        >
          Selected<br />
          <span style={{ color: "#a855f7" }}>Projects</span>
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {PROJECTS.map((p, i) => (
            <PortfolioCard key={p.title} proj={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT — Terminal aesthetic
───────────────────────────────────────────── */
function Contact() {
  const [ref, visible] = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(null);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "rgba(0,0,0,0.45)",
    border: `1px solid ${active === field ? "#4d9fff55" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8,
    padding: "13px 16px",
    color: "#e0edff",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.25s",
    resize: "vertical",
  });

  return (
    <section id="contact" style={{ padding: "100px 24px 120px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SectionLabel>Get In Touch</SectionLabel>
        <h2
          ref={ref}
          style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(30px, 4vw, 52px)", color: "#fff",
            margin: "12px 0 48px", lineHeight: 1.15,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease",
          }}
        >
          Let's Build<br />
          <span style={{ color: "#22d3ee" }}>Something Great</span>
        </h2>

        {/* Terminal card */}
        <div style={{
          background: "rgba(6,9,20,0.85)",
          border: "1px solid rgba(77,159,255,0.2)",
          borderRadius: 18,
          overflow: "hidden",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(77,159,255,0.08)",
        }}>
          {/* Terminal header bar */}
          <div style={{
            padding: "14px 20px",
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: "rgba(255,255,255,0.3)", marginLeft: 12, letterSpacing: "0.06em",
            }}>
              ~/moagency/contact — bash
            </span>
          </div>

          <div style={{ padding: 36 }}>
            {!sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>$ name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setActive("name")}
                    onBlur={() => setActive(null)}
                    style={inputStyle("name")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>$ email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setActive("email")}
                    onBlur={() => setActive(null)}
                    style={inputStyle("email")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>$ message</label>
                  <textarea
                    placeholder="Describe your project or inquiry..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setActive("message")}
                    onBlur={() => setActive(null)}
                    style={inputStyle("message")}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg,#1a6fff,#7c3aed)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    boxShadow: "0 0 24px rgba(77,159,255,0.35)",
                    transition: "box-shadow 0.25s",
                    alignSelf: "flex-start",
                  }}
                  onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 40px rgba(77,159,255,0.6)")}
                  onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 24px rgba(77,159,255,0.35)")}
                >
                  $ send --message
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#28c840", fontSize: 14, marginBottom: 8,
                }}>
                  Message transmitted successfully.
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(255,255,255,0.4)", fontSize: 13,
                }}>
                  We'll respond within 24 hours.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const labelStyle = {
  display: "block",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  color: "#4d9fff",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8,
    }}>
      <div style={{ width: 24, height: 1, background: "#4d9fff" }} />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "#4d9fff", letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "28px 24px",
      textAlign: "center",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
        <MoLogo size={28} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 14, color: "rgba(255,255,255,0.5)",
        }}>
          Mo<span style={{ color: "#4d9fff" }}>Agency</span>
        </span>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12,
        color: "rgba(255,255,255,0.25)", margin: 0,
      }}>
        © 2025 Mo Agency. All rights reserved. Built with intelligence.
      </p>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#060914 0%,#080d1e 50%,#06091a 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.4); }
        }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060914; }
        ::-webkit-scrollbar-thumb { background: #1a3a6f; border-radius: 3px; }
      `}</style>

      <ParticleCanvas />
      <Nav />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}
