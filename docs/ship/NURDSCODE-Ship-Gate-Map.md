# NURDSCODE Ship Gate Map

## Current Status

Project State: Existing Build redirected to vNext
Current Gate: **Gate 0 — PARTIAL PASS** (directive package present, Self-Check Kit BLOCKED owner-side)
Last update: 2026-04-29
Application Release Status: Not release-eligible until evidence exists

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
| Single command start | **PASS (LOCAL)** | `docker run --env-file .env.local nurdscode:phase1-test` boots; logs `[express] Server listening on http://0.0.0.0:3000` |
| Environment variables documented | **PASS** | `.env.example` rewritten 2026-04-28 from grep of actual `process.env.*` reads |
| No hardcoded secrets | **PARTIAL** | No secrets in committed files; `.env.local` gitignored; placeholder fallback `SESSION_SECRET = 'nurd-secret-key'` in `server/auth.ts:39` flagged for Phase 1.5 removal |
| Database migrations run | UNVERIFIED | `npm run db:push` requires owner-supplied `DATABASE_URL` |
| Health endpoint works | **PASS** | `GET /api/health` → 200 OK from inside container with valid JSON; evidence in `docs/SHIP_RECEIPTS/PHASE_1_BATCH_3_2026_04_28.md` |
| Error handling exists | **PARTIAL** | Server-side error handler present at `server/index.ts`; bug noted (re-throws after 500 response — Phase 1.5 fix) |

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
