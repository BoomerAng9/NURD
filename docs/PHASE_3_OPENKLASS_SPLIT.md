# Phase 3 — OpenKlass split to `ok.foai.cloud`

Design-only deliverable. **Phase 3 is blocked behind Phase 2 (V.I.B.E. extraction) which is blocked behind Phase 1.5 (modularization). Do not start Phase 3 work until Phase 1.5 lands.**

Per the owner's words on 2026-04-28: *"the training platform, which can be connected to ok.foai.cloud if done correctly."* The conditional "if done correctly" is the load-bearing phrase — Phase 3 is the design of *correctly*.

## Goal

Extract the **training surface** of NURDSCODE — courses, lessons, learning tracks, ACHIEVERS Program, trainer auth, cohorts — into a separate container at `ok.foai.cloud`, while keeping `nurdscode.com` as the identity + commerce + marketing surface and `vibe.nurdscode.com` as the AI coding lane.

OpenKlass = OK = the OPENKLASS AI portal in the ACHIEVEMOR ecosystem (per `client/src/pages/` references like `OKAI logo.png` already bundled). This is canonical FOAI sub-product positioning.

## Container topology after Phase 3

```
nurdscode-shell      → Host(`nurdscode.com`,`www.nurdscode.com`)  on myclaw-vps
nurdscode-vibe       → Host(`vibe.nurdscode.com`)                  on myclaw-vps  (Phase 2)
openklass            → Host(`ok.foai.cloud`)                       on myclaw-vps  (Phase 3)
```

All three behind the same Traefik instance, same Let's Encrypt resolver, same Docker network.

## DNS posture

- `ok.foai.cloud` is a subdomain of `foai.cloud`. Per the project memory entry `reference_dns_providers_per_zone.md`, `foai.cloud` DNS is at **Hostinger** (NOT Cloudflare).
- Add `ok` A record at Hostinger → myclaw-vps IP, no proxy involved.
- This is the same pattern `brewing.foai.cloud` and `perform.foai.cloud` follow.

## What moves out of `nurdscode-shell`

These pages and routes belong to OpenKlass:

**Pages** (`client/src/pages/`):
- `Achievers.tsx` — ACHIEVERS Program registration
- `summer-initiative.tsx` — NURD Summer Initiative info
- `parent-guide.tsx`
- `school-programs.tsx`
- `student-resources.tsx`
- `weekend-workshops.tsx`
- `Cohorts.tsx`
- `Trainers.tsx`
- `scholarships.tsx`
- `online-learning.tsx`
- `Learning.tsx`
- `ModuleDetail.tsx`
- `UserProgress.tsx`
- `Join-Our-Team.tsx`
- `AICourseCreator.tsx` — trainer course authoring (also touches V.I.B.E.; decide in Phase 2)
- `create-course.tsx` — same overlap concern

**Routes** (`server/routes.ts` post-modularization):
- `/api/courses/*` — course CRUD
- `/api/lessons/*` — lesson CRUD
- `/api/progress/*` — student progress
- `/api/achievements/*` — achievement awards
- `/api/cohorts/*` — cohort management (if not yet built, planned for OpenKlass)
- `/api/trainers/*` — trainer auth + trainer-specific data (Microsoft Graph for Teams)
- `/api/landing-content/*` — content management (only if it's training-content-specific)

**Storage methods** (`server/storage.ts` post-modularization):
- `getCourses`, `getFeaturedCourses`, `getCoursesByCategory`, `getCourseById`, `createCourse`
- `getLessons`, `getLessonById`, `createLesson`
- `getUserProgress`, `getUserProgressForCourse`, `createOrUpdateUserProgress`
- `getLessonProgress`, `createOrUpdateLessonProgress`
- `getAchievements`, `getUserAchievements`, `awardAchievement`
- `getUserStreak`, `updateUserStreak` (debatable — could stay in shell)

**Schema** (`shared/schema.ts` post-modularization):
- `courses`, `lessons`, `userProgress`, `lessonProgress`, `achievements`, `userAchievements`
- Some of these are in `shared/progress-schema.ts` already (good — partial work done)

## What stays in `nurdscode-shell`

- Identity: users, sessions, password reset, OAuth, scrypt hashing
- Subscription/billing: Stripe + PayPal + plans + price routing
- Marketing: home, pricing, about, FAQ
- Admin: image-locker, landing content (the marketing kind), admin dashboard
- Skill marketplace (`SkillMarketplace.tsx`, skill_storage.ts) — separate concern, lives with shell or extracts to its own container later
- Profile/account management

## What stays in `nurdscode-vibe` (Phase 2)

- V.I.B.E. coding environment (`AccessAI.tsx`, `VIBE.tsx`, `code-playground.tsx`)
- AI lanes: OpenAI / GROQ / Anthropic / askcodi / modal-service
- Code generation, code explanation
- WebSocket real-time collab in V.I.B.E. sessions

## Identity model

**Source of truth:** `nurdscode-shell` issues identity. OpenKlass and V.I.B.E. *consume* identity, do not issue.

**Cross-domain hand-off:** `.nurdscode.com` and `.foai.cloud` are different parent domains, so a session cookie can't be naturally shared between `nurdscode.com` (Phase 2 covers this for `vibe.nurdscode.com`) and `ok.foai.cloud`. Use signed-JWT redirect dance:

```
User on ok.foai.cloud → /auth → 302 to nurdscode.com/auth/handoff?return=https://ok.foai.cloud/auth/callback&intent=...
nurdscode.com (already-signed-in user) → mints short-lived JWT (5 min) → 302 back to ok.foai.cloud/auth/callback?token=eyJ...
ok.foai.cloud receives token → verifies signature with shared secret → mints its own session cookie scoped to .foai.cloud → drops to original page
```

**Required wiring:**
- New `/auth/handoff` and `/auth/issue-token` endpoints on `nurdscode-shell`
- New `/auth/callback` on `openklass` to receive the token
- Shared signing key in `openclaw-sop5-openclaw-1` (`HANDOFF_JWT_SECRET`)
- JWT claims: `sub` (user_id), `email`, `roles`, `exp` (5 min), `aud` (`openklass`)
- Optional: refresh-token endpoint at the issuer for long sessions

## Subscription state syncing

NURDSCODE shell is the source of truth for Stripe subscription state. OpenKlass needs to know whether a user is entitled to access training content.

**Cleanest model:** internal API.
- `nurdscode-shell` exposes `/api/internal/entitlements/:user_id` — returns `{ active: bool, tier: string, expires_at: timestamp }`
- Auth via mTLS or shared internal API token (NOT user JWT)
- `openklass` calls this endpoint on session establishment; caches in-memory for a short TTL (e.g., 5 min)
- Stripe webhook on `nurdscode-shell` invalidates the OpenKlass cache via internal pubsub OR best-effort HTTP push when subscription changes

Avoid duplicating subscription tables across services. Single source of truth.

## DB strategy

**Phase 3 default:** OpenKlass shares the same Neon Postgres database, but only reads/writes its own tables. Drizzle schemas split per service. No service crosses the line into another's tables in queries.

**Why share, not split:** simpler infrastructure, lower latency for cross-domain operations (entitlement check, user identity), easier to evolve schema together. The training and identity domains touch each other often (a user record references progress, achievements, etc.).

**Migration discipline:** each service owns its tables, owns its migrations. A `nurdscode-shell` migration does not touch OpenKlass tables, and vice versa. CI enforces.

**Future split option:** if data isolation becomes a hard requirement (compliance, scale), separate Neon projects with cross-DB foreign references via API only.

## Container shape (mirrors `nurdscode-shell` Phase 1)

```dockerfile
# OpenKlass shape — Phase 3 sketch
FROM node:20-alpine AS deps
# ...same multi-stage pattern...

# docker-compose.yml — labels:
- "traefik.http.routers.openklass.rule=Host(`ok.foai.cloud`)"
- "traefik.http.routers.openklass.entrypoints=websecure"
- "traefik.http.routers.openklass.tls.certresolver=letsencrypt"
- "traefik.http.services.openklass.loadbalancer.server.port=3000"
```

## Repo strategy

**Option A (preferred):** new repo `BoomerAng9/OPENKLASS`. Cleaner ownership, independent CI, explicit boundary. Code copied from current NURD/training surface, then fork-evolved.

**Option B:** monorepo subdirectory `~/foai/openklass/` alongside `~/foai/nurdscode/`. Workspace-style sharing of `@aims/*` deps via `file:../`. Faster to bootstrap; harder to extract later if needs to leave the FOAI org.

**Decision deferred to actual Phase 3 kickoff** — Phase 1.5 modularization will reveal which is cleaner.

## Design system

OpenKlass UI inherits the **A.I.M.S. light theme** per memory canon `reference_aims_light_theme_canon.md` — `#F8FAFC` slate-50 base, white surfaces, slate-200 borders, amber-600 `#D97706` accent, Inter / Doto. Same Tailwind tokens as NURD shell so brand stays cohesive across all three surfaces.

Logo: `OKAI logo` (already in `attached_assets/`) or owner-supplied OPENKLASS visual. **Do not** auto-generate brand assets without owner approval.

## Migration plan when Phase 3 starts

1. **Pre-flight** — confirm Phase 1.5 modularization has cleanly separated training routes/storage/schema
2. **Branch + bootstrap** — create `openklass` container scaffolding (Dockerfile, compose, base Express app, shared Tailwind config import)
3. **Move code** — port training pages + routes + storage + schema from `nurdscode-shell` to `openklass`. Delete from shell only after openklass renders the page identically.
4. **Wire identity** — implement `/auth/handoff` on shell + `/auth/callback` on openklass. Test the redirect dance manually.
5. **Wire entitlements** — implement `/api/internal/entitlements/:user_id` on shell + cache layer on openklass.
6. **DNS** — add `ok.foai.cloud` A record at Hostinger.
7. **Deploy** — same docker-compose-on-myclaw-vps pattern as Phase 1.
8. **Cutover** — for each migrated page, redirect `nurdscode.com/<page>` → `https://ok.foai.cloud/<page>` for one ramp week, then remove the legacy route on shell.
9. **Smoke** — golden path: user signs in at nurdscode.com → clicks training → seamlessly lands on ok.foai.cloud authenticated.

## Risks

- **Identity hand-off latency / UX**: 302-then-redirect adds perceived load time. Mitigation: prefetch the handoff token when user opens the training nav menu.
- **Subscription state staleness**: 5-min TTL means a user who upgrades sees access in up to 5 min. Acceptable; can lower to 30s if needed.
- **Cookie domain confusion**: must be careful that `nurdscode.com` cookies don't leak to `ok.foai.cloud` and vice versa. Different parent domains help, but middleware must enforce.
- **Cross-service deploy ordering**: when both services share schema migrations, deployment order matters. Phase 3 needs a shared-migration-then-deploy convention.
- **Brand confusion**: customers must understand `nurdscode.com` (V.I.B.E. + identity) and `ok.foai.cloud` (training) are part of the same product. Owner-side comms.

## Out of scope for this design

- Phase 2 V.I.B.E. extraction details — see `docs/PHASE_2_VIBE_EXTRACTION.md` (not yet written; will produce when Phase 2 starts)
- Specific course content / curriculum — owner-side product decision
- Pricing-tier permissions (which tier gets which courses) — owner-side product decision
- Trainer onboarding flow — separate design needed
