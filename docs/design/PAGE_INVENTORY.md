# NURD CODE — Page Inventory (mockup → route → recreatability tier)

Mapping every IMG_1841.zip mockup to its proposed route in the NURD CODE app. Recreatability classification:

- **HIGH** = layout fully recreatable with React + Tailwind, minimal asset extraction
- **MEDIUM** = layout recreatable + 1-3 image assets to extract (character renders, scene art)
- **LOW** = mostly artwork; use the image as-is or as a decorative section background

| Image | Surface / page identification | Theme | Suggested route | Tier |
|---|---|---|---|---|
| IMG_1836 | Capabilities / Unified Platform feature grid | deeper-build | `/` mid-section or `/about#capabilities` | HIGH |
| IMG_1837 | Operator Circuit Box system management panel | deeper-build (industrial variant) | `/owner/circuit-box` (operator-only, NEVER customer-facing) | MEDIUM |
| IMG_1839 | "JOIN THE TRIBE" community section | deeper-build | `/tribe` or `/community` | HIGH |
| IMG_1841 | Learning hub — V.I.B.E. + ACHIEVERS landing | hybrid | `/learn` (primary) | MEDIUM |
| IMG_1842 | "Think It. Prompt It. Let's Build It." hero | deeper-build | `/` Landing hero (alternate to IMG_1862) | MEDIUM |
| IMG_1843 | Top navigation bar with mega-menu | deeper-build | Global `<NavBar>` component | HIGH |
| IMG_1854 | Execution Dashboard (botanical / forest-glade) | deeper-build (botanical variant) | `/owner/execution` (operator-only) | MEDIUM-LOW |
| IMG_1858 | V.I.B.E. vs Professional Code Editor split | deeper-build | `/build` lane comparison module OR `/learn` lane intro | MEDIUM |
| IMG_1859 | Build features matrix — Professional Development Tools | deeper-build | `/build` features section | MEDIUM |
| IMG_1861 | "Think It / Prompt It / Let's Build It" 3-step flow | initiative-cream (light) | `/think` → `/` ("How it works" rail, light island within deeper) | HIGH |
| IMG_1862 | Landing hero — skater on hover-pad (drip headline) | deeper-build | `/` Landing hero (CANONICAL deeper-build hero) | MEDIUM |
| IMG_1863 | Voice Assistant agent demo — Sockeye Financial phone mock | deeper-build | `/agents` / `/showcase` ("What you can build" sample) | HIGH |
| IMG_1864 | Featured Projects gallery (dark) | deeper-build | `/projects` (deeper-build) | HIGH |
| IMG_1865 | Chat with ACHEEVY — IDE shell layout | deeper-build | `/chat` (Carrier Interface Builder mode) | HIGH |
| IMG_1866 | About NurdsCode — Mission/Values + Team grid | initiative-cream | `/about` or `/initiative/about` | HIGH |
| IMG_1867 | Profile Settings dashboard | deeper-build | `/account/settings` (with sub-routes) | HIGH |
| IMG_1868 | "Sockeye OS — Deep Water" decorative HUD | deeper-build (cyan variant) | raw asset / decorative bg only | LOW |
| IMG_1869 | Landing hero — split devices + audience pills | deeper-build | `/` Landing hero alt (same family as IMG_1862) | HIGH |
| IMG_1870 | Auth screen — Login + 3-step Register + ACHEEVY chat | deeper-build | `/auth` (or `/login` + `/register`) | HIGH |
| IMG_1871 | API & Integration documentation overview | initiative-cream (light) | `/initiative/docs/api` or `/docs/integrations` | HIGH |
| IMG_1873 | Pricing tiers — Curious / Growing / Expert Nurd | deeper-build | `/pricing` | HIGH |
| IMG_1875 | Mid-page CTA section — "Join Thousands of Nurds" | deeper-build | `/` (below hero, before pricing) | HIGH |
| IMG_1876 | Site footer (5-col + newsletter + sister-sites) | deeper-build | Global `<SiteFooter>` component | HIGH |
| IMG_1878 | Featured Projects grid (cream) | initiative-cream | `/initiative/projects` | HIGH |
| IMG_1879 | Final CTA banner — "Ready to Think It..." | deeper-build | `/` (final CTA section) | HIGH |
| IMG_1880 | "OUR SERVICES" 3-tile grid | deeper-build | `/services` | HIGH |
| IMG_1882 | Site footer (4-col, alt variant) | deeper-build | Global `<SiteFooter>` component (alt) | HIGH |
| IMG_1883 | NURD Learning Platform — Course/Lesson dashboard | deeper-build | `/learn/[course]/[lesson]` | MEDIUM |
| 1a6ee56f… | Tech Stack & Infrastructure reference | deeper-build | `/owner/architecture` (internal-only — see DOCTRINAL_FLAGS) | HIGH-but-blocked |

---

## Counts

- Total valid mockups: **28** (IMG_1855.PNG empty, excluded)
- Recreatability HIGH: 17 — straight-build with React + Tailwind primitives
- Recreatability MEDIUM: 10 — need 1-3 image assets per page (character renders, scene art, drip headlines)
- Recreatability LOW: 1 (IMG_1868 — decorative only)
- Operator-only / customer-blocked: 3 (IMG_1837, IMG_1854, 1a6ee56f…)

---

## Routing summary

### Deeper Build surfaces (dark theme default)

| Route | Source mockup(s) | Tier |
|---|---|---|
| `/` (Landing) | IMG_1862 (canonical hero), IMG_1842 (alt), IMG_1869 (alt), IMG_1875 (mid-CTA), IMG_1836 (capabilities), IMG_1839 (tribe section), IMG_1864 (projects), IMG_1873 (pricing preview), IMG_1879 (final CTA) | T1 |
| `/auth` | IMG_1870 | T1 |
| `/pricing` | IMG_1873 | T1 |
| `/tribe` (or `/community`) | IMG_1839 | T1 |
| `/services` | IMG_1880 | T1 |
| `/account/settings` (+ sub-routes) | IMG_1867 | T1 |
| `/projects` (or `/showcase`) | IMG_1864 | T1 |
| `/agents` (or `/showcase/agents`) | IMG_1863 | T2 |
| `/learn` (Learning hub) | IMG_1841, IMG_1883 | T2 |
| `/learn/[course]/[lesson]` | IMG_1883 | T2 |
| `/build` (V.I.B.E. lane) | IMG_1858, IMG_1859 | T2 |
| `/chat` (ACHEEVY) | IMG_1865 | T2 |

### Initiative Cream surfaces (light theme default)

| Route | Source mockup(s) | Tier |
|---|---|---|
| `/initiative` (Landing — preserves current Coastal-aligned home) | (current PR #16 hero) | T1 |
| `/initiative/about` | IMG_1866 | T1 |
| `/initiative/projects` | IMG_1878 | T1 |
| `/initiative/docs/api` | IMG_1871 | T2 (after tool-name scrub) |
| `/think` (3-step flow) | IMG_1861 | T2 (could live on `/initiative` or as cream-island within deeper) |

### Operator-only (gated, NEVER customer-facing)

| Route | Source mockup | Tier |
|---|---|---|
| `/owner/circuit-box` | IMG_1837 | T3 |
| `/owner/execution` | IMG_1854 | T3 |
| `/owner/architecture` | 1a6ee56f… | T3 (after tool-name scrub OR keep as internal-only doc, no customer route) |

### Global / cross-cutting

| Component | Source mockup |
|---|---|
| `<NavBar>` | IMG_1843 |
| `<SiteFooter>` | IMG_1876, IMG_1882 |
| `<DripLogo>` | All hero mockups |
| `<CircuitBackground>` | All deeper-build surfaces |
