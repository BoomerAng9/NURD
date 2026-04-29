import { Link } from "wouter";
import { Code2, Boxes, Lightbulb } from "lucide-react";

/**
 * Services — three service tiles with neon-stroked borders.
 *
 * Deeper-build theme. Maps to mockup IMG_1880 in docs/design/PAGE_INVENTORY.md.
 *
 * Custom marker-style filled-neon "OUR SERVICES" headline from the mockup is
 * approximated here with Inter ExtraBold + per-letter color treatment. A
 * dedicated neon display font can be wired in Tier 2 once typography assets
 * are extracted.
 */
export default function Services() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <section className="container py-16 md:py-24 lg:py-28">
        {/* Hero — chunky neon headline (Inter ExtraBold approximation) */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6">
            What we do
          </p>
          <h1
            className="font-sans font-extrabold tracking-tight text-6xl md:text-7xl lg:text-8xl uppercase leading-[1] mb-6"
            style={{
              color: "hsl(var(--neon-cyan))",
              textShadow:
                "0 0 8px hsl(var(--neon-cyan) / 0.5), 0 4px 0 hsl(var(--accent-magenta) / 0.4), 0 8px 24px hsl(var(--accent-magenta) / 0.3)",
            }}
          >
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
            Three lanes. Picked because they ship.
          </p>
        </div>

        {/* Service tiles */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <ServiceTile
            Icon={Code2}
            title="Web Development"
            description="Custom, responsive websites and platforms built for performance, scalability, and user engagement. We bring your vision to the web."
            accent="cyan"
          />
          <ServiceTile
            Icon={Boxes}
            title="Software Engineering"
            description="Robust and scalable software solutions, including backend systems, APIs, and complex application development."
            accent="magenta"
          />
          <ServiceTile
            Icon={Lightbulb}
            title="Digital Solutions"
            description="Strategic consulting, UX/UI design, and digital transformation strategies to optimize your online presence and business processes."
            accent="orange"
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/auth?intent=services"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--neon-green))] text-background font-sans text-base font-semibold uppercase tracking-wordmark hover:bg-[hsl(var(--neon-green)/0.9)] transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </section>

      {/* Footer */}
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

interface ServiceTileProps {
  Icon: typeof Code2;
  title: string;
  description: string;
  accent: "cyan" | "magenta" | "orange";
}

function ServiceTile({ Icon, title, description, accent }: ServiceTileProps) {
  const accentVar =
    accent === "cyan"
      ? "var(--neon-cyan)"
      : accent === "magenta"
        ? "var(--accent-magenta)"
        : "var(--neon-orange)";

  return (
    <div
      className="bg-card p-8 md:p-10 text-center"
      style={{
        boxShadow: `0 0 0 1px hsl(${accentVar} / 0.5), 0 0 32px hsl(${accentVar} / 0.2)`,
      }}
    >
      <Icon
        className="h-12 w-12 mx-auto mb-6"
        strokeWidth={1.5}
        style={{ color: `hsl(${accentVar})` }}
        aria-hidden="true"
      />
      <h3 className="font-sans font-semibold text-xl md:text-2xl tracking-tight text-foreground mb-4">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
