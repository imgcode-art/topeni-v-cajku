import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Phone, Menu, X, Wrench, Droplets, Zap, Shield,
  CheckCircle, ArrowRight, ChevronDown, Clock,
  Star, Award, Wind, Flame, Check,
  Leaf, TrendingDown, AlertCircle, FileText, Users, RefreshCw, Handshake, Heart,
  Play, Volume2, Percent
} from "lucide-react";

type Page =
  | "home" | "servis" | "cisteni" | "tepelna-cerpadla"
  | "marox" | "o-nas" | "kontakt";

const PHONE = "608 888 325";
const PHONE_HREF = "tel:+420608888325";
const WEB3FORMS_KEY = "4040abc3-6d29-433c-a981-b0c339e2a2d4";

// Palette — black, white, accent orange
const INK = "#0A0A0A";
const CREAM = "#FFFFFF";
const FIRE = "#E8623E";
const SMOKE = "#141414";
const HERO_GRADIENT = `linear-gradient(155deg, #1E1E1E 0%, ${INK} 65%)`;
const LOGO_TONE = "rgba(255,255,255,0.55)";

const FD = "'Poppins', sans-serif"; // display (headings, buttons, logo)
const FB = "'Inter', sans-serif"; // body (paragraphs, labels)

// Signature notched-corner clip paths (cut top-right corner) — used instead of rounded corners
const NOTCH_LG = "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";
const NOTCH_MD = "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)";
const NOTCH_SM = "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
function navTo(page: Page, setPage: (p: Page) => void) {
  setPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className, y = 22 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Counter ──────────────────────────────────────────────────────────────────
function Counter({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(value.replace(/[0-9]/g, "0"));

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1100;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target) + suffix);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref} className={className} style={style}>{display}</span>;
}

// ── VideoCard ────────────────────────────────────────────────────────────────
function VideoCard({ src, duration }: { src: string; duration: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  return (
    <div className="overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="relative" style={{ aspectRatio: "16/9", background: INK }}>
        <video
          ref={videoRef}
          controls={started}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          src={src}
        />
        {!started && (
          <>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}1a 0%, ${INK}99 100%)` }} />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white"
              style={{ background: "rgba(0,0,0,0.5)", fontFamily: FB }}>
              <Volume2 size={12} />
              Video se zvukem
            </div>
            <button onClick={handlePlay} aria-label="Přehrát video"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.span
                className="flex items-center justify-center rounded-full"
                style={{ width: 68, height: 68, background: FIRE, boxShadow: "0 16px 32px -12px rgba(232,98,62,0.75)" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2 }}>
                <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
              </motion.span>
              <span className="text-white font-semibold text-sm px-3 py-1 rounded-full" style={{ fontFamily: FB, background: "rgba(0,0,0,0.35)" }}>
                Přehrát video · {duration}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── HeroVideo ────────────────────────────────────────────────────────────────
// Loops from the start up to loopEnd (last radiator lit), then jumps back — never plays the full tail.
function HeroVideo({ src, loopEnd = 3.3, className = "w-full h-auto block", style }: { src: string; loopEnd?: number; className?: string; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => {
      if (v.currentTime >= loopEnd) v.currentTime = 0;
    };
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, [loopEnd]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ filter: "brightness(0.78) saturate(0.9)", ...style }}
      autoPlay muted playsInline
    />
  );
}

// ── Aurora ───────────────────────────────────────────────────────────────────
function Aurora({ color = FIRE }: { color?: string }) {
  return (
    <div className="aurora-wrap" aria-hidden="true">
      <div className="aurora-band" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}00 8%, ${color}CC 45%, ${color}CC 55%, ${color}00 92%, transparent 100%)`, animationDelay: "0s" }} />
      <div className="aurora-band" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}00 15%, ${color}66 50%, ${color}00 85%, transparent 100%)`, animationDelay: "-6s", opacity: 0.5 }} />
    </div>
  );
}

// ── StarBorder ───────────────────────────────────────────────────────────────
function StarBorder({
  as: Component = "button",
  className = "",
  color = FIRE,
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...rest
}: {
  as?: any; className?: string; color?: string; speed?: string; thickness?: number;
  children?: React.ReactNode; style?: React.CSSProperties; [key: string]: any;
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{ padding: `${thickness}px 0`, "--sb-color": color, ...style } as React.CSSProperties}
      {...rest}>
      <div className="border-gradient-bottom" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }} />
      <div className="border-gradient-top" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }} />
      <div className="inner-content">{children}</div>
    </Component>
  );
}

// ── Logo ─────────────────────────────────────────────────────────────────────
function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center rounded-full shrink-0"
      style={{ width: size, height: size, background: "rgba(255,255,255,0.08)", border: `1.3px solid ${LOGO_TONE}` }}>
      <motion.span
        className="inline-flex"
        animate={{
          scale: [1, 1.12, 0.94, 1.06, 1],
          rotate: [0, -5, 4, -3, 0],
          filter: [
            "brightness(0.95) saturate(0.85)",
            "brightness(1.3) saturate(1.4)",
            "brightness(0.95) saturate(0.85)",
            "brightness(1.18) saturate(1.2)",
            "brightness(0.95) saturate(0.85)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 90%" }}>
        <Flame size={size * 0.56} style={{ color: LOGO_TONE }} fill={LOGO_TONE} strokeWidth={1.5} />
      </motion.span>
      <span className="absolute inline-flex items-center justify-center rounded-full"
        style={{
          width: size * 0.44, height: size * 0.44,
          right: -size * 0.06, bottom: -size * 0.06,
          background: INK, border: `1.2px solid ${LOGO_TONE}`,
        }}>
        <Check size={size * 0.26} style={{ color: LOGO_TONE }} strokeWidth={3} />
      </span>
    </span>
  );
}

function Logo({ textSize = "text-lg", markSize = 30 }: { textSize?: string; markSize?: number }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={markSize} />
      <span className={`font-semibold ${textSize}`} style={{ fontFamily: FD, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.55)" }}>
        Topení v cajku
      </span>
    </span>
  );
}

// ── CustomCursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement;
      setPointer(!!target.closest("a, button, [role='button']"));
    };
    const hide = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div className="hidden lg:block fixed inset-0 z-[100] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}>
      <motion.div
        className="absolute rounded-full flex items-center justify-center top-0 left-0"
        style={{ width: 18, height: 18, marginLeft: -9, marginTop: -9, background: "rgba(255,255,255,0.75)", border: "1px solid rgba(0,0,0,0.06)" }}
        animate={{ x: pos.x, y: pos.y, scale: pointer ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 45, mass: 0.3 }}>
        <div className="rounded-full" style={{ width: 5, height: 5, background: INK, opacity: 0.7 }} />
      </motion.div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ currentPage, setPage }: { currentPage: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav: { label: string; page: Page }[] = [
    { label: "Čištění systémů", page: "cisteni" },
    { label: "Tepelná čerpadla", page: "tepelna-cerpadla" },
    { label: "Servis kotlů", page: "servis" },
    { label: "Fernox & Kamco", page: "marox" },
    { label: "Kontakt", page: "kontakt" },
  ];
  const go = (page: Page) => { navTo(page, setPage); setOpen(false); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 transition-shadow duration-300"
      style={{ background: INK, boxShadow: scrolled ? "0 8px 24px -12px rgba(0,0,0,0.5)" : "none" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-[76px] flex items-center justify-between gap-8">
        {/* Logo */}
        <button onClick={() => go("home")} className="appearance-none flex items-center gap-2 shrink-0 transition-opacity hover:opacity-75 outline-none" style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }} aria-label="Domů">
          <Logo textSize="text-xl" markSize={34} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {nav.map((item) => (
            <button key={item.page} onClick={() => go(item.page)}
              className="px-5 py-2.5 text-[15px] font-medium transition-colors"
              style={{
                fontFamily: FB,
                background: currentPage === item.page ? "rgba(232,98,62,0.15)" : "transparent",
                color: currentPage === item.page ? FIRE : "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={e => { if (currentPage !== item.page) (e.target as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { if (currentPage !== item.page) (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
              <span className="flex items-center gap-2.5 text-white text-sm font-semibold uppercase tracking-widest px-7 py-3.5" style={{ fontFamily: FD }}>
                <ArrowRight size={15} strokeWidth={2.5} />Zavolat
              </span>
            </StarBorder>
          </div>
          <button onClick={() => setOpen(!open)}
            className="lg:hidden p-1.5 text-white/90 hover:text-white">
            {open ? <X size={24} strokeWidth={2.25} /> : <Menu size={24} strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)} />
            <motion.div
              className="lg:hidden fixed top-[68px] right-4 z-50 w-[min(300px,calc(100vw-2rem))] overflow-hidden rounded-[28px]"
              style={{ background: SMOKE, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px -12px rgba(0,0,0,0.6)", transformOrigin: "top right" }}
              initial={{ opacity: 0, scale: 0.85, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}>
              <div className="p-3">
                {nav.map((item, i) => (
                  <motion.button key={item.page} onClick={() => go(item.page)}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                    className="flex items-center justify-between w-full text-left px-4 py-3 text-sm font-medium rounded-2xl transition-colors"
                    style={{
                      fontFamily: FB,
                      color: currentPage === item.page ? "#fff" : "rgba(255,255,255,0.65)",
                      background: currentPage === item.page ? "rgba(232,98,62,0.18)" : "transparent",
                    }}>
                    {item.label}
                    {currentPage === item.page && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: FIRE }} />}
                  </motion.button>
                ))}
              </div>
              <div className="p-3 pt-0">
                <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2} className="w-full" style={{ display: "block" }}>
                  <span className="flex items-center justify-center gap-2.5 text-white py-3.5 uppercase tracking-widest font-semibold text-sm" style={{ fontFamily: FD }}>
                    <ArrowRight size={16} strokeWidth={2.5} />Zavolat
                  </span>
                </StarBorder>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const go = (page: Page) => navTo(page, setPage);
  return (
    <footer style={{ background: INK, fontFamily: FB }}>
      {/* Links */}
      <div style={{ background: INK }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <button onClick={() => go("home")} className="appearance-none mb-4 inline-block hover:opacity-80 transition-opacity outline-none" style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }}>
            <Logo textSize="text-sm" markSize={24} />
          </button>
          <p className="text-xs text-white/55 leading-relaxed">
            Váš spolehlivý topenář.
          </p>
        </div>
        {[
          {
            title: "Služby",
            items: [
              ["cisteni", "Čištění topení"],
              ["tepelna-cerpadla", "Tepelná čerpadla"],
              ["servis", "Servis kotlů"],
              ["marox", "Fernox & Kamco"],
            ] as [Page, string][],
          },
          {
            title: "Firma",
            items: [
              ["o-nas", "O nás"],
              ["kontakt", "Kontakt"],
            ] as [Page, string][],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs uppercase tracking-wide font-semibold mb-4" style={{ color: FIRE }}>{col.title}</h4>
            <ul className="space-y-2">
              {col.items.map(([page, label]) => (
                <li key={page}>
                  <button onClick={() => go(page)} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 py-5 text-center text-xs text-white/20">
        <span>© 2026 Topení v cajku</span>
      </div>
      </div>
    </footer>
  );
}

// ── FAQBlock ─────────────────────────────────────────────────────────────────
interface FAQItem { q: string; a: string; }

function FAQBlock({ items, title = "Časté dotazy" }: { items: FAQItem[]; title?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section style={{ background: SMOKE, fontFamily: FB }} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h2 className="font-bold text-white mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)", lineHeight: 1 }}>
            {title.toUpperCase()}
          </h2>
        </Reveal>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div key={i} className="overflow-hidden transition-shadow duration-300"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  clipPath: NOTCH_SM,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${isOpen ? FIRE : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isOpen ? "0 12px 28px -16px rgba(232,98,62,0.45)" : "none",
                }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left pl-5 pr-5 py-5 sm:pl-6 sm:pr-6">
                  <span className="font-semibold text-white text-base leading-snug min-w-0">{item.q}</span>
                  <span className="shrink-0 w-8 h-8 flex items-center justify-center transition-colors duration-300"
                    style={{ background: isOpen ? FIRE : "rgba(255,255,255,0.08)", clipPath: NOTCH_SM }}>
                    <ChevronDown size={15} className="transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: isOpen ? "#fff" : "rgba(255,255,255,0.4)" }} />
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pl-6 pr-6 text-sm leading-relaxed text-white/55">{item.a}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── InquiryForm ───────────────────────────────────────────────────────────────
function InquiryForm({ title = "Pojďme to vyřešit", subtitle, dark = false, id }: {
  title?: string; subtitle?: string; dark?: boolean; id?: string;
}) {
  const [form, setForm] = useState({ name: "", phone: "", issue: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nová poptávka — Topení v cajku",
          jmeno: form.name,
          telefon: form.phone,
          co_resite: form.issue,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true); else setError(true);
    } catch {
      setError(true);
    }
    setBusy(false);
  };

  const bg = dark ? SMOKE : CREAM;
  const headColor = dark ? "#fff" : "#111";
  const subColor = dark ? "rgba(255,255,255,0.45)" : "#777";
  const labelColor = dark ? "rgba(255,255,255,0.6)" : "#555";
  const inputClass = dark
    ? "bg-white/10 border-white/25 text-white placeholder:text-white/35 focus:border-[#E8623E] focus:bg-white/[0.14] focus:shadow-[0_0_0_3px_rgba(232,98,62,0.18)]"
    : "bg-white border-black/12 text-[#111] placeholder:text-black/25 focus:border-[#E8623E] focus:shadow-[0_0_0_3px_rgba(232,98,62,0.12)]";

  return (
    <section id={id} className="py-24 px-6" style={{ background: bg, fontFamily: FB }}>
      <Reveal className="max-w-lg mx-auto">
        <h2 className="font-bold mb-2" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 1, color: headColor }}>
          {title.toUpperCase()}
        </h2>
        {subtitle && <p className="text-sm mb-8 leading-relaxed" style={{ color: subColor }}>{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}

        {sent ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} style={{ color: FIRE }} />
            </div>
            <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: FD, color: headColor }}>ODESLÁNO!</h3>
            <p className="text-sm" style={{ color: subColor }}>Ozveme se vám v pracovní dny a domluvíme termín.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {[
              { label: "Jméno *", key: "name", type: "text", ph: "Tonda Cajk" },
              { label: "Telefon *", key: "phone", type: "tel", ph: "+420 xxx xxx xxx" },
            ].map(({ label, key, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-normal mb-2" style={{ color: labelColor }}>{label}</label>
                <input type={type} required value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
                  className={`w-full px-4 py-3.5 border text-sm outline-none transition-colors ${inputClass}`} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-normal mb-2" style={{ color: labelColor }}>Co řešíte? *</label>
              <textarea required rows={3} value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                placeholder="Kotel nespouští, chci revizi, zajímá mě tepelné čerpadlo…"
                className={`w-full px-4 py-3.5 border text-sm outline-none resize-none transition-colors ${inputClass}`} />
            </div>
            <StarBorder as="button" type="submit" disabled={busy} color={FIRE} speed="4s" thickness={2} className="w-full" style={{ display: "block", opacity: busy ? 0.6 : 1 }}>
              <span className="block text-white font-bold text-sm py-4.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
                {busy ? "Odesílám…" : "ODESLAT POPTÁVKU →"}
              </span>
            </StarBorder>
            {error && (
              <p className="text-sm text-center" style={{ color: "#ef4444" }}>
                Odeslání se nepovedlo. Zkuste to prosím znovu, nebo nám rovnou zavolejte na {PHONE}.
              </p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
}

// ── SectionHero ───────────────────────────────────────────────────────────────
function SectionHero({ eyebrow, title, subtitle, icon, formId, imgId, imgSrc, videoSrc, aurora, imgDim }: {
  eyebrow: string; title: React.ReactNode; subtitle: React.ReactNode; icon: React.ReactNode; formId: string; imgId?: string; imgSrc?: string; videoSrc?: string; aurora?: boolean; imgDim?: number;
}) {
  const heroImg = imgSrc || (imgId ? `https://images.unsplash.com/${imgId}?w=1400&h=600&fit=crop&auto=format` : undefined);
  return (
    <section className="relative overflow-hidden py-28 lg:py-32 px-6"
      style={{ background: aurora ? INK : HERO_GRADIENT, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 96%)" }}>
      {aurora && <Aurora color={FIRE} />}
      {!aurora && videoSrc && (
        <div className="absolute inset-0">
          <video src={videoSrc} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}66 0%, ${INK}99 55%, ${INK}E0 100%)` }} />
        </div>
      )}
      {!aurora && !videoSrc && heroImg && (
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}66 0%, ${INK}99 55%, ${INK}E0 100%)` }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(115deg, ${FIRE}66 0%, transparent 55%)` }} />
          {imgDim && <div className="absolute inset-0" style={{ background: INK, opacity: imgDim }} />}
        </div>
      )}
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h1 className="font-bold text-white mb-6 leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
          {title}
        </motion.h1>
        <motion.p className="text-white/75 max-w-xl leading-relaxed mb-8 text-base" style={{ fontFamily: FB }}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}>
          {subtitle}
        </motion.p>
        <motion.div className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}>
          <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
            <span className="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-3.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
              <Phone size={18} />Zavolat
            </span>
          </StarBorder>
          <button onClick={() => scrollTo(formId)}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold uppercase tracking-wide text-sm px-7 py-3.5 border border-white/20 hover:border-white/40 transition-all"
            style={{ fontFamily: FB }}>
            Nezávazná poptávka <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════════════

const HOME_FAQ: FAQItem[] = [
  { q: "Jak se objednat na servis nebo opravu kotle?", a: "Zavolejte na 608 888 325 nebo pošlete poptávku přes formulář. Domluvíme se na termínu výjezdu dle vzájemné domluvy." },
  { q: "Jaké kotle servisujete?", a: "Servisujeme všechny běžné plynové kotle bez ohledu na značku — Viessmann, Vaillant, Buderus, Junkers, Protherm, Baxi a další. Nejsme vázáni na jednoho výrobce." },
  { q: "Kolik stojí výjezd a diagnostika?", a: "Cena závisí na konkrétní situaci. Vždy vám ale cenu sdělíme předem – stačí nám popsat váš problém a na ceně se domluvíme dopředu." },
  { q: "Provádíte i povinné revize kotlů?", a: "Ano, pravidelné servisní prohlídky i revize plynových kotlů. Po revizi dostanete revizní protokol. Revize je zákonnou povinností — doporučujeme ji jednou ročně." },
];

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const go = (page: Page) => navTo(page, setPage);

  const services = [
    { icon: <Droplets size={18} />, title: "Chemicko-mechanické čištění", desc: "Profesionální proplach systému — úspora 15–30 % na energiích. Přípravky Fernox a Kamco.", page: "cisteni" as Page },
    { icon: <Wind size={18} />, title: "Tepelná čerpadla", desc: "Dodávka, montáž a servis tepelných čerpadel. Nezávislé doporučení.", page: "tepelna-cerpadla" as Page },
    { icon: <Wrench size={18} />, title: "Servis plynových kotlů", desc: "Revize, opravy, záruční i pozáruční servis. Přesná diagnostika, cena sdělena před zahájením.", page: "servis" as Page },
    { icon: <FileText size={18} />, title: "Prodej přípravků Fernox a Kamco", desc: "Přípravky britských značek pro čištění a ochranu topných soustav.", page: "marox" as Page },
  ];

  const stats = [
    { val: "624", lbl: "spokojených zákazníků" },
    { val: "9", lbl: "let v oboru" },
    { val: "98%", lbl: "zákazníků doporučuje" },
  ];

  const situations = [
    {
      icon: <TrendingDown size={20} />,
      tag: "Úspora",
      title: "Vysoké účty za energii",
      desc: "Radiátory hřejí nerovnoměrně, spotřeba plynu roste.",
      cta: "Zjistit více",
      action: () => go("cisteni"),
      img: "/images/realizace/uspora.jpg",
    },
    {
      icon: <Leaf size={20} />,
      tag: "Modernizace",
      title: "Chci nový zdroj tepla",
      desc: "Uvažuji o tepelném čerpadle nebo novém kotli.",
      cta: "Poradit se",
      action: () => go("tepelna-cerpadla"),
      img: "/images/realizace/modernizace.jpg",
    },
    {
      icon: <AlertCircle size={20} />,
      tag: "Porucha",
      title: "Kotel nefunguje",
      desc: "Chybový kód, výpadek topení, kotel se zastavil.",
      cta: "Zavolat",
      action: () => (window.location.href = PHONE_HREF),
      img: "/images/realizace/porucha.jpg",
    },
  ];

  const testimonials = [
    { name: "Pavel Kovář", text: "Martin přijel den po zavolání, závadu diagnostikoval za půl hodiny a kotel byl funkční ještě týž den. Cena odpovídala tomu, co říkal telefonicky.", stars: 5 },
    { name: "Jana Musilová", text: "Po chemickém čištění se spotřeba plynu snížila o víc než čtvrtinu. Doporučuji všem, kdo mají starší systém.", stars: 5 },
    { name: "Radek Svoboda", text: "Tepelné čerpadlo funguje výborně. Martin nám celý projekt perfektně zorganizoval a výsledek předčil očekávání.", stars: 5 },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: INK, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 96%)" }}>
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-6 pt-12 lg:pt-16">
          <div className="relative w-full lg:order-2 lg:h-[440px]" style={{ aspectRatio: "1376 / 768" }}>
            <HeroVideo src="/videos/hero-heating.mp4" className="w-full h-full object-cover block"
              style={{ maskImage: "radial-gradient(ellipse 75% 75% at center, black 55%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, black 55%, transparent 100%)" }} />
          </div>

          <div className="w-full px-6 lg:px-0 pt-14 lg:pt-12 pb-16 lg:pb-20 relative lg:order-1">
            <motion.h1 className="font-semibold uppercase leading-tight" style={{ fontFamily: FD, fontSize: "clamp(1.4rem,2.6vw,2rem)", color: "rgba(255,255,255,0.7)" }}
              initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              Chemicko-mechanické čištění topných systémů, tepelná čerpadla, servis a montáž kotlů
            </motion.h1>
            <motion.div className="flex flex-wrap gap-x-8 gap-y-3 mt-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}>
              {["Férové jednání", "100% spolehlivost", "Ochota"].map((text, i) => (
                <span key={i} className="flex items-center gap-2 text-white/80 text-sm font-medium" style={{ fontFamily: FB }}>
                  <Check size={16} style={{ color: FIRE }} strokeWidth={3} />
                  {text}
                </span>
              ))}
            </motion.div>
            <motion.div className="flex flex-wrap items-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.15 }}>
              <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
                <span className="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-3.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
                  <Phone size={18} />Zavolat
                </span>
              </StarBorder>
              <button onClick={() => scrollTo("inquiry-home")}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold uppercase tracking-wide text-sm px-7 py-3.5 border border-white/20 hover:border-white/40 transition-all"
                style={{ fontFamily: FB }}>
                Nezávazná poptávka <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: INK }} className="py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i} className="text-center px-4 py-6"
              style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Counter value={s.val} className="font-bold break-words" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,5vw,2.8rem)", lineHeight: 1, color: FIRE }} />
              <div className="text-white/50 text-xs mt-2 uppercase tracking-wide font-semibold" style={{ fontFamily: FB }}>{s.lbl}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SITUATIONS ── */}
      <section style={{ background: SMOKE }} className="pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-bold text-white leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
                CO DNES ŘEŠÍTE?
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {situations.map((s, i) => (
              <motion.button key={i} onClick={s.action}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative text-left flex flex-col p-7 pt-8"
                style={{ background: `linear-gradient(to bottom left, rgba(232,98,62,0.32) 0%, #0a0a0a 50%, #050505 100%)`, clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/50" style={{ fontFamily: FB }}>
                    {s.tag}
                  </span>
                </div>
                <div className="aspect-[4/3] overflow-hidden mb-6" style={{ clipPath: NOTCH_MD }}>
                  <img src={s.img} alt="" draggable={false}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-bold text-xl text-white mb-3 leading-tight" style={{ fontFamily: FD }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-6 text-white/50" style={{ fontFamily: FB }}>
                  {s.desc}
                </p>
                <div className="mt-auto pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: FIRE, fontFamily: FD }}>
                    {s.cta} <ArrowRight size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ background: SMOKE }} className="pt-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-bold leading-none mb-16 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
              S ČÍM VÁM POMŮŽEME
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <motion.button key={i} onClick={() => go(s.page)}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full flex items-start gap-5 p-7 text-left"
                style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white leading-tight mb-1.5" style={{ fontFamily: FD, fontSize: "clamp(1.2rem,2.5vw,1.5rem)" }}>
                    {s.title.toUpperCase()}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </div>
                <ArrowRight size={18} className="absolute top-7 right-7 shrink-0 text-white/20 group-hover:text-[#E8623E] group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
              CO ŘÍKAJÍ ZÁKAZNÍCI
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-7 pt-9" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", clipPath: NOTCH_LG }}>
                <div className="flex flex-col items-start mb-4">
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={13} style={{ color: FIRE }} className="fill-current" />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-white uppercase tracking-normal" style={{ fontFamily: FD }}>{t.name}</div>
                </div>
                <p className="text-sm text-white/55 leading-relaxed" style={{ fontFamily: FB }}>"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQBlock items={HOME_FAQ} title="Nejčastější dotazy" />
      <InquiryForm id="inquiry-home" dark />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SERVIS
// ═══════════════════════════════════════════════════════════════════════════════

function ServisPage() {
  interface Card { icon: React.ReactNode; title: string; desc: string; }
  const cards: Card[] = [
    { icon: <FileText size={20} />, title: "Revize kotle", desc: "Zákonná povinnost jednou ročně. Kontrola spalování, těsnosti plynu a bezpečnostních prvků." },
    { icon: <Wrench size={20} />, title: "Oprava a diagnostika", desc: "Výjezd, přesná diagnostika závady, oprava na místě. Cenu sdělíme před zahájením — bez překvapení." },
    { icon: <Shield size={20} />, title: "Záruční a pozáruční servis", desc: "Servisujeme kotle v záruce i po ní. Specializujeme se na Baxi a De Dietrich, zvládneme i ostatní." },
    { icon: <Zap size={20} />, title: "Montáž nového kotle", desc: "Dodávka a montáž kondenzačního plynového kotle. Nezávislé doporučení — vybereme co vám sedí." },
    { icon: <RefreshCw size={20} />, title: "Výměna starého kotle", desc: "Demontáž starého, instalace nového. Zpracujeme dokumentaci a přihlášení k plynárenské společnosti." },
  ];

  const symptoms = [
    "Kotel se sám vypíná nebo zobrazuje chybový kód",
    "Topení nestíhá ohřát dům ani při plném výkonu",
    "Nerovnoměrné topení — některé radiátory studené",
    "Zvýšená spotřeba plynu bez zjevného důvodu",
    "Podezřelé zvuky (klepání, hučení, syčení)",
    "Kotel je starší než 12–15 let",
  ];

  return (
    <div>
      <SectionHero eyebrow="Servis a montáž" icon={<Wrench size={14} />}
        title={<>SERVIS<br />KOTLŮ</>}
        subtitle={<>Revize, opravy, záruční i pozáruční servis, nové montáže.<br />Hlavní značky: Baxi a De Dietrich.</>}
        formId="servis-form" imgSrc="/images/realizace/kotelna1.png" />

      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold leading-none mb-12 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>SLUŽBY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <div key={i} className="p-8 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 className="font-bold text-white mb-3" style={{ fontFamily: FD, fontSize: "1.4rem" }}>{c.title.toUpperCase()}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-4" style={{ fontFamily: FB }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: SMOKE }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>KDY VOLAT TOPENÁŘE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {symptoms.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.04] border border-white/8">
                <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: FIRE }} />
                <span className="text-sm text-white/60" style={{ fontFamily: FB }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: SMOKE }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold leading-none mb-12 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>JAK PROBÍHÁ SERVIS</h2>
          <div className="relative">
            {[
              { n: "1", title: "Telefonická konzultace", desc: "Popište problém — poradíme, jestli je nutný okamžitý výjezd, nebo může počkat." },
              { n: "2", title: "Výjezd a diagnostika", desc: "Přijedeme ve sjednaný čas, prohlédneme kotel a systém přímo na místě." },
              { n: "3", title: "Nabídka a souhlas", desc: "Sdělíme přesnou cenu za opravu nebo výměnu." },
              { n: "4", title: "Oprava nebo montáž", desc: "Práci provedeme odborně a čistě — obvykle při jedné návštěvě." },
              { n: "5", title: "Předání", desc: "Otestujeme systém, vysvětlíme obsluhu. Cenu jsme domluvili předem — férové jednání bez skrytých poplatků." },
            ].map((s, i, arr) => (
              <motion.div key={i}
                initial="inactive"
                whileInView="active"
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex items-start gap-6 pb-10 last:pb-0">
                {i < arr.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-px overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div className="w-full" style={{ background: FIRE }}
                      variants={{ inactive: { height: "0%" }, active: { height: "100%" } }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }} />
                  </div>
                )}
                <motion.span className="relative z-10 shrink-0 w-14 h-14 flex items-center justify-center font-bold"
                  variants={{
                    inactive: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", scale: 0.92 },
                    active: { background: FIRE, color: "#fff", scale: 1 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ fontFamily: FD, fontSize: "1.05rem", border: "1px solid rgba(255,255,255,0.12)", clipPath: NOTCH_SM }}>
                  {s.n}
                </motion.span>
                <div className="pt-3">
                  <motion.h4 className="font-bold mb-1" style={{ fontFamily: FD, fontSize: "1.2rem" }}
                    variants={{ inactive: { color: "rgba(255,255,255,0.3)" }, active: { color: "#fff" } }}
                    transition={{ duration: 0.3 }}>
                    {s.title.toUpperCase()}
                  </motion.h4>
                  <motion.p className="text-sm" style={{ fontFamily: FB }}
                    variants={{ inactive: { color: "rgba(255,255,255,0.2)" }, active: { color: "rgba(255,255,255,0.55)" } }}
                    transition={{ duration: 0.3 }}>
                    {s.desc}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InquiryForm id="servis-form" subtitle="Popište závadu nebo co potřebujete. Domluvíme se na termínu výjezdu." dark />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: CISTENI
// ═══════════════════════════════════════════════════════════════════════════════

const CISTENI_FAQ: FAQItem[] = [
  { q: "Co je chemicko-mechanické čištění topného systému?", a: "Profesionální proplach odstraní kal, koroze a usazeniny z vnitřku potrubí a radiátorů. Systém se promyje certifikovaným přípravkem pod tlakem, pak se vypustí a naplní čistou vodou s inhibitorem." },
  { q: "O kolik % se sníží spotřeba energie po čištění?", a: "U zanesených systémů bývá úspora 15–30 %. Vrstva kalu jen 1 mm silná snižuje přenos tepla o cca 15 %. Přesný efekt závisí na stavu systému před čištěním." },
  { q: "Jak poznám, že systém potřebuje vyčistit?", a: "Typické příznaky: radiátory hřejí nerovnoměrně (nahoře teplo, dole studené), systém dělá hluk, kotel pracuje na vyšší výkon než dřív, nebo topná voda při kontrole vypadá tmavě." },
  { q: "Co je inhibitor a proč je důležitý?", a: "Inhibitor (přípravky Fernox nebo Kamco) se přidává do topné vody po čištění. Zabraňuje korozi a opětovnému zanášení systému — prodlužuje životnost kotle i radiátorů." },
];

function CisteniPage() {
  const benefits = [
    { val: "15–30%", title: "Úspora energie", desc: "Čistý systém přenáší teplo efektivněji — kotel nepracuje zbytečně." },
    { val: "100%", title: "Rovnoměrné topení", desc: "Konec studených radiátorů. Celý systém hřeje tak, jak má." },
    { val: "+5 let", title: "Životnost kotle", desc: "Kal ničí výměník kotle. Čistý systém = kotel vydrží o roky déle." },
    { val: "Méně", title: "Poruch a oprav", desc: "Zanešený systém způsobuje poruchy čerpadla a výměníku." },
  ];

  const processSteps = [
    { title: "Vstupní diagnostika", desc: "Zkontrolujeme stav vody, tlak a vizuální stav radiátorů a kotle." },
    { title: "Aplikace přípravku Fernox / Kamco", desc: "Certifikovaný čisticí přípravek rozpustí kal, koroze a usazeniny." },
    { title: "Cirkulace a proplach", desc: "Přípravek cirkuluje systémem 2–4 hodiny, poté propláchneme čistou vodou." },
    { title: "Doplnění inhibitoru", desc: "Odvzdušníme radiátory, naplníme systém čistou vodou s inhibitorem." },
    { title: "Kontrola a předání", desc: "Ověříme těsnost, správný tlak a rovnoměrné topení." },
  ];
  const signs = [
    "Radiátory jsou nahoře teplé, dole studené",
    "Systém při spuštění klapá nebo hlučí",
    "Kotel pracuje na vyšší výkon než dřív",
    "Topení hřeje nerovnoměrně — místnost od místnosti",
    "Voda ze systému je tmavá nebo kalná",
    "Systém nebyl čištěn déle než 5 let",
  ];

  const flowMeterPair = { before: "/images/realizace/2.webp", after: "/images/realizace/3.webp", label: "Průtokoměry rozdělovače — kalná voda vs. čirá voda po vyčištění" };
  const sludgePair = { before: "/images/realizace/7.webp", after: "/images/realizace/1.webp", label: "Vnitřek kotle a rozvody" };

  return (
    <div>
      <SectionHero eyebrow="Čištění systémů" icon={<Droplets size={14} />}
        title={<>ČIŠTĚNÍ<br />TOPENÍ</>}
        subtitle={<>Kal a koroze v potrubí kradou teplo a ničí váš kotel.<br />Profesionálním proplachem obnovíme efektivitu a ušetříme vám 15–30 %.</>}
        formId="cisteni-form" imgSrc="/images/realizace/cisteni_topeni.png" />

      <section style={{ background: SMOKE }} className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="text-center p-6" style={{ clipPath: NOTCH_MD, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="font-bold mb-1" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 1, color: FIRE }}>{b.val}</div>
              <div className="font-semibold text-white/80 text-sm mb-2" style={{ fontFamily: FD }}>{b.title.toUpperCase()}</div>
              <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: FB }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: SMOKE }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold leading-none mb-12 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>POTŘEBUJE VÁŠE TOPENÍ ČIŠTĚNÍ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signs.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-5" style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_SM, border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="shrink-0 rounded-full" style={{ width: "10px", height: "10px", background: FIRE }} />
                <span className="text-base font-medium text-white/80 leading-snug" style={{ fontFamily: FB }}>{s}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-base font-semibold" style={{ fontFamily: FB, color: "rgba(232,98,62,0.9)" }}>
            Platí alespoň 2 body? Čištění se vám vrátí do dvou topných sezón.
          </p>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
            PŘED A PO
          </h2>
          <div className="overflow-hidden" style={{ clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={flowMeterPair.before} alt={`${flowMeterPair.label} — před čištěním`} className="w-full h-full object-cover" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={flowMeterPair.after} alt={`${flowMeterPair.label} — po čištění`} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="px-6 py-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-sm text-white/50" style={{ fontFamily: FB }}>{flowMeterPair.label}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: SMOKE }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>JAK PROBÍHÁ ČIŠTĚNÍ</h2>
          <div className="relative">
            {processSteps.map((s, i, arr) => (
              <motion.div key={i}
                initial="inactive"
                whileInView="active"
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex items-start gap-6 pb-9 last:pb-0">
                {i < arr.length - 1 && (
                  <div className="absolute left-[27px] top-14 bottom-0 w-px overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div className="w-full" style={{ background: FIRE }}
                      variants={{ inactive: { height: "0%" }, active: { height: "100%" } }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }} />
                  </div>
                )}
                <motion.div className="relative z-10 w-14 h-14 text-base font-bold flex items-center justify-center shrink-0"
                  variants={{
                    inactive: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", scale: 0.92 },
                    active: { background: FIRE, color: "#fff", scale: 1 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ fontFamily: FD, border: "1px solid rgba(255,255,255,0.15)", clipPath: NOTCH_SM }}>
                  {i + 1}
                </motion.div>
                <div className="pt-3">
                  <motion.h4 className="font-bold mb-1" style={{ fontFamily: FD, fontSize: "1.1rem" }}
                    variants={{ inactive: { color: "rgba(255,255,255,0.35)" }, active: { color: "#fff" } }}
                    transition={{ duration: 0.3 }}>
                    {s.title.toUpperCase()}
                  </motion.h4>
                  <motion.p className="text-sm" style={{ fontFamily: FB }}
                    variants={{ inactive: { color: "rgba(255,255,255,0.25)" }, active: { color: "rgba(255,255,255,0.55)" } }}
                    transition={{ duration: 0.3 }}>
                    {s.desc}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 p-6 border border-white/10">
            <p className="text-white/40 text-sm" style={{ fontFamily: FB }}>
              Cena závisí na velikosti systému a stupni znečištění. Přesná nabídka po obhlídce.
            </p>
          </div>
        </div>
      </section>

      {/* ── VIDEO Z REALIZACE ── */}
      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold leading-none mb-4 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>ČIŠTĚNÍ V PRAXI</h2>
          <p className="text-sm text-white/55 mb-8" style={{ fontFamily: FB }}>Krátké video přímo ze zakázky — podívejte se, jak proplach probíhá ve skutečnosti.</p>
          <VideoCard src="/videos/cisteni-video.mp4" duration="0:57" />
        </div>
      </section>

      <div className="relative h-px w-full overflow-hidden" style={{ background: "rgba(232,98,62,0.15)" }}>
        <motion.div className="absolute inset-y-0 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(232,98,62,0.85), transparent)" }}
          initial={{ x: "-100%" }}
          whileInView={{ x: "300%" }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }} />
      </div>

      <FAQBlock items={CISTENI_FAQ} title="Časté dotazy" />
      <InquiryForm id="cisteni-form" subtitle="Napište nám velikost domu a jak starý systém máte. Připravíme nabídku." dark />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: TEPELNÁ ČERPADLA
// ═══════════════════════════════════════════════════════════════════════════════

function TepelnaCerpadlaPage() {
  const types = [
    { title: "Vzduch-voda", tag: "Nejčastější volba", desc: "Nejrozšířenější typ pro rodinné domy. Instalace bez výkopů nebo vrtů. Pracuje spolehlivě do −20 °C.", highlight: true },
    { title: "Vzduch-vzduch", tag: "", desc: "Vhodné pro vytápění i chlazení. Ideální pro domy bez otopné soustavy nebo jako doplněk existujícího systému.", highlight: false },
    { title: "Země-voda", tag: "", desc: "Nejvyšší celoroční účinnost. Vyžaduje vrt nebo zemní kolektory. Ideální pro novostavby.", highlight: false },
  ];

  return (
    <div>
      <SectionHero eyebrow="Tepelná čerpadla" icon={<Wind size={14} />}
        title={<>TEPELNÁ<br />ČERPADLA</>}
        subtitle={<>Přejít na tepelné čerpadlo dnes dává smysl ekonomicky i ekologicky.<br />Pomůžeme vybrat správný typ a zajistíme instalaci.</>}
        formId="tc-form" imgSrc="/images/realizace/heat-pump-hero.jpg" imgDim={0.55} />

      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold leading-none mb-12 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>JAKÉ ČERPADLO VYBRAT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {types.map((t, i) => (
              <div key={i} className="p-8 transition-all duration-300 hover:-translate-y-1"
                style={t.highlight
                  ? { background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: `1.5px solid ${FIRE}`, boxShadow: "0 16px 32px -20px rgba(232,98,62,0.35)" }
                  : { background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                {t.tag && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full mb-4" style={{ background: "rgba(232,98,62,0.16)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FIRE, fontFamily: FB }}>{t.tag}</p>
                  </div>
                )}
                <h3 className="font-bold mb-3" style={{ fontFamily: FD, fontSize: "1.8rem", color: "#fff" }}>{t.title.toUpperCase()}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: FB, color: "rgba(255,255,255,0.55)" }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InquiryForm id="tc-form" subtitle="Napište velikost domu a typ stávajícího zdroje. Připravíme nabídku." dark />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MAROX
// ═══════════════════════════════════════════════════════════════════════════════

function MaroxPage() {
  const products = [
    { title: "Fernox F1 Filter Fluid+", brand: "Fernox", desc: <>Inhibitor koroze a ochrana topné soustavy.<br />Zabraňuje usazování kalu a rzi — chrání kotel i radiátory.</> },
    { title: "Fernox F3 Cleaner", brand: "Fernox", desc: <>Čisticí přípravek pro chemicko-mechanické čištění topných systémů.<br />Účinně odstraňuje kal, koroze a usazeniny.</> },
    { title: "Kamco Cleaner X400", brand: "Kamco", desc: <>Profesionální čisticí přípravek pro silně zanesené systémy.<br />Britská značka s dlouholetou tradicí v oboru.</> },
    { title: "Kamco Protector F1", brand: "Kamco", desc: <>Inhibitor koroze přidávaný po čištění.<br />Udržuje topnou vodu čistou a chrání systém před zanášením.</> },
  ];

  const productPhotos = [
    "/images/realizace/62165-Biocide-AF10-500ml.webp",
    "/images/realizace/62557-Protector-Filter-Fluid-F9-10L.webp",
    "/images/realizace/FERNOX_Leak_Sealer_F4_10l_62556_zm.webp",
    "/images/realizace/22216-large-6.webp",
    "/images/realizace/E5.webp",
    "/images/realizace/E8.webp",
    "/images/realizace/E9.webp",
    "/images/realizace/E10.webp",
    "/images/realizace/E11.webp",
    "/images/realizace/E12.webp",
    "/images/realizace/E13.webp",
  ];

  return (
    <div>
      <section className="relative overflow-hidden pt-24 pb-10 px-6" style={{ background: INK }}>
        <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="font-bold text-white leading-none mb-4" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            FERNOX <span style={{ color: FIRE }}>&</span> KAMCO
          </h2>
          <p className="text-white/40 max-w-xl leading-relaxed mb-8 text-base" style={{ fontFamily: FB }}>
            Přímý prodej přípravků britských značek Fernox a Kamco.<br />Pro soukromé osoby i topenářské firmy.
          </p>
          <div className="flex flex-wrap gap-3">
            <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
              <span className="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-3.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
                <Phone size={18} />Zavolat
              </span>
            </StarBorder>
            <button onClick={() => scrollTo("marox-form")}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold uppercase tracking-wide text-sm px-7 py-3.5 border border-white/20 hover:border-white/40 transition-all"
              style={{ fontFamily: FB }}>
              Nezávazná poptávka <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section style={{ background: INK }} className="pt-10 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden" style={{ background: INK, clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="px-6 md:px-8 pt-6 md:pt-8">
              <p className="font-semibold text-white" style={{ fontFamily: FB, fontSize: "0.95rem" }}>Zprostředkujeme celý sortiment Fernox a Kamco — stačí napsat.</p>
            </div>
            <div className="mt-6 overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)" }}>
              <div className="marquee-track flex items-center w-max py-8">
                {[...productPhotos, ...productPhotos].map((src, i) => (
                  <div key={i} className="shrink-0 w-24 md:w-28 aspect-square flex items-center justify-center p-3 mx-3"
                    style={{ background: "#dcdcdc", clipPath: NOTCH_SM }}>
                    <img src={src} alt="Přípravek Fernox / Kamco" className="max-w-full max-h-full object-contain" draggable={false} style={{ filter: "brightness(0.82)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {products.map((p, i) => (
              <div key={i} className="p-8 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: FD, fontSize: "1.3rem" }}>{p.title.toUpperCase()}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-5" style={{ fontFamily: FB }}>{p.desc}</p>
                <button onClick={() => scrollTo("marox-form")}
                  className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 hover:gap-3 transition-all"
                  style={{ color: FIRE, fontFamily: FD }}>
                  Poptat cenu <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8 px-6 py-4 mx-auto w-fit"
            style={{ background: "rgba(232,98,62,0.1)", border: "1px solid rgba(232,98,62,0.25)", clipPath: NOTCH_SM }}>
            <Percent size={18} style={{ color: FIRE }} className="shrink-0" />
            <p className="text-sm font-semibold text-center text-white" style={{ fontFamily: FB }}>
              Aktuální ceník na vyžádání. Množstevní slevy pro topenářské firmy.
            </p>
          </div>
        </div>
      </section>

      <InquiryForm id="marox-form" subtitle="Napište, o které produkty máte zájem a v jakém množství." dark />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: O NÁS
// ═══════════════════════════════════════════════════════════════════════════════

function ONasPage() {
  const certs = [
    "Výuční list — obor Instalatér",
    "Osvědčení pro práci s plynovými zařízeními",
    "Zkušenosti s přípravky Fernox a Kamco — čištění topných soustav",
    "Oprávnění k montáži tepelných čerpadel",
    "Revizní technik plynových zařízení",
  ];

  return (
    <div>
      <section style={{ background: HERO_GRADIENT }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold text-white leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            MARTIN<br />MACHÁČ
          </h2>
        </div>
      </section>

      <section style={{ background: INK }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <p className="text-sm text-white/55 leading-relaxed mb-5" style={{ fontFamily: FB }}>
                Topenářství se věnuji přes 9 let. Začínal jsem v Brně jako montér, postupně jsem se specializoval na servis a diagnostiku plynových kotlů — zejména značek Baxi a De Dietrich — a na moderní systémy vytápění.
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-5" style={{ fontFamily: FB }}>
                Dělám chemicko-mechanické čištění topných soustav s přípravky Fernox a Kamco — metodu, která se v zahraničí osvědčila a u nás zatím málokdo dělá pořádně.
              </p>
              <p className="text-sm text-white/55 leading-relaxed" style={{ fontFamily: FB }}>
                Pracuji sám nebo s prověřenými kolegy. Každá zakázka má mé jméno — proto si na práci zakládám.
              </p>
            </div>
            <div className="p-8" style={{ background: SMOKE, clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
              <ul className="space-y-4">
                {certs.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: FIRE }} />
                    <span className="text-sm text-white/60" style={{ fontFamily: FB }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Shield size={20} />, title: "Férové jednání", desc: "Cenu sdělíme před prací. Nezdražujeme a nevymýšlíme problémy, které neexistují." },
              { icon: <Award size={20} />, title: "Kvalita řemesla", desc: "Pracujeme pečlivě a čistě. Za svou prací si stojíme a nestydíme se pod ni podepsat." },
              { icon: <Clock size={20} />, title: "Spolehlivost", desc: "Přijdeme v domluvený čas. Když to nejde, zavoláme dopředu." },
            ].map((v, i) => (
              <div key={i} className="p-8 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ background: SMOKE, color: FIRE, clipPath: NOTCH_SM }}>{v.icon}</div>
                <h3 className="font-bold text-white mb-3" style={{ fontFamily: FD, fontSize: "1.3rem" }}>{v.title.toUpperCase()}</h3>
                <p className="text-sm text-white/55 leading-relaxed" style={{ fontFamily: FB }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InquiryForm subtitle="Zavolejte nebo napište — rádi se domluvíme na výjezdu." dark />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: KONTAKT
// ═══════════════════════════════════════════════════════════════════════════════

function KontaktInlineForm() {
  const [form, setForm] = useState({ name: "", phone: "", issue: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nová poptávka — Topení v cajku",
          jmeno: form.name,
          telefon: form.phone,
          co_resite: form.issue,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true); else setError(true);
    } catch {
      setError(true);
    }
    setBusy(false);
  };
  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={36} className="mx-auto mb-4" style={{ color: FIRE }} />
        <h3 className="font-bold text-white mb-1" style={{ fontFamily: FD, fontSize: "1.4rem" }}>ODESLÁNO!</h3>
        <p className="text-sm text-white/50" style={{ fontFamily: FB }}>Ozveme se v pracovní dny.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4" style={{ fontFamily: FB }}>
      {[
        { label: "Jméno *", key: "name", type: "text", ph: "Tonda Cajk" },
        { label: "Telefon *", key: "phone", type: "tel", ph: "+420 xxx xxx xxx" },
      ].map(({ label, key, type, ph }) => (
        <div key={key}>
          <label className="block text-xs font-semibold uppercase tracking-wide text-white/50 mb-2">{label}</label>
          <input type={type} required value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
            className="w-full px-4 py-3.5 border border-white/15 bg-white/5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#E8623E] focus:bg-white/[0.08] transition-colors" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-white/50 mb-2">Co řešíte? *</label>
        <textarea required rows={3} value={form.issue}
          onChange={(e) => setForm({ ...form, issue: e.target.value })} placeholder="Popis situace…"
          className="w-full px-4 py-3.5 border border-white/15 bg-white/5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#E8623E] focus:bg-white/[0.08] resize-none transition-colors" />
      </div>
      <StarBorder as="button" type="submit" disabled={busy} color={FIRE} speed="4s" thickness={2} className="w-full" style={{ display: "block", opacity: busy ? 0.6 : 1 }}>
        <span className="block text-white font-bold text-sm py-4 uppercase tracking-wide" style={{ fontFamily: FD }}>
          {busy ? "Odesílám…" : "Odeslat →"}
        </span>
      </StarBorder>
      {error && (
        <p className="text-sm text-center" style={{ color: "#ef4444" }}>
          Odeslání se nepovedlo. Zkuste to prosím znovu, nebo nám rovnou zavolejte na {PHONE}.
        </p>
      )}
    </form>
  );
}

function KontaktPage() {
  const info = [
    { label: "Jméno", value: "Martin Macháč" },
    { label: "IČO", value: "09606475" },
    { label: "Telefon", value: PHONE, href: PHONE_HREF },
    { label: "E-mail", value: "martinmachac24@seznam.cz", href: "mailto:martinmachac24@seznam.cz" },
    { label: "Oblast", value: "Brno a Jihomoravský kraj" },
    { label: "Po–Pá", value: "8:00–16:00" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden pt-24 lg:pt-28 pb-8 px-6"
        style={{ background: INK, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 96%)" }}>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white mb-6 leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
              KOTEL<br />NEJEDE?
            </h1>
            <p className="text-white/50 max-w-xl leading-relaxed text-base mb-8" style={{ fontFamily: FB }}>
              Žádný strach, rádi vám to dáme do pořádku.
            </p>
            <div className="flex flex-wrap gap-3">
              <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
                <span className="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-3.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
                  <Phone size={18} />Zavolat
                </span>
              </StarBorder>
              <button onClick={() => scrollTo("kontakt-form")}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold uppercase tracking-wide text-sm px-7 py-3.5 border border-white/20 hover:border-white/40 transition-all"
                style={{ fontFamily: FB }}>
                Nezávazná poptávka <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="relative w-56 h-56 md:w-64 md:h-64 shrink-0 overflow-hidden" style={{ clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.1)" }}>
            <img src="/images/realizace/topenivcajku_martin.jpg" alt="Martin Macháč" className="w-full h-full object-cover" style={{ objectPosition: "56% 50%" }} draggable={false} />
          </div>
        </div>
      </section>

      <section id="kontakt-form" style={{ background: INK }} className="pt-10 pb-24 px-6">
        <div className="max-w-xl mx-auto flex flex-col gap-12">
          <div className="p-8" style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="divide-y divide-white/10">
              {info.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-xs text-white/40 uppercase tracking-wide shrink-0" style={{ fontFamily: FB }}>{c.label}</span>
                  {c.href ? (
                    <a href={c.href} className="font-semibold text-white hover:opacity-70 transition-opacity text-sm text-right break-all" style={{ fontFamily: FB }}>{c.value}</a>
                  ) : (
                    <span className="font-semibold text-white text-sm text-right break-all" style={{ fontFamily: FB }}>{c.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8" style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="font-bold mb-5 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.5rem,2.5vw,1.9rem)", lineHeight: 1 }}>
              POJĎME TO VYŘEŠIT
            </h2>
            <KontaktInlineForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const setPage = (page: Page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setPage={setPage} />;
      case "servis": return <ServisPage />;
      case "cisteni": return <CisteniPage />;
      case "tepelna-cerpadla": return <TepelnaCerpadlaPage />;
      case "marox": return <MaroxPage />;
      case "o-nas": return <ONasPage />;
      case "kontakt": return <KontaktPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };
  return (
    <div className="min-h-screen flex flex-col" style={{ background: INK }}>
      <CustomCursor />
      <Header currentPage={currentPage} setPage={setPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
