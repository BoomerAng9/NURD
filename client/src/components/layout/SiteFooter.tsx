import { useState } from "react";
import { Link } from "wouter";

/**
 * SiteFooter — global site footer (drip-NURD identity).
 *
 * Combines IMG_1876 (5-col + newsletter capture + sister-vertical strip + socials
 * + legal bar) with IMG_1882 (dual-color "Nurds"+"Code" wordmark, gradient-bordered
 * legal bar). Strongest elements from each:
 *   • IMG_1876: 5-column grid + newsletter form + ACHIEVEMOR / NURD Initiative /
 *     OpenKlass sister-vertical strip + social row + dedicated legal bar
 *   • IMG_1882: "Nurds" (orange) + "Code" (cyan) split wordmark + gradient-trim
 *     legal panel for visual punctuation
 *
 * Theme-agnostic — uses hsl(var(--token)) inline styles for brand colors not
 * mapped to Tailwind utilities. Drops cleanly under a light or dark page.
 *
 * Customer-safe: no internal tool/model/provider names. Phase 2 wires:
 *   • newsletter submit → real list provider
 */
export interface SiteFooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const NAV_COMPANY: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Mission & Values", href: "/about#mission" },
  { label: "Team", href: "/about#team" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];

const NAV_PLATFORM: FooterLink[] = [
  { label: "Learn", href: "/learn" },
  { label: "Build", href: "/build" },
  { label: "V.I.B.E.", href: "/vibe" },
  { label: "Pricing", href: "/pricing" },
];

const NAV_COMMUNITY: FooterLink[] = [
  { label: "The Tribe", href: "/tribe" },
  { label: "Documentation", href: "/docs" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const NAV_LEGAL: FooterLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Security Policy", href: "/security" },
  { label: "Cookie Policy", href: "/cookies" },
];

const SISTER_SITES: FooterLink[] = [
  { label: "Coastal Brewing", href: "https://brewing.foai.cloud/", external: true },
  { label: "Per|Form", href: "https://perform.foai.cloud/", external: true },
  { label: "AI Managed Solutions", href: "https://aimanagedsolutions.cloud/", external: true },
];

const SOCIAL_LINKS: { label: string; href: string; symbol: string }[] = [
  { label: "GitHub", href: "https://github.com/", symbol: "code" },
  { label: "X", href: "https://x.com/", symbol: "alternate_email" },
  { label: "LinkedIn", href: "https://linkedin.com/", symbol: "work" },
  { label: "Discord", href: "https://discord.com/", symbol: "forum" },
  { label: "Instagram", href: "https://instagram.com/", symbol: "photo_camera" },
];

export default function SiteFooter({ className = "" }: SiteFooterProps) {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Phase 2 wires newsletter
    console.log("Phase 2 wires newsletter", email);
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer
      className={`w-full py-16 lg:py-24 border-t border-border bg-card text-muted-foreground ${className}`}
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        {/* ============== 5-COL GRID (per IMG_1876) ============== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand block — drip-NURD wordmark + tagline (IMG_1882 dual-color split) */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="font-sans font-extrabold text-3xl tracking-tighter">
                <span
                  style={{
                    color: "hsl(var(--neon-orange))",
                    textShadow: "0 0 10px hsl(var(--neon-orange) / 0.5)",
                  }}
                >
                  Nurds
                </span>
                <span
                  style={{
                    color: "hsl(var(--neon-cyan))",
                    textShadow: "0 0 10px hsl(var(--neon-cyan) / 0.5)",
                  }}
                >
                  Code
                </span>
              </h2>
            </Link>
            <p className="font-sans text-base text-foreground">
              Think It. Prompt It.
              <br />
              Let's Build It.
            </p>
            <p className="text-sm">Join The Tribe of Nurds.</p>
          </div>

          {/* Company nav */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-mono text-xs uppercase text-foreground tracking-widest">
              Company
            </h3>
            <ul className="space-y-2">
              {NAV_COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform nav */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-mono text-xs uppercase text-foreground tracking-widest">
              Platform
            </h3>
            <ul className="space-y-2">
              {NAV_PLATFORM.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community nav */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-mono text-xs uppercase text-foreground tracking-widest">
              Community
            </h3>
            <ul className="space-y-2">
              {NAV_COMMUNITY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter capture */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <h3 className="font-mono text-xs uppercase text-foreground tracking-widest">
              Newsletter Signup
            </h3>
            <p className="text-sm">
              Drop your email. Build updates, manifesto drops, and tribe news —
              no spam.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@nurd.email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  className="w-full bg-background border border-border rounded-lg py-3 pl-4 pr-14 text-sm text-foreground focus:outline-none focus:ring-2 transition-all"
                  style={{ caretColor: "hsl(var(--neon-green))" }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "hsl(var(--neon-green))",
                    color: "#0b0e14",
                    boxShadow: "0 0 12px hsl(var(--neon-green) / 0.45)",
                  }}
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Legal nav (full row on mobile, last col span on lg) */}
          <div className="space-y-4 lg:col-span-12">
            <h3 className="font-mono text-xs uppercase text-foreground tracking-widest">
              Legal
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* divider */}
        <div className="border-t border-border my-12" />

        {/* ============== SOCIAL ROW + SISTER-VERTICAL STRIP (IMG_1876) ============== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border transition-all hover:border-[hsl(var(--neon-green))] hover:text-foreground"
              >
                <span className="material-symbols-outlined text-base">
                  {s.symbol}
                </span>
              </a>
            ))}
          </div>

          <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
            {SISTER_SITES.map((site, idx) => (
              <span key={site.href} className="flex items-center gap-x-4">
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  {site.label}
                </a>
                {idx < SISTER_SITES.length - 1 && (
                  <span className="text-border" aria-hidden>
                    &bull;
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* ============== LEGAL BAR (IMG_1882 gradient trim) ============== */}
        <div
          className="mt-12 rounded-lg p-px"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--neon-orange)), hsl(var(--neon-cyan)))",
            boxShadow:
              "0 0 18px hsl(var(--neon-cyan) / 0.18), 0 0 18px hsl(var(--neon-orange) / 0.18)",
          }}
        >
          <div className="bg-background rounded-[7px] px-6 py-4 text-center text-sm">
            <p>&copy; {year} NurdsCode. All Rights Reserved. Master the Void.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
