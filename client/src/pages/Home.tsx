import { Link } from "wouter";
import nurdSkateboardImg from "@/assets/nurd-skateboard.png";
import madeInPoolerImg from "@/assets/made-in-pooler.png";

/**
 * NURD by ACHIEVEMOR — Home page.
 *
 * FOAI vertical, Coastal-Brewing-aligned. Same Pooler discipline, distinct
 * skateboard motif. No glass, no gradient text, no fake animated counters.
 * Operator-grade voice: V.I.B.E. is a serious build environment for builders;
 * NURD Summer Initiative + ACHIEVERS Program are the youth verticals (8-18)
 * inside the broader platform.
 */
export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO ============== */}
      <section className="container py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 md:gap-16 md:grid-cols-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              NURD by ACHIEVEMOR &middot; Made in Pooler.
            </p>
            <h1 className="font-sans font-semibold tracking-tight text-[clamp(40px,7vw,80px)] leading-[1.05] text-foreground">
              Naturally Unstoppable<br />
              Resourceful Dreamers.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-prose leading-relaxed">
              Build platform from Pooler, GA. AI-paired coding through V.I.B.E., peer skill exchange,
              and cohort programs for youth. A vertical of the FOAI ecosystem.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/access-ai"
                className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background border border-foreground font-sans text-sm font-medium hover:bg-background hover:text-foreground transition-colors vibe-surface"
              >
                Open V.I.B.E.
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-5 py-3 border border-border bg-transparent text-foreground font-sans text-sm font-medium hover:border-foreground transition-colors"
              >
                Sign in / Register
              </Link>
              <Link
                href="/achievers"
                className="inline-flex items-center gap-2 px-5 py-3 border border-border bg-transparent text-foreground font-sans text-sm font-medium hover:border-foreground transition-colors achievers-surface"
              >
                ACHIEVERS Program
                <span className="font-mono text-[10px] uppercase tracking-wordmark text-muted-foreground">
                  ages 8-18
                </span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <img
              src={nurdSkateboardImg}
              alt="NURD skateboard — Made in Pooler, GA"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ============== THE PILLARS. ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <div className="mb-10 md:mb-14">
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-2">
              01 Foundations
            </p>
            <h2 className="font-sans font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              The pillars.
            </h2>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            <PillarCell
              eyebrow="01 Build"
              title="V.I.B.E."
              description="Vibrant Imagination Build Environment. AI-paired coding for builders. Operator-grade workbench, not a wizard."
              href="/access-ai"
              motifClass="vibe-surface"
            />
            <PillarCell
              eyebrow="02 Iterate"
              title="Code Playground"
              description="Interactive editor for fast iteration. Real execution, real feedback."
              href="/code-playground"
            />
            <PillarCell
              eyebrow="03 Exchange"
              title="Skill Marketplace"
              description="Peers swap skills. Bridges between builders get built and rated."
              href="/skill-marketplace"
              motifClass="marketplace-surface"
            />
            <PillarCell
              eyebrow="04 Cohort"
              title="ACHIEVERS Program"
              description="Structured cohorts for ages 8-18. Real projects, real outcomes."
              href="/achievers"
              motifClass="achievers-surface"
            />
            <PillarCell
              eyebrow="05 Initiative"
              title="NURD Summer Initiative"
              description="Flagship youth program (8-18). Cohort applications open by season."
              href="/summer-initiative"
              motifClass="achievers-surface"
            />
            <PillarCell
              eyebrow="06 Plans"
              title="Subscriptions"
              description="Tiered access for individuals, families, and schools. Cancel anytime."
              href="/subscription-plans"
            />
          </div>
        </div>
      </section>

      {/* ============== THE COMMITMENT. ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20 max-w-3xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-2">
            02 Commitment
          </p>
          <h2 className="font-sans font-semibold tracking-tight text-3xl md:text-4xl mb-8">
            Made in Pooler.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
            <p>
              NURD lives where it was raised. Pooler, GA. The skateboard, the drip, the dreamers &mdash;
              all of it carries forward.
            </p>
            <p>
              We&rsquo;re a vertical of the <span className="font-medium">FOAI ecosystem</span> &mdash;
              siblings to{" "}
              <a
                href="https://brewing.foai.cloud"
                className="underline underline-offset-4 decoration-border hover:decoration-foreground"
              >
                Coastal Brewing Co.
              </a>{" "}
              and others. Same discipline. Different products. Same town.
            </p>
            <p className="text-muted-foreground">
              No fake counters. No machinery shown. Only the work, only the receipts.
            </p>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border">
        <div className="container py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img
              src={madeInPoolerImg}
              alt="Made in Pooler, GA"
              className="h-12 md:h-14 object-contain"
            />
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground text-center md:text-right">
              NURD &middot; Naturally Unstoppable Resourceful Dreamers<br />
              powered by ACHIEVEMOR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface PillarCellProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  motifClass?: string;
}

function PillarCell({ eyebrow, title, description, href, motifClass }: PillarCellProps) {
  return (
    <Link
      href={href}
      className={`block bg-background p-6 md:p-8 hover:bg-secondary transition-colors group ${
        motifClass || ""
      }`}
    >
      <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
        {eyebrow}
      </p>
      <h3 className="font-sans font-semibold tracking-tight text-xl md:text-2xl mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
      <p className="mt-6 font-mono uppercase tracking-wordmark text-[10px] text-foreground/70 group-hover:text-foreground transition-colors">
        Open &rarr;
      </p>
    </Link>
  );
}
