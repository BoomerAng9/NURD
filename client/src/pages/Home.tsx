import { Link } from "wouter";
import madeInPlrImg from "@/assets/made-in-pooler-green.png";
import nurdHeroImg from "@/assets/nurd-hero.png";

/**
 * NurdsCode — Home page.
 *
 * FOAI vertical. Hero is the kokonut two-column (image right, text left with
 * justify-between 3-block rhythm: NurdsCode. wordmark / What is a NURD? middle
 * block / An FOAI Space for Modern Dreamers. tagline at bottom).
 *
 * Below the hero: "The platform" — Initiative path / Build path (mockup → page) /
 * Billing matrix. Footer: pipe-separated, vertically centered row, PLR logo.
 */
export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO (kokonut two-column) ============== */}
      <section>
        <div className="container py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 relative overflow-x-hidden">
            {/* Right column: owner-supplied hero image */}
            <div className="md:order-2 relative">
              <div className="absolute -z-10 w-72 h-72 rounded-full bg-foreground/5 blur-3xl opacity-60 -top-10 -left-10"></div>
              <img
                src={nurdHeroImg}
                alt="NurdsCode — Made in Pooler"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>

            {/* Left column: kokonut justify-between 3-block rhythm */}
            <div className="md:order-1 flex flex-col justify-between">
              <div className="flex flex-col h-full justify-between gap-10 md:gap-0">
                {/* Block 1 — wordmark */}
                <div>
                  <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
                    Made in Pooler.
                  </p>
                  <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tighter">
                    NurdsCode.
                  </h1>
                </div>

                {/* Block 2 — What is a NURD? (replaces kokonut fashion list) */}
                <div>
                  <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                    02 What is a NURD?
                  </p>
                  <h2 className="font-sans font-semibold tracking-tight text-3xl md:text-4xl text-foreground leading-[1.1] mb-3">
                    Naturally Unstoppable<br />
                    Resourceful Dreamers.
                  </h2>
                  <p className="font-sans text-xl md:text-2xl text-foreground/90 font-light">
                    Is that you?
                  </p>
                </div>

                {/* Block 3 — bottom tagline (replaces kokonut "SUMMER 2025") */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium text-foreground mt-auto tracking-tight">
                    An FOAI Space for Modern Dreamers.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== THE PLATFORM (Initiative / Build Path / Billing Matrix) ============== */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <div className="mb-10 md:mb-14">
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-2">
              01 The platform.
            </p>
            <h2 className="font-sans font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl">
              What we're building.
            </h2>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-3">
            {/* Col 1 — The Initiative */}
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                01 The Initiative
              </p>
              <h3 className="font-sans font-semibold tracking-tight text-xl md:text-2xl mb-4 text-foreground">
                The youth program.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Cohorts and curriculum for ages 8–18. Foster · Develop · Hone.
              </p>
              <ul className="space-y-2 mb-8 text-sm">
                <li>
                  <Link href="/achievers" className="text-foreground/90 hover:underline underline-offset-4">
                    → ACHIEVERS Program
                  </Link>
                </li>
                <li>
                  <Link href="/summer-initiative" className="text-foreground/90 hover:underline underline-offset-4">
                    → NURD Summer Initiative
                  </Link>
                </li>
                <li>
                  <Link href="/cohorts" className="text-foreground/90 hover:underline underline-offset-4">
                    → Cohorts
                  </Link>
                </li>
                <li>
                  <Link href="/tribe" className="text-foreground/90 hover:underline underline-offset-4">
                    → Join the Tribe
                  </Link>
                </li>
              </ul>
              <Link
                href="/summer-initiative"
                className="mt-auto font-mono uppercase tracking-wordmark text-[10px] text-foreground hover:underline underline-offset-4"
              >
                Open the Initiative →
              </Link>
            </div>

            {/* Col 2 — The Build Path */}
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                02 The Build Path
              </p>
              <h3 className="font-sans font-semibold tracking-tight text-xl md:text-2xl mb-4 text-foreground">
                Mockup → page.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Surfaces from the owner mockup canon. Live or coming.
              </p>
              <ul className="space-y-2 mb-2 text-sm">
                <BuildPathRow href="/pricing"  label="Pricing"  img="IMG_1873" status="live" />
                <BuildPathRow href="/tribe"    label="Tribe"    img="IMG_1839" status="live" />
                <BuildPathRow href="/services" label="Services" img="IMG_1880" status="live" />
                <BuildPathRow href="#"         label="Auth"     img="IMG_1870" status="coming" />
                <BuildPathRow href="#"         label="Chat"     img="IMG_1865" status="coming" />
                <BuildPathRow href="#"         label="Learn"    img="IMG_1841" status="coming" />
                <BuildPathRow href="#"         label="Build"    img="IMG_1858" status="coming" />
                <BuildPathRow href="#"         label="Projects" img="IMG_1864" status="coming" />
                <BuildPathRow href="#"         label="Account"  img="IMG_1867" status="coming" />
              </ul>
            </div>

            {/* Col 3 — The Billing Matrix */}
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                03 The Billing Matrix
              </p>
              <h3 className="font-sans font-semibold tracking-tight text-xl md:text-2xl mb-4 text-foreground">
                Three tiers, three lanes.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                Pick where you start. Cancel anytime.
              </p>
              <div className="space-y-3 mb-8 text-sm">
                <TierRow name="Curious Nurd" price="$0"  cadence="forever" />
                <TierRow name="Growing Nurd" price="$29" cadence="month"   />
                <TierRow name="Expert Nurd"  price="$99" cadence="month"   />
              </div>
              <Link
                href="/pricing"
                className="mt-auto font-mono uppercase tracking-wordmark text-[10px] text-foreground hover:underline underline-offset-4"
              >
                See full pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER (pipe-separated, center-aligned) ============== */}
      <footer className="border-t border-border">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center">
            <p className="font-sans text-lg md:text-xl font-light text-foreground/90 tracking-tight">
              Build the world you want to live in.
            </p>
            <span aria-hidden="true" className="hidden md:inline text-muted-foreground/50 select-none">
              |
            </span>
            <img
              src={madeInPlrImg}
              alt="Made in PLR"
              className="h-12 md:h-14 object-contain"
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

interface BuildPathRowProps {
  href: string;
  label: string;
  img: string;
  status: "live" | "coming";
}

function BuildPathRow({ href, label, img, status }: BuildPathRowProps) {
  const isLive = status === "live";
  return (
    <li className="flex items-baseline gap-3">
      {isLive ? (
        <Link href={href} className="text-foreground/90 hover:underline underline-offset-4">
          {label}
        </Link>
      ) : (
        <span className="text-foreground/70">{label}</span>
      )}
      <span className="font-mono text-[9px] text-muted-foreground/70">{img}</span>
      <span
        className={`ml-auto font-mono uppercase tracking-wordmark text-[9px] ${
          isLive
            ? "text-[hsl(var(--nurd-drip-green))]"
            : "text-muted-foreground"
        }`}
      >
        {isLive ? "Live" : "Coming"}
      </span>
    </li>
  );
}

interface TierRowProps {
  name: string;
  price: string;
  cadence: string;
}

function TierRow({ name, price, cadence }: TierRowProps) {
  return (
    <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
      <span className="text-foreground/90">{name}</span>
      <span className="font-mono text-foreground">
        {price}
        <span className="text-muted-foreground"> / {cadence}</span>
      </span>
    </div>
  );
}
