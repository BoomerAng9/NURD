import { useState } from "react";
import { Link } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { chatCompletion, type LiteLLMMessage } from "@/lib/litellm";

/**
 * /chat — ACHEEVY chat surface, IDE-shell layout per IMG_1865 mockup
 * (deeper-build dark canon). Sometimes called the Carrier Interface
 * Builder Mode in the vNext docs.
 *
 * Stage A wiring (FOAI vNext canon):
 *   - Submit hits the LiteLLM proxy (`@/lib/litellm`), the canonical model
 *     gateway per `reference_litellm_in_front_of_openrouter_canon.md`. App
 *     never calls model providers direct.
 *   - Default model: `kimi-k2-6` (production alias). Owner-tunable.
 *   - Firebase ID token (foai-aims project) attached when the user is
 *     signed in — proxy gates billing + rate limiting on that.
 *   - Customer copy: ACHEEVY persona only, NEVER name the underlying model.
 *
 * Phase 2 (deferred):
 *   - Spinner intent classification ahead of LiteLLM (Stepper recipe routing)
 *   - Voice mic capture via existing Gemini Live relay (wss://voice.foai.cloud)
 *   - File-tree wired to project / Workspace state
 *   - Right-rail metadata wired to live session telemetry
 */

const ACHEEVY_SYSTEM_PROMPT =
  "You are ACHEEVY, the digital twin and primary orchestrator inside the FOAI " +
  "(The Future of AI) ecosystem on NurdsCode. You speak directly, with quiet " +
  "confidence. You help builders go from idea to working code. You never name " +
  "the underlying language model, provider, or internal tools you may be using; " +
  "you are ACHEEVY. Keep responses tight unless the user asks for depth.";

type ChatMessage = {
  id: string;
  role: "user" | "acheevy";
  text: string;
  timestamp: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "acheevy",
  text:
    "Hi, I'm ACHEEVY. Tell me what you want to build and I'll help you " +
    "shape it — from idea to working code. What are we making today?",
  timestamp: "Now",
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isResponding, setIsResponding] = useState(false);

  function nowStamp(): string {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isResponding) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: nowStamp(),
    };
    setThread((prev) => [...prev, userMsg]);
    setInput("");
    setIsResponding(true);

    try {
      // Build the LiteLLM message list: system prompt + the existing thread
      // (mapped to OpenAI roles) + the new user message.
      const history: LiteLLMMessage[] = [{ role: "system", content: ACHEEVY_SYSTEM_PROMPT }];
      for (const m of thread) {
        history.push({
          role: m.role === "acheevy" ? "assistant" : "user",
          content: m.text,
        });
      }
      history.push({ role: "user", content: trimmed });

      // Attach Firebase ID token if the user is signed in (foai-aims project).
      // The LiteLLM proxy uses it for billing + rate limiting attribution.
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;

      const { text } = await chatCompletion(history, { idToken });
      const acheevyMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "acheevy",
        text: text.trim() || "(no response)",
        timestamp: nowStamp(),
      };
      setThread((prev) => [...prev, acheevyMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "acheevy",
        text:
          "I hit a snag connecting to the build runtime. " +
          (err instanceof Error ? err.message : "Try again in a moment.") +
          " — ACHEEVY",
        timestamp: nowStamp(),
      };
      setThread((prev) => [...prev, errorMsg]);
    } finally {
      setIsResponding(false);
    }
  }

  // Suppress unused-import warning if onAuthStateChanged isn't called above.
  // (Reserved for Phase 2 — live auth-state listener for session telemetry.)
  void onAuthStateChanged;

  return (
    <div
      data-theme="deep"
      className="bg-background text-foreground min-h-screen circuit-bg"
    >
      <div className="flex flex-col h-screen">
        {/* ============== TOP BAR ============== */}
        <header
          className="border-b flex items-center justify-between px-2 py-1 text-sm"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <div className="flex items-center gap-4">
            {/* TODO: replace with extracted asset from IMG_1865 */}
            <img
              src="https://placehold.co/24x24/191c22/39ff14?text=NC"
              data-alt="NurdsCode logo mark"
              className="rounded"
            />
            <nav className="flex gap-4">
              {["File", "Edit", "Selection", "Go", "Run", "Help"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex justify-center px-16">
            <div className="w-full max-w-md relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                search
              </span>
              <input
                type="search"
                placeholder="Search app"
                className="w-full rounded-md py-1 pl-9 pr-3 text-sm focus:outline-none border"
                style={{
                  background: "hsl(var(--secondary))",
                  borderColor: "hsl(var(--border))",
                }}
              />
            </div>
          </div>

          <div
            className="flex items-center gap-4"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <span className="material-symbols-outlined text-xl">fullscreen</span>
            <span className="material-symbols-outlined text-xl">minimize</span>
            <span className="material-symbols-outlined text-xl">close</span>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* ============== LEFT SIDEBAR ============== */}
          <aside
            className="w-64 flex border-r"
            style={{
              background: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <div
              className="w-12 p-2 flex flex-col items-center gap-4"
              style={{
                background: "hsl(var(--card))",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "hsl(var(--neon-green))" }}
              >
                description
              </span>
              <span className="material-symbols-outlined">share</span>
              <span className="material-symbols-outlined">bug_report</span>
              <span className="material-symbols-outlined">layers</span>
              <span className="material-symbols-outlined">biotech</span>
              <div className="flex-grow" />
              <Link
                href="/account"
                className="hover:text-foreground transition-colors"
              >
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
              <Link
                href="/settings"
                className="hover:text-foreground transition-colors"
              >
                <span className="material-symbols-outlined">settings</span>
              </Link>
            </div>

            <div className="flex-1 p-2 text-sm">
              <h2
                className="font-mono uppercase tracking-wordmark text-[11px] mb-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Explorer
              </h2>
              <div className="space-y-1">
                <div className="font-bold text-foreground">VIBE WORKSPACE</div>
                <div className="pl-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ color: "hsl(var(--neon-green))" }}
                    >
                      folder
                    </span>
                    <span>src</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>
                    <span className="material-symbols-outlined text-base text-red-400">
                      folder
                    </span>
                    <span>node_modules</span>
                  </div>
                  <div className="flex items-center gap-1 pl-4">
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ color: "hsl(var(--accent-gold))" }}
                    >
                      code
                    </span>
                    <span>main.js</span>
                  </div>
                  <div className="flex items-center gap-1 pl-4">
                    <span className="material-symbols-outlined text-base text-blue-400">
                      data_object
                    </span>
                    <span>package.json</span>
                  </div>
                  <div className="flex items-center gap-1 pl-4">
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ color: "hsl(var(--neon-cyan))" }}
                    >
                      info
                    </span>
                    <span>README.md</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-foreground flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>{" "}
                  OUTLINE
                </h3>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-foreground flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>{" "}
                  TIMELINE
                </h3>
              </div>
            </div>
          </aside>

          {/* ============== MAIN CHAT ============== */}
          <main
            className="flex-1 p-4"
            style={{ background: "hsl(var(--background))" }}
          >
            <div
              className="rounded-xl border flex flex-col h-full"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--neon-green) / 0.5)",
                boxShadow:
                  "0 0 20px hsl(var(--neon-green) / 0.3), inset 0 0 10px hsl(var(--neon-green) / 0.2)",
              }}
            >
              {/* Chat Header */}
              <header
                className="p-4 border-b flex justify-between items-center"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-center gap-4">
                  {/* TODO: replace with extracted asset from IMG_1865 */}
                  <img
                    src="https://placehold.co/48x48/1d2026/39ff14?text=A"
                    data-alt="ACHEEVY avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h1 className="font-sans font-bold text-2xl text-foreground">
                      Chat with{" "}
                      <span style={{ color: "hsl(var(--accent-gold))" }}>
                        ACHEEVY
                      </span>
                    </h1>
                    <p
                      className="text-sm"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Your build-companion — voice and text
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <button
                    type="button"
                    disabled
                    title="Voice coming in Phase 2"
                    aria-label="Start voice input (coming in Phase 2)"
                    className="p-2 rounded-md disabled:opacity-60"
                    style={{
                      background: "hsl(var(--neon-green))",
                      color: "hsl(var(--background))",
                    }}
                  >
                    <span className="material-symbols-outlined">mic</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Voice coming in Phase 2"
                    aria-label="Toggle audio output (coming in Phase 2)"
                    className="p-2 rounded-md disabled:opacity-60"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <span className="material-symbols-outlined">volume_up</span>
                  </button>
                  <Link
                    href="/dashboard"
                    aria-label="Close chat"
                    className="hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </Link>
                </div>
              </header>

              {/* Chat Log */}
              <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                {thread.map((msg) =>
                  msg.role === "user" ? (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg ml-auto max-w-xl"
                      style={{ background: "hsl(var(--secondary))" }}
                    >
                      <p>
                        <span
                          className="font-bold"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          You:
                        </span>{" "}
                        {msg.text}{" "}
                        <span
                          className="text-xs"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          [{msg.timestamp}]
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex gap-4 max-w-xl">
                      {/* TODO: replace with extracted asset from IMG_1865 */}
                      <img
                        src="https://placehold.co/40x40/1d2026/39ff14?text=A"
                        data-alt="ACHEEVY avatar"
                        className="rounded-full w-10 h-10 flex-shrink-0"
                      />
                      <div
                        className="p-4 rounded-lg border relative"
                        style={{
                          background: "hsl(var(--secondary))",
                          borderColor: "hsl(var(--accent-gold) / 0.2)",
                        }}
                      >
                        <p className="relative">
                          <span
                            className="font-bold"
                            style={{ color: "hsl(var(--accent-gold))" }}
                          >
                            ACHEEVY:
                          </span>{" "}
                          {msg.text}
                        </p>
                        <div
                          className="text-xs mt-3 flex items-center gap-3 relative"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          <span>[{msg.timestamp}]</span>
                          <button
                            type="button"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              content_copy
                            </span>{" "}
                            Copy
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              save
                            </span>{" "}
                            Save
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              refresh
                            </span>{" "}
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Chat Input */}
              <footer
                className="p-4 border-t space-y-4"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex gap-2">
                  {["Build an app", "Debug this code", "Explain this concept"].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setInput(label)}
                        className="px-4 py-2 rounded-md text-sm transition-colors hover:opacity-90"
                        style={{
                          background: "hsl(var(--secondary))",
                          color: "hsl(var(--foreground))",
                        }}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask ACHEEVY anything…"
                    className="w-full border rounded-lg py-3 pl-4 pr-24 focus:outline-none placeholder:text-muted-foreground/50"
                    style={{
                      background: "hsl(var(--secondary))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 font-bold px-6 py-2 rounded-md text-sm transition-transform active:scale-95"
                    style={{
                      background: "hsl(var(--neon-green))",
                      color: "hsl(var(--background))",
                      boxShadow: "0 0 16px hsl(var(--neon-green) / 0.4)",
                    }}
                  >
                    Send
                  </button>
                </form>
                <div
                  className="flex justify-around items-center text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <button
                    type="button"
                    disabled
                    title="Voice coming in Phase 2"
                    className="flex flex-col items-center gap-1 hover:text-foreground transition-colors disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">
                      keyboard_voice
                    </span>{" "}
                    Start voice input
                  </button>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined">inventory_2</span>{" "}
                    Save conversation
                  </button>
                  <button
                    type="button"
                    onClick={() => setThread([WELCOME_MESSAGE])}
                    className="flex flex-col items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>{" "}
                    Clear history
                  </button>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined">upload</span>{" "}
                    Export as prompt
                  </button>
                  <Link
                    href="/settings"
                    className="flex flex-col items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined">settings</span>{" "}
                    Settings
                  </Link>
                </div>
              </footer>
            </div>
          </main>

          {/* ============== RIGHT METADATA RAIL ============== */}
          <aside
            className="w-80 border-l p-4 space-y-4 text-sm overflow-y-auto"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <div>
              <button
                type="button"
                className="w-full flex justify-between items-center font-bold text-foreground mb-2"
              >
                <span>Conversation Metadata</span>
                <span className="material-symbols-outlined text-base">
                  expand_less
                </span>
              </button>
              <div
                className="space-y-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <p>Session: new</p>
                <p>Mode: text</p>
                <p>Started: just now</p>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="w-full flex justify-between items-center font-bold text-foreground mb-2"
              >
                <span>Context</span>
                <span className="material-symbols-outlined text-base">
                  expand_less
                </span>
              </button>
              <p style={{ color: "hsl(var(--muted-foreground))" }}>
                ACHEEVY has access to your current workspace files when you grant
                permission.
              </p>
            </div>

            <div>
              <button
                type="button"
                className="w-full flex justify-between items-center font-bold text-foreground mb-2"
              >
                <span>Recent Conversations</span>
                <span className="material-symbols-outlined text-base">
                  expand_less
                </span>
              </button>
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                No prior conversations yet. Your sessions will appear here.
              </p>
            </div>

            <div>
              <button
                type="button"
                className="w-full flex justify-between items-center font-bold text-foreground mb-2"
              >
                <span>What ACHEEVY can do</span>
                <span className="material-symbols-outlined text-base">
                  expand_less
                </span>
              </button>
              <ul
                className="list-disc list-inside space-y-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <li>Scaffold a new app from a plain-English description</li>
                <li>Walk you through code, line by line</li>
                <li>Debug what's broken and explain why</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">Usage</h3>
              <div className="space-y-3">
                <div
                  className="flex justify-between items-center"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <span>Session</span>
                  <span>—</span>
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ background: "hsl(var(--secondary))" }}
                >
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: "0%", background: "hsl(var(--neon-green))" }}
                  />
                </div>
                <div style={{ color: "hsl(var(--muted-foreground))" }}>Plan</div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ background: "hsl(var(--secondary))" }}
                >
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: "0%", background: "hsl(var(--neon-green))" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="space-y-2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <div className="flex justify-between items-center">
                <span>Voice command (Phase 2)</span>
                <kbd
                  className="px-2 py-0.5 text-xs font-sans rounded border"
                  style={{
                    background: "hsl(var(--secondary))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  Ctrl + /
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>New conversation</span>
                <kbd
                  className="px-2 py-0.5 text-xs font-sans rounded border"
                  style={{
                    background: "hsl(var(--secondary))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  Ctrl + N
                </kbd>
              </div>
            </div>
          </aside>
        </div>

        {/* ============== STATUS BAR ============== */}
        <footer
          className="border-t flex items-center justify-between px-4 py-0.5 text-xs"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-base">
              git_compare
            </span>
            <span>main</span>
            <span className="material-symbols-outlined text-base">sync</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">
                error_outline
              </span>
              <span>0</span>
              <span className="material-symbols-outlined text-base">warning</span>
              <span>0</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Ready</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span className="material-symbols-outlined text-base">
              notifications
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
