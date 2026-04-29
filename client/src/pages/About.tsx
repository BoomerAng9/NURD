import { Link } from "wouter";
import { ExternalLink, Coffee, Trophy, Cpu, Sparkles } from "lucide-react";
import StackedPanels from "@/components/ui/stacked-panels-cursor-intereactive-component";
import { Card } from "@/components/ui/card";
import madeInPlrImg from "@/assets/made-in-pooler-green.png";

/**
 * About — FOAI deep-dive.
 *
 * Hero: kokonut StackedPanels cursor-interactive 3D scene.
 * Body: what FOAI is + the verticals as Card-grid.
 * Footer: Made in Pooler / "Powered by: A.I.M.S." / pipe-separated row.
 */
export default function About() {
  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO — interactive 3D panels ============== */}
      <section className="relative w-full h-[80vh] md:h-[88vh] overflow-hidden bg-background">
        {/* Subtle noise texture */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Eyebrow */}
        <p className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-wordmark uppercase text-muted-foreground font-mono select-none">
          About FOAI
        </p>

        {/* Interactive panels */}
        <div className="absolute inset-0 w-full h-full">
          <StackedPanels />
        </div>

        {/* Bottom hint */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-wordmark uppercase text-muted-foreground/70 font-mono select-none text-center">
          Move cursor to interact
        </p>

        {/* Headline overlay */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20 px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground/95 leading-[1] tracking-tight mix-blend-difference">
            We build worlds.
          </h1>
        </div>
      </section>

      {/* ============== WHAT IS FOAI ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24 max-w-3xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
            01 What is FOAI?
          </p>
          <h2 className="font-serif font-semibold tracking-tight text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.05]">
            An ecosystem of AI-managed verticals.
          </h2>
          <div className="space-y-5 text-lg md:text-xl text-foreground/85 leading-relaxed font-light">
            <p>
              FOAI is what happens when one company decides to stop selling tools and
              start running a neighborhood. Each vertical is a real product
              with real customers — coffee here, sports data there, code over
              this way, software services down the street.
            </p>
            <p>
              They don&apos;t share a chassis. They share a posture: built in Pooler,
              run by AI, attended by humans who care about the result. What
              ties them together is intent, not infrastructure.
            </p>
            <p className="font-serif italic text-foreground/90">
              The verticals are siblings. FOAI is the household.
            </p>
          </div>
        </div>
      </section>

      {/* ============== THE VERTICALS ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24">
          <div className="mb-10 md:mb-14 max-w-3xl">
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-2">
              02 The verticals
            </p>
            <h2 className="font-serif font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              Each one is its own thing.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* You are here — col-span-full hero */}
            <Card className="col-span-full overflow-hidden p-6 md:p-8 bg-card border-border/60 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <Sparkles className="text-foreground size-5 mt-1" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-1">
                    You are here
                  </p>
                  <h3 className="font-serif text-foreground text-2xl md:text-3xl font-semibold">
                    NurdsCode
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                The builder&apos;s lane. AI-paired coding via V.I.B.E., a Tribe of makers, and
                a youth Initiative (ages 8–18) that grows the next generation of Naturally
                Unstoppable Resourceful Dreamers.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/tribe"
                  className="font-mono uppercase tracking-wordmark text-[10px] px-4 py-2 border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Join the Tribe →
                </Link>
                <Link
                  href="/pricing"
                  className="font-mono uppercase tracking-wordmark text-[10px] px-4 py-2 border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  See pricing →
                </Link>
                <Link
                  href="/dreamers"
                  className="font-mono uppercase tracking-wordmark text-[10px] px-4 py-2 border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Read the manifesto →
                </Link>
              </div>
            </Card>

            <VerticalCard
              icon={<Coffee className="text-foreground size-5" strokeWidth={1.5} />}
              name="Coastal Brewing Co."
              tagline="Pooler-rooted virtual brewer."
              description="Lowcountry coffee + tea, virtually delivered. The original FOAI vertical pilot — a human-less storefront with AI-curated sourcing, blends, and customer service."
              url="https://brewing.foai.cloud/"
              cta="Order coffee"
            />
            <VerticalCard
              icon={<Trophy className="text-foreground size-5" strokeWidth={1.5} />}
              name="Per|Form"
              tagline="Athlete intelligence."
              description="Sports data surfaced cleanly. NBA Awards Watch, draft analytics, athlete-by-athlete intelligence. Built for fans who want the numbers behind the narrative."
              url="https://perform.foai.cloud/"
              cta="See the numbers"
            />
            <VerticalCard
              icon={<Cpu className="text-foreground size-5" strokeWidth={1.5} />}
              name="A.I.M.S."
              tagline="AI Managed Solutions."
              description="The SaaS lane. AI-managed automations, agent runtimes, and operator tooling for businesses ready to let software do the work."
              url="https://aimanagedsolutions.cloud/"
              cta="Learn more"
            />
          </div>
        </div>
      </section>

      {/* ============== MADE IN POOLER CLOSING ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20 max-w-2xl text-center">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
            03 Origin
          </p>
          <h2 className="font-serif font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl mb-6 leading-[1.1]">
            Made in Pooler, GA.
          </h2>
          <p className="text-lg md:text-xl text-foreground/85 font-light leading-relaxed mb-8">
            One small lowcountry town. A house full of verticals. Run by a team
            that decided early that AI shouldn&apos;t replace people — it
            should free them up to dream bigger.
          </p>
          <p className="font-serif italic text-2xl md:text-3xl text-foreground tracking-tight">
            Build the world you want to live in.
          </p>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border">
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
            <img
              src={madeInPlrImg}
              alt="Made in PLR"
              className="h-10 md:h-12 object-contain"
            />
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

interface VerticalCardProps {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  url: string;
  cta: string;
}

function VerticalCard({ icon, name, tagline, description, url, cta }: VerticalCardProps) {
  return (
    <Card className="overflow-hidden p-6 md:p-7 bg-card border-border/60 shadow-sm flex flex-col">
      <div className="mb-5">{icon}</div>
      <h3 className="font-serif text-foreground text-xl md:text-2xl font-semibold mb-1">
        {name}
      </h3>
      <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
        {tagline}
      </p>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-2 font-mono uppercase tracking-wordmark text-[10px] text-foreground hover:underline underline-offset-4"
      >
        {cta}
        <ExternalLink className="size-3" strokeWidth={1.5} />
      </a>
    </Card>
  );
}
