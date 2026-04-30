import { Link } from "wouter";
import { motion } from "framer-motion";

/**
 * Think — the "Think It / Prompt It / Let's Build It." 3-step flow.
 *
 * Per IMG_1861 mockup. Initiative-light NURD-drip-identity canon —
 * cream / warm-paper background, drip-stickered, multi-color accents,
 * bright graphic-pop. NOT the deeper-build dark canon.
 *
 * Flow:
 *   01 THINK IT.   → Conceptualize Your Vision.
 *   02 PROMPT IT.  → Articulate Your Idea.
 *   03 LET'S BUILD IT. → Bring Your Project to Life. (CTA → /access-ai)
 *
 * Reference: docs/design/PAGE_INVENTORY.md (IMG_1861 = initiative-light, /think route).
 */
export default function Think() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ============== HERO — title strip ============== */}
      <section className="relative border-b border-border overflow-hidden">
        {/* Drip-sticker decorations — TODO: replace with extracted assets from IMG_1861 */}
        <img
          src="https://placehold.co/100x100/0000/00000000?text="
          data-alt="Decorative drip sticker — glowing lightbulb (NURD-drip identity)"
          alt=""
          aria-hidden="true"
          className="absolute -top-4 left-4 sm:left-12 w-20 h-20 -rotate-12 hidden lg:block pointer-events-none select-none"
          style={{ color: "hsl(var(--nurd-drip-orange))" }}
        />
        <img
          src="https://placehold.co/120x60/0000/00000000?text="
          data-alt="Decorative drip sticker with the NURD wordmark"
          alt=""
          aria-hidden="true"
          className="absolute top-12 left-0 w-24 -rotate-12 hidden lg:block pointer-events-none select-none"
          style={{ color: "hsl(var(--nurd-drip-green))" }}
        />
        <img
          src="https://placehold.co/100x100/0000/00000000?text="
          data-alt="Decorative drip sticker with NU/RD text"
          alt=""
          aria-hidden="true"
          className="absolute -top-2 right-12 sm:right-24 w-20 h-20 rotate-12 hidden lg:block pointer-events-none select-none"
          style={{ color: "hsl(var(--nurd-drip-purple))" }}
        />
        <img
          src="https://placehold.co/100x100/0000/00000000?text="
          data-alt="Decorative drip sticker with the N logo"
          alt=""
          aria-hidden="true"
          className="absolute top-12 right-0 sm:right-8 w-24 h-24 rotate-6 hidden lg:block pointer-events-none select-none"
          style={{ color: "hsl(var(--nurd-drip-blue))" }}
        />

        <div className="container py-20 md:py-28 max-w-5xl relative">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6 text-center">
            How it works
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif italic font-medium text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-foreground text-center"
          >
            Think&nbsp;It.<br />
            Prompt&nbsp;It.<br />
            Let&apos;s&nbsp;Build&nbsp;It.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mt-10 text-center"
          >
            Three moves. One project. ↓
          </motion.p>
        </div>
      </section>

      {/* ============== THE THREE STEPS ============== */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-28 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 xl:gap-10">
            <StepCard
              num="01"
              accent="green"
              eyebrow="Think it."
              icon="lightbulb"
              title="Conceptualize Your Vision."
              body="Start with your idea. Define your concept, explore possibilities, and brainstorm the core features of your project."
            />

            <StepArrow />

            <StepCard
              num="02"
              accent="orange"
              eyebrow="Prompt it."
              icon="terminal"
              title="Articulate Your Idea."
              body="Translate your concept into precise instructions. Create detailed prompts that effectively communicate your vision for generation."
            />

            <StepArrow />

            <StepCard
              num="03"
              accent="purple"
              eyebrow="Let's build it."
              icon="rocket_launch"
              title="Bring Your Project to Life."
              body="Execute your plan. Use your prompts to build and develop your final product, transforming ideas into reality."
            />
          </div>
        </div>
      </section>

      {/* ============== CTA STRIP — handoff to V.I.B.E. ============== */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24 max-w-4xl text-center">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6">
            Ready when you are
          </p>
          <h2 className="font-serif font-medium tracking-tight text-3xl md:text-5xl text-foreground mb-6">
            You&apos;ve thought it. Now build it.
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light max-w-2xl mx-auto mb-10">
            Open the AI-paired coding workbench. Bring your concept, your prompt,
            and your willingness to iterate. We&apos;ll bring the rest.
          </p>
          <Link
            href="/access-ai"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-mono uppercase tracking-wordmark text-xs text-background transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
            style={{ backgroundColor: "hsl(var(--nurd-drip-green))" }}
          >
            <span>Open the workbench</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <p className="mt-6 font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground/70">
            Or <Link href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">return home</Link>
          </p>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer>
        <div className="container py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center">
            <Link
              href="/"
              className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to NurdsCode
            </Link>
            <span aria-hidden="true" className="hidden md:inline text-muted-foreground/50 select-none">
              |
            </span>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Powered by: A.I.M.S.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────────── Step card ────────────────────────────── */

type AccentKey = "green" | "orange" | "purple";

interface StepCardProps {
  num: string;
  accent: AccentKey;
  eyebrow: string;
  icon: string;
  title: string;
  body: string;
}

const ACCENT_VAR: Record<AccentKey, string> = {
  green: "var(--nurd-drip-green)",
  orange: "var(--nurd-drip-orange)",
  purple: "var(--nurd-drip-purple)",
};

function StepCard({ num, accent, eyebrow, icon, title, body }: StepCardProps) {
  const accentVar = ACCENT_VAR[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center text-center p-8 bg-card rounded-xl border border-border max-w-md"
    >
      {/* Drip-sticker badge — colored by accent */}
      <div className="flex items-baseline gap-3 mb-2">
        <span
          className="font-mono uppercase tracking-wordmark text-[10px]"
          style={{ color: `hsl(${accentVar})` }}
        >
          {num}
        </span>
        <span
          className="font-mono uppercase tracking-wordmark text-xs font-semibold"
          style={{ color: `hsl(${accentVar})` }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Icon panel — placeholder swap target. TODO: replace with extracted illustration from IMG_1861 */}
      <div
        className="w-44 h-44 my-6 rounded-2xl flex items-center justify-center"
        style={{
          backgroundColor: `hsl(${accentVar} / 0.10)`,
          border: `1px solid hsl(${accentVar} / 0.25)`,
        }}
        data-alt={`Step ${num} illustration — ${title}`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "5rem",
            color: `hsl(${accentVar})`,
            fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48",
          }}
        >
          {icon}
        </span>
      </div>

      <h2 className="font-serif font-medium tracking-tight text-2xl md:text-3xl text-foreground">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed font-light">
        {body}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────── Drippy connector arrow ─────────────────────────── */

function StepArrow() {
  return (
    <>
      {/* Desktop: horizontal drippy arrow */}
      <div className="self-center hidden lg:flex items-center justify-center" aria-hidden="true">
        <span
          className="material-symbols-outlined text-5xl"
          style={{
            color: "hsl(var(--nurd-drip-purple))",
            fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48",
          }}
        >
          arrow_forward
        </span>
      </div>
      {/* Mobile / tablet: vertical down arrow */}
      <div className="self-center lg:hidden" aria-hidden="true">
        <span
          className="material-symbols-outlined text-5xl"
          style={{
            color: "hsl(var(--nurd-drip-purple))",
            fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48",
          }}
        >
          arrow_downward
        </span>
      </div>
    </>
  );
}
