# Universal Ecosystem Tool Warehouse v6.0

## Purpose

The Universal Ecosystem Tool Warehouse is the owner-neutral registry for tools, models, frameworks, agents, APIs, CLIs, SDKs, templates, recipes, automations, sandboxes, and deployment capabilities used across the ecosystem.

It replaces any single-platform or owner-named warehouse as the canonical tool governance layer.

## Core Functions

1. Store tool knowledge.
2. Classify tool readiness.
3. Route tool selection.
4. Govern security and license review.
5. Maintain automation recipes.
6. Track evidence.
7. Bridge approved outputs into ecosystem platforms such as NURDSCODE and OpenKlass AI.

## Owner-Neutral Language

Do not hardcode a named owner in the universal warehouse.

Use generic role labels:

| Generic Term | Alias Allowed |
|---|---|
| Primary Orchestrator | ACHEEVY |
| Tool Selector | Picker_Ang |
| Build Engine | Buildsmith |
| Security Reviewer | The Farmer / Guard_Ang |
| Evidence Logger | Chronicle |
| Quality Gatekeeper | NTNTN |
| Strategy Gatekeeper | SIVIS |
| Specialist Agent Pool | House of ANG / Boomer_Angs |
| Build Factory | Plug Factory |
| Internal Evidence Log | Ledger |
| User-Facing Receipt | Charter |
| Internal Usage Credits | Melanium Ingots |
| User-Facing Credits | Platform Credits |

## Status Model

| Status | Meaning | Allowed Use |
|---|---|---|
| Raw Material | Known tool, not reviewed | Research only |
| Candidate | Basic metadata exists | Sandbox queue |
| Quarantined | Useful but unresolved risk | No project injection |
| Sandbox-Verified | Installs/runs in isolation | Sandbox projects only |
| Approved Adapter | Bounded integration exists | Controlled builds |
| Governed Core | Default ecosystem capability | Platform workflows |
| Commercial-Gate Pending | Works but lacks proof | No paid customer path |
| Release-Eligible | Evidence exists for security, tests, docs, operations | Commercial paths allowed |
| Deprecated | Replaced or stale | No new usage |
| Blocked | Security, legal, license, or operational issue | Not available |

Rule: UNVERIFIED is not PASS.

## Shelf Map

| Shelf | Category | Purpose |
|---:|---|---|
| 1 | Orchestration & Agent Core | Agent frameworks, multi-agent systems, planning engines |
| 2 | Router / Tool Selection | Spinner, tool selector, stack selector, policy routing |
| 3 | Automation Recipes | Stepper recipes, workflow automation, build scripts |
| 4 | Sandbox & Runtime Isolation | Daytona, Modal, OpenSandbox-style execution, containers |
| 5 | Code Generation & Coding Agents | Claude Code, Gemini CLI, Codex, Goose, Aider, Cursor, OpenCode-style tools |
| 6 | App Builders & Vibe Builders | VibeCode-style builders, Bolt, v0, Lovable, Replit, mobile/web builders |
| 7 | Web Frameworks | Next.js, React, Vite, Remix, Astro, SvelteKit |
| 8 | Mobile & Cross-Platform | Expo, React Native, Flutter, Kotlin, Swift, EAS |
| 9 | Backend & APIs | FastAPI, Hono, Express, NestJS, GraphQL, gRPC |
| 10 | Data, Memory & Persistence | Neon, Supabase, Postgres, Redis, Chroma, Pinecone, DuckDB |
| 11 | Research & Retrieval | AutoResearch, Perplexity, Tavily, Firecrawl, Jina, academic retrieval |
| 12 | Browser / Scraper Squadron | Browser agents, local browser automation, scraping, form automation |
| 13 | AI Organization Systems | Paperclip-style AI companies, multi-agent org charts, governance dashboards |
| 14 | Voice, Audio & Push-to-Talk | Whisper, Deepgram, VAPI, ElevenLabs, Parakeet, radio-style voice UX |
| 15 | Media, Video & Simulation | LTX, Runway, HeyGen, Open Higgsfield, Omniverse, Cosmos, VASE |
| 16 | Design & Generative UI | C1, Figma, Canva, shadcn/ui, Framer Motion, design agents |
| 17 | Marketing & Growth | Programmatic marketing, CRM, ad tools, email tools, Badgers route |
| 18 | Education & Learning | OpenKlass AI bridge, LMS, course tools, assessment generators |
| 19 | Security, Policy & Compliance | Trivy, Snyk, Semgrep, VirusTotal, OPA, Gatekeeper, Vault |
| 20 | QA, Testing & Evaluation | Playwright, Cypress, Vitest, Jest, k6, synthetic users, evaluation harnesses |
| 21 | Observability & Evidence | OpenTelemetry, Sentry, Langfuse, logs, receipts, proof bundles |
| 22 | Billing, Usage & Marketplace | Stripe, RevenueCat, usage credits, subscriptions, white-label pricing |
| 23 | File Systems & Workspace | Pewter, SmelterOS workspace, object storage, project file graph |
| 24 | Emerging / Quarantine Shelf | OpenClaw, MoltBot, Hermes Agent, Agent Zero, Goose, CoPaw, NemoClaw, OpenSandbox, Remy, new repos |

## Tool Lifecycle

```text
Discovery
-> Candidate Tool Card
-> Metadata Review
-> License Review
-> Security Review
-> Sandbox Install
-> Smoke Test
-> Adapter Design
-> Route Registration
-> Stepper Recipe
-> Evidence Receipt
-> Approved Adapter
-> Governed Core, if repeatedly used and evidence-backed
```

## Tool Ingestion Rule

When a user requests a missing tool:

```text
1. Router detects missing capability.
2. Tool Selector searches the warehouse.
3. Candidate Tool Card is created if missing.
4. Tool is cloned or connected in quarantine.
5. Security Reviewer checks license, repo activity, secrets, dependencies, and data access.
6. Sandbox runs install and smoke test.
7. Evidence Logger writes a receipt.
8. Quality Gatekeeper classifies approve, sandbox-only, watch, or block.
9. Router receives route tags.
10. Tool becomes selectable only at approved level.
```

## Public vs Internal Split

Public tool records may show:

- Tool name
- Purpose
- Use cases
- Availability
- Required plan
- Data access notice
- Status
- Limitations
- Support level

Internal tool records may include:

- Cost
- Secrets
- Provider limits
- Security risk
- Known failures
- Adapter code
- Router logic
- Smoke test result
- Usage logs
- Internal credits

Never expose internal costs, markups, secrets, route scoring, private evidence logs, or security weaknesses in user-facing surfaces.
