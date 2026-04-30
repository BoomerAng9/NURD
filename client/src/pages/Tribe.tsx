import { Link } from "wouter";

/**
 * /tribe — community landing page.
 *
 * Visual upgrade: rebuilt from owner mockup IMG_1839 ("JOIN THE TRIBE").
 * Deeper-build canon — circuit-bg, neon-green hero, glow cards.
 *
 * Hero + 6 community feature cards + bottom CTA + footer.
 *
 * Phase 1 scope: visual only. CTA links to /auth?intent=join-tribe (existing
 * Auth page handles the registration flow).
 */
export default function Tribe() {
  return (
    <div
      data-theme="deep"
      className="bg-background text-foreground min-h-screen circuit-bg"
    >
      {/* ============== HERO + GRID SECTION ============== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Faint circuit-board backdrop image — layered on top of the global
            circuit-bg pattern for extra depth per IMG_1839 reference. */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* TODO: replace with extracted asset from IMG_1839 */}
          <img
            src="https://placehold.co/1920x1080/0a0c10/39ff14?text=Circuit+Board+BG"
            data-alt="Faint, glowing green circuit board pattern on a dark background"
            className="w-full h-full object-cover opacity-20"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl flex flex-col items-center gap-12">
          {/* Hero copy */}
          <div className="text-center max-w-4xl flex flex-col gap-4">
            <h1
              className="font-sans font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl uppercase leading-[1.05]"
              style={{
                color: "hsl(var(--neon-green))",
                textShadow: "0 0 12px hsl(var(--neon-green) / 0.6)",
              }}
            >
              Join The Tribe
            </h1>
            <p className="font-sans font-semibold text-2xl md:text-3xl text-foreground leading-snug">
              Building the ultimate community of tech enthusiasts, innovators, and creators
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Where collective growth, knowledge sharing, and impactful learning define our shared mission.
            </p>
          </div>

          {/* Feature grid — 6 community pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <TribeCard
              icon="integration_instructions"
              title="Collaboration Studio"
              description="Real-time pair programming and group projects to build together."
            />
            <TribeCard
              icon="groups"
              title="Mentorship Network"
              description="Learn directly from experienced Nurds and industry leaders."
            />
            <TribeCard
              icon="emoji_objects"
              title="Project Showcase"
              description="Share your builds, get feedback, and inspire the community."
            />
            <TribeCard
              icon="event_note"
              title="Events & Workshops"
              description="Join regular learning events, hackathons, and skill-building sessions."
            />
            <TribeCard
              icon="headset_mic"
              title="Discord Community"
              description="Real-time chat, networking, and instant support from the Tribe."
            />
            <TribeCard
              icon="auto_stories"
              title="Resources Hub"
              description="Access a shared library of knowledge, best practices, and tools."
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-6">
            <Link
              href="/auth?intent=join-tribe"
              className="inline-block font-mono uppercase tracking-wordmark text-[12px] px-10 py-4 border-2 rounded-lg transition-all duration-300 transform active:scale-95 hover:bg-[hsl(var(--neon-green)/0.1)]"
              style={{
                color: "hsl(var(--neon-green))",
                borderColor: "hsl(var(--neon-green))",
                textShadow: "0 0 10px hsl(var(--neon-green) / 0.6)",
                boxShadow: "0 0 25px hsl(var(--neon-green) / 0.3)",
              }}
              data-testid="link-join-tribe"
            >
              Become a Nurd — Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border relative z-10">
        <div className="container mx-auto max-w-7xl py-8 md:py-10 px-4 sm:px-6 lg:px-8">
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

interface TribeCardProps {
  /** Material Symbols Outlined icon name (font is loaded globally). */
  icon: string;
  title: string;
  description: string;
}

function TribeCard({ icon, title, description }: TribeCardProps) {
  return (
    <div
      className="bg-card p-6 rounded-xl border flex items-start gap-6"
      style={{
        borderColor: "hsl(var(--neon-green) / 0.5)",
        boxShadow: "0 0 25px hsl(var(--neon-green) / 0.18)",
      }}
    >
      <span
        className="material-symbols-outlined text-4xl shrink-0"
        style={{
          color: "hsl(var(--neon-green))",
          textShadow: "0 0 12px hsl(var(--neon-green) / 0.6)",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <h3 className="font-sans font-semibold text-xl md:text-2xl tracking-tight text-foreground mb-2">
          {title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
