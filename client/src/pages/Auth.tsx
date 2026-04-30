import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

/**
 * /auth — deeper-build canon, derived from owner mockup IMG_1870.
 * 3-column layout: Login + 3-step Registration + Chat with ACHEEVY assist.
 * Wires to existing backend: POST /api/login, POST /api/register, OAuth via
 * GET /api/auth/{google,github,facebook,microsoft}.
 *
 * Phase 1 scope: visual + auth/register form submission to existing endpoints.
 * Phase 2 (deferred): live ACHEEVY chat thread + voice mic capture.
 */
export default function Auth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Login form state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Registration form state — only step 1 wired in Phase 1; steps 2-3 are
  // visual placeholders until owner approves the full multi-step flow.
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPassConfirm, setRegPassConfirm] = useState("");
  const [submittingReg, setSubmittingReg] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginUser || !loginPass) return;
    setSubmittingLogin(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Sign-in failed (${res.status})`);
      }
      toast({ title: "Welcome back, Nurd.", description: "Routing you to your dashboard." });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Sign-in failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleRegisterStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) return;
    if (regPass !== regPassConfirm) {
      toast({ title: "Passwords don't match.", variant: "destructive" });
      return;
    }
    setSubmittingReg(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: regEmail,
          email: regEmail,
          password: regPass,
          fullName: regName,
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Sign-up failed (${res.status})`);
      }
      toast({ title: "Welcome to the Tribe.", description: "Account created." });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Sign-up failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReg(false);
    }
  }

  return (
    <div
      data-theme="deep"
      className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 circuit-bg"
    >
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* ============== HEADER ============== */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 grid place-items-center rounded-lg bg-card border border-border">
              <span className="font-sans font-bold text-2xl text-[hsl(var(--neon-green))]">N</span>
            </div>
            <span className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              NurdsCode
            </span>
          </div>
          <p className="text-muted-foreground mt-2 font-mono uppercase tracking-wordmark text-[11px]">
            Join the Tribe of Nurds
          </p>
        </header>

        {/* ============== MAIN GRID ============== */}
        <main className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── LEFT 8 cols: Login + Registration ── */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LOGIN */}
              <section className="bg-card p-6 sm:p-8 rounded-2xl border border-border flex flex-col gap-6">
                <h2 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
                  Login
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Email/Username"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    autoComplete="username"
                    className="bg-background border-2 rounded-lg p-3 w-full focus:outline-none placeholder:text-muted-foreground/50"
                    style={{ borderColor: "hsl(var(--accent-gold))" }}
                  />
                  <div className="relative">
                    <input
                      type={showLoginPass ? "text" : "password"}
                      placeholder="Password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      autoComplete="current-password"
                      className="bg-background border-2 rounded-lg p-3 w-full pr-12 focus:outline-none placeholder:text-muted-foreground/50"
                      style={{ borderColor: "hsl(var(--neon-green))" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((v) => !v)}
                      aria-label={showLoginPass ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showLoginPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 text-muted-foreground/90 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-background border-border"
                        style={{ accentColor: "hsl(var(--neon-green))" }}
                      />
                      Remember Me
                    </label>
                    <a
                      href="/forgot-password"
                      className="hover:underline"
                      style={{ color: "hsl(var(--accent-gold))" }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLogin}
                    className="font-mono uppercase tracking-wordmark text-[12px] rounded-lg py-3 w-full transition-transform active:scale-95 disabled:opacity-60"
                    style={{
                      background: "hsl(var(--neon-green))",
                      color: "hsl(var(--background))",
                      boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                    }}
                  >
                    {submittingLogin ? "Signing In…" : "Sign In"}
                  </button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a
                    href="#registration"
                    className="font-bold hover:underline"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    Sign Up
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <hr className="flex-grow border-border/60" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <hr className="flex-grow border-border/60" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/api/auth/github"
                    className="bg-secondary border border-border rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">code</span>
                    <span className="font-mono uppercase tracking-wordmark text-[11px]">GitHub</span>
                  </a>
                  <a
                    href="/api/auth/google"
                    className="bg-white text-black border border-border rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">g_translate</span>
                    <span className="font-mono uppercase tracking-wordmark text-[11px]">Google</span>
                  </a>
                </div>

                <button
                  type="button"
                  className="bg-secondary border border-border rounded-lg py-2.5 flex items-center justify-center gap-3 hover:bg-muted transition-colors"
                  aria-label="Sign in with voice (coming soon)"
                  disabled
                  title="Voice sign-in is coming in Phase 2"
                >
                  <span className="material-symbols-outlined" style={{ color: "hsl(var(--accent-gold))" }}>
                    mic
                  </span>
                  <span className="font-mono uppercase tracking-wordmark text-[11px]">
                    Sign in with voice
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wordmark"
                    style={{ color: "hsl(var(--neon-green))" }}
                  >
                    soon
                  </span>
                </button>
              </section>

              {/* REGISTRATION */}
              <section
                id="registration"
                className="bg-card p-6 sm:p-8 rounded-2xl border border-border flex flex-col gap-6"
              >
                <h2 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
                  Registration
                </h2>
                <div>
                  <div className="w-full bg-border/60 rounded-full h-1.5 mb-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: "33%",
                        background: "hsl(var(--neon-green))",
                        boxShadow: "0 0 8px hsl(var(--neon-green) / 0.6)",
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Step 1 of 3: Basic Info</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleRegisterStep1}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    autoComplete="name"
                    className="bg-background border-2 rounded-lg p-3 w-full focus:outline-none placeholder:text-muted-foreground/50"
                    style={{ borderColor: "hsl(var(--accent-gold))" }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="bg-background border-2 rounded-lg p-3 w-full focus:outline-none placeholder:text-muted-foreground/50"
                    style={{ borderColor: "hsl(var(--accent-gold))" }}
                  />
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      autoComplete="new-password"
                      className="bg-background border-2 border-border rounded-lg p-3 w-full pr-12 focus:outline-none focus:border-[hsl(var(--accent-gold))] placeholder:text-muted-foreground/50"
                    />
                    <span className="material-symbols-outlined absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-[20px]">
                      key
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={regPassConfirm}
                      onChange={(e) => setRegPassConfirm(e.target.value)}
                      autoComplete="new-password"
                      className="bg-background border-2 border-border rounded-lg p-3 w-full pr-12 focus:outline-none focus:border-[hsl(var(--accent-gold))] placeholder:text-muted-foreground/50"
                    />
                    <span className="material-symbols-outlined absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-[20px]">
                      sync_lock
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="font-mono uppercase tracking-wordmark text-[12px] rounded-lg py-3 w-full transition-transform active:scale-95 mt-2 disabled:opacity-60"
                    style={{
                      background: "hsl(var(--neon-green))",
                      color: "hsl(var(--background))",
                      boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                    }}
                  >
                    {submittingReg ? "Creating…" : "Next Step"}
                  </button>
                </form>
              </section>
            </div>

            {/* ── RIGHT 4 cols: Chat with ACHEEVY ── */}
            <aside className="lg:col-span-4 bg-card p-6 sm:p-8 rounded-2xl border border-border flex flex-col gap-6">
              <h2 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
                Chat with{" "}
                <span style={{ color: "hsl(var(--accent-gold))" }} className="font-bold">
                  ACHEEVY
                </span>
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full grid place-items-center border-2 shrink-0"
                    style={{
                      background: "hsl(var(--secondary))",
                      borderColor: "hsl(var(--accent-gold))",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: "hsl(var(--neon-cyan))" }}
                    >
                      auto_awesome
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary p-4 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        Hi! I'm{" "}
                        <span className="font-bold" style={{ color: "hsl(var(--accent-gold))" }}>
                          ACHEEVY
                        </span>
                        . Ready to help you build something amazing?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["How to Start", "Tour", "Templates"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-full px-4 py-1.5 text-sm border transition-colors"
                    style={{
                      background: "hsl(var(--accent-gold) / 0.1)",
                      color: "hsl(var(--accent-gold))",
                      borderColor: "hsl(var(--accent-gold) / 0.5)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Voice waveform placeholder (Phase 2 wires the live capture) */}
              <div className="w-full">
                <div className="flex items-center justify-center gap-1 h-10 px-3 bg-secondary rounded-lg">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="block w-1 rounded-full"
                      style={{
                        height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
                        background: "hsl(var(--neon-green))",
                        opacity: 0.3 + Math.abs(Math.sin(i * 0.7)) * 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Voice input (Phase 2)…"
                  disabled
                  className="bg-background border-2 border-border rounded-lg p-3 w-full pr-12 focus:outline-none placeholder:text-muted-foreground/50 disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled
                  aria-label="Send"
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 disabled:opacity-60"
                  style={{ color: "hsl(var(--accent-gold))" }}
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>

              <div className="grid grid-cols-3 text-center pt-4 border-t border-border/60 divide-x divide-border/60">
                <div>
                  <p className="text-xs text-muted-foreground">GitHub Stars</p>
                  <p className="font-sans font-bold text-xl text-foreground">25K+</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">User Count</p>
                  <p className="font-sans font-bold text-xl text-foreground">500K+</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Community</p>
                  <p className="font-sans font-bold text-xl text-foreground">1M+</p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* ============== FOOTER ============== */}
        <footer className="w-full max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground/80 gap-4">
          <nav className="flex gap-6 font-mono uppercase tracking-wordmark text-[10px]">
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/support" className="hover:text-foreground transition-colors">
              Support
            </a>
          </nav>
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
            Powered by: A.I.M.S.
          </p>
        </footer>
      </div>
    </div>
  );
}
