# NURDSCODE — Build Control Pack

Per A.I.M.S. UNIFIED SKILL COMPANION §4. Drives evidence-based shipping for `nurdscode.com`.

## State classification: **Existing Build → Rescue lean**

Repo exists, partially implemented, last push 2025-09-15 (~7 mo stale), site offline, prior CF rebuild attempt abandoned. Code rot present (duplicate pages, monolithic router/storage, dead deps). Not Initiation. Not pure Rescue (the code mostly works on Replit). **Existing Build with rescue-level gaps.**

---

## 1. Product Intent Brief

| Field | Value |
|---|---|
| Product | NURD by ACHIEVEMOR — youth tech-education platform |
| Primary user | Students (youth, 13-22) enrolled in NURD Summer Initiative cohorts |
| Secondary users | Trainers (MS Teams auth), parents (read-only progress), admins |
| Problem | Bridging beginners into AI tools and modern coding without the friction of pro-grade dev environments |
| Primary outcome | Student completes a learning track (Vibe Coding Foundations, World Builder Lab, Prompt Mastery, Collaboration Studio), produces a project, earns achievement |
| Main user action | Sign in → choose track → progress through lessons → use V.I.B.E. AI coding env → submit project |
| Success criteria (Phase 1) | nurdscode.com loads at FOAI infra; existing student can sign in; V.I.B.E. responds; payments process; trainer auth works |
| Out of scope (Phase 1) | New features, redesign, V.I.B.E. extraction, OpenKlass split |
| Non-negotiable | No Replit deps. No Cloudflare Workers/D1/R2. No mocks. No "deployed" claim without evidence. |

## 2. User Roles and Permission Map

| Role | Read | Create | Edit | Delete | Auth |
|---|---|---|---|---|---|
| Public visitor | landing pages, pricing, about, FAQ | — | — | — | none |
| Registered student | own profile, enrolled tracks, own progress, V.I.B.E., own submissions | account, V.I.B.E. session, progress events | own profile, own preferences | own account | session (Passport: local + Google + GitHub + Facebook) |
| Trainer | trainee progress, course content, cohort dashboard | course/lesson, achievement award | own course content | own draft content | session (MS Graph) |
| Admin | all data, image locker, landing content | trainers, courses, achievements, content | any | any | role flag in session |
| AI/system agent | scoped service-to-service (Phase 2 V.I.B.E.) | AI runs, code-gen artifacts | — | — | API token (TBD Phase 2) |

**Tenant isolation:** student A cannot read student B progress, submissions, account info. Enforced via `req.user.id` checks in storage methods. **Phase 1.5 audit required** — current `storage.ts` is monolithic and isolation must be verified per-method.

## 3. Data Handling Map

| Data class | Where stored | Sensitivity | Retention |
|---|---|---|---|
| User account (email, hashed password, OAuth IDs) | Neon Postgres `users` table | High — PII + creds | Account lifetime + audit window |
| Session | Neon Postgres `sessions` (connect-pg-simple) | High — auth bearer | TTL on cookie (default 7d, harden in P1.5) |
| Subscription/payment | Stripe + PayPal (foreign-stored); Stripe customer ID + sub ID local | High — billing | Stripe is source of truth |
| Learning progress (lessons, quizzes, achievements) | Neon `progress`, `achievements`, `userProgress`, `lessonProgress` | Medium — student record | Long-lived |
| V.I.B.E. AI prompts + outputs | DB + AI provider logs (OpenAI/GROQ/Anthropic) | Medium — could include student ideas | Audit retention TBD; **flag for Phase 2** |
| Uploaded files (Multer) | Volume `/opt/foai-data/nurdscode/uploads/` | Variable — could include student work | Phase 1 = unlimited; cap later |
| Email (transactional) | SendGrid logs + nodemailer SMTP | Low | Provider default |
| Logs | stdout in container, Docker log driver `json-file` max 10m × 3 | Low — must NOT log secrets, tokens, PII | Container lifetime |
| Theme/UI preferences | DB `userThemePreferences` | Low | Long-lived |

## 4. Architecture Decision Record

| Decision | Choice | Why |
|---|---|---|
| Frontend framework | React 18 + Vite + Wouter + Tailwind + Shadcn UI | Existing — keep |
| Backend | Express + TypeScript + tsx (dev) + esbuild (build) | Existing — keep |
| Database | Neon serverless Postgres + Drizzle ORM + connect-pg-simple sessions | Existing — keep (already non-CF) |
| Auth | Passport.js (local + Google + GitHub + Facebook + Microsoft) + scrypt password hash | Existing — keep; **drop replitAuth.ts** |
| Hosting | Docker container on `myclaw-vps`, Traefik routed at `nurdscode.com` | FOAI canon |
| TLS | Let's Encrypt via Traefik | FOAI canon |
| DNS | Cloudflare zone `1819fd1dfd…` proxy-OFF, A record at myclaw-vps IP | Owner directive |
| Storage | Volume mount for uploads in P1; GCS later if needed | Lightweight |
| Payments | Stripe + PayPal (existing) | Existing — keep |
| Email | nodemailer SMTP (and SendGrid SDK in deps — usage TBD) | Existing — verify in P1.5 |
| AI | OpenAI + GROQ + Anthropic SDK + (Modal — likely dead) | Existing — keep openai/groq/anthropic; audit modal |
| Logging | stdout → Docker json-file driver | FOAI canon |
| CI/CD | None Phase 1 (manual deploy from local). GitHub Actions later. | Speed |
| Testing | None Phase 1 (no test runner exists). Add in P1.5. | Truthful gap |

## 5. Threat Model Lite

| Surface | Risk | Mitigation Phase 1 | Phase 1.5+ |
|---|---|---|---|
| `cors({origin:true, credentials:true})` + redundant `Access-Control-Allow-Origin: '*'` middleware | `*` rejects creds → broken or worse, leaky CORS | KEEP existing behavior; flag | Fix to explicit allowlist |
| `replitAuth.ts` reads `REPLIT_DOMAINS`, `REPL_ID` | Dead code, but imports `openid-client` and could be live-loaded | DELETE file | — |
| Hardcoded fallback `SESSION_SECRET = 'nurd-secret-key'` in `auth.ts:39` | Predictable session secret if env var missing | Require `SESSION_SECRET` to be set; fail boot if not | Phase 1.5: remove fallback entirely |
| Stripe webhook endpoint signature verification | Unknown — must verify `payment-processing.ts` checks `stripe-signature` | Audit before going live | — |
| Multer upload limits | Unknown — must verify file-size + MIME guards | Audit before going live | Phase 1.5: hard caps |
| Anthropic key inline at `routes.ts:926` | Key leaked into request handler scope (less risky than client exposure but messy) | KEEP for P1; flag | Phase 1.5: extract to service |
| `crypto: ^1.0.1` npm dep | Wrong package — could be a typosquat | Audit before P1 deploy | Phase 1.5: remove |
| `modal: ^0.2.0` npm dep | Wrong package (UI lib, not Modal Labs SDK) | Audit usage | Phase 1.5: remove if unused |
| `localtunnel` dep | Replit-era tunneling | Verify unused | Phase 1.5: remove if unused |
| Multer destination | Container-local; lost on rebuild | Mount volume in compose | — |
| Logs revealing stack traces in prod | `routes.ts` error handler does `throw err` after sending 500 | Catch and silence in prod path | Phase 1.5 |
| Session cookie `secure: process.env.NODE_ENV === 'production'` | OK — but `sameSite` not set | Set `sameSite: 'lax'` | — |

## 6. Vertical Slice Build Plan — Phase 1

**One complete user path proven end-to-end before any feature work.**

| Step | Action | Evidence required |
|---|---|---|
| 1 | Repo cloned at `~/foai/nurdscode/` | `git remote -v` shows `BoomerAng9/NURD` |
| 2 | Replit prune complete (12 files removed, 3 deps removed, vite.config + server/index + package.json edited) | `git status` clean post-commit; `grep -r replit` returns only docs |
| 3 | `npm install` succeeds | exit 0; lockfile resolves; no peer-dep errors blocking |
| 4 | `.env.local` populated from `openclaw-sop5-openclaw-1` (DATABASE_URL minimum) | `printenv DATABASE_URL` works inside container |
| 5 | `npm run dev` boots, server listens on 3000 | `curl localhost:3000/api/health` → 200 (or document if no health route exists yet) |
| 6 | Drizzle schema applies to Neon | `npm run db:push` exit 0 |
| 7 | `npm run build` succeeds | `dist/index.js` + `dist/public/` produced |
| 8 | Docker image builds | `docker build -t nurdscode:phase1 .` exit 0 |
| 9 | Container runs locally | `docker run -p 3000:3000 --env-file .env.local nurdscode:phase1` and `curl localhost:3000` returns HTML |
| 10 | Compose stanza valid | `docker compose config` no errors |
| 11 | Deploy to myclaw-vps | `scp` build context, `docker compose up -d --build`, container `Up` with healthcheck passing |
| 12 | DNS cutover for `nurdscode.com` + `www.nurdscode.com` | `dig +short nurdscode.com` = myclaw-vps IP; Cloudflare proxy off |
| 13 | TLS certs issued by Traefik | `curl -I https://nurdscode.com` shows valid cert; no MITM warning |
| 14 | OAuth callbacks reconfigured | Each provider's redirect URI updated in their dashboard to `https://nurdscode.com/api/auth/<provider>/callback` |
| 15 | Stripe + PayPal webhooks reconfigured | New URL in dashboards; signature verification still passes |
| 16 | Smoke test golden path | Sign up → sign in → land on dashboard → V.I.B.E. responds to a prompt → log out |
| 17 | Build Session Receipt published | `docs/SHIP_RECEIPTS/PHASE_1_<date>.md` per Companion §8 format |

**No step skipped. No `UNVERIFIED` accepted as `PASS`.**

## 7. Definition of Done with Evidence (Phase 1)

A claim of "Phase 1 done" requires:
- All 17 vertical-slice steps pass with explicit evidence captured
- `https://nurdscode.com` returns 200 with valid TLS
- One real user account can sign in, reach V.I.B.E., make one AI call, and sign out
- Stripe webhook receives a real test event and the handler returns 200 with valid signature
- Build Session Receipt committed to repo
- No Replit references remain in code (only in docs/CLAUDE.md as historical context)

## 8. Self-Check Receipt Plan

After every meaningful work batch, produce a receipt covering:
- What landed (files changed, commands run)
- What's verified vs unverified vs failed
- Security checks performed
- Affected ship-gate items
- Remaining blockers
- Next required action

Format: Companion §8 (Build Session Receipt). Stored in `docs/SHIP_RECEIPTS/`.

## 9. Ship Checklist Gate Map (Companion §4.9)

| Gate | Question | Current status | Blocker |
|---|---|---|---|
| 1 | Does it run? | **FAIL** | Site is offline. Replit deps. |
| 2 | Can someone sign up? | UNVERIFIED | Site offline. Auth flow exists in code. |
| 3 | Does the core feature work? (V.I.B.E.) | UNVERIFIED | Site offline. Provider keys not loaded. |
| 4 | Can someone pay? | UNVERIFIED | Stripe + PayPal wired in code; webhooks need re-config; signature verification needs audit |
| 5 | Is it deployed? | **FAIL** | Not on FOAI infra. Was on Replit. |
| 6 | Is it secure? | UNVERIFIED → audit reveals issues (CORS, hardcoded session-secret fallback, logs/stack-trace, dep typosquats) | Phase 1.5 hardening |
| 7 | Will it survive failures, traffic, cost risk? | UNVERIFIED | No tests, no rate limits visible, no cost ceilings on AI calls |
| 8 | Can a stranger become a customer? | UNVERIFIED | Onboarding exists in code; needs end-to-end smoke after Phase 1 deploy |

**Current gate to clear: Gate 1 → Gate 5.** Phase 1 vertical slice is the path.

---

## Phase 2 + Phase 3 (referenced for context only, not Phase 1 scope)

Phase 2 — V.I.B.E. extraction to `vibe.nurdscode.com`. Blocked by Phase 1.5 modularization.
Phase 3 — OpenKlass training surface at `ok.foai.cloud` with shared identity. Blocked by Phase 2.
