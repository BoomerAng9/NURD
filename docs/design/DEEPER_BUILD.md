# NURD CODE — Deeper Build Design System

**Source of truth.** Extracted from owner-supplied IMG_1841.zip (28 valid mockup images, studied 2026-04-29 via parallel agents).

This design system governs the **deeper-build** identity — the platform-level theme. The complementary **initiative-light NURD-drip-identity** (drip-stickered, multi-color, bright graphic-pop on cream/white) lives on `/initiative` and youth-program surfaces. **Both themes coexist.** The platform Home, Build, Learn, Tribe, Pricing, Auth, Chat, Projects, Services, Account surfaces use deeper-build. The /initiative section + About + API docs use initiative-light.

> **Identity rule (owner directive 2026-04-29):** NURD CODE has its own identity. Do NOT frame any NURD asset, theme, code, component, palette, typography, or copy as "Coastal-aligned" or "Coastal-Brewing-aligned." Coastal Brewing Co. is a sibling FOAI vertical in the company sense, NOT in design language. The 30 mockups in IMG_1841.zip have ZERO Coastal aesthetic.

> **Landing exception (owner directive 2026-04-29):** The `/` Landing is the **Kokonut two-column hero** (light theme, NURD Kid image right, motion pillar list left, "An FOAI Space for Modern Dreamers." tagline, "Build the world you want to live in." footer). It is **separate from the 30 IMG_1841.zip mockups** — the deeper-build hero candidates (IMG_1862 / IMG_1842 / IMG_1869) are NOT for the Landing. They apply to other surfaces only. Do NOT propose to "rebuild the Landing from IMG_1862." The Coastal-branded cup + bag in the Landing hero image are owner-curated cross-vertical art, approved on customer copy.

---

## 1. The thesis

NURD CODE has **two complementary themes** sharing one Pooler-rooted identity:

| Theme | Surface | Mood |
|---|---|---|
| **Deeper-Build** (primary) | `/`, `/learn`, `/build`, `/tribe`, `/pricing`, `/auth`, `/chat`, `/projects`, `/services`, `/account`, `/owner/*` | Confident, neon-on-dark, circuit-board, character-led, gamified, builder-grade |
| **Initiative-Light NURD-drip-identity** (alternate) | `/initiative`, `/initiative/about`, `/initiative/projects`, `/initiative/docs/*`, `/about` | Cream/white base, drip-sticker badges (green/orange/purple), multi-color borders, bright graphic-pop typography, drip-icon family, character art |

**What both themes share:**
- The NURD wordmark + drip motif (different palettes, same gesture)
- Made in Pooler signature ("MADE IN PLR" badge with palms)
- The "What is a NURD?" / "Naturally Unstoppable Resourceful Dreamers" founding ethos
- Sharp, restrained, no-fluff voice — "no machinery shown" per Add-On 02
- Circuit-board / drip / Pooler / skateboard motifs available in both themes (different intensity)
- Footer signature variants: "powered by ACHIEVEMOR" (initiative) / "Powered by: A.I.M.S." (deeper-build)

---

## 2. Color palette — Deeper Build (primary)

### Primary surface tokens

| Token | Hex | Usage |
|---|---|---|
| `--background` | **#0a0e10** | Page background — near-black with subtle warm cast. Circuit-board pattern overlay at low opacity. |
| `--foreground` | **#FFFFFF** | Primary text |
| `--muted-foreground` | **#9CA3AF** | Secondary text, descriptions, labels |
| `--card` | **#141A22** / **#16222E** | Card / panel surface (slightly lighter than background) |
| `--border` | **#1f2a3a** | Hairline rules between sections |

### Signature accents

| Token | Hex | Reserved for |
|---|---|---|
| `--neon-green` | **#39FF14** / **#22C55E** / **#00FF66** | Primary CTA, V.I.B.E. accents, success states, code-execution surfaces, primary nav active state, progress bars, NURD wordmark green |
| `--neon-cyan` | **#00F0FF** / **#00E5FF** / **#00D9FF** | Secondary accent, "Prompt It" headline run, footer column headers, code highlights |
| `--neon-orange` | **#FF8A1F** / **#F97316** / **#FFB422** | "Let's Build It" hero accent, ACHIEVERS surfaces, tertiary CTA, drip-orange in NURD logo |
| `--accent-gold` | **#FFB700** / **#FACC15** | "JOIN THE TRIBE" CTA pill, gold focus rings on auth inputs, premium tier accent, NURD wordmark gold portion |
| `--accent-magenta` | **#D04AC2** / **#c43a7a** | "Think It" hero gradient run, Premium plan progress, special features |

### Usage rules
- **Photography is NOT the visual hero here.** Character renders + circuit traces + neon glow ARE the visual hero.
- **Circuit-board background** (cyan + green traces on near-black) is a recurring backdrop motif. Reusable as a tileable SVG/PNG.
- **Neon glow** on borders, headlines, and active states. NOT on body text.
- **Drip treatment** on the NURD wordmark — green/yellow/teal default; can take orange variant on warm sections.
- The 5 user-pickable color schemes from the legacy NURD theme (ocean/forest/sunset/space) are **retired**. One palette per theme.

---

## 3. Color palette — Initiative-Light NURD-drip-identity (alternate)

Re-derived from owner mockups IMG_1861, IMG_1866, IMG_1871, IMG_1878 — drip-stickered, multi-color, bright graphic-pop on cream/white.

| Token | Hex | Usage |
|---|---|---|
| `--background` | **#F8F4EC** / **#FAF7F0** / **#FFFFFF** | Cream / off-white / pure white page backgrounds |
| `--foreground` | **#1a1612** / **#0E1620** | Warm near-black text |
| `--muted-foreground` | **#6a665d** | Secondary text |
| `--border` | **#d8d2c4** | Hairline rules |
| `--card` | **#FFFFFF** | Card / product backdrop |
| `--nurd-drip-green` | **#3DE053** | V.I.B.E. drip-sticker, code surfaces, primary CTA |
| `--nurd-drip-orange` | **#FF8A00** | ACHIEVERS drip-sticker, event accents, warm CTA |
| `--nurd-drip-blue` | **#3EC6E0** | Skill Marketplace drip-sticker, exchange surfaces |
| `--nurd-drip-purple` | **#5B2A8A** | Drip-sticker badge, light-theme heading accent |

In the light theme, drip-color accents are **first-class identity colors** — used as primary CTA fill, sticker badges, multi-color card borders, and bright graphic-pop type. Use them directly, not "sparingly as restraint."

---

## 4. Typography

### Deeper Build

| Role | Family | Weight / treatment |
|---|---|---|
| Display headline (hero) | **Inter** ExtraBold or **Manrope** ExtraBold | `clamp(40px, 7vw, 80px)`, tracking-tighter, multi-color per-word treatment supported |
| Display headline (sections) | Inter Bold | uppercase, tracked, 3xl-5xl |
| Body | Inter Regular | 16-18px, leading-relaxed |
| Eyebrow / nav / footer label | **JetBrains Mono** Regular | uppercase tracking-wordmark `0.18em`, 10-11px, muted-foreground color |
| Code | JetBrains Mono | inside `<CodeBlock>` components |
| **Special — "Marker neon" headline** | Custom (Bungee / Lilita One / display fill) | Used for "OUR SERVICES"-style chunky filled-neon section heads. Reserve for ~3 surfaces only — overuse kills it. |
| **Special — "Drip-style" headline** | Custom layered SVG / image asset | Used for "Think It. Prompt It. Let's Build It." with per-word color drip. Render as image for highest fidelity unless we build a real SVG drip generator. |

### Initiative-Light NURD-drip-identity
**Inter** body (graphic-pop, bright at heading scale) / **Fraunces** serif (editorial / about / long-form storytelling only) / **JetBrains Mono** utility (eyebrows, nav labels, footer caps). Drip-style display headlines may be used for hero callouts on light surfaces (image asset, per §5).

### Type rules
- Editorial pull statements with terminal periods: "The pillars.", "Made in Pooler.", "Naturally Unstoppable Resourceful Dreamers."
- Section eyebrows uppercase tracked-out small mono: `01 BUILD`, `02 LEARN`, `03 TRIBE`
- Filter pills lowercase: `coffee · tea · matcha` style
- Display headline can take **alternating per-word colors**: white / neon-green / orange / cyan
- Display headline can take **drip treatment** on signature words ("LET'S BUILD IT", "NURD") — image asset

---

## 5. Wordmark & lockup

NURD wordmark has **multiple canonical variants**:

### Variant A — Drip wordmark (primary brand mark)
- Layered "NURD" with melting bottom edge
- Green (default): teal `#3DF59A` → green `#39FF14` → yellow drip
- Orange variant: orange `#FF8A1F` → red `#FF3A1A` drip
- Cyan/teal variant: `#00F0FF` → cyan `#22E3CF` drip
- Used as: hero logo (top-left), pricing tier headers, footer brand mark, sticker badge motif

### Variant B — "NURDS CODE." display wordmark
- Two-word lockup: NURDS / CODE (stacked or side-by-side)
- Used in: HTML title, `<title>NURDS CODE.</title>`, hero H1 on Landing
- Sharp, no drip on this variant — institutional brand signature

### Variant C — Duotone "NurdsCode" wordmark
- Orange "Nurds" + cyan/blue "Code" running together as one word
- Visible in IMG_1879 footer, IMG_1882 footer
- **Owner clarification needed** (CB-J): is this canonical, or only for footer/logo lockup contexts?

### Mascot tag
- "NURD I'm cool like that" — small badge / sticker that appears bottom-right on hero illustrations
- "Be cool like that." — recurring tagline pinned to the brand

### Made in PLR badge
- Tropical palms + wood-stork-ish silhouette
- "MADE IN PLR" text
- Used as: footer signature, hero corner badge. "MADE IN PLR" is a shared Pooler-vertical FOAI signature.

---

## 6. Layout & components inventory

### Global components (used across deeper-build surfaces)

| Component | Source mockup | Recreatability |
|---|---|---|
| `<NavBar>` — sticky neon-glow rounded-pill container with mega-menu dropdowns + search + theme toggle + login dropdown | IMG_1843 | HIGH |
| `<SiteFooter>` — drip-NURD wordmark + 4-5 column nav + newsletter capture + sister-vertical strip + social row + legal bar | IMG_1876, IMG_1882 | HIGH |
| `<DripLogo>` — SVG drip wordmark (3 color variants) | All hero mockups | MEDIUM (extract once, reuse) |
| `<NeonDeviceFrame>` — laptop/dashboard mockup with neon-glow border | IMG_1869 | HIGH |
| `<NeonHeadline>` — chunky filled marker-style heading with neon stroke + drop-shadow | IMG_1880 ("OUR SERVICES") | MEDIUM (custom font + filter) |
| `<CircuitBackground>` — tileable SVG with cyan + green circuit traces on near-black | All deeper-build surfaces | HIGH |
| `<MadeInPLRBadge>` — palm-tree illustration with "MADE IN PLR" wordmark | IMG_1858, IMG_1859, IMG_1875, IMG_1876 | MEDIUM (extract once) |
| `<NurdMascotBadge>` — character with "NURD I'm cool like that" sticker | IMG_1869, IMG_1873 | MEDIUM (extract once) |

### Section/page components

| Component | Source mockup | Recreatability |
|---|---|---|
| `<HeroDripHeadline>` — multi-color drip headline with character render right (THINK IT. / PROMPT IT. / LET'S BUILD IT.) | IMG_1842, IMG_1862 | MEDIUM (drip text + character render extraction) |
| `<HeroSplitDevices>` — split-device mockup hero with audience pills | IMG_1869 | HIGH (uses `<NeonDeviceFrame>` + extracted character) |
| `<CapabilitiesGrid>` — 2x3 feature cards with neon-stroke borders + line-art icons | IMG_1836, IMG_1839 | HIGH (icon set + card component) |
| `<TribeSection>` — "JOIN THE TRIBE" hero + 6-card community feature grid + CTA | IMG_1839 | HIGH |
| `<PricingTiers>` — 3-up tier cards with character avatars + neon borders + CTA per tier | IMG_1873 | HIGH (cards) + MEDIUM (3 character renders) |
| `<ProjectCardGrid>` — 3x2 project gallery with tech-stack pills (deeper) or multi-color borders (cream) | IMG_1864 (dark), IMG_1878 (cream) | HIGH |
| `<ServiceTilesNeon>` — 3-up service tiles with chunky neon headline | IMG_1880 | HIGH |
| `<AuthSplit>` — 3-column login + 3-step register + ACHEEVY chat assist | IMG_1870 | HIGH |
| `<ACheevyChatPanel>` — IDE-shell chat interface with file tree + chat thread + metadata rail | IMG_1865 | HIGH (UI primitives + ACHEEVY avatar asset) |
| `<LearningHubDashboard>` — 3-pane learn shell with sidebar nav + course content + achievements rail | IMG_1841, IMG_1883 | MEDIUM (high info density) |
| `<AccountSettings>` — left-rail sidebar nav + form panel + quick-stats rail | IMG_1867 | HIGH |
| `<ThreeStepFlow>` — Think It / Prompt It / Let's Build It explainer cards | IMG_1861 | HIGH (light theme — likely lives on /initiative or as cream-island within deeper-build) |
| `<VIBEvsProSplit>` — V.I.B.E. (left learner) vs Professional Editor (right pro) comparison | IMG_1858 | MEDIUM (character renders) |
| `<MidPageCTASection>` — value-prop list left + character group right + 3-up CTA strip | IMG_1875 | HIGH (uses extracted character group illustration) |
| `<FinalCTABanner>` — bottom-of-page conversion banner with circuit BG + character + dual CTAs | IMG_1879 | HIGH (uses extracted character) |
| `<TechStackMatrix>` — 4-column tech reference grid with logos + descriptions | IMG_1837 (full + heavily scrubbed), 1a6ee56f… | HIGH (but ship-blocked — see DOCTRINAL_FLAGS.md) |
| `<APIIntegrationsRef>` — cream-themed API docs page | IMG_1871 | HIGH |
| `<AboutMissionTeam>` — cream-themed about with mission + values + team grid | IMG_1866 | HIGH |
| `<ExecutionDashboard>` — botanical-themed node-graph monitoring (operator-tier only) | IMG_1854 | MEDIUM-LOW (forest backdrop + ornamental vine frame as image assets) |
| `<CircuitBoxOps>` — brushed-metal industrial control panel (operator-tier only) | IMG_1837 | MEDIUM (panel chrome as image asset) |

---

## 7. Image assets to extract

These are the **bespoke illustrations + character renders** that need to be saved as PNG/WebP and reused across surfaces. Listed by priority:

### Tier 1 — ship-critical (extract before any deeper-build page lands)
1. **NURD drip wordmark SVG** — 3 color variants (green default, orange warm, cyan cool) — header + footer + hero + sticker
2. **Hero character render** — youth on hover-pad with tablet, NURD tee (IMG_1862) — Landing primary asset
3. **Hero character render alt** — youth in white VR goggles on hoverboard with palms (IMG_1879) — Final CTA banner
4. **Drip-style headline** — "THINK IT. PROMPT IT. LET'S BUILD IT." pre-rendered (IMG_1862) — Landing
5. **NURD mascot "I'm cool like that" badge** — small character sticker (IMG_1869, IMG_1873)
6. **Made in PLR badge** — palms + wordmark (multiple mockups)
7. **Circuit-board background tile** — neon green + cyan traces on near-black (all hero mockups)

### Tier 2 — needed for specific page launches
8. **ACHEEVY avatar** — gold-ringed astronaut/headset character (IMG_1870, IMG_1865)
9. **5-Nurds group illustration** — multi-ethnic group on neon circuit wave (IMG_1875)
10. **Pricing tier characters** — Curious Nurd (single student), Growing Nurd (single afro at laptop), Expert Nurd (trio team) (IMG_1873)
11. **NURD-tee skater on Scratch UI** — V.I.B.E. learner side (IMG_1858)
12. **Pro editor character with hologram laptop** — Professional Editor side (IMG_1858)
13. **Featured Project thumbnails** — 6 illustrations from IMG_1864 + 6 more from IMG_1878
14. **Robot mascot sidekick** — small companion to skater (IMG_1858, IMG_1869)

### Tier 3 — supplemental
15. **Forest-glade backdrop** — Execution Dashboard (IMG_1854)
16. **Ornamental vine corner SVGs** — botanical flourishes (IMG_1854)
17. **Brushed-metal panel texture** — Circuit Box (IMG_1837)
18. **Red emergency dome button + ON/OFF rocker** — operator surfaces
19. **About-page team photos** — placeholder, replace with real (IMG_1866)
20. **Six neon line-art icons** — capabilities + tribe + services (IMG_1836, IMG_1839, IMG_1880)

### Asset extraction workflow
- Use the original PNG mockups as source
- For each asset: crop, mask out background, save as transparent PNG (and WebP fallback)
- Drop into `client/public/assets/deeper-build/` or `client/src/assets/deeper-build/` per Vite import conventions
- Run image compression (WebP @ 85% quality, PNG with `pngquant`) — Phase 1.5 image optimization applies

---

## 8. Voice (extracted from copy across all 28 mockups)

### Headline patterns
- "NURDS CODE." (terminal period)
- "THINK IT. PROMPT IT. LET'S BUILD IT."
- "JOIN THE TRIBE OF NURDS."
- "JOIN THE REVOLUTION."
- "BECOME A NURD - JOIN NOW"
- "BE COOL LIKE THAT" / "Be cool. Code like that."

### Section headers (uppercase tracked, terminal-period optional)
- "FEATURED PROJECTS"
- "OUR SERVICES"
- "OUR MISSION & VALUES"
- "JOIN THE TRIBE"
- "EXECUTION DASHBOARD"
- "SECURITY & ACCESS SECTION"
- "PREFERENCES SECTION"

### Tier names (canonical)
- **Curious Nurd** — Free
- **Growing Nurd** — $29/month
- **Expert Nurd** — $99/month
- (Internal: "Chief Nurd" appears as Expert tier CTA destination — likely a community/role, not a price tier)

### CTA patterns
- "Start Building" / "Start Learning" / "Start Your Journey"
- "Join The Tribe" / "Join the Tribe of Nurds"
- "Upgrade to Pro" / "Level Up Your Nurd"
- "Become a Chief Nurd"
- "Open in Vibe Coding" — V.I.B.E. handoff
- "Practice in Vibe Coding" — Lesson → Lab handoff
- "Ask ACHEEVY" — chat invocation FAB
- "Sign in with voice" — voice-first auth (wires to `voice.foai.cloud`)

### Acronym mantras (brand canon)
- **FOSTER · DEVELOP · HONE** — character-development triad on ACHIEVERS billboard
- **S.M.A.R.T.** — goal-setting framework
- **P.A.C.T.** — accountability framework
- **S.T.E.A.M.** — Science / Tech / Engineering / Arts / Math
- Combined footer mantra: "Foster, Develop, Hone, S.M.A.R.T., P.A.C.T., S.T.E.A.M. - Be Cool Like That!"

### Audience pills (used in landing audience strip)
- **STUDENTS** — Unlock your potential
- **DEVELOPERS** — Build the future
- **EDUCATORS** — Inspire the next generation
- **TECH ENTHUSIASTS** — Explore new frontiers

---

## 9. Cross-theme guardrails

When working in **deeper-build** mode:
- Customer-facing copy NEVER names internal tools (OpenAI, GROQ, Cloudflare, Stripe, Modal, ElevenLabs, Daytona, Drizzle, Wouter, Shadcn, Discord = OK as public destination, GitHub = OK, etc.)
- Use function-name labels: "AI Code Generation", "Multi-model reasoning", "Voice Lane", "Edge Functions", "Payments", "Repositories", "Realtime DB"
- Photography is OK but secondary — character illustrations + neon are the visual leads
- No glass panels, no unrestrained gradients on body text
- Sharp corners on cards (`--radius: 0`) UNLESS a specific neon-glow card requires soft corner for halo effect

When working in **initiative-light NURD-drip-identity** mode:
- Drip-sticker badges + multi-color card borders + bright graphic-pop type ARE the visual hero
- Drip colors (green / orange / purple / blue) are first-class identity, used as primary CTA fill and sticker badges — not held back as restraint
- Cream / white background; full-color drip motifs centerpiece
- Character art + drip stickers welcome at hero scale
- Photography is supplemental, not the lead

---

## 10. Phasing & next steps

This canon doc is the source of truth for the deeper-build implementation. Implementation order in `docs/design/PAGE_INVENTORY.md`. Doctrinal violations + ship-blocking issues in `docs/design/DOCTRINAL_FLAGS.md`.

**Recommended Tier 1 implementation order:**

> NOTE: `/` Landing is the **Kokonut hero (light theme)** — already live, do NOT rebuild from IMG_1862. The deeper-build heroes (IMG_1862 / IMG_1842 / IMG_1869 / IMG_1875 / IMG_1879) are reusable below the Kokonut hero as section-level modules ("capabilities", "mid-page CTA", "final CTA") OR on alt routes (e.g., `/build`), but they are NOT the Landing hero.

1. **Global components** (NavBar, SiteFooter, DripLogo SVG, NeonDeviceFrame, CircuitBackground, MadeInPLRBadge)
2. **Asset extraction** (Tier 1 image list above) — done in parallel with global components
3. **Theme toggle infrastructure** — `[data-theme="deep"]` vs `[data-theme="initiative"]` root attribute, route-based default
4. **`/initiative` section** — light theme NURD-drip-identity (re-derive from IMG_1861/1866/1871/1878), separate from Landing
5. **Optional Landing enrichment** — extend the Kokonut Landing with deeper-build section modules below the hero (capabilities IMG_1836, tribe-preview IMG_1839, featured-projects IMG_1864, pricing-preview IMG_1873, final-CTA IMG_1879). The Kokonut hero stays at the top.
6. **Build `/auth`** with ACHEEVY chat assist (IMG_1870)
7. **Build `/pricing`** standalone (IMG_1873)
8. **Build `/tribe`** standalone (IMG_1839)
9. **Build `/services`** (IMG_1880)
10. **Build `/account/settings`** (IMG_1867)

Phase 2:
11. **Build `/learn` learning hub** (IMG_1841 + IMG_1883)
12. **Build `/chat` ACHEEVY surface** (IMG_1865) — wires voice via `voice.foai.cloud`
13. **Build `/build` editor surface** (IMG_1858, IMG_1859)
14. **Build `/projects` showcase** (IMG_1864 dark, IMG_1878 cream)

Phase 3 (operator-only, never customer-facing):
15. **`/owner/circuit-box`** (IMG_1837) — system management panel
16. **`/owner/execution`** (IMG_1854) — execution dashboard

Initiative-Light NURD-drip-identity section:
17. **`/initiative`** landing — re-derive hero from drip-stickered, multi-color mockups (IMG_1861, IMG_1866, IMG_1871, IMG_1878)
18. **`/initiative/about`** (IMG_1866)
19. **`/initiative/projects`** (IMG_1878)
20. **`/initiative/docs/api`** (IMG_1871) — pending tool-name scrub
