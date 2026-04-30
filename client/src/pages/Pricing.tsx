import { Link } from "wouter";

/**
 * /pricing — deeper-build canon, derived from owner mockup IMG_1873.
 * Three tiers: Curious Nurd (free), Growing Nurd ($29/mo, gold), Expert Nurd ($99/mo).
 *
 * Theme scope: this page sets data-theme="deep" on its root, switching the
 * cream Landing palette to the dark + neon-green deeper-build palette only
 * for this surface.
 *
 * Doctrinal flags resolved (per docs/design/DOCTRINAL_FLAGS.md):
 *   - Expert tier copy "Everything in Pro" → "Everything in Growing Nurd" (CB §4)
 *   - No internal tool/model/provider names in customer copy (CB §1)
 *
 * Token mapping — source HTML used Tailwind tokens that don't exist in this
 * project's tailwind.config.ts (e.g. accent-lime, accent-gold, surface-*).
 * Mapped to the existing CSS variables in client/src/index.css:
 *   - accent-lime  -> --neon-green (#39FF14 — canonical first-lane accent)
 *   - accent-gold  -> --accent-gold (#FFB700)
 *   - surface-container-high -> bg-card / bg-secondary
 *   - on-surface / on-background -> text-foreground
 *   - on-surface-variant -> text-muted-foreground
 */
export default function Pricing() {
  return (
    <div
      data-theme="deep"
      className="bg-background text-foreground min-h-screen circuit-bg flex flex-col overflow-x-hidden"
    >
      {/* Soft radial backdrop layer (sits beneath circuit-bg). */}
      <div
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, hsl(var(--secondary) / 0.6), hsl(var(--background)) 60%, hsl(var(--background)))",
        }}
        aria-hidden="true"
      />

      <main className="flex-grow flex flex-col items-center justify-center w-full px-6 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          {/* ============== HEADER ============== */}
          <header className="text-center mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">
              {/* TODO: replace with extracted asset from IMG_1873 */}
              <img
                src="https://placehold.co/100x50/10131a/39FF14?text=NURD"
                alt="NurdsCode wordmark"
                data-alt="NURD logo with green slime drip effect"
                className="h-12 md:h-16 w-auto"
              />
              <h1 className="font-sans font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.15]">
                Join the Nurd Tribe.
                <span className="block text-foreground/80 font-light text-2xl md:text-3xl mt-2">
                  Unified Pricing &amp; Learning.
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              NurdsCode and V.I.B.E. — one platform, three lanes. Pick where you start.
            </p>
          </header>

          {/* ============== TIER GRID ============== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Curious Nurd (free, lime/green accent) */}
            <TierCard
              name="Curious Nurd"
              tagline="Free Tier"
              ctaLabel="Join the Tribe — Free"
              ctaHref="/auth?plan=curious"
              accent="green"
              avatarSrc="https://placehold.co/128x128/272a31/ffffff?text=+"
              avatarAlt="Curious Nurd avatar"
              avatarDataAlt="Avatar illustration of a young person with a curious expression"
              avatarClass="w-24 h-24"
              features={[
                "Basic learning access",
                "Limited V.I.B.E. usage",
                "Community access",
                "Free starter projects",
              ]}
            />

            {/* Card 2: Growing Nurd ($29/mo, gold accent — middle / featured) */}
            <TierCard
              name="Growing Nurd"
              tagline="$29 / month"
              ctaLabel="Level Up Your Nurd"
              ctaHref="/auth?plan=growing"
              accent="gold"
              avatarSrc="https://placehold.co/128x128/272a31/ffffff?text=+"
              avatarAlt="Growing Nurd avatar"
              avatarDataAlt="Avatar illustration of a person in futuristic armor with headphones"
              avatarClass="w-24 h-24"
              features={[
                "Full learning paths",
                "Advanced V.I.B.E. features",
                "Real-time collaboration",
                "AI-powered code generation",
                "Analytics dashboard",
              ]}
            />

            {/* Card 3: Expert Nurd ($99/mo, lime/green accent again) */}
            <TierCard
              name="Expert Nurd"
              tagline="$99 / month"
              ctaLabel="Become a Chief Nurd"
              ctaHref="/auth?plan=expert"
              accent="green"
              avatarSrc="https://placehold.co/160x128/272a31/ffffff?text=+"
              avatarAlt="Expert Nurd team avatar"
              avatarDataAlt="Avatar illustration of a diverse team of three professionals around a laptop"
              avatarClass="w-32 h-24 object-contain"
              features={[
                "Everything in Growing Nurd",
                "Priority support",
                "Team workspace",
                "Advanced analytics",
                "Custom integrations",
                "Mentorship tools",
              ]}
              ctaGradient
            />
          </div>

          {/* ============== FOOTER MANTRA ============== */}
          <footer className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center">
            <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Foster · Develop · Hone · S.M.A.R.T. · P.A.C.T. · S.T.E.A.M. — Be Cool Like That.
            </p>
            {/* TODO: replace with extracted asset from IMG_1873 */}
            <img
              src="https://placehold.co/150x75/10131a/FFB700?text=NURD"
              alt="NurdsCode signature"
              data-alt="NURD logo with tagline 'I'm cool like that.'"
              className="h-12 md:h-14 w-auto"
            />
          </footer>

          {/* Sub-footer (deeper-build minimal) */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
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
        </div>
      </main>
    </div>
  );
}

/* ───────────────────────── TierCard ───────────────────────── */

interface TierCardProps {
  name: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  accent: "green" | "gold";
  avatarSrc: string;
  avatarAlt: string;
  avatarDataAlt: string;
  avatarClass: string;
  /** When true, render the CTA with a gradient fill (used by the Expert tier). */
  ctaGradient?: boolean;
}

function TierCard({
  name,
  tagline,
  features,
  ctaLabel,
  ctaHref,
  accent,
  avatarSrc,
  avatarAlt,
  avatarDataAlt,
  avatarClass,
  ctaGradient = false,
}: TierCardProps) {
  const isGold = accent === "gold";
  const accentVar = isGold ? "var(--accent-gold)" : "var(--neon-green)";
  const accentRgba = isGold ? "240, 183, 0" : "57, 255, 20"; // #FFB700 / #39FF14

  // Outer gradient frame -> draws the colored "edge glow" around each card.
  const frameStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, hsl(${accentVar} / 0.8) 0%, hsl(${accentVar} / 0.25) 100%)`,
    boxShadow: `0 0 30px rgba(${accentRgba}, 0.4)`,
  };

  // CTA button — solid accent OR gradient (Expert tier).
  const ctaStyle: React.CSSProperties = ctaGradient
    ? {
        background: `linear-gradient(90deg, hsl(${accentVar}) 0%, hsl(${accentVar} / 0.7) 100%)`,
        color: "hsl(var(--background))",
        boxShadow: `0 0 24px rgba(${accentRgba}, 0.45)`,
      }
    : {
        background: `hsl(${accentVar})`,
        color: "hsl(var(--background))",
        boxShadow: `0 0 20px rgba(${accentRgba}, 0.35)`,
      };

  // Tier name color + glow text-shadow.
  const nameStyle: React.CSSProperties = {
    color: `hsl(${accentVar})`,
    textShadow: `0 0 10px rgba(${accentRgba}, 0.7)`,
  };

  // Check icon color.
  const checkStyle: React.CSSProperties = {
    color: `hsl(${accentVar})`,
  };

  return (
    <div className="rounded-2xl p-[1px]" style={frameStyle}>
      <div className="bg-card rounded-2xl h-full p-8 flex flex-col">
        {/* Avatar / illustration */}
        {/* TODO: replace with extracted asset from IMG_1873 */}
        <img
          src={avatarSrc}
          alt={avatarAlt}
          data-alt={avatarDataAlt}
          className={`${avatarClass} mx-auto mb-6 rounded-lg`}
        />

        {/* Tier name + tagline */}
        <h2
          className="font-sans font-bold text-2xl md:text-[28px] text-center tracking-tight mb-1"
          style={nameStyle}
        >
          {name}
        </h2>
        <p className="font-mono text-center text-muted-foreground uppercase tracking-wordmark text-[11px] mb-8">
          {tagline}
        </p>

        {/* Feature list */}
        <ul className="space-y-4 flex-grow text-foreground/90">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span
                className="material-symbols-outlined mt-0.5 flex-shrink-0"
                style={checkStyle}
                aria-hidden="true"
              >
                check
              </span>
              <span className="text-base leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="font-mono uppercase tracking-wordmark text-[12px] mt-10 w-full py-4 rounded-lg font-bold text-center transition-transform duration-200 active:scale-95 hover:brightness-110 inline-block"
          style={ctaStyle}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
