import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Phone, Mail, Menu, X, Wrench, Droplets, Shield,
  CheckCircle, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock,
  Star, Award, Wind, Flame, Check,
  Leaf, TrendingDown, AlertCircle, FileText, Users, RefreshCw, Handshake, Heart,
  Play, Volume2, Download
} from "lucide-react";

type Page =
  | "home" | "servis" | "cisteni" | "tepelna-cerpadla"
  | "marox" | "o-nas" | "kontakt";

// URL <-> Page mapping, so every page has a real, bookmarkable, back/forward-able address.
const PAGE_PATHS: Record<Page, string> = {
  "home": "/",
  "servis": "/servis-kotlu",
  "cisteni": "/cisteni-systemu",
  "tepelna-cerpadla": "/tepelna-cerpadla",
  "marox": "/fernox-kamco",
  "o-nas": "/o-nas",
  "kontakt": "/kontakt",
};
function pageFromPath(pathname: string): Page {
  const match = (Object.keys(PAGE_PATHS) as Page[]).find((p) => PAGE_PATHS[p] === pathname);
  return match || "home";
}

// Per-page <title> and meta description, kept in sync with the current page in App().
const PAGE_META: Record<Page, { title: string; description: string }> = {
  "home": {
    title: "Váš spolehlivý topenář",
    description: "Topení v cajku — chemicko-mechanické čištění topných systémů, tepelná čerpadla, servis a montáž plynových kotlů. Brno a Jihomoravský kraj.",
  },
  "servis": {
    title: "Plynový kotel | Topení v cajku",
    description: "Revize, opravy, záruční i pozáruční servis plynových kotlů. Kompletní montáž a zprovoznění nových kotlů. Hlavní značky Baxi a De Dietrich.",
  },
  "cisteni": {
    title: "Čištění systému | Topení v cajku",
    description: "Chemicko-mechanické čištění topných systémů odstraní kal a korozi, obnoví efektivitu a ušetří 15–30 % na energiích.",
  },
  "tepelna-cerpadla": {
    title: "Tepelné čerpadlo | Topení v cajku",
    description: "Dodávka, montáž a servis tepelných čerpadel. Pomůžeme vybrat správný typ a zajistíme instalaci.",
  },
  "marox": {
    title: "Fernox & Kamco | Topení v cajku",
    description: "Přímý prodej přípravků britských značek Fernox a Kamco pro čištění a ochranu topných soustav. Pro soukromé osoby i topenářské firmy.",
  },
  "o-nas": {
    title: "O nás | Topení v cajku",
    description: "Martin Macháč — topenářské práce s devítiletou praxí. Chemicko-mechanické čištění, servis kotlů a tepelná čerpadla v Brně a okolí.",
  },
  "kontakt": {
    title: "Kontakt | Topení v cajku",
    description: "Kontaktujte nás pro rychlé řešení problémů s topením — telefon, e-mail nebo poptávkový formulář. Brno a Jihomoravský kraj.",
  },
};

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

const FD = "'Space Grotesk', sans-serif"; // display (headings, buttons, logo)
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
function VideoCard({ src, duration, poster }: { src: string; duration: string; poster?: string }) {
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
          poster={poster}
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
function HeroVideo({ src, startAt, className = "w-full h-auto block", style }: { src: string; startAt?: number; className?: string; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !startAt) return;
    const onLoadedMetadata = () => { v.currentTime = startAt; };
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => v.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [src, startAt]);

  return (
    <video ref={videoRef} src={src} autoPlay muted playsInline aria-hidden="true"
      className={className} style={style} />
  );
}

// ── Aurora ───────────────────────────────────────────────────────────────────
function Aurora({ color = FIRE }: { color?: string }) {
  return (
    <div className="aurora-wrap" aria-hidden="true">
      <div className="aurora-band" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}00 4%, ${color}2E 24%, ${color}2E 76%, ${color}00 96%, transparent 100%)`, animationDelay: "0s" }} />
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
function LogoMark({ size = 30, hovered = false }: { size?: number; hovered?: boolean }) {
  const tone = hovered ? FIRE : LOGO_TONE;
  return (
    <motion.span className="relative inline-flex items-center justify-center rounded-full shrink-0"
      animate={{ scale: hovered ? 1.08 : 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: size, height: size, background: hovered ? "rgba(232,98,62,0.14)" : "rgba(255,255,255,0.08)", border: `1.3px solid ${tone}`, transition: "background 0.25s ease, border-color 0.25s ease" }}>
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
        <Flame size={size * 0.56} style={{ color: tone, transition: "color 0.25s ease" }} fill={tone} strokeWidth={1.5} />
      </motion.span>
      <span className="absolute inline-flex items-center justify-center rounded-full"
        style={{
          width: size * 0.44, height: size * 0.44,
          right: -size * 0.06, bottom: -size * 0.06,
          background: INK, border: `1.2px solid ${tone}`, transition: "border-color 0.25s ease",
        }}>
        <Check size={size * 0.26} style={{ color: tone, transition: "color 0.25s ease" }} strokeWidth={3} />
      </span>
    </motion.span>
  );
}

function Logo({ textSize = "text-lg", markSize = 30 }: { textSize?: string; markSize?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span className="flex items-center gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <LogoMark size={markSize} hovered={hovered} />
      <span className={`font-bold ${textSize}`} style={{ fontFamily: FD, letterSpacing: "-0.01em", color: hovered ? "#fff" : "rgba(255,255,255,0.92)", transition: "color 0.25s ease" }}>
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
    { label: "Čištění systému", page: "cisteni" },
    { label: "Tepelné čerpadlo", page: "tepelna-cerpadla" },
    { label: "Plynový kotel", page: "servis" },
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
        <button onClick={() => go("home")} className="appearance-none flex items-center gap-2 shrink-0 outline-none" style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }} aria-label="Domů">
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
                color: currentPage === item.page ? FIRE : "#fff",
              }}
              onMouseEnter={e => { if (currentPage !== item.page) (e.target as HTMLElement).style.color = FIRE; }}
              onMouseLeave={e => { if (currentPage !== item.page) (e.target as HTMLElement).style.color = "#fff"; }}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex sm:items-center">
            <StarBorder as="a" href={PHONE_HREF} color={FIRE} speed="4s" thickness={2}>
              <span className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-widest px-7 py-3.5" style={{ fontFamily: FD, background: FIRE, color: INK }}>
                Zavolat
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
                    Zavolat
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
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <button onClick={() => go("home")} className="appearance-none mb-4 inline-block outline-none" style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }}>
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
              ["cisteni", "Čištění systému"],
              ["tepelna-cerpadla", "Tepelné čerpadlo"],
              ["servis", "Plynový kotel"],
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

      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 py-5 text-center text-xs text-white/40">
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
    <section style={{ background: SMOKE, fontFamily: FB }} className="pt-16 md:pt-24 pb-8 md:pb-10 px-6">
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

// ── FloatingField ────────────────────────────────────────────────────────────
// Shared floating-label input/textarea used by every contact form on the site.
function FloatingField({ label, id, type = "text", value, onChange, required, dark = true, textarea = false, rows = 3 }: {
  label: string; id: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean; dark?: boolean; textarea?: boolean; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const fieldClass = dark
    ? "bg-white/10 border-white/25 text-white focus:border-[#E8623E] focus:bg-white/[0.14] focus:shadow-[0_0_0_3px_rgba(232,98,62,0.18)]"
    : "bg-white border-black/12 text-[#111] focus:border-[#E8623E] focus:shadow-[0_0_0_3px_rgba(232,98,62,0.12)]";
  const restColor = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const idleColor = dark ? "rgba(255,255,255,0.6)" : "#555";
  const shared = {
    id, required, value, onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
  const paddingClass = active ? "pt-6 pb-2" : textarea ? "pt-3.5 pb-3.5" : "py-3.5";
  return (
    <div className="relative">
      {textarea ? (
        <textarea {...shared} rows={rows}
          className={`peer w-full px-4 ${paddingClass} border text-sm outline-none resize-none transition-all duration-200 ${fieldClass}`} />
      ) : (
        <input {...shared} type={type}
          className={`peer w-full px-4 ${paddingClass} border text-sm outline-none transition-all duration-200 ${fieldClass}`} />
      )}
      <label htmlFor={id} className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{
          top: active ? "0.5rem" : textarea ? "0.9rem" : "50%",
          transform: (!active && !textarea) ? "translateY(-50%)" : "none",
          fontSize: active ? "0.7rem" : "0.875rem",
          color: focused ? FIRE : active ? idleColor : restColor,
        }}>
        {label}
      </label>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
// Full-size image viewer with prev/next navigation. Reusable for any image list.
function Lightbox({ images, index, onClose, onNav }: {
  images: string[]; index: number; onClose: () => void; onNav: (dir: 1 | -1) => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const dragX = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiping = useRef(false);

  const go = (dir: 1 | -1) => { setDirection(dir); onNav(dir); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, onNav]);

  const SWIPE_THRESHOLD = 60;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) { touchStart.current = null; return; }
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiping.current = false;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal drag — this is our gesture, not a page/pinch gesture.
      if (Math.abs(dx) > 8) swiping.current = true;
      dragX.current = dx;
    }
  };
  const handleTouchEnd = () => {
    if (!touchStart.current) return;
    touchStart.current = null;
    if (images.length > 1 && Math.abs(dragX.current) > SWIPE_THRESHOLD) {
      go(dragX.current < 0 ? 1 : -1);
    }
    dragX.current = 0;
    // Swallow the synthetic click that follows a touch, so a swipe over the
    // backdrop doesn't also trigger the close-on-backdrop-click handler.
    setTimeout(() => { swiping.current = false; }, 80);
  };
  const handleBackdropClick = () => {
    if (swiping.current) return;
    onClose();
  };

  const navBtnClass = "absolute flex items-center justify-center transition-colors z-10";
  const navBtnStyle = {
    background: "rgba(232,98,62,0.16)",
    border: "1px solid rgba(232,98,62,0.5)",
    clipPath: NOTCH_SM,
    color: FIRE,
    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
  } as React.CSSProperties;

  const closeBtnClass = "absolute flex items-center justify-center text-white transition-colors hover:bg-white/[0.16] hover:border-white/30 z-10";
  const closeBtnStyle = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", clipPath: NOTCH_SM } as React.CSSProperties;

  const slideVariants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.97 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(4px)", touchAction: "pan-y" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Zavřít"
          className={`${closeBtnClass} top-4 right-4 md:top-6 md:right-6 w-11 h-11`} style={closeBtnStyle}>
          <X size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Předchozí obrázek"
              className={`${navBtnClass} left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 hover:bg-[rgba(232,98,62,0.28)]`}
              style={navBtnStyle}>
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Další obrázek"
              className={`${navBtnClass} right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 hover:bg-[rgba(232,98,62,0.28)]`}
              style={navBtnStyle}>
              <ChevronRight size={26} strokeWidth={2.5} />
            </button>
          </>
        )}

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center p-6 md:p-10"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", clipPath: NOTCH_LG, maxWidth: "min(90vw, 560px)", maxHeight: "min(80vh, 560px)" }}
            onClick={(e) => e.stopPropagation()}>
            <span className="absolute rounded-full pointer-events-none" aria-hidden="true"
              style={{ inset: "12%", background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 55%, transparent 78%)" }} />
            <img src={images[index]} alt="Přípravek Fernox / Kamco" className="relative max-w-full object-contain" style={{ maxHeight: "min(68vh, 460px)" }} draggable={false} />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs" style={{ fontFamily: FB }}>
            {index + 1} / {images.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ── InquiryForm ───────────────────────────────────────────────────────────────
function InquiryForm({ title = "Pojďme to vyřešit", subtitle, dark = false, id, tightTop = false }: {
  title?: string; subtitle?: string; dark?: boolean; id?: string; tightTop?: boolean;
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
  const fieldId = id || "form";

  return (
    <section id={id} className={tightTop ? "pt-8 md:pt-10 pb-16 md:pb-24 px-6" : "py-16 md:py-24 px-6"} style={{ background: bg, fontFamily: FB }}>
      <Reveal className="max-w-xl mx-auto">
        <h2 className="font-bold mb-2" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1, color: headColor }}>
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
              { label: "Jméno *", key: "name", type: "text" },
              { label: "Telefon *", key: "phone", type: "tel" },
            ].map(({ label, key, type }) => (
              <FloatingField key={key} label={label} id={`${fieldId}-${key}`} type={type} required dark={dark}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
            <FloatingField label="Co řešíte? *" id={`${fieldId}-issue`} textarea rows={3} required dark={dark}
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })} />
            <StarBorder as="button" type="submit" disabled={busy} color={FIRE} speed="4s" thickness={2} className="w-full" style={{ display: "block", opacity: busy ? 0.6 : 1 }}>
              <span className="block text-white font-bold text-sm py-4.5 tracking-wide uppercase" style={{ fontFamily: FD }}>
                {busy ? "Odesílám…" : "ODESLAT POPTÁVKU"}
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
function SectionHero({ eyebrow, title, subtitle, icon, formId, imgId, imgSrc, videoSrc, aurora, imgDim, sideImage }: {
  eyebrow: string; title: React.ReactNode; subtitle: React.ReactNode; icon: React.ReactNode; formId: string; imgId?: string; imgSrc?: string; videoSrc?: string; aurora?: boolean; imgDim?: number; sideImage?: string;
}) {
  const heroImg = imgSrc || (imgId ? `https://images.unsplash.com/${imgId}?w=1400&h=600&fit=crop&auto=format` : undefined);
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32 px-6"
      style={{ background: aurora ? INK : HERO_GRADIENT, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 96%)" }}>
      {aurora && <div className={sideImage ? "hidden lg:block" : undefined}><Aurora color={FIRE} /></div>}
      {sideImage && (
        <div className="absolute inset-0 lg:hidden">
          <img src={sideImage} alt="" className="w-full h-full object-cover" style={{ objectPosition: "56% 30%" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}66 0%, ${INK}99 55%, ${INK}E0 100%)` }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(115deg, ${FIRE}66 0%, transparent 55%)` }} />
        </div>
      )}
      {!aurora && videoSrc && (
        <div className="absolute inset-0">
          <video src={videoSrc} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}66 0%, ${INK}99 55%, ${INK}E0 100%)` }} />
        </div>
      )}
      {!aurora && !videoSrc && !sideImage && heroImg && (
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}66 0%, ${INK}99 55%, ${INK}E0 100%)` }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(115deg, ${FIRE}66 0%, transparent 55%)` }} />
          {imgDim && <div className="absolute inset-0" style={{ background: INK, opacity: imgDim }} />}
        </div>
      )}
      <div className={`mx-auto relative z-10 ${sideImage ? "max-w-5xl flex flex-col lg:flex-row lg:items-stretch gap-10" : "max-w-4xl"}`}>
        <div className="flex-1 min-w-0">
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
              Nezávazná poptávka
            </button>
          </motion.div>
        </div>
        {sideImage && (
          <motion.div className="hidden lg:block relative lg:w-72 lg:self-stretch shrink-0 overflow-hidden"
            style={{ clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.15)" }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <img src={sideImage} alt="Martin Macháč" className="w-full h-full object-cover" style={{ objectPosition: "56% 30%" }} draggable={false} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════════════

const HOME_FAQ: FAQItem[] = [
  { q: "Jak se objednat na servis nebo opravu kotle?", a: "Zavolejte na 608 888 325 nebo pošlete poptávku přes formulář. Domluvíme se na termínu výjezdu dle vzájemné domluvy." },
  { q: "Jaké kotle servisujete?", a: "Specializujeme se na servis plynových kotlů značek Baxi a De Dietrich." },
  { q: "Kolik stojí výjezd a diagnostika?", a: "Cena závisí na konkrétní situaci. Vždy vám ale cenu sdělíme předem – stačí nám popsat váš problém a na ceně se domluvíme dopředu." },
  { q: "Provádíte i povinné revize kotlů?", a: "Ano, pravidelné servisní prohlídky i revize plynových kotlů. Po revizi dostanete revizní protokol. Revize je zákonnou povinností — doporučujeme ji jednou ročně." },
  { q: "Jak poznám, že topení potřebuje čištění?", a: "Typické příznaky jsou studené radiátory (často nahoře teplé, dole studené), hluk nebo klapání v kotli, kalná či tmavá voda v systému a celkově horší ohřev i přes vyšší výkon kotle. Pokud systém nebyl čištěn déle než 5 let, čištění se obvykle vyplatí." },
];

// Body důvěryhodnosti pod hlavním nadpisem hero sekce.
const DUVERYHODNOST = ["Férové jednání", "Spolehlivost", "Ochota"];

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const go = (page: Page) => navTo(page, setPage);

  const services = [
    { icon: <Droplets size={18} />, title: "Chemicko-mechanické čištění", desc: "Profesionální proplach systému — úspora 15–30 % na energiích. Přípravky Fernox a Kamco.", page: "cisteni" as Page },
    { icon: <Wind size={18} />, title: "Tepelné čerpadlo", desc: "Dodávka, montáž a servis tepelných čerpadel.", page: "tepelna-cerpadla" as Page },
    { icon: <Wrench size={18} />, title: "Plynový kotel", desc: "Revize, opravy, záruční i pozáruční servis. Kompletní montáž a zprovoznění nových plynových kotlů.", page: "servis" as Page },
    { icon: <FileText size={18} />, title: "Prodej přípravků Fernox a Kamco", desc: "Přípravky britských značek pro čištění a ochranu topných soustav.", page: "marox" as Page },
  ];

  const statistiky = [
    { hodnota: "100 %", popisek: "Pokrytí regionu" },
    { hodnota: "9 let", popisek: "V oboru" },
    { hodnota: "3 v 1", popisek: "Montáž, servis, revize" },
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
          <div className="relative w-full lg:order-2 lg:h-[440px]" style={{ aspectRatio: "1920 / 1080" }}>
            <HeroVideo src="/videos/hero-heating.mp4" className="w-full h-full block object-cover" />
          </div>

          <div className="w-full px-6 lg:px-0 pt-14 lg:pt-12 pb-16 lg:pb-20 relative lg:order-1">
            <motion.h1 className="font-bold text-white uppercase leading-tight" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}
              initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              Teplo domova, <br />na které je spoleh
            </motion.h1>
            <motion.h2 className="font-normal leading-relaxed mt-4 text-base md:text-lg" style={{ fontFamily: FB, color: "rgba(255,255,255,0.65)" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
              Provádíme kompletní servis a montáž plynových kotlů, tepelných čerpadel a důkladné čištění topných systémů
            </motion.h2>
            <motion.div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-x-8 md:gap-y-3 mt-6"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}>
              {DUVERYHODNOST.map((text, i) => (
                <span key={i} className="flex items-center gap-2 text-white/80 text-sm font-medium" style={{ fontFamily: FB }}>
                  <span className="shrink-0 rounded-full" style={{ width: "6px", height: "6px", background: FIRE }} />
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
                Nezávazná poptávka
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: INK }} className="py-10 md:py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statistiky.map((s, i) => (
            <motion.div key={i} className="text-center px-4 py-6"
              style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Counter value={s.hodnota} className="font-bold break-words" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,5vw,2.8rem)", lineHeight: 1, color: FIRE }} />
              <div className="text-white/50 text-xs mt-2 uppercase tracking-wide font-semibold" style={{ fontFamily: FB }}>{s.popisek}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SITUATIONS ── */}
      <section style={{ background: SMOKE }} className="pt-16 md:pt-24 pb-8 md:pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-bold text-white leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
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
      <section style={{ background: SMOKE }} className="pt-8 md:pt-10 pb-16 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-bold leading-none mb-12 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
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
      <section style={{ background: INK }} className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
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
      <InquiryForm id="inquiry-home" subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark tightTop />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SERVIS
// ═══════════════════════════════════════════════════════════════════════════════

const SERVIS_FAQ: FAQItem[] = [
  { q: "Jak často je potřeba dělat revizi plynového kotle?", a: "Revize plynového kotle je ze zákona povinná jednou ročně. Zajišťuje bezpečný provoz a bývá podmínkou platné záruky i pojištění. Po revizi vystavujeme revizní protokol." },
  { q: "Servisujete kotle i mimo záruku a od jiných značek?", a: "Ano, servisujeme kotle v záruce i po jejím vypršení, bez ohledu na to, kde byl kotel původně zakoupen. Specializujeme se na Baxi a De Dietrich, zvládneme ale i ostatní běžné plynové kotle." },
  { q: "Kolik stojí oprava nebo výměna kotle?", a: "Cena se odvíjí od konkrétní závady nebo typu nového kotle. Po telefonické konzultaci nebo výjezdu vám cenu sdělíme předem — bez skrytých poplatků." },
  { q: "Jak dlouho trvá výměna starého kotle za nový?", a: "Výměna kotle na klíč — demontáž starého, instalace nového a zprovoznění — trvá obvykle jeden den. Pomůžeme i s dokumentací a přihlášením nového zařízení." },
];

function ServisPage() {
  interface Card { icon: React.ReactNode; title: string; desc: string; }
  const cards: Card[] = [
    { icon: <FileText size={20} />, title: "Revize kotle", desc: "Zákonná povinnost jednou ročně. Kontrola spalování, těsnosti plynu a bezpečnostních prvků." },
    { icon: <Wrench size={20} />, title: "Oprava a diagnostika", desc: "Výjezd, přesná diagnostika závady, oprava na místě. Cenu sdělíme před zahájením — bez překvapení." },
    { icon: <Shield size={20} />, title: "Záruční a pozáruční servis", desc: "Servisujeme kotle v záruce i po ní. Specializujeme se na Baxi a De Dietrich, zvládneme i ostatní." },
    { icon: <RefreshCw size={20} />, title: "Výměna a montáž kotlů", desc: "Dodávka, demontáž starého a instalace nového kotle na klíč. Pomůžeme s výběrem, zpracujeme dokumentaci a vyřídíme přihlášení." },
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
      <SectionHero eyebrow="Plynový kotel" icon={<Wrench size={14} />}
        title={<>PLYNOVÝ <br />KOTEL</>}
        subtitle={<>Revize, opravy, záruční i pozáruční servis, nové montáže. <br />Hlavní značky: Baxi a De Dietrich.</>}
        formId="servis-form" imgSrc="/images/realizace/kotelna1.png" />

      <section style={{ background: INK }} className="py-16 md:py-24 px-6">
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

      <section style={{ background: SMOKE }} className="pt-16 md:pt-24 pb-8 md:pb-10 px-6">
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

      <section style={{ background: SMOKE }} className="pt-8 md:pt-10 pb-8 md:pb-10 px-6">
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

      <FAQBlock items={SERVIS_FAQ} title="Časté dotazy o servisu kotlů" />
      <InquiryForm id="servis-form" subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark tightTop />
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
    { val: "+5 let", title: "Životnost kotle", desc: "Kal ničí výměník kotle. Čistý systém = kotel vydrží o roky déle." },
    { val: "100%", title: "Rovnoměrné topení", desc: "Konec studených radiátorů. Celý systém hřeje tak, jak má." },
    { val: "Méně", title: "Poruch a oprav", desc: "Zanešený systém způsobuje poruchy čerpadla a výměníku." },
  ];

  const processSteps = [
    { title: "Vstupní diagnostika", desc: "Zkontrolujeme stav vody, tlak, stav kotle, radiátorů i podlahového topení." },
    { title: "Aplikace přípravku Fernox / Kamco", desc: "Aplikujeme certifikovaný čistící přípravek, který rozpustí vodní kámen, usazeniny a korozi." },
    { title: "Čištění a proplach", desc: "Chemie cirkuluje v systému, poté celý systém důkladně propláchneme čistou vodou." },
    { title: "Doplnění inhibitoru", desc: "Odvzdušníme radiátory, napustíme systém demineralizovanou vodou dle normy VDI 2035 a přidáme ochranný inhibitor." },
    { title: "Kontrola a předání", desc: "Ověříme těsnost systému, správný provozní tlak a rovnoměrné topení v celém domě." },
  ];
  const signs = [
    "Radiátory jsou nahoře teplé, dole studené",
    "Systém při spuštění klapá nebo hlučí",
    "Kotel pracuje na vyšší výkon než dřív",
    "Topení hřeje nerovnoměrně — místnost od místnosti",
    "Voda ze systému je tmavá nebo kalná",
    "Systém nebyl čištěn déle než 5 let",
  ];

  const flowMeterPair = { before: "/images/realizace/prutokomery_podlahoveho_topeni2.jpeg", after: "/images/realizace/prutokomery_podlahoveho_topeni1.jpeg", label: "Průtokoměry podlahového topení — kalná voda vs. čirá voda po vyčištění" };
  const sludgePair = { before: "/images/realizace/7.webp", after: "/images/realizace/1.webp", label: "Vnitřek kotle a rozvody" };

  return (
    <div>
      <SectionHero eyebrow="Čištění systému" icon={<Droplets size={14} />}
        title={<>ČIŠTĚNÍ <br />SYSTÉMU</>}
        subtitle={<>Kal a koroze v potrubí kradou teplo a ničí váš kotel. <br />Profesionálním proplachem obnovíme efektivitu a ušetříme vám 15–30 %.</>}
        formId="cisteni-form" imgSrc="/images/realizace/cisteni_topeni.png" />

      <section style={{ background: INK }} className="pt-12 md:pt-16 pb-8 md:pb-10 px-6">
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

      <section style={{ background: INK }} className="pt-8 md:pt-10 pb-8 md:pb-10 px-6">
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
      <section style={{ background: INK }} className="pt-8 md:pt-10 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
            PŘED A PO
          </h2>
          <div className="overflow-hidden" style={{ clipPath: NOTCH_LG, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={flowMeterPair.before} alt={`${flowMeterPair.label} — před čištěním`} className="w-full h-full object-cover" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={flowMeterPair.after} alt={`${flowMeterPair.label} — po čištění`} className="w-full h-full object-cover" style={{ transform: "scale(1.15)", transformOrigin: "80% center" }} />
              </div>
            </div>
            <div className="px-6 py-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-sm text-white/50" style={{ fontFamily: FB }}>{flowMeterPair.label}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: SMOKE }} className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold text-white leading-none mb-12" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>JAK PROBÍHÁ ČIŠTĚNÍ</h2>
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-px overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div className="w-full" style={{ background: FIRE }}
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.1, ease: "easeOut" }} />
            </div>
            {processSteps.map((s, i, arr) => (
              <motion.div key={i}
                initial="inactive"
                whileInView="active"
                viewport={{ once: true, margin: "-80px" }}
                className={`relative flex items-start gap-6 ${i < arr.length - 1 ? "pb-9" : ""}`}>
                <motion.div className="relative z-10 w-14 h-14 text-base font-bold flex items-center justify-center shrink-0"
                  variants={{
                    inactive: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", scale: 0.92 },
                    active: { background: FIRE, color: "#fff", scale: 1 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ fontFamily: FD, border: "1px solid rgba(255,255,255,0.15)", clipPath: NOTCH_SM }}>
                  {i + 1}
                </motion.div>
                <div>
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
            <p className="text-white/70 text-sm" style={{ fontFamily: FB }}>
              Cena závisí na velikosti systému a stupni znečištění. Přesná nabídka po obhlídce.
            </p>
          </div>
        </div>
      </section>

      {/* ── VIDEO Z REALIZACE ── */}
      <section style={{ background: INK }} className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold leading-none mb-6 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>ČIŠTĚNÍ V PRAXI</h2>
          <p className="text-sm text-white/55 mb-8" style={{ fontFamily: FB }}>Krátké video přímo ze zakázky — podívejte se, jak proplach probíhá ve skutečnosti.</p>
          <VideoCard src="/videos/cisteni-video.mp4" duration="0:57" poster="/images/cisteni-video-poster.jpg" />
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
      <InquiryForm id="cisteni-form" subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark tightTop />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: TEPELNÁ ČERPADLA
// ═══════════════════════════════════════════════════════════════════════════════

const TC_FAQ: FAQItem[] = [
  { q: "Jaké tepelné čerpadlo je pro rodinný dům nejvhodnější?", a: "Pro většinu rodinných domů v ČR je nejčastější volbou čerpadlo vzduch-voda — instaluje se bez výkopů a vrtů a spolehlivě pracuje i při mrazech do −20 °C. Konkrétní typ doporučíme po zjištění stavu domu a topného systému." },
  { q: "Dá se tepelné čerpadlo napojit na stávající radiátory?", a: "Ve většině případů ano, záleží na typu radiátorů a teplotním spádu systému. Posoudíme to při obhlídce a navrhneme řešení, které nebude vyžadovat kompletní výměnu otopné soustavy." },
  { q: "Kolik stojí montáž tepelného čerpadla?", a: "Cena závisí na typu čerpadla, výkonu a náročnosti instalace. Po nezávazné konzultaci připravíme konkrétní nabídku na míru vašemu domu." },
  { q: "Jak náročná je údržba tepelného čerpadla?", a: "Tepelné čerpadlo vyžaduje minimální údržbu — doporučujeme pravidelnou servisní kontrolu jednou ročně, podobně jako u kotle. Servis tepelných čerpadel zajišťujeme i my." },
];

function TepelnaCerpadlaPage() {
  const types = [
    { title: "Vzduch-voda", tag: "Nejčastější volba", desc: "Nejrozšířenější typ pro rodinné domy. Instalace bez výkopů nebo vrtů. Pracuje spolehlivě do −20 °C.", highlight: true },
    { title: "Vzduch-vzduch", tag: "", desc: "Vhodné pro vytápění i chlazení. Ideální pro domy bez otopné soustavy nebo jako doplněk existujícího systému.", highlight: false },
    { title: "Země-voda", tag: "", desc: "Nejvyšší celoroční účinnost. Vyžaduje vrt nebo zemní kolektory. Ideální pro novostavby.", highlight: false },
  ];

  return (
    <div>
      <SectionHero eyebrow="Tepelné čerpadlo" icon={<Wind size={14} />}
        title={<>TEPELNÉ <br />ČERPADLO</>}
        subtitle={<>Přejít na tepelné čerpadlo dnes dává smysl ekonomicky i ekologicky. <br />Pomůžeme vybrat správný typ a zajistíme instalaci.</>}
        formId="tc-form" imgSrc="/images/realizace/heat-pump-hero.jpg" imgDim={0.55} />

      <section style={{ background: INK }} className="py-16 md:py-24 px-6">
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

      <FAQBlock items={TC_FAQ} title="Časté dotazy o tepelných čerpadlech" />
      <InquiryForm id="tc-form" subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark tightTop />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MAROX
// ═══════════════════════════════════════════════════════════════════════════════

function MaroxPage() {
  const bestsellers = [
    { src: "/images/produkty/fernox-ds40.jpg", alt: "Fernox DS40 System Cleaner" },
    { src: "/images/produkty/kamco-fx2.jpg", alt: "Kamco FX2 Power Flush" },
    { src: "/images/produkty/fernox-protector-f1.jpg", alt: "Fernox Protector F1" },
    { src: "/images/produkty/fernox-protector-f9.jpg", alt: "Fernox Protector F9" },
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const navLightbox = (dir: 1 | -1) => setLightboxIndex((prev) =>
    prev === null ? null : (prev + dir + bestsellers.length) % bestsellers.length);

  return (
    <div>
      <SectionHero eyebrow="Fernox & Kamco" icon={<FileText size={14} />}
        title={<>FERNOX <span style={{ color: FIRE }}>&</span> KAMCO</>}
        subtitle={<>Přímý prodej přípravků britských značek Fernox a Kamco. <br />Pro soukromé osoby i topenářské firmy.</>}
        formId="marox-form" aurora />

      <section style={{ background: INK }} className="pt-8 md:pt-10 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <StarBorder as="a" href="/katalog-produktu.pdf" target="_blank" rel="noopener noreferrer" color={FIRE} speed="4s" thickness={2}>
              <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-widest px-7 py-3.5" style={{ fontFamily: FD, background: FIRE, color: INK }}>
                <Download size={16} strokeWidth={2.5} />
                Stáhnout katalog produktů (PDF)
              </span>
            </StarBorder>
          </div>

          <h2 className="font-bold text-white mt-12 mb-6 leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
            NEJPRODÁVANĚJŠÍ PRODUKTY
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestsellers.map((p, i) => (
              <button key={i} type="button" onClick={() => setLightboxIndex(i)}
                aria-label="Zobrazit fotku produktu ve větším rozlišení"
                className="aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                style={{ clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={p.src} alt={p.alt} className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <InquiryForm id="marox-form" subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark />

      {lightboxIndex !== null && (
        <Lightbox images={bestsellers.map(p => p.src)} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={navLightbox} />
      )}
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
      <section style={{ background: HERO_GRADIENT }} className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
                    <h1 className="font-bold text-white leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            MARTIN <br />MACHÁČ
          </h1>
        </div>
      </section>

      <section style={{ background: INK }} className="py-16 md:py-24 px-6">
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

      <InquiryForm subtitle="Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení." dark />
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
        { label: "Jméno *", key: "name", type: "text" },
        { label: "Telefon *", key: "phone", type: "tel" },
      ].map(({ label, key, type }) => (
        <FloatingField key={key} label={label} id={`kontakt-${key}`} type={type} required
          value={form[key as keyof typeof form]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      ))}
      <FloatingField label="Co řešíte? *" id="kontakt-issue" textarea rows={3} required
        value={form.issue}
        onChange={(e) => setForm({ ...form, issue: e.target.value })} />
      <StarBorder as="button" type="submit" disabled={busy} color={FIRE} speed="4s" thickness={2} className="w-full" style={{ display: "block", opacity: busy ? 0.6 : 1 }}>
        <span className="block text-white font-bold text-sm py-4 uppercase tracking-wide" style={{ fontFamily: FD }}>
          {busy ? "Odesílám…" : "Odeslat poptávku"}
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
  const EMAIL = "martinmachac24@seznam.cz";

  return (
    <div>
      <SectionHero eyebrow="Kontakt" icon={<Phone size={14} />}
        title={<>KOTEL <br />NEJEDE?</>}
        subtitle="Žádný strach, rádi vám to dáme do pořádku."
        formId="kontakt-form" aurora sideImage="/images/realizace/topenivcajku_martin.jpg" />

      <section style={{ background: INK }} className="pt-8 md:pt-10 pb-16 md:pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-bold text-white mb-6 leading-none" style={{ fontFamily: FD, fontSize: "clamp(1.6rem,2.5vw,2.2rem)" }}>
            KDO SE VÁM O TO POSTARÁ?
          </h2>
          <p className="text-white/55 leading-relaxed text-base" style={{ fontFamily: FB }}>
            Za Topením v cajku stojím já, Martin, se svým týmem zkušených parťáků. V oboru se pohybujeme už řadu let a hlavní je pro nás jediné – aby vám topení doma bezstarostně fungovalo. Když se cokoliv přihodí, jsme na telefonu a rychle zasáhneme.
          </p>
        </div>
      </section>

      <section id="kontakt-form" style={{ background: SMOKE }} className="pt-16 md:pt-24 pb-16 md:pb-24 px-6">
        <div className="max-w-xl mx-auto flex flex-col gap-12">
          <div className="p-8" style={{ background: "rgba(255,255,255,0.04)", clipPath: NOTCH_MD, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href={PHONE_HREF}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white break-all transition-colors hover:bg-white/[0.14] hover:border-white/25"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", fontFamily: FB }}>
                <Phone size={16} style={{ color: FIRE }} className="shrink-0" />
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white break-all transition-colors hover:bg-white/[0.14] hover:border-white/25"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", fontFamily: FB }}>
                <Mail size={16} style={{ color: FIRE }} className="shrink-0" />
                {EMAIL}
              </a>
            </div>
            <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: FB }}>
              <span className="text-white font-semibold">Martin Macháč</span> · IČO 09606475
              <br />
              Jsme vám k dispozici v Brně a Jihomoravském kraji, Po–Pá od 8:00 do 16:00.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2 text-white" style={{ fontFamily: FD, fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1 }}>
              POJĎME TO VYŘEŠIT
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Popište nám svůj problém nebo požadavek. Ozveme se vám s návrhem řešení.
            </p>
            <KontaktInlineForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STRUKTUROVANÁ DATA (JSON-LD)
// ═══════════════════════════════════════════════════════════════════════════════
// Firemní údaje (LocalBusiness) jsou staticky v index.html, aby je viděli i
// roboti, kteří nespouští JavaScript. Tady se ke každé stránce dynamicky
// přidává její vlastní Service / FAQPage / BreadcrumbList / Person schéma.

const SITE_URL = "https://topenivcajku.com";
const BUSINESS_ID = `${SITE_URL}/#firma`;
const SERVICE_AREA = [
  { "@type": "City", "name": "Brno" },
  { "@type": "AdministrativeArea", "name": "Jihomoravský kraj" },
];

function breadcrumbSchema(page: Page) {
  if (page === "home") return null;
  return {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Domů", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": PAGE_META[page].title.split(" | ")[0], "item": SITE_URL + PAGE_PATHS[page] },
    ],
  };
}

function faqPageSchema(items: FAQItem[]) {
  return {
    "@type": "FAQPage",
    "mainEntity": items.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };
}

function serviceSchema(name: string, description: string) {
  return {
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": { "@id": BUSINESS_ID },
    "areaServed": SERVICE_AREA,
  };
}

function buildPageSchema(page: Page): object | null {
  const graph: object[] = [];
  const bc = breadcrumbSchema(page);
  if (bc) graph.push(bc);

  switch (page) {
    case "home":
      graph.push(faqPageSchema(HOME_FAQ));
      break;
    case "servis":
      graph.push(serviceSchema(
        "Servis a montáž plynových kotlů",
        "Revize, opravy, záruční i pozáruční servis plynových kotlů. Kompletní montáž a zprovoznění nových kotlů, hlavně značek Baxi a De Dietrich."
      ));
      graph.push(faqPageSchema(SERVIS_FAQ));
      break;
    case "cisteni":
      graph.push(serviceSchema(
        "Chemicko-mechanické čištění topných systémů",
        "Profesionální proplach topného systému přípravky Fernox a Kamco, který odstraní kal a korozi a obnoví efektivitu vytápění."
      ));
      graph.push(faqPageSchema(CISTENI_FAQ));
      break;
    case "tepelna-cerpadla":
      graph.push(serviceSchema(
        "Tepelná čerpadla",
        "Dodávka, montáž a servis tepelných čerpadel vzduch-voda, vzduch-vzduch a země-voda pro rodinné domy."
      ));
      graph.push(faqPageSchema(TC_FAQ));
      break;
    case "marox":
      graph.push(serviceSchema(
        "Prodej přípravků Fernox a Kamco",
        "Přímý prodej čisticích přípravků a inhibitorů koroze britských značek Fernox a Kamco pro soukromé osoby i topenářské firmy."
      ));
      break;
    case "o-nas":
      graph.push({
        "@type": "Person",
        "name": "Martin Macháč",
        "jobTitle": "Topenář",
        "worksFor": { "@id": BUSINESS_ID },
        "description": "Topenářským pracím se věnuje přes 9 let — servis a diagnostika plynových kotlů, chemicko-mechanické čištění topných soustav a montáž tepelných čerpadel.",
      });
      break;
  }

  if (graph.length === 0) return null;
  return { "@context": "https://schema.org", "@graph": graph };
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromPath(window.location.pathname));

  const setPage = (page: Page) => {
    setCurrentPage(page);
    const path = PAGE_PATHS[page];
    if (window.location.pathname !== path) {
      window.history.pushState({ page }, "", path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync state when the user uses the browser's Back/Forward buttons.
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pageFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Keep <title> and meta description in sync with the current page.
  useEffect(() => {
    const meta = PAGE_META[currentPage];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [currentPage]);

  // Keep the page's JSON-LD structured data (Service/FAQPage/BreadcrumbList/Person) in sync.
  useEffect(() => {
    document.getElementById("ld-page")?.remove();
    const data = buildPageSchema(currentPage);
    if (data) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "ld-page";
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }, [currentPage]);

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
