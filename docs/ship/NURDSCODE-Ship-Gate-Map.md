# NURDSCODE Ship Gate Map

## Current Status

Project State: Existing Build redirected to vNext — **PHASE 1 LIVE** as of 2026-04-29
Current Gates passing: 1, 2, 5 (PASS evidence-backed); 0 PARTIAL (Self-Check Kit BLOCKED owner-side)
Live URL: **https://nurdscode.com** — auth round-trip verified, valid Let's Encrypt TLS
Last update: 2026-04-29 (Phase 1 LIVE deploy via PRs #1-#7 + Neon database creation + Drizzle migration)
Application Release Status: Phase 1 surface SHIPPED. Phase 2 (V.I.B.E. + Carrier Interface) and Phase 1.5 cleanup remain next.

See `docs/ship/receipts/PHASE_1_LIVE_2026_04_29.md` for full evidence.

## Gate 0 - Directive Package and Self-Check

| Item | Status | Evidence |
|---|---|---|
| vNext docs package added | **PASS** | 13 files committed on `nurdscode-aims-vnext` (12 docs + scripts/run-self-check.sh); see commit "Ship NURDSCODE vNext directive package" |
| Self-Check Kit located | **BLOCKED** | `ai-managed-solutions-self-check/` not present in repo or any FOAI sibling — see `docs/ship/receipts/2026-04-29-self-check-blocker.md` |
| operator.yaml generated/updated | **PASS** | `operator.yaml` v0.1 at repo root, generated 2026-04-29 from repo evidence |
| audit.py or equivalent run | **BLOCKED** | Cannot run without kit; script halted truthfully at the directory check (exit 1) |
| Self-Check receipt generated | **PASS** (blocker form) | `docs/ship/receipts/2026-04-29-self-check-blocker.md` |
| Current blockers recorded | **PASS** | Same receipt above + `operator.yaml` `known_blockers` section |

**Gate 0 status: PARTIAL PASS** — directive package and operator.yaml present; Self-Check Kit blocker recorded truthfully per directive's Failure Handling section. Closes fully when owner provides the kit.

## Gate 1 - Does It Run?

| Item | Status | Evidence |
|---|---|---|
| Single command start | **PASS (LIVE)** | Container `nurdscode` Up healthy on myclaw-vps; logs `[express] Server listening on http://0.0.0.0:3000` |
| Environment variables documented | **PASS** | `.env.example` rewritten from grep of actual `process.env.*` reads; live `.env.local` composed from openclaw-sop5 |
| No hardcoded secrets | **PASS** | No secrets in committed files; `.env.local` gitignored; SESSION_SECRET fallback removed in PR #3 (production guard throws if unset) |
| Database migrations run | **PASS** | `npm run db:push` ran 2026-04-29 against `nurdscode_db` in shared FOAI Neon project; 16 tables created (note: progress-schema.ts excluded — Phase 1.5 schema consolidation) |
| Health endpoint works | **PASS** | `GET https://nurdscode.com/api/health` → 200 OK with valid JSON |
| Error handling exists | **PARTIAL** | Server-side error handler present; re-throws after 500 response (Phase 1.5 fix); `/api/register` empty-body 500 instead of 400 (Phase 1.5 input validation) |

## Gate 2 - Can Someone Sign Up?

| Item | Status | Evidence |
|---|---|---|
| Landing page loads | **PASS** | `GET https://nurdscode.com/` → 200 HTML |
| Sign-up flow works | **PASS** | `POST /api/register` → 201 with user JSON, full smoke test 2026-04-29 |
| Login flow works | **PASS** | `POST /api/login` → 200 with user JSON, scrypt comparePasswords verified |
| Password reset works | UNVERIFIED | EMAIL_* env not configured (deferred per B+C); reset flow exists in code but won't deliver mail |
| Session management works | **PASS** | Session cookie issued on register/login, `/api/user` reads it correctly, `/api/logout` clears it |
| OAuth/SSO works if offered | DEFERRED | Google/GitHub/Facebook/Microsoft client IDs not configured (B+C plan); login page hides those buttons gracefully |
| Email verification works | DEFERRED | EMAIL_* env not configured; verification email won't deliver |

## Gate 5 - Is It Deployed?

| Item | Status | Evidence |
|---|---|---|
| Production URL responds | **PASS** | `https://nurdscode.com` 200 + `https://www.nurdscode.com` 200 |
| TLS cert valid | **PASS** | Let's Encrypt cert auto-issued by Traefik, ssl_verify=0 |
| Container healthy | **PASS** | `docker ps` shows `Up X minutes (healthy)`, HEALTHCHECK passing |
| Logging works | **PASS** | Docker `json-file` driver, max 10m × 3 files |
| Rollback path exists | **PASS** | `docker compose down` + `git checkout <prev-sha>` + `up` |
| Monitoring | UNVERIFIED | No external uptime monitor wired (Phase 1.5+) |

## Gate 2 - Can Someone Sign Up?

| Item | Status | Evidence Required |
|---|---|---|
| Landing page loads | UNVERIFIED | URL/screenshot/manual test |
| Sign-up flow works | UNVERIFIED | Test account result |
| Login flow works | UNVERIFIED | Test account result |
| Password reset works | UNVERIFIED | Email/reset proof |
| Session management works | UNVERIFIED | Session test |
| OAuth/SSO works if offered | UNVERIFIED | OAuth test |
| Email verification works | UNVERIFIED | Verification proof |

## Gate 3 - Does the Core Feature Work?

| Item | Status | Evidence Required |
|---|---|---|
| Primary action completes | UNVERIFIED | User path test |
| Output is correct/useful | UNVERIFIED | 10-input test set |
| Loading states exist | UNVERIFIED | UI proof |
| Error states handled | UNVERIFIED | Failure tests |
| Output is exportable/shareable | UNVERIFIED | Export proof |
| History/persistence works | UNVERIFIED | Logout/login persistence test |

## Gate 4 - Can Someone Pay?

Payment gates remain UNVERIFIED until Stripe or billing flow is implemented and tested.

## Gate 5 - Is It Deployed?

Deployment gates remain UNVERIFIED until production/staging URLs, CI/CD, rollback, monitoring, and logging are proven.

## Gate 6 - Is It Secure?

Security gates remain UNVERIFIED until protected routes, authorization, tenant isolation, input validation, rate limiting, dependency audit, and secret management are proven.

## Gate 7 - Will It Survive?

Resilience gates remain UNVERIFIED until backups, degradation, load testing, cost controls, and data export are proven.

## Gate 8 - Can a Stranger Become a Customer?

Onboarding, help/docs, legal pages, and support channels remain UNVERIFIED until tested.

## Release Rule

No gate may be marked PASS without evidence.

UNVERIFIED is operationally equivalent to FAIL for release decisions.
