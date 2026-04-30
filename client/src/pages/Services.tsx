import { Link } from "wouter";

/**
 * /services — deeper-build canon, derived from owner mockup IMG_1880.
 * "OUR SERVICES" 3-tile grid: Web Development / Software Engineering / Digital Solutions.
 *
 * Conversion of `_tailwind-pages/IMG_1880.html` (Gemini-generated from the
 * owner's IMG_1880 reference). Brand color tokens from the source mock are
 * mapped onto the project's HSL CSS variables:
 *   - cyan-container (#00f2ff)   -> --neon-cyan
 *   - secondary-container (#d05bff) -> --accent-magenta
 *   - tertiary-fixed-dim (#ffb77f)  -> --neon-orange
 *
 * Phase 1 keeps placeholder iconography; Iller_Ang-extracted neon SVGs from
 * IMG_1880 land in a follow-up Tier 2 visual pass.
 */
export default function Services() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <main className="flex-grow">
        <section className="py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            {/* ============== HEADLINE ============== */}
            <h2
              className="font-sans font-extrabold text-center mb-16 tracking-tight uppercase text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
              style={{
                color: "hsl(var(--neon-cyan))",
                textShadow:
                  "0 4px 0 hsl(var(--accent-magenta) / 0.6), 0 0 20px hsl(var(--neon-cyan) / 0.4)",
              }}
            >
              Our Services
            </h2>

            {/* ============== TILE GRID ============== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {/* Web Development */}
              <ServiceTile
                accent="cyan"
                title="Web Development"
                description="Custom, responsive websites and platforms built for performance, scalability, and user engagement. We bring your vision to the web."
                imgAlt="Neon icon of code brackets and a gear"
                iconShadowA="hsl(var(--neon-cyan))"
                iconShadowB="hsl(var(--neon-orange))"
                wavePath="M15 5 C 20 18 30 18 35 5 C 38 12 43 12 46 5 M60 3 C 63 15 73 15 76 3"
              />

              {/* Software Engineering — features a floating arrow accent */}
              <div className="relative">
                <ServiceTile
                  accent="magenta"
                  title="Software Engineering"
                  description="Robust and scalable software solutions, including backend systems, APIs, and complex application development."
                  imgAlt="Neon icon of interconnected cubes representing software architecture"
                  iconShadowA="hsl(var(--accent-magenta))"
                  iconShadowB="hsl(var(--neon-orange))"
                  wavePath="M25 3 C 30 15 40 15 45 3 M55 5 C 60 18 70 18 75 5 C 78 12 83 12 86 5"
                />
                <span
                  className="material-symbols-outlined absolute top-1/2 right-0 -translate-y-1/4 translate-x-1/2 text-5xl -rotate-12 pointer-events-none"
                  style={{
                    color: "hsl(var(--neon-cyan))",
                    textShadow: "0 0 10px hsl(var(--neon-cyan) / 0.6)",
                  }}
                  aria-hidden="true"
                >
                  arrow_selector_tool
                </span>
              </div>

              {/* Digital Solutions */}
              <ServiceTile
                accent="orange"
                title="Digital Solutions"
                description="Strategic consulting, UX/UI design, and digital transformation strategies to optimize your online presence and business processes."
                imgAlt="Neon icon of a lightbulb with a brain and an upward arrow"
                iconShadowA="hsl(var(--neon-cyan))"
                iconShadowB="hsl(var(--neon-orange))"
                wavePath="M10 3 C 15 15 25 15 30 3 M45 5 C 50 18 60 18 65 5 M75 4 C 80 16 90 16 95 4"
              />
            </div>

            {/* ============== CTA ============== */}
            <div className="text-center mt-20">
              <Link
                href="/auth?intent=services"
                className="inline-flex items-center gap-3 px-8 py-4 font-mono uppercase tracking-wordmark text-[12px] rounded-lg transition-transform active:scale-95"
                style={{
                  background: "hsl(var(--neon-green))",
                  color: "hsl(var(--background))",
                  boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                }}
              >
                Start a Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-8 md:py-10">
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

interface ServiceTileProps {
  accent: "cyan" | "magenta" | "orange";
  title: string;
  description: string;
  imgAlt: string;
  iconShadowA: string;
  iconShadowB: string;
  wavePath: string;
}

function ServiceTile({
  accent,
  title,
  description,
  imgAlt,
  iconShadowA,
  iconShadowB,
  wavePath,
}: ServiceTileProps) {
  const accentVar =
    accent === "cyan"
      ? "var(--neon-cyan)"
      : accent === "magenta"
        ? "var(--accent-magenta)"
        : "var(--neon-orange)";

  return (
    <div
      className="relative bg-card rounded-2xl p-8 flex flex-col items-center text-center h-full"
      style={{
        border: `1px solid hsl(${accentVar} / 0.3)`,
        boxShadow: `0 0 40px -10px hsl(${accentVar} / 0.5)`,
      }}
    >
      {/* TODO: replace with extracted asset from IMG_1880 */}
      <img
        src="https://placehold.co/128x128/272a31/000000?text="
        data-alt={imgAlt}
        alt={imgAlt}
        className="w-24 h-24 mb-8"
        style={{
          filter: `drop-shadow(0 0 10px ${iconShadowA}) drop-shadow(0 0 5px ${iconShadowB})`,
        }}
      />
      <h3 className="font-sans font-bold text-2xl md:text-[28px] leading-tight text-foreground mb-4">
        {title}
      </h3>
      <p className="text-base text-muted-foreground max-w-xs leading-relaxed">{description}</p>

      {/* Decorative wave silhouette beneath the tile */}
      <div className="absolute bottom-0 left-0 right-0 h-8 translate-y-[99%] pointer-events-none">
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="w-full h-full text-card"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={wavePath} />
        </svg>
      </div>
    </div>
  );
}
