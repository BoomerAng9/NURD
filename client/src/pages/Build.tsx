import { Link } from "wouter";

/**
 * /build — V.I.B.E. coding environment overview surface.
 *
 * Combines IMG_1858 (V.I.B.E. learner ↔ Pro editor split) + IMG_1859
 * (Build features matrix) into a single deeper-build page.
 *
 * Internal tool names from the source mockup ARE SCRUBBED per
 * `feedback_never_publish_internal_tool_names.md`:
 *   • "OpenAI / Groq" → "Multi-model AI access"
 *   • "Cloudflare Workers / D1 / Docker / Modal" → function-name labels
 *   • Stripe logo overlay removed → no payment branding visible
 *   • "Image Locker (Admin)" → operator-only, NOT shown on customer page
 *
 * Phase 1: marketing/overview surface. Phase 2 (deferred): the actual
 * interactive code editor (Monaco + AI completions + live execution).
 */
export default function Build() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <main className="container mx-auto max-w-[1400px] px-4 py-12 sm:px-8 sm:py-20">
        {/* ============== HEADLINE ============== */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="font-sans font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tighter inline-block"
            style={{
              color: "hsl(var(--neon-cyan))",
              textShadow:
                "0 0 24px hsl(var(--neon-cyan) / 0.5), 0 0 80px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            BUILD
          </h1>
          <p className="font-mono uppercase tracking-wordmark text-[12px] text-muted-foreground mt-4">
            Professional development tools for builders.
          </p>
        </div>

        {/* ============== V.I.B.E. ↔ PRO SPLIT (from IMG_1858) ============== */}
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] items-center gap-8 xl:gap-4 mb-16 md:mb-24">
          {/* V.I.B.E. — learner */}
          <div
            className="bg-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
            style={{
              border: "1px solid hsl(var(--neon-green) / 0.4)",
              boxShadow: "0 0 32px hsl(var(--neon-green) / 0.18)",
            }}
          >
            <div>
              <h2
                className="font-sans font-bold text-3xl md:text-4xl tracking-tight"
                style={{ color: "hsl(var(--neon-green))" }}
              >
                V.I.B.E.
              </h2>
              <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mt-1">
                Vibrant Imagination Build Environment
              </p>
              <p className="text-base md:text-lg text-foreground/90 mt-4 leading-relaxed">
                AI-paired coding for builders. Operator-grade workbench, not a wizard.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <FeatureSquare icon="menu_book" label="Interactive lessons" accent="green" />
              <FeatureSquare icon="edit_note" label="Guided projects" accent="green" />
              <FeatureSquare icon="smart_toy" label="AI assistance" accent="green" />
            </div>
            {/* TODO: replace with extracted asset from IMG_1858 — youth coder on hover-skateboard with V.I.B.E. UI + AI mascot */}
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-secondary border border-border">
              <img
                src="https://placehold.co/600x450/16222E/39FF14?text=V.I.B.E."
                alt="V.I.B.E. UI"
                data-alt="Young builder on hover-skateboard next to a visual block-based coding interface with friendly AI mascot."
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              href="/access-ai"
              className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95"
              style={{
                background: "hsl(var(--neon-green))",
                color: "hsl(var(--background))",
                boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
              }}
            >
              Open V.I.B.E. →
            </Link>
          </div>

          {/* Center connector */}
          <div className="flex flex-col items-center gap-4 text-center py-8 px-4">
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Seamless progression
            </p>
            <span
              className="material-symbols-outlined text-6xl"
              style={{ color: "hsl(var(--accent-gold))" }}
            >
              trending_up
            </span>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground max-w-[10rem]">
              Graduate from learner to pro
            </p>
          </div>

          {/* Pro Editor — advanced */}
          <div
            className="bg-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
            style={{
              border: "1px solid hsl(var(--accent-gold) / 0.4)",
              boxShadow: "0 0 32px hsl(var(--accent-gold) / 0.18)",
            }}
          >
            <div>
              <h2
                className="font-sans font-bold text-3xl md:text-4xl tracking-tight"
                style={{ color: "hsl(var(--accent-gold))" }}
              >
                Pro Editor
              </h2>
              <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mt-1">
                Real execution, real feedback
              </p>
              <p className="text-base md:text-lg text-foreground/90 mt-4 leading-relaxed">
                Real-time execution and advanced development tools. Build with power.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <FeatureSquare icon="translate" label="Multi-language" accent="gold" />
              <FeatureSquare icon="psychology" label="AI code gen" accent="gold" />
              <FeatureSquare icon="bug_report" label="Live debugging" accent="gold" />
            </div>
            {/* TODO: replace with extracted asset from IMG_1858 — pro developer at hologram editor with AI assistant */}
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-secondary border border-border">
              <img
                src="https://placehold.co/600x450/16222E/FFB700?text=Pro+Editor"
                alt="Pro Editor"
                data-alt="Professional developer using a futuristic holographic code editor with AI assistant."
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              href="/code-playground"
              className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 border-2"
              style={{
                borderColor: "hsl(var(--accent-gold))",
                color: "hsl(var(--accent-gold))",
              }}
            >
              Open Pro Editor →
            </Link>
          </div>
        </section>

        {/* ============== FEATURES MATRIX (from IMG_1859) ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advanced Code Editor */}
          <FeatureCard label="Advanced Code Editor">
            <div className="relative rounded-lg overflow-hidden border border-border">
              {/* TODO: replace with extracted asset from IMG_1859 — dark code editor screenshot */}
              <img
                src="https://placehold.co/800x500/16222E/E1E2EB?text=Code+Editor"
                alt="Code editor"
                data-alt="Dark-themed code editor with multiple language tabs and syntax highlighting."
                className="w-full h-auto"
              />
            </div>
            <BulletList
              items={[
                "Real-time code execution",
                "Multi-language support (JS, Python, more)",
                "Syntax highlighting & intelligent completions",
                "Live debugging",
                "Project file system",
              ]}
            />
          </FeatureCard>

          {/* AI-Powered Development */}
          <FeatureCard label="AI-Paired Development">
            <div className="rounded-lg overflow-hidden border border-border bg-secondary p-8">
              <div className="grid grid-cols-3 gap-4 items-center justify-center">
                <span
                  className="material-symbols-outlined text-5xl mx-auto"
                  style={{ color: "hsl(var(--neon-cyan))" }}
                >
                  psychology
                </span>
                <span
                  className="material-symbols-outlined text-5xl mx-auto"
                  style={{ color: "hsl(var(--accent-gold))" }}
                >
                  bolt
                </span>
                <span
                  className="material-symbols-outlined text-5xl mx-auto"
                  style={{ color: "hsl(var(--neon-green))" }}
                >
                  code
                </span>
              </div>
              <p className="text-center text-xs font-mono uppercase tracking-wordmark text-muted-foreground mt-4">
                Multi-model AI access · Reasoning lane · Code-gen lane
              </p>
            </div>
            <BulletList
              items={[
                "Code generation & explanation",
                "Intelligent suggestions",
                "Prompt engineering tools",
                "Multi-model reasoning lane",
              ]}
            />
          </FeatureCard>

          {/* Real-time Collaboration */}
          <FeatureCard label="Real-time Collaboration">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0 md:w-1/2">
                {/* TODO: replace with extracted asset from IMG_1859 — multi-cursor collab UI */}
                <img
                  src="https://placehold.co/400x400/16222E/E1E2EB?text=Collab"
                  alt="Collaboration"
                  data-alt="Code editor with multiple cursors and user avatars showing real-time collaboration."
                  className="w-full h-auto rounded-lg border border-border"
                />
              </div>
              <BulletList
                items={[
                  "WebSocket collaboration",
                  "Team workspace & sharing",
                  "Code review & commenting",
                  "Pair programming",
                ]}
              />
            </div>
          </FeatureCard>

          {/* Professional Deployment & Infrastructure — TOOL NAMES SCRUBBED */}
          <FeatureCard label="Deployment & Infrastructure">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-6 text-center">
              <InfraTile icon="bolt" label="Edge runtime" />
              <InfraTile icon="database" label="Realtime DB" />
              <InfraTile icon="package_2" label="Container runtime" />
              <InfraTile icon="memory" label="Serverless inference" />
              <InfraTile icon="folder_managed" label="Project mgmt" />
            </div>
            <BulletList
              items={[
                "Serverless architecture",
                "Version control integration",
                "Authentication & user management",
                "Subscription tiers",
                "File upload & project management",
                "Analytics dashboard",
              ]}
            />
          </FeatureCard>
        </div>

        {/* ============== CTA STRIP ============== */}
        <section className="mt-16 md:mt-24 text-center max-w-3xl mx-auto">
          <h3 className="font-sans font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-6">
            Ready to ship?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/access-ai"
              className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-8 py-4 rounded-lg transition-all active:scale-95"
              style={{
                background: "hsl(var(--neon-green))",
                color: "hsl(var(--background))",
                boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
              }}
            >
              Start with V.I.B.E.
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-8 py-4 rounded-lg transition-all active:scale-95 border-2"
              style={{
                borderColor: "hsl(var(--accent-gold))",
                color: "hsl(var(--accent-gold))",
              }}
            >
              See pricing
            </Link>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="border-t border-border mt-16 md:mt-24 pt-8">
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
        </footer>
      </main>
    </div>
  );
}

interface FeatureSquareProps {
  icon: string;
  label: string;
  accent: "green" | "gold";
}

function FeatureSquare({ icon, label, accent }: FeatureSquareProps) {
  const color = accent === "green" ? "hsl(var(--neon-green))" : "hsl(var(--accent-gold))";
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="material-symbols-outlined text-3xl" style={{ color }}>
        {icon}
      </span>
      <span className="font-mono uppercase tracking-wordmark text-[10px] text-foreground">{label}</span>
    </div>
  );
}

interface FeatureCardProps {
  label: string;
  children: React.ReactNode;
}

function FeatureCard({ label, children }: FeatureCardProps) {
  return (
    <article
      className="bg-card rounded-xl p-6 flex flex-col gap-6"
      style={{
        border: "1px solid hsl(var(--neon-cyan) / 0.25)",
        boxShadow: "0 0 24px hsl(var(--neon-cyan) / 0.12)",
      }}
    >
      <h2
        className="font-mono uppercase tracking-wordmark text-[11px]"
        style={{ color: "hsl(var(--neon-cyan))" }}
      >
        {label}
      </h2>
      {children}
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-base text-foreground/90">
      {items.map((it) => (
        <li key={it} className="flex items-start">
          <span className="mr-3 mt-1.5 text-xs" style={{ color: "hsl(var(--neon-cyan))" }}>
            •
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function InfraTile({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-12 w-12 rounded-lg grid place-items-center bg-secondary"
        style={{ border: "1px solid hsl(var(--neon-cyan) / 0.3)" }}
      >
        <span className="material-symbols-outlined" style={{ color: "hsl(var(--neon-cyan))" }}>
          {icon}
        </span>
      </div>
      <span className="font-mono uppercase tracking-wordmark text-[9px] text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
