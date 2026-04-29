# Warehouse Migration Map v5.x to v6.0

## Purpose

This map converts prior owner-named warehouse documents into the Universal Ecosystem Tool Warehouse v6.0.

## Core Migration Rules

1. Remove hardcoded owner and maintainer labels.
2. Convert branded roles into generic roles with optional aliases.
3. Replace fixed tool counts with dynamic registry counts.
4. Replace star ratings with evidence-backed readiness status.
5. Separate public-facing tool records from internal routing, cost, and security records.
6. Move any unverified tool to Candidate or Raw Material status.
7. Move risky or unknown tools to Emerging / Quarantine Shelf.
8. Do not preserve commercial or release claims unless evidence exists.

## Role Migration

| Prior Label | v6 Role |
|---|---|
| ACHEEVY | Primary Orchestrator |
| NTNTN | Quality Gatekeeper |
| SIVIS | Strategy Gatekeeper |
| Picker_Ang | Tool Selector |
| Buildsmith | Build Engine |
| The Farmer | Security Reviewer |
| Chronicle | Evidence Logger |
| House of Alchemist | Tool Governance Layer |
| House of ANG | Specialist Agent Pool |
| Plug Factory | Build Factory |
| Alchemical Warehouse | Universal Ecosystem Tool Warehouse |
| Formula Registry | Tool Registry |
| Circuit Box | Service Capability Map |
| Circuit Breaker | Isolated Service Connector |
| Charter | User-Facing Receipt |
| Ledger | Internal Evidence Log |

## Status Migration

| Prior Status | v6 Status |
|---|---|
| Production-Ready without evidence | Commercial-Gate Pending |
| 5-star active | Approved Adapter only if tested; otherwise Candidate |
| Beta | Candidate or Sandbox-Verified |
| Deprecated | Deprecated |
| Confidential | Restricted Internal Capability |
| New / trending | Raw Material |
| Integrated | Approved Adapter only if evidence exists |

## Shelf Migration

Prior shelves should be mapped to the new 24-shelf model. When a tool fits multiple shelves, store one primary shelf and multiple capability tags.

Example:

```yaml
tool_id: "goose_agent"
primary_shelf: "shelf_05_code_generation_and_coding_agents"
capability_tags:
  - "agent_runtime"
  - "mcp"
  - "cli"
  - "desktop_agent"
  - "sandbox_mode"
```

## Migration Completion Criteria

- All prior tools have a v6 tool card or are recorded in the migration exception log.
- All old owner names have been moved to aliases or implementation notes.
- All fixed production claims have been converted to evidence status.
- All internal costs are moved to restricted fields.
- All unknown repos/tools are assigned to Emerging / Quarantine Shelf.
- Router rules and Stepper recipes only reference Approved Adapter, Governed Core, or Sandbox-Verified tools.
