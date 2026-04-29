# Phase 1.5 — Code-rot cleanup

Design-only. **Phase 1.5 is the prerequisite for Phase 2 (V.I.B.E. extraction).** The current monolith ships in Phase 1; this doc captures everything that was deferred.

**Discipline:** Phase 1.5 is **no behavior change**. Every PR is a refactor that preserves all observable behavior. Tests (when added) must pass before and after each change.

## 1. Modularize `server/routes.ts` (1,133 LOC)

Split into per-domain routers under `server/routes/`:

| New file | Owns |
|---|---|
| `server/routes/health.routes.ts` | `/api/health` |
| `server/routes/auth.routes.ts` | `/api/register`, `/api/login`, `/api/logout`, `/api/user`, OAuth callback wiring |
| `server/routes/users.routes.ts` | `/api/users/*`, profile, preferences, themes |
| `server/routes/courses.routes.ts` | `/api/courses/*` (Phase 3 candidate for extraction to OpenKlass) |
| `server/routes/lessons.routes.ts` | `/api/lessons/*` (Phase 3 OpenKlass candidate) |
| `server/routes/progress.routes.ts` | `/api/progress/*`, `/api/lesson-progress/*`, `/api/achievements/*`, streak (Phase 3 OpenKlass) |
| `server/routes/skills.routes.ts` | `/api/skill-categories/*`, `/api/skill-offerings/*`, `/api/skill-requests/*`, `/api/skill-exchanges/*` |
| `server/routes/payments.routes.ts` | `/api/create-payment-intent`, `/api/get-or-create-subscription`, Stripe + PayPal webhooks |
| `server/routes/ai.routes.ts` | `/api/code-generator`, `/api/ai/*`, `/api/groq/*` (Phase 2 candidate for extraction to V.I.B.E. container) |
| `server/routes/images.routes.ts` | `/api/images/*` (admin image-locker) |
| `server/routes/landing.routes.ts` | `/api/landing-content/*` |
| `server/routes/activities.routes.ts` | `/api/activities/*` |

Each router file: `export function register<Domain>Routes(app: Express, deps: Deps)`.

Top-level `server/routes.ts` becomes a thin orchestrator that calls each register function in sequence. Keeps the import surface trivial; routing logic lives in domain files.

**Critical fix during this split:** the **inline Anthropic SDK instantiation at `routes.ts:926`** moves into a new `server/services/anthropic.service.ts` with a singleton getter (`getAnthropicClient()`).

## 2. Modularize `server/storage.ts` (1,701 LOC)

Split the mega-class into per-domain repositories. Each repository owns its own tables and queries.

```
server/storage/
  index.ts                 — re-exports + DB pool + shared helpers
  user.repo.ts             — user CRUD, sessions
  course.repo.ts           — courses + lessons (Phase 3 candidate)
  progress.repo.ts         — userProgress, lessonProgress, achievements (Phase 3 candidate)
  skill.repo.ts            — skill marketplace
  image.repo.ts            — image_locker, image_tags
  landing.repo.ts          — landing content
  activity.repo.ts         — user activity log, streak
  preference.repo.ts       — user theme + UI prefs
```

The current `storage.ts` exports a `storage` object with methods. After split, that object is composed of per-repo instances. Callers using `storage.getCourses()` keep working — backwards-compatible facade — until callers migrate to direct repo imports.

**Bug fixed during split:** `storage.ts:1687` `db.select({...image_tags})` — the spread of a Drizzle table into a select clause is wrong. Replace with explicit column selection or `db.select().from(image_tags)`.

## 3. Modularize `shared/schema.ts` (553 LOC)

Currently a single Drizzle schema file. Split by domain:

```
shared/schema/
  index.ts             — re-exports everything
  user.schema.ts       — users, sessions
  course.schema.ts     — courses, lessons
  progress.schema.ts   — already exists at shared/progress-schema.ts; absorb here
  skill.schema.ts      — skill_categories, skill_offerings, skill_requests, skill_exchanges
  image.schema.ts      — image_locker_images, image_tags, image_tag_mappings
  landing.schema.ts    — landing_content
  activity.schema.ts   — user_activities, user_streaks
  preference.schema.ts — user_theme_preferences
```

Drizzle migrations regenerate cleanly. No new tables, just reorganization.

## 4. Audit + delete duplicate pages

| Pair | Likely canonical | Action | Notes |
|---|---|---|---|
| `auth-page.tsx` (468 LOC) vs `auth-page-new.tsx` (429 LOC) | **TBD — both substantial** | Read both, identify which is wired in `client/src/App.tsx`, propose deletion of the other | Both 400+ LOC, easy to confuse |
| `code-playground.tsx` (372 LOC) vs `CodePlayground.tsx` (14 LOC) | **`code-playground.tsx`** | Delete `CodePlayground.tsx` (14-line stub) | Stub is a re-export or scaffold |
| `Landing.tsx` (331 LOC) vs `LandingPage.tsx` (496 LOC) | **TBD — `LandingPage.tsx` likely newer** | Read both, identify which is wired in router, propose deletion of the other | |

**Owner approval required for each deletion** per the never-delete-without-approval rule.

## 5. Remove dead deps

Confirmed unused (no `import` / `require` statements outside `nurd-codebase/` zombie):

| Package | Why dead |
|---|---|
| `crypto@1.0.1` | Stub of Node built-in. `import { ... } from "crypto"` resolves to built-in regardless. Confusing; remove. |
| `modal@0.2.0` | UI modal lib, NOT Modal Labs SDK. `server/modal-service.ts` references it but the runtime symbols don't match — likely broken or unused. Audit + remove. |
| `jade@1.11.0` | Jade was renamed to Pug a decade ago. No `.jade` files in repo. |
| `localtunnel@2.0.2` | Replit-era public-tunnel tool. No code references. |

Also flagged by deprecation warnings during `npm install`:
- `@esbuild-kit/esm-loader` (merged into tsx) — informational; tsx still resolves it
- `@esbuild-kit/core-utils` (same)
- `constantinople@3.0.2`, `transformers@2.1.0` — transitive deps of the above; will fall out when their parents update

## 6. Hardening

| Issue | Location | Fix |
|---|---|---|
| CORS double-config (`origin:true,credentials:true` + `Access-Control-Allow-Origin: '*'`) | `server/index.ts` | Remove the `*` wildcard middleware. Keep the `cors()` middleware with explicit allowlist (production: `https://nurdscode.com`, `https://www.nurdscode.com`, `https://vibe.nurdscode.com` once Phase 2 lands; dev: `http://localhost:3000`). |
| `SESSION_SECRET` fallback `'nurd-secret-key'` | `server/auth.ts:39` | Remove fallback. If unset in production, throw at boot. Same for `replitAuth.ts` if not already deleted (it should be). |
| Eager AI client instantiation crashes boot if any key missing | `server/accessibility.ts`, `server/ai-code-tools.ts` | Lazy singletons via `getOpenAIClient()`, `getAnthropicClient()`, etc. Each returns null/throws-at-call only if its key is missing. Boot completes regardless. |
| Multer upload caps unknown | `server/routes.ts` Multer setup | Add explicit `limits: { fileSize: 10MB, files: 5 }` and `fileFilter` MIME guard. |
| Stripe webhook signature verification | `server/payment-processing.ts` | Audit that `stripe.webhooks.constructEvent` is called with raw body + `STRIPE_WEBHOOK_SECRET`. Express needs `express.raw({type: 'application/json'})` for the webhook route, NOT `express.json()`. Common pitfall. |
| Error handler re-throws after 500 response | `server/index.ts` (the `app.use((err, req, res) => { ...; throw err; })` block) | Remove the `throw err` — already responded; throwing crashes the process. |
| Logs may include sensitive data | `server/index.ts` request logger captures full JSON response | Redact tokens, password fields, payment intents from logs. Or skip request logging in production for `/api/auth/*` and `/api/webhooks/*`. |

## 7. Image optimization

`dist/public/` ships as 41MB because of bundled raw PNGs:
- `IMG_0098-DHGWJIWb.png` — 9.9MB
- `Untitled design-B1JYHapF.png` — 4.6MB
- `made-in-pooler-BSzPmpHW.png` — 3.4MB
- multiple 1.5–2.5MB images

**Phase 1.5 actions:**
- Identify which images are referenced in code (Vite would not bundle unreferenced ones)
- For each large image: convert to WebP (typically 80% smaller), resize to actual display dimensions
- Audit `attached_assets/` — anything not referenced is dead weight
- Consider splitting heavy media to GCS bucket served via `<img loading="lazy">` for non-critical visuals

## 8. JS bundle code-splitting

Vite warned: `dist/public/assets/index-BJErtE9J.js` is **1.6MB minified, 386KB gzipped**. Above the 500KB threshold.

Fixes:
- Lazy-load route components via `React.lazy(() => import('./pages/Foo'))` — Wouter supports this via `Suspense`
- Configure `build.rollupOptions.output.manualChunks` to split vendor bundles (Stripe, Anthropic, OpenAI, etc.) from app code
- Code-split V.I.B.E. surface (`AccessAI.tsx`, `VIBE.tsx`, `code-playground.tsx`) into its own chunk — already partially happening per the build log

## 9. Test scaffolding

Currently no test runner. Phase 1.5 introduces:
- Vitest for unit tests
- Playwright for E2E (already a dep candidate; package isn't present yet — verify)
- One test per domain repository for the basic CRUD path
- One E2E for the auth flow + V.I.B.E. round-trip

CI integration via GitHub Actions when a CI/CD setup is decided.

## 10. Lint + format

- Add `eslint` with the Next/React/TS shared config used in `~/foai/perform/`
- Add `prettier` for format-on-save
- `npm run validate` script that runs lint + typecheck + tests (matching CTI Hub's pattern)

## Sequencing inside Phase 1.5

Order matters because some items unblock others:

1. **Hardening fixes (6)** — CORS, SESSION_SECRET, eager AI, error handler. Low-risk, high-value, no architectural change.
2. **Dead-dep removal (5)** — independent, safe.
3. **Schema split (3)** — modular schema enables modular repos.
4. **Storage split (2)** — depends on schema split.
5. **Routes split (1)** — depends on storage split (each route imports its repo).
6. **Inline Anthropic extraction** — folds into routes split.
7. **Duplicate-page audit (4)** — independent of backend work.
8. **Image optimization (7)** — independent.
9. **Bundle code-splitting (8)** — comes after duplicate pages so we know what's in vs out.
10. **Test scaffolding (9)** — final, codifies the new structure.
11. **Lint/format (10)** — enforced after structure stabilizes.

## Out of scope

- Anything that changes user-visible behavior
- New features
- New AI providers
- V.I.B.E. extraction (Phase 2)
- OpenKlass split (Phase 3)
- Major UI rework
