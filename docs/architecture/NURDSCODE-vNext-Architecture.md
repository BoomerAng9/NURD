# NURDSCODE vNext Architecture Directive

## Status

Release Type: Architecture and operating directive update
Project State: Existing Build, redirected into vNext architecture
Application Release Status: Not release-eligible until evidence gates pass

The existing repository assessment is treated as prior state. This directive does not reopen discovery. It defines the next build path and the required evidence sequence.

## Mission

NURDSCODE is the ecosystem build control plane for creating applications, automations, AI-agent workflows, learning artifacts, and deployment-ready systems through a governed A.I.M.S. workflow.

The platform must not behave like a generic coding chatbot. It must operate as a routed build environment:

```text
Prompt -> Mission Anchor -> Route -> Tool Match -> Sandbox -> Build -> Verify -> Receipt -> Deploy/Bridge
```

## vNext Architecture

### Core Stack

| Layer | vNext Direction |
|---|---|
| Web control plane | Next.js or React dashboard |
| Mobile/app output | React Native + Expo |
| Authentication | Firebase Auth first; Better Auth later if self-hosting is required |
| Database | Neon Postgres |
| ORM | Prisma or Drizzle |
| File/workspace layer | Pewter-compatible workspace model with SmelterOS-style file graph |
| Storage | Google Cloud Storage or Firebase Storage |
| AI model access | Vertex AI + OpenRouter |
| Agent runtime | Cloud Run |
| Sandbox | Daytona, OpenSandbox-style runtime, or isolated Cloud Run Jobs |
| Automation | Stepper recipes + GitHub Actions + Cloud Run Jobs |
| Tool governance | Universal Ecosystem Tool Warehouse v6.0 |
| Routing | Spinner / Router |
| Tool selection | Tool Selector |
| Evidence | Self-Check Kit + Ship Checklist |
| Mobile build | Expo EAS |
| Billing | Stripe |
| OpenKlass bridge | OK.FOAI.cloud bridge API |

### Retained from Prior Direction

- GCP remains the main infrastructure environment.
- Vertex AI remains the heavy AI and agent reasoning layer.
- Cloud Run remains the runtime for ACHEEVY-style agent services.
- Neon remains the preferred relational database for the warehouse and platform records.
- Firebase remains the preferred fast authentication and hosting assist layer.
- Cloudflare may remain useful for DNS, CDN, WAF, simple routing, and optional object storage, but it is not the main application brain.

## Primary System Roles

| Generic Role | Current Ecosystem Alias |
|---|---|
| Primary Orchestrator | ACHEEVY |
| Doctrine / Operating Skill | A.I.M.S. |
| Router | Spinner |
| Automation Runner | Stepper |
| Tool Selector | Picker_Ang |
| Build Engine | Buildsmith |
| Evidence Logger | Chronicle |
| Security Reviewer | The Farmer / Guard_Ang |
| Specialist Agent Pool | Boomer_Angs |
| Fast Swarm Workers | Lil_Hawks |
| Scraping/Research Team | Squadron |
| Learning Platform Bridge | OpenKlass AI |

The vNext warehouse must be owner-neutral. Aliases may exist, but the universal registry cannot depend on one named owner or one branded implementation.

## Required First Vertical Slice

The first vNext slice must prove the full product path without adding unrelated features:

```text
User signs in
-> opens A.I.M.S. carrier interface
-> submits a build prompt
-> Spinner classifies intent
-> Tool Selector checks the warehouse
-> Stepper provisions a controlled workspace
-> Build Control Pack is generated
-> sandbox/build path creates a starter artifact
-> Self-Check receipt is generated
-> Ship Gate status is updated
-> OpenKlass bridge payload is generated when relevant
```

## Build Constraints

- Do not build isolated features that cannot be tested through a real user path.
- Do not inject unknown tools directly into projects.
- Do not use raw GitHub repos outside sandbox until classified.
- Do not expose secrets, internal costs, routing logic, or private evidence logs in user-facing surfaces.
- Do not label any build release-eligible without evidence.

## Completion Standard

This architecture update is complete only when:

1. The vNext docs package exists in the repo.
2. The Self-Check Kit has run or a blocker has been logged.
3. A Self-Check receipt exists.
4. The current Ship Gate status is recorded.
5. The next complete vertical slice is named.
