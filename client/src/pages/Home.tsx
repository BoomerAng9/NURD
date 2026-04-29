import { Link } from "wouter";
import { motion } from "framer-motion";
import madeInPoolerImg from "@/assets/made-in-pooler.png";
import nurdCoastalHeroImg from "@/assets/nurd-coastal-hero.png";

/**
 * NURD CODE — Home page.
 *
 * FOAI vertical. Hero adapts the kokonut-style two-column layout (owner-supplied
 * pattern 2026-04-29): image right, content left with hover-lift pillar list,
 * H1 + section heading + body. Owner-supplied hero image (NURD x Coastal scene
 * with Pooler palms + lowcountry storks) anchors the right column.
 *
 * Below the hero: "What is a NURD?" / "Is that you?" / Footer with
 * "Powered by: A.I.M.S."
 */
export default function Home() {
  const pillars = [
    { label: "V.I.B.E.", href: "/access-ai" },
    { label: "Code Playground", href: "/code-playground" },
    { label: "Skill Marketplace", href: "/skill-marketplace" },
    { label: "ACHIEVERS Program", href: "/achievers" },
    { label: "NURD Summer Initiative", href: "/summer-initiative" },
    { label: "Subscriptions", href: "/subscription-plans" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO ============== */}
      <section>
        <div className="container py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative overflow-x-hidden">
            {/* Right column: owner-supplied hero image */}
            <div className="md:order-2 relative">
              <div className="absolute -z-10 w-72 h-72 rounded-full bg-foreground/5 blur-3xl opacity-60 -top-10 -left-10"></div>
              <img
                src={nurdCoastalHeroImg}
                alt="NURD CODE — Made in Pooler, lowcountry scene"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>

            {/* Left column: wordmark + pillar list + tagline */}
            <div className="md:order-1 flex flex-col justify-between">
              <div className="flex flex-col h-full justify-between gap-10 md:gap-0">
                <div>
                  <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6">
                    Made in Pooler.
                  </p>
                  <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tighter">
                    NURDS CODE.
                  </h1>
                </div>

                <ul className="space-y-2 tracking-tighter text-lg text-foreground/90 mt-8 md:mt-0">
                  {pillars.map((pillar, index) => (
                    <motion.li
                      key={pillar.label}
                      initial={{ opacity: 0.8 }}
                      whileHover={{
                        opacity: 1,
                        y: -3,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link href={pillar.href} className="cursor-pointer hover:underline underline-offset-4">
                        {pillar.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 md:mt-0">
                  <h2 className="text-2xl md:text-3xl font-medium text-foreground">
                    An FOAI Space for Modern Dreamers.
                  </h2>
                  <p className="text-lg text-foreground/95 max-w-md pt-4 tracking-tight">
                    Build the world you want to live in.
                  </p>
                </div>
              </div>
            </div>
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

      {/* ============== WHAT IS A NURD? ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20 max-w-3xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
            02 What is a NURD?
          </p>
          <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-5xl lg:text-6xl mb-10 leading-[1.1]">
            Naturally Unstoppable<br />
            Resourceful Dreamers.
          </h2>
          <p className="font-sans text-2xl md:text-3xl text-foreground/90 font-light">
            Is that you?
          </p>
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
              Powered by: A.I.M.S.
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
