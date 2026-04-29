import { Link } from "wouter";
import { Check } from "lucide-react";

/**
 * Pricing page — Curious / Growing / Expert Nurd tiers.
 *
 * Deeper-build theme (per docs/design/DEEPER_BUILD.md §2). Maps to mockup
 * IMG_1873 in docs/design/PAGE_INVENTORY.md.
 *
 * Theme scope: this page sets data-theme="deep" on its root, switching the
 * cream Landing palette to the dark + neon-green deeper-build palette only
 * for this surface.
 *
 * Doctrinal flags resolved (per docs/design/DOCTRINAL_FLAGS.md):
 *   - Expert tier copy "Everything in Pro" → "Everything in Growing Nurd" (CB §4)
 *   - No internal tool names in customer copy (CB §1)
 */
export default function Pricing() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <section className="container py-16 md:py-24 lg:py-28">
        {/* Eyebrow + heading */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
            Pricing
          </p>
          <h1 className="font-sans font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6">
            Join the Nurd Tribe.
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-light leading-relaxed">
            One platform. Three lanes. Pick where you start.
          </p>
        </div>

        {/* Tier grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <TierCard
            name="Curious Nurd"
            tagline="Free Tier"
            price="$0"
            cadence="forever"
            features={[
              "Basic learning access",
              "Limited V.I.B.E. usage",
              "Community access",
              "Free starter projects",
            ]}
            ctaLabel="Join the Tribe — Free"
            ctaHref="/auth?plan=curious"
            accent="green"
          />
          <TierCard
            name="Growing Nurd"
            tagline="Most Popular"
            price="$29"
            cadence="month"
            features={[
              "Full learning paths",
              "Advanced V.I.B.E. features",
              "Real-time collaboration",
              "AI-powered code generation",
              "Analytics dashboard",
            ]}
            ctaLabel="Level Up Your Nurd"
            ctaHref="/auth?plan=growing"
            accent="gold"
            featured
          />
          <TierCard
            name="Expert Nurd"
            tagline="For Teams + Pros"
            price="$99"
            cadence="month"
            features={[
              "Everything in Growing Nurd",
              "Priority support",
              "Team workspace",
              "Advanced analytics",
              "Custom integrations",
              "Mentorship tools",
            ]}
            ctaLabel="Become a Chief Nurd"
            ctaHref="/auth?plan=expert"
            accent="cyan"
          />
        </div>

        {/* Mantra strip */}
        <p className="text-center font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mt-16 md:mt-20">
          Foster · Develop · Hone · S.M.A.R.T. · P.A.C.T. · S.T.E.A.M. — Be Cool Like That.
        </p>
      </section>

      {/* Footer signature (deeper-build minimal) */}
      <footer className="border-t border-border">
        <div className="container py-8 md:py-10">
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
        </div>
      </footer>
    </div>
  );
}

interface TierCardProps {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  accent: "green" | "gold" | "cyan";
  featured?: boolean;
}

function TierCard({
  name,
  tagline,
  price,
  cadence,
  features,
  ctaLabel,
  ctaHref,
  accent,
  featured = false,
}: TierCardProps) {
  const cardClass =
    accent === "gold"
      ? "neon-card neon-card--gold"
      : accent === "cyan"
        ? "neon-card neon-card--cyan"
        : "neon-card";

  const ctaClass =
    accent === "gold"
      ? "bg-[hsl(var(--accent-gold))] text-background hover:bg-[hsl(var(--accent-gold)/0.9)]"
      : accent === "cyan"
        ? "bg-[hsl(var(--neon-cyan))] text-background hover:bg-[hsl(var(--neon-cyan)/0.9)]"
        : "bg-[hsl(var(--neon-green))] text-background hover:bg-[hsl(var(--neon-green)/0.9)]";

  const checkClass =
    accent === "gold"
      ? "text-[hsl(var(--accent-gold))]"
      : accent === "cyan"
        ? "text-[hsl(var(--neon-cyan))]"
        : "text-[hsl(var(--neon-green))]";

  return (
    <div className={`${cardClass} p-8 md:p-10 flex flex-col ${featured ? "md:scale-[1.02]" : ""}`}>
      {/* Tagline + Tier name */}
      <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
        {tagline}
      </p>
      <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-6">
        {name}
      </h2>

      {/* Price */}
      <div className="mb-8 flex items-baseline gap-2">
        <span className="font-sans font-bold text-5xl md:text-6xl text-foreground tracking-tight">
          {price}
        </span>
        <span className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
          / {cadence}
        </span>
      </div>

      {/* Feature list */}
      <ul className="space-y-3 mb-10 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-foreground/90">
            <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkClass}`} aria-hidden="true" />
            <span className="text-base leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={`inline-flex items-center justify-center px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wordmark transition-colors ${ctaClass}`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
