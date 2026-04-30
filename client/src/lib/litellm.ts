/**
 * LiteLLM proxy client — the canonical model gateway for the FOAI ecosystem.
 *
 * Per `reference_litellm_in_front_of_openrouter_canon.md`: apps NEVER call
 * OpenRouter / Anthropic / Gemini / OpenAI direct — only LiteLLM. The proxy
 * lives on the AIMS Core (vps2) and exposes OpenAI-compatible endpoints
 * with canonical model aliases.
 *
 * Canonical aliases (per FOAI canon):
 *   - kimi-k2-6              (production default, Moonshot)
 *   - nemotron-super         (free demo, OpenRouter)
 *   - claude-haiku-4-x       (fast)
 *   - claude-sonnet-4-x      (balanced)
 *   - claude-opus-4-x        (heavy reasoning)
 *   - gemini-3-pro           (heavy)
 *   - gemini-3-flash         (fast)
 *   - gemini-3.1-flash-tts-preview  (TTS, non-realtime)
 *   - gemini-3.1-flash-live-preview (realtime voice + function calling)
 *   - gpt-5  / gpt-5-mini    (OpenAI)
 *   - gemma-3-27b            (open weights)
 *
 * Customer-safe rule: NEVER expose the underlying provider name in user copy.
 * Refer to AI capability by function ("AI assistant", "code helper") not
 * "Claude" / "Gemini" / "Kimi" in surfaces.
 */

const LITELLM_BASE_URL =
  import.meta.env.VITE_LITELLM_BASE_URL || "https://litellm.foai.cloud/v1";

export type LiteLLMRole = "system" | "user" | "assistant";

export interface LiteLLMMessage {
  role: LiteLLMRole;
  content: string;
}

export interface LiteLLMChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  /** Optional Firebase ID token for auth. The proxy validates against
   *  foai-aims project membership when an Authorization header is present. */
  idToken?: string;
}

export interface LiteLLMChatResponse {
  text: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

const DEFAULT_MODEL = "kimi-k2-6";

/**
 * Send a chat completion to the LiteLLM proxy. Uses the OpenAI-compatible
 * `/chat/completions` endpoint. Returns the assistant text + model used.
 */
export async function chatCompletion(
  messages: LiteLLMMessage[],
  options: LiteLLMChatOptions = {},
): Promise<LiteLLMChatResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.idToken) {
    headers["Authorization"] = `Bearer ${options.idToken}`;
  }

  const res = await fetch(`${LITELLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: options.model ?? DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    }),
    signal: options.signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LiteLLM ${res.status}: ${detail.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return {
    text,
    model: data.model ?? options.model ?? DEFAULT_MODEL,
    usage: data.usage,
  };
}
