# Voice Integration — NURDSCODE Chat / A.I.M.S. Carrier Interface (Phase 2)

**Status:** Canon, awaiting Phase 2 implementation. Owner directive 2026-04-29 confirmed reading 2026-04-29.

**Phase position:** Phase 2 (V.I.B.E. extraction + Carrier Interface). Voice is **NOT** a Phase 1 LIVE-deploy gate; voice **IS** a Phase 2 ship gate.

## Why voice is non-negotiable

The A.I.M.S. Carrier Interface (`docs/ux/AIMS-Carrier-Interface-Spec-v1.0.md`) defines five modes — Flip Phone, Two-Way Pager, Swarm Console, Builder, Tool House. **Flip Phone Mode is voice-first push-to-talk by definition.** A chat UI without voice modes is a Carrier-Interface ship blocker.

Voice is also the differentiator vs every other AI coding chat surface (VibeCode, Lovable, Bolt, Replit). The directive's product framing in Add-On 02 §2 explicitly positions NURD as exceeding VibeCode-level simplicity through governed escalation — voice is part of the simplicity story.

## Verified routing canon (do not redraw)

Source of truth: `~/.claude/skills/open-mind/references/voice-routing.md` dated 2026-04-19.

### Default — Gemini 3.1 Flash family

| Use case | Model |
|---|---|
| **Realtime voice with function calling** (NURD chat live conversation, V.I.B.E. coding voice) | `gemini-3.1-flash-live-preview` |
| **Pre-recorded narration / lesson voiceover / podcast / multi-speaker dialogue** | `gemini-3.1-flash-tts-preview` |

**Why Gemini Live is the realtime default:**
- Single vendor, single billing — Google already paid for Gemini 3.1 Flash text path
- Tool calls happen natively in the same model that's generating voice — no separate LLM-router/Spinner bridge
- Google Search grounding included
- Same voice catalog as Gemini TTS (Enceladus, Puck, Liam, etc.) — consistent brand voice across realtime + pre-rendered
- Vertex AI deployment option matches existing FOAI ops pattern

**Capabilities (Gemini Live):**
- Low-latency speech-to-speech, 70 languages
- Barge-in (user can interrupt mid-response)
- Function calling in the same flow as speech
- Audio transcripts back to client (real-time text of both user input + model output)
- Proactive audio (model can initiate speech for long-running task agents)

### Fallback — Inworld + Spinner

Use Inworld + Spinner **only** when one of these applies (the bar is high):

1. **OpenAI Realtime API port-over** — Inworld is a near-drop-in replacement for OpenAI Realtime (same event schema, same session structure, same client/server event types).
2. **Multi-provider router fan-out** in one realtime session — OpenAI + Anthropic + Gemini + DeepSeek + Mistral + open-source mid-conversation. Inworld Router supports 200+ models.
3. **Benchmarked Inworld TTS-1.5 Max quality win** — must be demonstrated, not assumed. #1 on Artificial Analysis Speech Arena, but Gemini Live's voices are usually fine.

**Pattern reference (already scaffolded in CH):**
- `~/foai/chicken-hawk/hawk-ui/components/spinner-voice.tsx` (91 LOC)
- `~/foai/chicken-hawk/hawk-ui/app/api/voice/session/route.ts` (75 LOC) — server-side scoped session token minter
- Status: scaffolded but inactive pending Inworld credentials per `project_chicken_hawk_paused_2026_04_28.md`

**Inworld endpoint:** `wss://api.inworld.ai/v1/realtime`
**Auth:** `Authorization: Basic $INWORLD_API_KEY`

### Hard "do not"

- Do not stand up a self-hosted Nemotron-3-Super endpoint for ACHEEVY-voice / Boomer_Ang voice / NURD chat voice — over-scoped per `feedback_gemini_first_supersedes_nemotron_super_scope.md`.
- Do not use raw OpenAI Realtime API directly — port to Inworld+Spinner if Realtime semantics are needed; default to Gemini Live otherwise.
- Do not build a parallel voice service when `~/foai/voice_relay/` already exists.
- Do not expose model names ("Gemini", "Inworld", "Anthropic") on customer surfaces — use function-name labels per `feedback_owner_brief_is_not_customer_copy.md`.

## How NURD plugs in (Wire don't build)

### Existing infrastructure to reuse

```
~/foai/voice_relay/
├── main.py             # FastAPI WebSocket relay
├── auth.py             # WebSocket key auth + ALLOWED_ORIGINS
├── docker-compose.yml  # Traefik labels, port 8091, voice.foai.cloud
├── Dockerfile
└── requirements.txt    # fastapi, uvicorn, websockets, google-genai, httpx
```

**Architecture (already deployed):**
```
Browser mic ──[WebSocket]──▶ wss://voice.foai.cloud
                                  │
                                  ▼
                             voice_relay (FastAPI)
                                  │
                                  ▼
                             Gemini Live API (gemini-3.1-flash-live-preview)
                                  │
                                  ├──[function call]──▶ AGENT_ENDPOINTS map
                                  │                     (scout/content/edu/biz/ops/cfo)
                                  │
                                  └──[audio + transcript]──▶ back to browser
```

### Two changes to `~/foai/voice_relay/` for NURD

**1. `auth.py:ALLOWED_ORIGINS`** — add NURD origins:

```python
ALLOWED_ORIGINS = [
    "https://foai.cloud",
    "https://cti.foai.cloud",
    "https://deploy.foai.cloud",
    "https://nurdscode.com",          # ← NEW for NURD chat (Phase 2)
    "https://www.nurdscode.com",      # ← NEW for NURD chat (Phase 2)
    "https://vibe.nurdscode.com",     # ← NEW for V.I.B.E. (Phase 2)
    "http://localhost:3000",
    "http://localhost:3001",
]
```

**2. `main.py:AGENT_ENDPOINTS`** — extend with NURD-specific function endpoints:

```python
AGENT_ENDPOINTS = {
    # existing ACHEEVY → Boomer_Ang routes
    "scout_ang": os.getenv("SCOUT_ANG_URL", ""),
    "content_ang": os.getenv("CONTENT_ANG_URL", ""),
    "edu_ang": os.getenv("EDU_ANG_URL", ""),
    "biz_ang": os.getenv("BIZ_ANG_URL", ""),
    "ops_ang": os.getenv("OPS_ANG_URL", ""),
    "cfo_ang": os.getenv("CFO_ANG_URL", ""),
    # NURD-specific function endpoints (Phase 2 — TBD which actions voice can trigger)
    "nurd_vibe_generate_code": os.getenv("NURD_VIBE_CODE_URL", ""),
    "nurd_vibe_explain_code": os.getenv("NURD_VIBE_EXPLAIN_URL", ""),
    "nurd_course_progress": os.getenv("NURD_PROGRESS_URL", ""),
    # ...
}
```

### NURD client-side wiring

**Mic button component (Phase 2 — to be written, with `~/foai/chicken-hawk/hawk-ui/components/spinner-voice.tsx` as the structural reference):**

```typescript
// Connect to voice.foai.cloud with NURD's API key
const ws = new WebSocket(
  `wss://voice.foai.cloud/voice?key=${VOICE_RELAY_API_KEY}`
);

// Send mic audio chunks
mediaRecorder.ondataavailable = (e) => ws.send(e.data);

// Receive audio + transcripts
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.type === 'audio') playAudio(msg.data);
  if (msg.type === 'transcript') showTranscript(msg.text);
  if (msg.type === 'function_call') /* shown as agent activity card */;
};
```

**Mic-button gating** (per `feedback_ch_access_tier_canon.md` pattern):
- Anonymous public visitors → voice DISABLED (text chat only)
- Authenticated NURD users → voice ENABLED with full function-call surface

### Pre-recorded TTS (lesson narration, V.I.B.E. explanations)

For one-shot TTS that doesn't need realtime:
- Direct call to Gemini API at `gemini-3.1-flash-tts-preview` from NURD server
- 70+ languages, 30 voices, 200+ audio tags, native multi-speaker, SynthID watermarking
- Server-side: `npm install @google/genai` (already in `package.json` as `@google/generative-ai@^0.24.1` — verify version supports TTS at integration time per `feedback_verify_models_at_api_not_code_comments.md`)
- No relay needed — single HTTP call, audio bytes back

### Speech-to-text input

Already inside Gemini Live — STT happens on Google's side, transcripts come back through the WebSocket. No separate Whisper / Deepgram integration needed for the realtime lane.

For pre-recorded audio uploaded by the user (e.g., voice memo of a coding question) → use Gemini API directly with multimodal input.

## Carrier Interface mode mapping

Per `docs/ux/AIMS-Carrier-Interface-Spec-v1.0.md`:

| Carrier Mode | Voice behavior |
|---|---|
| **Flip Phone Mode** | Voice-first PTT — Mic button → `voice.foai.cloud` realtime → audio response. Default mode for fast voice tasks. |
| **Two-Way Pager Mode** | Text-first — voice off by default, can toggle on. |
| **Swarm Console Mode** | Voice off (read-only agent activity). Optional voice transcript playback of a session. |
| **Builder Mode** | Voice optional — used for "explain this build" / "narrate the next step." Pre-recorded TTS for build receipts; realtime for live build supervision. |
| **Tool House Mode** | Voice off by default. Could add "speak tool description" via pre-recorded TTS if accessibility lane needs it. |

## Privacy posture (Add-On 02 alignment)

Per `docs/agents/NURDSCODE-vNext-Dev-Cycle-Directive-Add-On-02.md` §9 (Privacy and paid-app training rule):

- **Private Build Mode users** → voice transcripts are NOT used to train provider models
- For Gemini paths: route through Vertex AI with `enable_grounding=true` only when needed; use project-level cache controls; verify Vertex zero-data-retention is honored per `cloud.google.com/vertex-ai/generative-ai/docs/data-governance`
- For Inworld fallback: per CH policy, scoped session tokens minted server-side; private content stays workspace-bound
- Tool House provider data labels apply (`docs/warehouse/tool-cards/google-ai-backbone-tools.yaml`)

## What ships when

| Phase | Voice deliverable |
|---|---|
| Phase 1 LIVE | None — voice not on the gate |
| Phase 1.5 | None — refactor, no behavior change |
| **Phase 2 V.I.B.E. extraction + Carrier Interface** | **Mic button + WebSocket client wiring** to `voice.foai.cloud` · pre-recorded TTS for narration · `voice_relay/` `ALLOWED_ORIGINS` + `AGENT_ENDPOINTS` updates · Flip Phone + Pager modes functional |
| Phase 3 OpenKlass split | TTS for course/lab playback · multi-speaker dialogue for trainer-student lessons (Gemini 3.1 Flash TTS native multi-speaker) · OpenKlass bridge fields include voice asset metadata |
| Future | Inworld + Spinner fallback (only if benchmarked case surfaces); multimodal voice retrieval via Gemini Embedding 2 |

## Open decisions (resolve at Phase 2 kickoff)

1. **Which V.I.B.E. actions can voice trigger?** Code generation, code explanation, run tests, navigate to lesson — define the function-call surface for `AGENT_ENDPOINTS`.
2. **Voice on / voice off as default?** Carrier spec implies Flip Phone Mode is selectable, not always on. New users should they default to Pager (text) or Flip (voice)?
3. **Per-tenant voice budget caps?** Gemini Live has minute-based pricing; need a soft cap per workspace to prevent runaway costs.
4. **Voice transcript persistence?** Store in `userActivities` table (existing Drizzle schema) or new `voiceSessions` table? Privacy mode might require ephemeral-only.

These do not block Phase 2 design; they're product decisions for the implementation kickoff.

## Cross-references

- `~/.claude/skills/open-mind/references/voice-routing.md` — full decision matrix (canonical)
- `~/foai/voice_relay/main.py` — production reference implementation (Gemini Live)
- `~/foai/chicken-hawk/hawk-ui/components/spinner-voice.tsx` — Inworld fallback pattern
- `docs/ux/AIMS-Carrier-Interface-Spec-v1.0.md` — Carrier UI modes and voice behavior
- `docs/agents/NURDSCODE-vNext-Dev-Cycle-Directive-Add-On-02.md` — Add-On 02 Google AI Backbone (§7 Interactions API, §8 Embeddings)
- Memory: `feedback_voice_integration_nurd_chat_non_negotiable.md` (this canon, indexed in MEMORY.md)
