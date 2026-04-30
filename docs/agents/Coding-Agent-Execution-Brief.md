# Coding Agent Execution Brief

## Directive

Apply the Build Control Pack + Evidence-Based Shipping Protocol to NURDSCODE vNext.

The repository has already been assessed. Treat it as an existing build being redirected into vNext architecture. Do not restart discovery. Do not begin feature expansion until this directive package exists in the repo and the Self-Check Kit has been run or a blocker has been recorded.

## Immediate Task

Create the vNext docs package in the repository, then run the Self-Check Kit against the current NURDSCODE repo before writing new feature code.

## Required Files to Add

```text
docs/architecture/NURDSCODE-vNext-Architecture.md
docs/warehouse/Universal-Ecosystem-Tool-Warehouse-v6.0.md
docs/warehouse/Tool-Card-Schema-v6.0.yaml
docs/warehouse/Warehouse-Postgres-Schema-v6.0.sql
docs/warehouse/Warehouse-Migration-Map-v5-to-v6.md
docs/bridge/OpenKlass-AI-Bridge-Spec-v1.0.md
docs/ux/AIMS-Carrier-Interface-Spec-v1.0.md
docs/agents/AIMS-Spinner-Stepper-Operating-Model.md
docs/agents/Coding-Agent-Execution-Brief.md
docs/ship/NURDSCODE-Ship-Gate-Map.md
docs/ship/Self-Check-Run-Directive.md
docs/runbooks/First-Implementation-Runbook.md
scripts/run-self-check.sh
```

## Required Stack Direction

Use this vNext stack direction:

- Web dashboard: Next.js or React
- Mobile output: React Native + Expo
- Auth: Firebase Auth first; Better Auth later if needed
- Database: Neon Postgres
- ORM: Prisma or Drizzle
- AI: Vertex AI + OpenRouter
- Agent runtime: Cloud Run
- Sandbox: Claude managed agents (Anthropic Claude Agent SDK), or isolated Cloud Run Jobs
- Tool governance: Universal Ecosystem Tool Warehouse v6.0
- Routing: Spinner
- Automation: Stepper
- Tool selection: Tool Selector
- Evidence: Self-Check Kit + Ship Checklist
- Bridge: OpenKlass AI / OK.FOAI.cloud

## Required Build Control Pack

Create or update:

1. Product Intent Brief
2. User Roles and Permission Map
3. Data Handling Map
4. Architecture Decision Record
5. Threat Model Lite
6. Vertical Slice Build Plan
7. Definition of Done with Evidence
8. Self-Check Receipt Plan
9. Ship Checklist Gate Map

## Self-Check Requirement

After the docs package is added:

1. Locate the Self-Check Kit.
2. Run the Self-Check workflow against the repo.
3. Generate or update `operator.yaml`.
4. Run the audit script.
5. Produce the receipt.
6. Store the receipt in `docs/ship/receipts/` or the repository's existing receipt path.
7. Record blockers if the Self-Check Kit is missing or cannot run.

## Do Not Proceed Until

- The docs package exists.
- Self-Check was run or a blocker was recorded.
- Current Ship Gate status is updated.
- The next vertical slice is listed.

## Required Response After Running

```md
# Build Session Receipt

## 1. Current Project State
State: Existing Build / Rescue
Reason:

## 2. Current Ship Gate
Gate:
Pass/Fail Status:
Reason:

## 3. What Changed
-

## 4. Files Changed
-

## 5. Commands Run
```bash
# commands here
```

## 6. Tests and Checks Run
- [ ] App start verified
- [ ] Type check run
- [ ] Lint run
- [ ] Unit tests run
- [ ] Integration tests run
- [ ] Auth flow checked
- [ ] Protected routes checked
- [ ] Tenant/user isolation checked
- [ ] Input validation checked
- [ ] Error handling checked
- [ ] Environment variables checked
- [ ] Secrets scan checked
- [ ] Self-Check Kit run
- [ ] Ship Gate map updated

## 7. Evidence
-

## 8. Security Review
Passed:
-
Failed:
-
Unverified:
-

## 9. Ship Checklist Items Affected
- Gate:
- Item:
- Status:
- Evidence:

## 10. Known Blockers
-

## 11. Next Required Action
-
```

## Non-Negotiables

- Never say done without evidence.
- Never treat UNVERIFIED as PASS.
- Never build new features before the directive package and Self-Check run.
- Never inject unknown tools into active projects without warehouse classification.
- Never expose internal costs, secrets, private route logic, or internal evidence logs.
