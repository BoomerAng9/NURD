import { Link } from "wouter";

/**
 * /agents — Voice Assistant agent showcase.
 *
 * Derived from owner mockup IMG_1863 (Sockeye Financial phone-mock, deeper-build dark canon).
 * The mockup shows a fictional banking sample app demonstrating a voice-driven agent
 * in production. We frame that mock as one of the "what you can build" samples and
 * surround it with NurdsCode page chrome explaining the Voice Assistant agent
 * capability + a CTA into V.I.B.E.
 *
 * Customer-safe per `feedback_never_publish_internal_tool_names.md`:
 *   • "Sockeye Financial" — fictional sample customer per design canon. Demo content, kept.
 *   • Voice surface is a CSS-animated waveform placeholder. Phase 2 wires the live
 *     Gemini 3.1 Flash Live capture via `voice_relay` (see `docs/VOICE_INTEGRATION.md`).
 *   • No internal tool/model/provider names surface anywhere on this page.
 *
 * Phase 1: marketing/showcase surface. Phase 2 (deferred): live mic capture +
 * function-call dispatch on the demo handset.
 */
export default function Agents() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <main className="container mx-auto max-w-[1400px] px-4 py-12 sm:px-8 sm:py-20">
        {/* ============== HEADLINE ============== */}
        <header className="text-center mb-12 md:mb-16">
          <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-3">
            Agent Showcase
          </p>
          <h1
            className="font-sans font-extrabold text-6xl sm:text-7xl md:text-8xl tracking-tighter inline-block"
            style={{
              color: "hsl(var(--neon-cyan))",
              textShadow:
                "0 0 24px hsl(var(--neon-cyan) / 0.5), 0 0 80px hsl(var(--neon-cyan) / 0.25)",
            }}
          >
            VOICE ASSISTANT
          </h1>
          <p className="text-base md:text-lg text-foreground/80 mt-6 max-w-2xl mx-auto leading-relaxed">
            Drop a voice agent into any app. Real-time speech, function calls, and
            confirmation flows — production-grade, not a wizard.
          </p>
        </header>

        {/* ============== SHOWCASE: PHONE MOCK + EXPLAINER ============== */}
        <section className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-start mb-20 md:mb-28">
          {/* PHONE MOCK — direct conversion of IMG_1863 */}
          <div className="mx-auto lg:mx-0">
            <PhoneMock />
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground text-center mt-4">
              Sample build — fictional customer
            </p>
          </div>

          {/* EXPLAINER */}
          <div className="flex flex-col gap-8 max-w-xl">
            <div>
              <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-2">
                What you can build
              </p>
              <h2
                className="font-sans font-bold text-3xl md:text-4xl tracking-tight"
                style={{ color: "hsl(var(--accent-gold))" }}
              >
                Sockeye Financial
              </h2>
              <p className="text-base md:text-lg text-foreground/80 mt-3 leading-relaxed">
                A fictional banking app demonstrating a Voice Assistant agent in
                production: balance lookup, transfer confirmation, anomaly alerts —
                all by voice, with on-screen confirmation before any sensitive action
                executes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Capability icon="record_voice_over" label="Real-time speech" accent="cyan" />
              <Capability icon="hub" label="Function calling" accent="green" />
              <Capability icon="task_alt" label="Two-step confirm" accent="gold" />
              <Capability icon="shield" label="Anomaly alerts" accent="red" />
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-4">
              <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
                Voice substrate
              </p>
              <ul className="text-sm text-foreground/85 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] mt-0.5"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    check_circle
                  </span>
                  Sub-second push-to-talk latency
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] mt-0.5"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    check_circle
                  </span>
                  Function calls dispatched to your backend
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] mt-0.5"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    check_circle
                  </span>
                  Confirmation gates for irreversible actions
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] mt-0.5"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    check_circle
                  </span>
                  Drop-in WebSocket relay — bring your own UI
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/access-ai"
                className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-transform active:scale-95"
                style={{
                  background: "hsl(var(--neon-green))",
                  color: "hsl(var(--background))",
                  boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                }}
              >
                Build your own agent →
              </Link>
              <Link
                href="/build"
                className="inline-flex items-center justify-center font-mono uppercase tracking-wordmark text-[11px] px-6 py-3 rounded-lg transition-transform active:scale-95 border-2"
                style={{
                  borderColor: "hsl(var(--accent-gold))",
                  color: "hsl(var(--accent-gold))",
                }}
              >
                Open Pro Editor
              </Link>
            </div>
          </div>
        </section>

        {/* ============== AGENT CATALOG (forward-looking) ============== */}
        <section>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-2">
                More agents coming
              </p>
              <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-foreground">
                The agent library
              </h2>
            </div>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Voice Assistant available now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              icon="record_voice_over"
              accent="cyan"
              title="Voice Assistant"
              status="available"
              blurb="Real-time speech in/out with function calls. Drop into web or mobile."
            />
            <AgentCard
              icon="auto_awesome"
              accent="gold"
              title="Pair Programmer"
              status="coming-soon"
              blurb="AI-paired coding inside V.I.B.E. — refactor, debug, explain on demand."
            />
            <AgentCard
              icon="schema"
              accent="green"
              title="Workflow Runner"
              status="coming-soon"
              blurb="Recipe execution: chain tools, gate steps, hand off to humans when needed."
            />
            <AgentCard
              icon="psychology"
              accent="cyan"
              title="Research Lane"
              status="coming-soon"
              blurb="Multi-source research with citations and structured summaries."
            />
            <AgentCard
              icon="image_search"
              accent="gold"
              title="Vision Reader"
              status="coming-soon"
              blurb="Read documents, screenshots, and diagrams. Extract, classify, route."
            />
            <AgentCard
              icon="travel_explore"
              accent="green"
              title="Browser Operator"
              status="coming-soon"
              blurb="Headless browser tasks: form fills, scrapes, multi-step web flows."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============== PHONE MOCK ============== */
/* Direct conversion of the IMG_1863 phone frame — preserves the Sockeye Financial
 * fictional sample exactly as the mockup composes it. The "accent red" tint
 * (originally the Sockeye brand color #ff5a79) is mapped to a destructive-ish red
 * inline so the mock reads as a third-party brand, not the NurdsCode palette. */
function PhoneMock() {
  // Sockeye-brand sample red (fictional customer accent); not a NurdsCode brand color.
  const sockeyeRed = "#ff5a79";

  return (
    <div className="w-full max-w-[400px] mx-auto bg-gray-800 rounded-[48px] p-2 border-4 border-gray-700 shadow-2xl shadow-black/50">
      <div className="bg-black rounded-[40px] h-[844px] overflow-hidden relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-xl z-20" />

        <div
          className="p-3 pt-10 h-full overflow-y-auto flex flex-col space-y-2.5 text-white/90"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            fontFamily: "'VT323', monospace",
          }}
        >
          {/* Brand panel */}
          <GlassPanel>
            <CornerDots />
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-md border"
                style={{
                  background: `${sockeyeRed}1a`,
                  borderColor: `${sockeyeRed}4d`,
                }}
              >
                {/* TODO: replace with extracted asset from IMG_1863 — Sockeye fish logo, glowing red */}
                <img
                  src="https://placehold.co/40x40/ff5a79/ff5a79?text=."
                  data-alt="Sockeye fish logo, glowing red"
                  alt=""
                  className="w-10 h-10"
                />
              </div>
              <span
                className="text-2xl leading-none tracking-widest"
                style={{ color: sockeyeRed, textShadow: `0 0 10px ${sockeyeRed}b3` }}
              >
                SOCKEYE
                <br />
                FINANCIAL
              </span>
            </div>
          </GlassPanel>

          {/* Voice assistant active */}
          <GlassPanel>
            <CornerDots />
            <div className="flex items-center justify-between w-full">
              <span className="text-lg leading-tight tracking-wider">
                VOICE ASSISTANT
                <br />
                ACTIVE
              </span>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-md border"
                style={{
                  background: `${sockeyeRed}1a`,
                  borderColor: `${sockeyeRed}4d`,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: sockeyeRed, textShadow: `0 0 10px ${sockeyeRed}b3` }}
                >
                  mic
                </span>
              </div>
            </div>
          </GlassPanel>

          {/* Waveform + balance */}
          <GlassPanel className="p-4 flex-col items-center gap-2">
            <CornerDots all />
            {/* CSS-animated waveform — Phase 2 swaps in live capture */}
            <div className="w-full flex items-center justify-center gap-[2px] h-[60px] my-2">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className="block w-1 rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.abs(Math.sin(i * 0.45)) * 80}%`,
                    background: sockeyeRed,
                    opacity: 0.4 + Math.abs(Math.sin(i * 0.45)) * 0.5,
                    animationDelay: `${(i % 12) * 80}ms`,
                    animationDuration: "1.4s",
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              <span className="text-3xl tracking-wider">BALANCE: $12,450.80</span>
              <p className="text-sm text-white/60 tracking-wide" style={{ fontFamily: "Lexend, sans-serif" }}>
                Available Funds
              </p>
            </div>
          </GlassPanel>

          {/* User bubble */}
          <div className="flex flex-col items-end space-y-2 pt-2">
            <div
              className="rounded-xl rounded-br-none p-3 max-w-xs self-end"
              style={{
                background: "#272a31",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              <p className="text-white/90">Transfer $500 to savings</p>
            </div>
          </div>

          {/* Agent reply */}
          <div className="flex flex-col items-start space-y-2">
            <div
              className="rounded-xl p-3 flex items-center gap-3 max-w-xs"
              style={{
                background: "rgba(29, 32, 38, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border"
                style={{
                  background: `${sockeyeRed}1a`,
                  borderColor: `${sockeyeRed}4d`,
                }}
              >
                {/* TODO: replace with extracted asset from IMG_1863 — Sockeye fish head icon */}
                <img
                  src="https://placehold.co/24x24/ff5a79/ff5a79?text=."
                  data-alt="Sockeye fish head icon, glowing red"
                  alt=""
                  className="w-6 h-6"
                />
              </div>
              <p
                className="text-sm text-white/80 leading-snug"
                style={{ fontFamily: "Lexend, sans-serif" }}
              >
                Confirming transfer of $500 to Savings. Say "Confirm" to proceed.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <GlassPanel className="gap-2">
            <CornerDots all />
            <button
              type="button"
              className="w-1/2 font-bold py-3 rounded-md text-xl tracking-widest text-black"
              style={{
                background: sockeyeRed,
                boxShadow: `0 0 20px ${sockeyeRed}80`,
              }}
            >
              PAY NOW
            </button>
            <button
              type="button"
              className="w-1/2 py-3 rounded-md text-sm tracking-wider border"
              style={{ borderColor: sockeyeRed, color: sockeyeRed }}
            >
              CONFIRM TRANSFER
            </button>
          </GlassPanel>

          {/* Sliders / transactions */}
          <div
            className="rounded-lg p-3 relative flex flex-col gap-4"
            style={{
              background: "rgba(29, 32, 38, 0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="relative w-full h-2 flex items-center">
              <div className="w-full h-0.5 bg-white/20 rounded-full" />
              <div
                className="absolute left-1/2 w-4 h-4 -translate-x-1/2 rounded-sm border"
                style={{ background: "#272a31", borderColor: "rgba(255,255,255,0.3)" }}
              />
            </div>
            <div
              className="rounded-md p-2 text-sm text-white/70 leading-relaxed"
              style={{ background: "rgba(25, 28, 34, 0.5)", fontFamily: "Lexend, sans-serif" }}
            >
              <p>Coffee Shop - $4.50</p>
              <p>Rent Payment - $1,200.00</p>
              <p>Salary Deposit - $4,500.00</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-1/2">
                <span className="material-symbols-outlined text-white/50 text-lg">credit_card</span>
                <div className="relative w-full h-2 flex items-center">
                  <div className="w-full h-0.5 bg-white/20 rounded-full" />
                  <div
                    className="absolute left-1/4 w-3 h-3 -translate-x-1/2 rounded-sm border"
                    style={{ background: "#272a31", borderColor: "rgba(255,255,255,0.3)" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/2">
                <span className="material-symbols-outlined text-white/50 text-lg">volume_up</span>
                <div className="relative w-full h-2 flex items-center">
                  <div className="w-full h-0.5 bg-white/20 rounded-full" />
                  <div
                    className="absolute left-3/4 w-3 h-3 -translate-x-1/2 rounded-sm border"
                    style={{ background: "#272a31", borderColor: "rgba(255,255,255,0.3)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warning bar */}
          <div
            className="rounded-lg p-2 relative flex items-center justify-center gap-2 text-sm tracking-wide"
            style={{
              background: "rgba(29, 32, 38, 0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${sockeyeRed}80`,
              color: sockeyeRed,
            }}
          >
            <span className="material-symbols-outlined text-base">warning</span>
            <span>WARNING: Unusual activity detected. Verify.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== SUB-COMPONENTS ============== */

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg p-2.5 relative flex items-center justify-between ${className}`}
      style={{
        background: "rgba(29, 32, 38, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {children}
    </div>
  );
}

function CornerDots({ all = false }: { all?: boolean }) {
  return (
    <>
      <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-white/20" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white/20" />
      {all && (
        <>
          <span className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-white/20" />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-white/20" />
        </>
      )}
    </>
  );
}

type Accent = "cyan" | "green" | "gold" | "red";

function accentColor(a: Accent): string {
  switch (a) {
    case "cyan":
      return "hsl(var(--neon-cyan))";
    case "green":
      return "hsl(var(--neon-green))";
    case "gold":
      return "hsl(var(--accent-gold))";
    case "red":
      return "hsl(var(--destructive))";
  }
}

function Capability({
  icon,
  label,
  accent,
}: {
  icon: string;
  label: string;
  accent: Accent;
}) {
  const color = accentColor(accent);
  return (
    <div
      className="bg-card rounded-xl p-4 flex items-center gap-3 border border-border"
      style={{ boxShadow: `0 0 20px ${color.replace(")", " / 0.08)")}` }}
    >
      <span className="material-symbols-outlined text-2xl" style={{ color }}>
        {icon}
      </span>
      <span className="font-mono uppercase tracking-wordmark text-[11px] text-foreground/90">
        {label}
      </span>
    </div>
  );
}

function AgentCard({
  icon,
  accent,
  title,
  status,
  blurb,
}: {
  icon: string;
  accent: Accent;
  title: string;
  status: "available" | "coming-soon";
  blurb: string;
}) {
  const color = accentColor(accent);
  const isAvailable = status === "available";

  return (
    <div
      className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-4 transition-transform hover:-translate-y-1"
      style={{
        boxShadow: isAvailable ? `0 0 28px ${color.replace(")", " / 0.18)")}` : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="material-symbols-outlined text-3xl" style={{ color }}>
          {icon}
        </span>
        <span
          className="font-mono uppercase tracking-wordmark text-[10px] px-2 py-1 rounded-full border"
          style={{
            color: isAvailable ? "hsl(var(--neon-green))" : "hsl(var(--muted-foreground))",
            borderColor: isAvailable
              ? "hsl(var(--neon-green) / 0.5)"
              : "hsl(var(--border))",
            background: isAvailable
              ? "hsl(var(--neon-green) / 0.1)"
              : "hsl(var(--secondary))",
          }}
        >
          {isAvailable ? "Available" : "Coming Soon"}
        </span>
      </div>
      <h3 className="font-sans font-bold text-xl tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-foreground/75 leading-relaxed">{blurb}</p>
      {isAvailable ? (
        <Link
          href="/access-ai"
          className="font-mono uppercase tracking-wordmark text-[11px] mt-auto"
          style={{ color }}
        >
          Build with this →
        </Link>
      ) : (
        <span className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mt-auto">
          On the roadmap
        </span>
      )}
    </div>
  );
}
