# NURDSCODE.com — Project Scope (CLAUDE.md)

This file pins the operating doctrine, repo identity, target architecture, and known hazards for any session working in `~/foai/nurdscode/`.

## ⚠️ READ FIRST — vNext directive supersedes the Phase 1 architecture below

**As of 2026-04-29**, owner shipped `nurdscode-vnext-directive-package.zip` redefining the architectural target. The directive lives in-repo at:

- `docs/agents/Coding-Agent-Execution-Brief.md` — operating brief (READ THIS BEFORE EVERY SESSION)
- `docs/architecture/NURDSCODE-vNext-Architecture.md` — vNext stack canon
- `docs/agents/AIMS-Spinner-Stepper-Operating-Model.md` — A.I.M.S. governs · Spinner routes · Stepper automates
- `docs/warehouse/Universal-Ecosystem-Tool-Warehouse-v6.0.md` — owner-neutral tool registry (24 shelves)
- `docs/bridge/OpenKlass-AI-Bridge-Spec-v1.0.md` — OK.FOAI.cloud bridge API
- `docs/ux/AIMS-Carrier-Interface-Spec-v1.0.md` — radio/pager-inspired UI canon
- `docs/ship/NURDSCODE-Ship-Gate-Map.md` — current evidence-backed gate state
- `docs/ship/Self-Check-Run-Directive.md` — Gate 0 enforcement
- `docs/runbooks/First-Implementation-Runbook.md` — execution path

**Key vNext stack shifts vs the Phase 1 substrate below:**

| Layer | Phase 1 (current, deployed) | vNext (target) |
|---|---|---|
| Web | React + Vite + Wouter (single Express container) | Next.js or React + dashboards |
| Mobile | none | React Native + Expo + EAS |
| Auth | Passport.js (Google/GitHub/Facebook/Microsoft + scrypt local) | Firebase Auth first; Better Auth later if self-host needed |
| AI | Direct OpenAI / Anthropic / GROQ / askcodi SDKs | Vertex AI + OpenRouter |
| Routing | Hardcoded Express routes | **Spinner** (intent classification + routing) |
| Automation | None | **Stepper** (recipe execution) |
| Tool selection | None | **Tool Selector** + Tool Warehouse v6.0 governance |
| Sandbox | None | Daytona, OpenSandbox, or isolated Cloud Run Jobs |
| Storage | Local volume (Multer) | GCS or Firebase Storage |
| Bridge | Phase 3 design only | OpenKlass AI bridge endpoint (`POST /api/bridge/openklass/ingest`) |
| Carrier UI | Generic SPA | A.I.M.S. Carrier Interface (Flip / Pager / Swarm / Builder / Tool House modes) |

**Non-negotiable rule from the directive:** No new feature work begins until the vNext docs package is in the repo (✅ done 2026-04-29) AND the Self-Check Kit has run OR a truthful blocker has been recorded (✅ blocker recorded — kit owner-side).

The Phase 1 substrate documented below is the **deployed reality** (single container at `nurdscode.com` on myclaw-vps). vNext is the **target direction**. Phase 1 ships, then Phase 1.5 modularizes, then Phase 2/3/vNext layers on. See the directive docs for the full vNext path.

### Voice integration is non-negotiable for the chat interface (Phase 2)

Owner directive 2026-04-29: NURDSCODE chat / A.I.M.S. Carrier Interface MUST ship with voice. The carrier metaphor (Flip Phone Mode = voice-first PTT, Two-Way Pager Mode = text fallback) collapses without voice — it's not a "ship without voice, add later" surface.

**Verified canon** (per `~/.claude/skills/open-mind/references/voice-routing.md`, dated 2026-04-19):

| Lane | Default | Fallback |
|---|---|---|
| Realtime voice + function calling | `gemini-3.1-flash-live-preview` | Inworld + Spinner |
| Pre-recorded TTS / narration | `gemini-3.1-flash-tts-preview` | — |
| Text agentic reasoning | Gemini 3.1 Flash (text) | — |

**Wire don't build** — production-shaped voice service already exists at `~/foai/voice_relay/` (FastAPI WebSocket relay, deployed at `wss://voice.foai.cloud`, Gemini Live, function-calling dispatch, ACHEEVY persona). NURD reuses this; no new service needed.

Phase 2 wiring details: `docs/VOICE_INTEGRATION.md`.

Memory pointer: `feedback_voice_integration_nurd_chat_non_negotiable.md`.

---

## Identity

- **Active GitHub repo:** `BoomerAng9/NURD` — clone present at this path
- **ABANDONED — DO NOT TOUCH:** `ACHVMR/Nurds_Code_Dot_Com` — was the Cloudflare-stack attempt, walked away from 2026-04-28. Local relic at `~/temp_nurds_code` is dead weight.
- **Product:** Build control plane for the FOAI ecosystem (per vNext directive). Carries V.I.B.E. (Vibrant Imagination Build Environment) as the user-side coding lane and bridges to OpenKlass AI for the learning-platform lane. The "NURD Summer Initiative youth-education" framing was the prior product positioning; the vNext directive expands NURDSCODE into the ecosystem build control plane.
- **Public domain:** `nurdscode.com`
- **Currently:** offline. Phase 1 substrate proven LOCAL; LIVE deploy owner-blocked. Last deployed on Replit (now stripped). Last push 2025-09-15 before this work.

## Operating doctrine (load order)

This project operates under four layered docs:

1. **`docs/agents/Coding-Agent-Execution-Brief.md`** — in-repo, mandatory first read. The vNext operating brief.
2. **`C:\Users\rishj\iCloudDrive\ACHIEVEMOR_\Projects_\The Deploy Platform_\Claude Code\A.I.M.S. UNIFIED SKILL.md`** — global doctrine (Teleological Anchor, compute field, brain function, state assessment, Hard Halt / Calculated Bet)
3. **`…\A.I.M.S. UNIFIED SKILL COMPANION.md`** — Build Control Pack + Evidence-Based Shipping Protocol (9-section BCP, 8 ship gates, "Done" rule, Build Session Receipt format)
4. **`…\NURDSCODE REVISION.md`** — earlier product direction. **Note:** the infra recommendations (Cloudflare Workers / D1 / R2 / Pages) are **obsolete** — walked away from that stack on 2026-04-28. Methodology (BCP, vertical slice, evidence-based shipping) still applies.

The Build Control Pack lives at `docs/BUILD_CONTROL_PACK.md` (Phase 1 detail) AND is referenced by the vNext directive at `docs/agents/Coding-Agent-Execution-Brief.md`.

**Self-Check + Ship Gate state:** `docs/ship/NURDSCODE-Ship-Gate-Map.md`. Most recent receipts in `docs/ship/receipts/` (vNext path) and `docs/SHIP_RECEIPTS/` (Phase 1 path; consolidate later).

## Target architecture (Phase 1)

| Layer | Choice | Rationale |
|---|---|---|
| Substrate | `myclaw-vps` Traefik | FOAI canon for whole-app surfaces (Per\|Form, CTI Hub precedent) |
| Container base | `node:20-alpine` multi-stage | Per\|Form / CTI Hub canon |
| Internal port | `3000` | FOAI canon (override Replit's `:5000`) |
| TLS | Let's Encrypt via Traefik (`certresolver=letsencrypt`) | Per `perform.foai.cloud` precedent |
| Database | **Neon serverless Postgres** (existing `DATABASE_URL`) | Already non-CF, already serverless. Stays. |
| Object storage | Volume `/opt/foai-data/nurdscode/uploads` for Multer | Lightweight Phase 1; GCS later if asset CDN matters |
| Secrets | `.env.local` sourced from `openclaw-sop5-openclaw-1` container env on myclaw-vps | FOAI canon |
| DNS | Cloudflare zone `1819fd1dfd27964244dfe3b3021e406a` — **DNS-only**, proxy OFF (grey-cloud), A record at myclaw-vps IP | Owner directive 2026-04-28 |
| Cloudflare account | `49d710612f9fc6359ac0f067482b5684` (DNS only — no Workers/D1/R2/Pages) | Owner directive 2026-04-28 |

## Phasing

| Phase | Goal | Containers |
|---|---|---|
| **Phase 1** | Site back online, Replit stripped, single container at `nurdscode.com` | `nurdscode-shell` (monolith) |
| **Phase 1.5** | Code-rot cleanup: modularize `routes.ts` (1133 LOC), `storage.ts` (1701 LOC), `schema.ts` (553 LOC); prune duplicate pages | same |
| **Phase 2** | Extract V.I.B.E. to own container at `vibe.nurdscode.com`. Anthropic Managed Agents migration. Shared session cookie on `.nurdscode.com`. | shell + vibe |
| **Phase 3** | OpenKlass split — training pages → `ok.foai.cloud` with shared identity | shell + vibe + openklass |

## Known coupling hazards (informs Phase 1.5 + Phase 2)

- `server/routes.ts` (1133 LOC) — single mega-router. Anthropic SDK instantiated inline at L926. V.I.B.E. routes co-mounted with courses, skills, payments, image-locker.
- `server/storage.ts` (1701 LOC) — single mega-class. All domains share one DB session.
- `shared/schema.ts` (553 LOC) — one Drizzle schema, all tables.
- **Duplicate pages** in `client/src/pages/` (canonical TBD): `auth-page.tsx` / `auth-page-new.tsx` · `code-playground.tsx` / `CodePlayground.tsx` · `Landing.tsx` / `LandingPage.tsx`
- Conflicting CORS in `server/index.ts` — both `cors({origin:true, credentials:true})` AND `Access-Control-Allow-Origin: '*'` middleware. `*` rejects credentials → bug. Phase 1.5 fix.
- `crypto: ^1.0.1` in deps — wrong package (Node has built-in `crypto`); the npm `crypto` package is a legacy stub. Phase 1.5 fix.
- `modal: ^0.2.0` — npm UI modal lib, NOT Modal Labs SDK. `server/modal-service.ts` likely broken or unused. Phase 1.5 audit.
- `nurd-codebase/` — full DUPLICATE of the repo at root level. Zombie copy. Awaiting owner approval before deletion.

## V.I.B.E. (Phase 2 target — what to extract)

Cleanly separable today:
- `server/ai-code-tools.ts` (150 LOC)
- `server/ai-course-generator.ts` (129 LOC)
- `server/groq-service.ts` (262 LOC)
- `server/askcodi-service.ts` (238 LOC)
- `server/modal-service.ts` (346 LOC)

Blocked by mega-router/mega-storage until Phase 1.5 modularization lands.

## Standing rules (project-scoped)

- **Never delete without owner approval.** Standing rule across all FOAI work. Default = keep.
- **No skill-load announcement headers.** Proceed straight to the work.
- **Evidence-based shipping.** Every "done" claim per Companion §8 Build Session Receipt format. `UNVERIFIED ≡ FAIL`.
- **Internal tool names never publish.** Per FOAI canon. Surface labels = function not tool.
- **No mocks, no stubs, no placeholders shipped.** Companion §5 hard ban.

## Calculated bets in force

- **CB1:** Internal port `3000` (was `5000`). Reverse if any external client hardcodes `:5000`.
- **CB2:** Single container (Express serves Vite-built static). Reverse if CDN-backed static needed for performance.
- **CB3:** Modal API likely dead weight (npm package mismatch — see Phase 1.5 audit). Reverse if V.I.B.E. genuinely uses Modal Labs.
- **CB4:** VPS-only — no `Dockerfile.cloudrun` variant (whole-app FOAI rule).
- **CB5 (revised):** Single container in Phase 1, V.I.B.E. extraction in Phase 2 — coupling audit found mega-router + mega-storage block clean extraction.
- **CB6:** Phase 2 V.I.B.E. subdomain = `vibe.nurdscode.com`.
- **CB7:** Shared session cookie on `.nurdscode.com` parent domain (so shell + vibe SSO in Phase 2).

## Build commands

```bash
# Local dev (port 3000 after Phase 1 edits)
cd ~/foai/nurdscode
npm install
npm run dev                # tsx server/index.ts

# Build
npm run build              # vite build + esbuild server bundle → dist/

# Type check
npm run check              # tsc

# DB migrations (Drizzle to Neon)
npm run db:push
```

## Domain cutover checklist (Phase 1 ship)

When ready to flip nurdscode.com to FOAI:
- [ ] Cloudflare DNS: A `nurdscode.com.` → `<myclaw-vps public IP>`, proxy OFF
- [ ] Cloudflare DNS: A `www.nurdscode.com.` → same IP, proxy OFF
- [ ] Traefik labels in compose: Host(`nurdscode.com`) + Host(`www.nurdscode.com`)
- [ ] Stripe webhook URL: `https://nurdscode.com/api/webhooks/stripe`
- [ ] PayPal webhook URL: `https://nurdscode.com/api/webhooks/paypal`
- [ ] OAuth callback URLs (Google / GitHub / Facebook / Microsoft): `https://nurdscode.com/api/auth/<provider>/callback`
- [ ] `APP_URL=https://nurdscode.com` in `.env.local`
- [ ] Smoke test: `/`, `/access-ai`, `/api/health` all 200; auth flow works end-to-end

## Memory references

- `project_nurdscode_active_repo_2026_04_28.md` — repo identity disambiguation
- `feedback_no_skill_load_announcements.md` — no banner recaps
- `feedback_never_delete_without_approval.md` — standing rule
- `feedback_never_publish_internal_tool_names.md` — function not tool labels
- `reference_aims_unified_skill_installed.md` — global doctrine path
- `feedback_perform_lives_on_vps_not_cloud_run.md` — whole-app FOAI rule (NURD inherits)
- `reference_dns_providers_per_zone.md` — Cloudflare = 5 zones incl. `nurdscode`; foai.cloud at Hostinger
