import { useState } from "react";
import { Link } from "wouter";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

/**
 * NavBar — global top navigation bar (drip-NURD identity).
 *
 * Source: `_tailwind-pages/IMG_1843.html`. Clipped-polygon green-bordered
 * container, drip-NURD logo + "Think It. Prompt It. Let's Build It." tagline,
 * gold "JOIN THE TRIBE" CTA, hover-dropdown nav, search, theme toggle,
 * gold LOGIN / SIGN UP, account avatar dropdown.
 *
 * Theme-agnostic — uses hsl(var(--token)) inline styles for brand colors not
 * mapped to Tailwind utilities. Caller decides light/dark theme via the
 * existing ThemeProvider on documentElement.
 *
 * Customer-safe: no internal tool/model/provider names. Phase 2 wires:
 *   • search submit → real query handler
 *   • avatar Logout → POST /api/logout
 *   • newsletter (lives in SiteFooter) → real list provider
 */
export interface NavBarProps {
  className?: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

interface NavLinkConfig {
  label: string;
  href: string;
  active?: boolean;
  highlight?: "gold" | "green";
  children?: DropdownItem[];
}

const NAV_LINKS: NavLinkConfig[] = [
  { label: "Home", href: "/", active: true, highlight: "gold" },
  {
    label: "Learn",
    href: "/learn",
    highlight: "green",
    children: [
      { label: "V.I.B.E.", href: "/vibe" },
      { label: "Learning Paths", href: "/learn" },
    ],
  },
  {
    label: "Build",
    href: "/build",
    children: [
      { label: "Code Editor", href: "/build" },
      { label: "Tools", href: "/build#tools" },
    ],
  },
  { label: "Community", href: "/tribe" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Achievemor", href: "/about" },
      { label: "Nurd Initiative", href: "/summer-initiative" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact", highlight: "green" },
];

export default function NavBar({ className = "" }: NavBarProps) {
  const [search, setSearch] = useState("");
  const { themeMode, setThemeMode } = useTheme();

  const isDark =
    themeMode === "dark" ||
    (themeMode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Phase 2 wires search
    console.log("Phase 2 wires search", search);
    setSearch("");
  };

  const handleLogout = () => {
    /* Phase 2: POST /api/logout */
  };

  // Clip-path polygon: outer wrapper (carries the green glow drop-shadow) +
  // inner wrapper (carries the green border + surface fill). Matches IMG_1843.
  const clipPolygon =
    "polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), 98% 100%, 2% 100%, 0% calc(100% - 24px))";

  return (
    <header className={`w-full py-6 px-4 ${className}`}>
      <div
        className="w-full max-w-[1440px] mx-auto"
        style={{
          clipPath: clipPolygon,
          filter: "drop-shadow(0 0 15px hsl(var(--neon-green) / 0.6))",
        }}
      >
        <div
          className="relative bg-card/80 backdrop-blur-lg p-4"
          style={{
            clipPath: clipPolygon,
            border: "2px solid hsl(var(--neon-green))",
          }}
        >
          {/* gold accent line near top */}
          <div
            className="absolute top-4 left-1/4 right-1/4 h-px opacity-50"
            style={{
              background:
                "linear-gradient(to right, transparent, hsl(var(--accent-gold)), transparent)",
            }}
          />

          <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
            {/* ============== LEFT: drip-NURD wordmark + tagline + JOIN CTA ============== */}
            <div className="flex items-end gap-4">
              <Link href="/" className="block">
                <div>
                  <div
                    className="font-sans font-extrabold text-3xl tracking-tighter"
                    style={{
                      color: "hsl(var(--neon-green))",
                      textShadow: "0 0 12px hsl(var(--neon-green) / 0.7)",
                    }}
                  >
                    NURD
                  </div>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mt-2"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    Think It. Prompt It. Let's Build It.
                  </p>
                </div>
              </Link>
              <Link
                href="/auth?intent=join-tribe"
                className="flex items-center gap-1 font-mono uppercase tracking-wider text-xs px-4 py-2 rounded-md transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: "hsl(var(--accent-gold))",
                  color: "#0b0e14",
                }}
              >
                JOIN THE TRIBE
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </Link>
            </div>

            {/* ============== CENTER: nav links with hover dropdowns ============== */}
            <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider">
              {NAV_LINKS.map((link) => {
                const baseColor =
                  link.highlight === "gold"
                    ? "hsl(var(--accent-gold))"
                    : link.highlight === "green"
                      ? "hsl(var(--neon-green))"
                      : undefined;

                if (link.children) {
                  return (
                    <div key={link.label} className="relative group">
                      <button
                        type="button"
                        className="flex items-center gap-1 transition-colors hover:text-foreground"
                        style={baseColor ? { color: baseColor } : { color: "hsl(var(--muted-foreground))" }}
                      >
                        {link.label}
                        <span className="material-symbols-outlined text-lg">
                          expand_more
                        </span>
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-card rounded-lg shadow-lg border border-border hidden group-hover:block z-20 overflow-hidden">
                        {link.children.map((child) => (
                          <Link
                            key={child.href + child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={`transition-colors hover:text-foreground ${
                      link.active ? "border-b pb-1" : ""
                    }`}
                    style={
                      link.active
                        ? {
                            color: "hsl(var(--accent-gold))",
                            borderColor: "hsl(var(--accent-gold))",
                          }
                        : baseColor
                          ? { color: baseColor }
                          : { color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ============== RIGHT: search, theme toggle, login/signup, avatar ============== */}
            <div className="flex items-center gap-3">
              {/* search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search"
                  className="bg-card border border-border rounded-full py-1 pl-4 pr-8 text-sm w-32 focus:w-40 transition-all focus:outline-none focus:ring-1"
                  style={{
                    // ring color via inline focus token won't apply on focus; rely on Tailwind utility
                  }}
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined text-base">
                    search
                  </span>
                </button>
              </form>

              {/* theme toggle (light/dark pair, gold-active per source) */}
              <div className="flex items-center bg-card border border-border rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setThemeMode("light")}
                  aria-label="Switch to light theme"
                  aria-pressed={!isDark}
                  className="p-1 rounded-full transition-colors"
                  style={
                    !isDark
                      ? {
                          background: "hsl(var(--accent-gold))",
                          color: "#0b0e14",
                        }
                      : { color: "hsl(var(--muted-foreground))" }
                  }
                >
                  <Sun className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode("dark")}
                  aria-label="Switch to dark theme"
                  aria-pressed={isDark}
                  className="p-1 rounded-full transition-colors"
                  style={
                    isDark
                      ? {
                          background: "hsl(var(--accent-gold))",
                          color: "#0b0e14",
                        }
                      : { color: "hsl(var(--muted-foreground))" }
                  }
                >
                  <Moon className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {/* login / signup */}
              <Link
                href="/auth"
                className="font-mono uppercase tracking-wider text-xs px-3 py-2 rounded-md transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: "hsl(var(--accent-gold))",
                  color: "#0b0e14",
                }}
              >
                LOGIN / SIGN UP
              </Link>

              {/* account avatar with dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  aria-label="Account menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-transform active:scale-95"
                  style={{
                    background: "hsl(var(--neon-green))",
                    color: "#0b0e14",
                  }}
                >
                  <span className="material-symbols-outlined text-xl">
                    account_circle
                  </span>
                </button>
                <div className="absolute top-full right-0 mt-4 w-48 bg-card rounded-lg shadow-lg border border-border hidden group-hover:block z-20 overflow-hidden">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/account/settings"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
