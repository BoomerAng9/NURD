# NURD CODE Mockup — Doctrinal Flags

Issues found in the IMG_1841.zip mockups that must be resolved before any of these surfaces ships customer-facing. Captured 2026-04-29 by parallel-agent design study.

The mockups are owner concept art. They contain placeholder copy, internal-tool names, stale infrastructure, typos, and inconsistencies. **None of these are problems with the mockup-as-spec** — they're problems if we transcribe them verbatim into customer copy.

Per memory canon:
- `feedback_owner_brief_is_not_customer_copy.md` — translate, don't transcribe
- `feedback_never_publish_internal_tool_names.md` — function names, not tool names, on customer surfaces
- `feedback_shipped_means_commercial_ready.md` — no placeholders, mocks, "if available", or stale references shipped as final

---

## 1. Tool-name leaks (HIGH severity — block ship)

### IMG_1836 — Capabilities grid
**Found:** "Multi-AI support (OpenAI, GROQ) for faster, smarter coding."
**Replace with:** "Multi-model AI support — fast inference + reasoning lanes."

### IMG_1837 — Operator Circuit Box (internal-only — but if any of this appears in customer screenshots, scrub)
**Found:** "ElevenLabs", "CloudFlare Workers", "Stripe (Payments)", "GitHub", "PostgreSQL Database", "WebSocket Service", "Eleven Turbo v2"
**Replace with:** "Voice Lane", "Edge Functions", "Payments", "Repositories", "Realtime DB", "WebSocket Service", "TTS Engine"
**Recommendation:** keep entire surface at `/owner/circuit-box` — operator-tier only. Customers should NEVER see this page.

### IMG_1859 — Build features matrix
**Found:** "OpenAI GPT-4 / GROQ (Llama, Mistral) / Code Generation & Explanation / Intelligent Suggestions / Prompt Engineering Tools"
**Found:** "Cloudflare Workers / D1 Database / Docker / Modal / File Upload & Project Mgmt / Serverless Architecture"
**Replace with:** Capability labels: "AI Code Generation", "Multi-model reasoning", "Edge runtime", "Realtime DB", "Container runtime", "Serverless inference"

### IMG_1871 — API & Integration docs
**Found:** "GROQ model access" (in AI Service Endpoints list)
**Replace with:** "Multi-model AI access" or "AI inference endpoints"

### 1a6ee56f… — Tech Stack Infrastructure reference
**Found:** Comprehensive list of internal tools (React, Vite, Tailwind, Wouter, Shadcn, Framer Motion, React Query, TypeScript, Cloudflare Workers, Cloudflare D1, Express.js, PostgreSQL, Drizzle ORM, WebSocket, Passport.js, OpenAI GPT-4, GROQ, Modal, Stripe, OAuth providers Google/Facebook/GitHub, Docker, Daytona, Ubuntu.cloud, GitHub Actions, JWT, CORS)
**Recommendation:** **DO NOT publish this surface customer-facing.** Keep at `/owner/architecture` or as an internal docs file only. If a customer-facing version is wanted, rebuild as function-name version: "Frontend framework / Edge runtime / Realtime DB / Code-gen lane / Reasoning lane / Voice lane / Payments / Container runtime / CI/CD / Auth / Security headers".

---

## 2. Stale infrastructure references (HIGH severity — factually wrong now)

### IMG_1859 — Build features matrix
**Found:** "Cloudflare Workers / D1 Database"
**Reality:** Cloudflare Workers + D1 stack was **abandoned 2026-04-28** per `feedback_perform_lives_on_vps_not_cloud_run.md` and PR #1 pivot. Current Phase 1 is myclaw-vps Traefik + Neon Postgres. vNext (Add-On 02) target is Vertex AI + OpenRouter.
**Replace with:** Phase 1 reality (myclaw-vps + Traefik + Neon) or vNext target (Vertex AI + OpenRouter + GCS) — owner picks.

### 1a6ee56f… — Tech Stack reference
**Found:** "Cloudflare Workers", "Cloudflare D1", "Wouter", "Shadcn UI", "Express.js", "Passport.js", "Drizzle ORM" — many of these are Phase 1 substrate that vNext (Add-On 02) explicitly REPLACES (Next.js + Firebase Auth + Vertex AI + OpenRouter)
**Replace with:** Either (a) remove this surface from customer routes, OR (b) rebuild reflecting current substrate AND vNext target with version-clear labeling.

---

## 3. Placeholder copy / "if available" language (MEDIUM severity — break commercial-ready rule)

### IMG_1859 — Build features
**Found:** "GROQ (Llama, Mistral) ... if available, otherwise AI models"
**Issue:** "if available" copy is owner draft language, never ship-ready.
**Replace with:** Definitive capability label.

### 1a6ee56f… — Tech Stack
**Found:** "Wouter — routing (if available)" / "Shadcn UI — components (if available)" / "GROQ (Llama, Mistral models) — if available, otherwise AI models" / "Modal — distributed computing (if available)"
**Replace with:** Definitive labels OR remove the "if available" lines entirely.

### IMG_1866 — About / Our Culture
**Found:** Inline placeholder reference: "(as seen in <IMAGE 2>)"
**Replace with:** Either insert the actual referenced image OR rewrite the sentence to not reference an unavailable image.

---

## 4. Typos & garbled copy (MEDIUM severity)

### IMG_1841 — Learn hub
**Typo:** "FEATURE HIGLIGHTS" → "FEATURE HIGHLIGHTS"

### IMG_1873 — Pricing
**Inconsistency:** Expert Nurd tier copy says "Everything in **Pro**" but the previous tier is named "Growing Nurd", not "Pro".
**Replace with:** "Everything in Growing Nurd" or define a "Pro" tier name.

### IMG_1876 — Footer
**Garbled copy:** Newsletter description reads "We're gated and address and newsletters to your email."
**Replace with:** "We'll send updates and announcements to your inbox." or similar.

### IMG_1882 — Footer alt
**Stale year:** "© 2024 NurdsCode. All Rights Reserved."
**Replace with:** Current year (auto-update via `new Date().getFullYear()`).

### IMG_1883 — Learning Platform
**Garbled learning objectives:** "Introduces with Development coding" / "Devise enthumetricals and data types" / "Comprehend variables and movement"
**Replace with:** Clean copy ("Introduction to development concepts", "Master variables and data types", "Understand variable scope and lifetime").

---

## 5. Brand inconsistencies (MEDIUM severity — owner decision needed)

### Wordmark variants
**Found:** Multiple lockups across mockups:
- "NURDS CODE." (two-word display, terminal period — current canonical, used in PR #14)
- "NurdsCode" (one-word camelcase, used in IMG_1837, IMG_1843, IMG_1865, IMG_1873, IMG_1879, IMG_1882, IMG_1883)
- "NurdsCode" duotone (orange "Nurds" + cyan "Code", IMG_1879, IMG_1882)
- Drip "NURD" wordmark (green/yellow/teal drip, all hero mockups)
**Owner decision needed (CB-J):** which wordmark variant lives where?
**Recommended:** "NURDS CODE." stays as the institutional brand mark (HTML title, hero H1, page wordmark). "NurdsCode" lowercase camelcase OK for footer/inline references. Drip variant for hero logos + character merch + sticker badges. Duotone variant for footer brand mark only.

### Tagline variants
**Found:**
- "Think It. Prompt It. Let's Build It." (IMG_1842, IMG_1862, IMG_1869, IMG_1875, IMG_1879)
- "Build the world you want to live in." (current Landing, PR #13)
- "An FOAI Space for Modern Dreamers." (current Landing, PR #11)
- "Code Meets Culture. Creativity Leads." (IMG_1882 footer)
- "Be cool. Code like that." / "Be Cool Like That." (recurring sticker)
- "Naturally Unstoppable Resourceful Dreamers." (current /initiative + footer)
**Owner decision needed (CB-K):** rationalize which tagline lives where. Recommended: "Think It. Prompt It. Let's Build It." for deeper-build hero; "Build the world you want to live in." can be the soul subtitle; "An FOAI Space for Modern Dreamers." stays as the positioning line; "Be cool like that." stays as the sticker mantra; "Naturally Unstoppable Resourceful Dreamers." stays as the founding ethos / What is a NURD section.

### Footer signatures
**Found:**
- "powered by ACHIEVEMOR" (legacy)
- "Powered by: A.I.M.S." (current PR #15)
- "Made with [heart] by ACHIEVEMOR team" (IMG_1870 auth footer)
**Owner decision needed:** which footer signature lives in deeper-build vs initiative-light surfaces?

---

## 6. Sister-vertical link policy (MEDIUM severity — internal positioning leak risk)

### IMG_1876 — Footer
**Found:** Sister-site link row including "ACHIEVEMOR main site / NURD Initiative / The STARGATE / OpenKlass AI"
**Concern:** Per memory `feedback_no_unmarked_internal_positioning_in_customer_copy.md` — never publish sister-vertical links without explicit owner authorization. ACHIEVEMOR + OpenKlass AI are public brands. NURD Initiative is internal scope (now a route on this same domain). "The STARGATE" needs owner verification (likely internal per the project README mention).
**Owner decision needed:** which sister-sites are publishable in the footer?

---

## 7. Licensing reference (LOW severity — but flag)

### IMG_1876 — Footer Legal column
**Found:** "License (MIT)"
**Concern:** Conflicts with FOAI commercial canon (per various memory entries, FOAI verticals are commercial products, not open-source MIT).
**Owner decision needed:** is NURD CODE open-source MIT, source-available, or closed?

---

## 8. Placeholder team / contact data (LOW — pre-launch)

### IMG_1866 — About team
**Placeholder names:** Sarah Chen / Jamal Davis / Alex Rivera with placeholder photos
**Replace with:** Real team members + photos before launch. Owner-supplied.

### IMG_1882 — Footer contact
**Placeholder data:** "Email: hello@nurdscode.com" + "Location: Tech Hub, Silicon Valley, CA"
**Replace with:** Real contact email + real location (Pooler, GA per brand canon — NOT Silicon Valley).

---

## Summary checklist before any deeper-build surface ships

- [ ] All internal tool names replaced with function names (or surface kept owner-only)
- [ ] All stale infra references updated to current Phase 1 reality or vNext target
- [ ] All "if available" / placeholder language removed
- [ ] Typos corrected (HIGLIGHTS, enthumetricals, etc.)
- [ ] Wordmark variant policy decided (CB-J)
- [ ] Tagline variant policy decided (CB-K)
- [ ] Footer signature policy decided
- [ ] Sister-vertical link list approved by owner
- [ ] License language decided
- [ ] Real team names + photos in place (or About delayed)
- [ ] Real contact info (Pooler, not Silicon Valley)

These checks run BEFORE each individual page lands customer-facing. Surfaces that fail any of these stay in `/owner/*` until they pass.
