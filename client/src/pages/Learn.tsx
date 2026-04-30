import { Link } from "wouter";

/**
 * /learn — Learning hub landing surface (deeper-build dark canon),
 * mapped from IMG_1841 mockup. Pairs the V.I.B.E. environment with
 * the ACHIEVERS program in a single overview page.
 *
 * Note: there is a legacy /learning route and Learning.tsx page that
 * predates this hub — that one is intentionally left alone. This file
 * is the new Wave 3 /learn route.
 *
 * Conversion rules applied:
 *   - data-theme="deep" + circuit-bg + standard token classes
 *   - Brand colors via hsl(var(--neon-*)) inline styles
 *   - Material Symbols outlined icons (font loaded globally)
 *   - Source mockup typo "FEATURE HIGLIGHTS" corrected to "FEATURE HIGHLIGHTS"
 *     (per docs/design/DOCTRINAL_FLAGS.md §4)
 *   - "Practice in Vibe Coding" / "Open in Vibe Coding" → /access-ai
 *   - Course/lesson CTAs use placeholder /learn/[course]/[lesson] hrefs
 *   - No internal tool / model / provider names surfaced
 */

type LearningTrack = {
  icon: string;
  title: string;
  description: string;
  accent: "cyan" | "orange";
  href: string;
};

const TRACKS: LearningTrack[] = [
  {
    icon: "data_object",
    title: "Vibe Coding Foundations",
    description: "Programming fundamentals, algorithms, data structures.",
    accent: "cyan",
    href: "/learn/vibe-coding-foundations/intro",
  },
  {
    icon: "shapes",
    title: "World Builder Lab",
    description: "Creative project development, game design, 3D modeling.",
    accent: "orange",
    href: "/learn/world-builder-lab/intro",
  },
  {
    icon: "psychology_alt",
    title: "Prompt Mastery",
    description: "AI interaction, prompt engineering, generative AI tools.",
    accent: "cyan",
    href: "/learn/prompt-mastery/intro",
  },
  {
    icon: "groups",
    title: "Collaboration Studio",
    description: "Team-based learning, version control, group projects.",
    accent: "orange",
    href: "/learn/collaboration-studio/intro",
  },
];

const ACHIEVERS_BULLETS = [
  "Structured paths for youth.",
  "Mentorship opportunities.",
  "Certificate programs.",
  "Progress tracking & analytics.",
  "NURD Summer Initiative integration.",
];

export default function Learn() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <main className="container mx-auto max-w-[1280px] px-6 py-12 md:px-8 md:py-16">
        {/* ============== HEADER ============== */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1
            className="font-sans font-extrabold text-6xl md:text-7xl tracking-tighter"
            style={{
              color: "hsl(var(--neon-cyan))",
              textShadow:
                "0 0 24px hsl(var(--neon-cyan) / 0.5), 0 0 80px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            Learn
          </h1>

          <div className="flex flex-col items-center gap-2">
            {/* TODO: replace with extracted asset from IMG_1841 — NURD wordmark with dripping paint effect */}
            <img
              src="https://placehold.co/120x60/10131a/00f0ff?text=NURD"
              alt="NURD wordmark"
              data-alt="NURD logo with dripping paint effect"
              className="h-12"
            />
            <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground text-center">
              Learn with{" "}
              <span style={{ color: "hsl(var(--neon-cyan))" }}>V.I.B.E.</span>{" "}
              — Vibrant Imagination Build Environment
            </p>
          </div>

          <Link
            href="/learn/progress"
            className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 border-2"
            style={{
              borderColor: "hsl(var(--neon-orange))",
              color: "hsl(var(--neon-orange))",
              boxShadow: "0 0 20px hsl(var(--neon-orange) / 0.3)",
            }}
          >
            View Progress
          </Link>
        </header>

        {/* ============== V.I.B.E. ENVIRONMENT ============== */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* V.I.B.E. environment copy + CTA */}
          <div
            className="lg:col-span-2 bg-card rounded-xl p-8 flex flex-col justify-between gap-6"
            style={{
              border: "2px solid hsl(var(--neon-cyan) / 0.5)",
              boxShadow: "0 0 24px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            <div className="flex flex-col gap-4">
              <h2
                className="font-sans font-bold text-3xl md:text-4xl tracking-tight"
                style={{ color: "hsl(var(--neon-cyan))" }}
              >
                V.I.B.E. ENVIRONMENT
              </h2>
              <ul className="text-base md:text-lg text-foreground/90 leading-relaxed space-y-2">
                <li>AI-powered interactive coding environment.</li>
                <li>Real-time feedback &amp; guidance.</li>
                <li>Beginner-friendly.</li>
                <li>Visual learning tools.</li>
              </ul>
            </div>
            <Link
              href="/access-ai"
              className="mt-2 text-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 border-2"
              style={{
                borderColor: "hsl(var(--neon-cyan))",
                color: "hsl(var(--neon-cyan))",
                boxShadow: "0 0 20px hsl(var(--neon-cyan) / 0.3)",
              }}
            >
              Start Learning
            </Link>
          </div>

          {/* V.I.B.E. environment hero image */}
          <div
            className="lg:col-span-3 rounded-xl overflow-hidden bg-secondary"
            style={{
              border: "2px solid hsl(var(--neon-cyan) / 0.5)",
              boxShadow: "0 0 24px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            {/* TODO: replace with extracted asset from IMG_1841 — V.I.B.E. in action hero */}
            <img
              src="https://placehold.co/800x500/1d2026/e1e2eb?text=V.I.B.E.+in+Action"
              alt="V.I.B.E. in action"
              data-alt="A young developer coding at an outdoor cafe, with UI overlays showing code suggestions and progress bars."
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* ============== TRACKS + FEATURE HIGHLIGHTS ============== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Tracks */}
          <div className="flex flex-col">
            <h3 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-4">
              Learning Tracks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TRACKS.map((track) => (
                <TrackCard key={track.title} track={track} />
              ))}
            </div>
          </div>

          {/* Feature Highlights — ACHIEVERS PROGRAM */}
          <div className="flex flex-col">
            <h3 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-4">
              Feature Highlights
            </h3>
            <div
              className="bg-card p-8 rounded-xl flex flex-col h-full"
              style={{
                border: "2px solid hsl(var(--neon-orange) / 0.5)",
                boxShadow: "0 0 24px hsl(var(--neon-orange) / 0.25)",
              }}
            >
              <div className="flex-grow flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  <h4
                    className="font-sans font-bold text-2xl md:text-3xl tracking-tight"
                    style={{ color: "hsl(var(--neon-orange))" }}
                  >
                    ACHIEVERS PROGRAM
                  </h4>
                  <ul className="text-base md:text-lg text-foreground/90 leading-relaxed space-y-2">
                    {ACHIEVERS_BULLETS.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  {/* TODO: replace with extracted asset from IMG_1841 — Achiever NURD character with FOSTER/DEVELOP/HONE blocks */}
                  <img
                    src="https://placehold.co/200x250/1d2026/ffb700?text=Achiever"
                    alt="Achiever character"
                    data-alt="Illustration of a young NURD character standing proudly next to a stack of blocks labeled with positive attributes like FOSTER, DEVELOP, HONE."
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/access-ai"
                  className="flex-1 text-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 border-2"
                  style={{
                    borderColor: "hsl(var(--neon-cyan))",
                    color: "hsl(var(--neon-cyan))",
                    boxShadow: "0 0 20px hsl(var(--neon-cyan) / 0.3)",
                  }}
                >
                  Start Learning
                </Link>
                <Link
                  href="/learn/progress"
                  className="flex-1 text-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 border-2"
                  style={{
                    borderColor: "hsl(var(--neon-orange))",
                    color: "hsl(var(--neon-orange))",
                    boxShadow: "0 0 20px hsl(var(--neon-orange) / 0.3)",
                  }}
                >
                  View Progress
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="border-t border-border mt-16 md:mt-24 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to NurdsCode
            </Link>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Powered by: A.I.M.S.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function TrackCard({ track }: { track: LearningTrack }) {
  const cssVar = track.accent === "cyan" ? "--neon-cyan" : "--neon-orange";
  const accent = `hsl(var(${cssVar}))`;
  return (
    <Link
      href={track.href}
      className="bg-card rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 transition-all hover:-translate-y-0.5"
      style={{
        border: `2px solid hsl(var(${cssVar}) / 0.5)`,
        boxShadow: `0 0 24px hsl(var(${cssVar}) / 0.25)`,
      }}
    >
      <span
        className="material-symbols-outlined text-6xl flex-shrink-0"
        style={{ color: accent }}
      >
        {track.icon}
      </span>
      <div className="text-center md:text-left">
        <h4 className="font-sans font-bold text-xl md:text-2xl text-foreground tracking-tight">
          {track.title}
        </h4>
        <p className="text-sm md:text-base text-muted-foreground mt-1 leading-relaxed">
          {track.description}
        </p>
      </div>
    </Link>
  );
}
