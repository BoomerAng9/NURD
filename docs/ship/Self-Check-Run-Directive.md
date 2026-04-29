# Self-Check Run Directive

## Required Action

Create the vNext docs package in the repo, then run the Self-Check Kit against the current NURDSCODE repo before writing new feature code.

The repo has already been assessed. This run is not a new discovery interview. It is the evidence-producing checkpoint that must happen before further build work.

## Expected Self-Check Workflow

```text
1. Confirm vNext docs package exists.
2. Locate the Self-Check Kit.
3. Inspect the current repo state.
4. Generate or update operator.yaml based only on evidence.
5. Run the audit script against operator.yaml.
6. Generate the receipt.
7. Store receipt under docs/ship/receipts/ or the repo's established receipt path.
8. Update the Ship Gate Map.
9. Name the next complete vertical slice.
```

## Preferred Command Pattern

```bash
python ai-managed-solutions-self-check/audit.py ./operator.yaml
```

If the kit is stored elsewhere, update the path and record the actual command used.

## Required Receipt Output

The receipt must include:

- Application name
- Review date
- Repository inspected
- Readiness label
- What works
- What is missing
- What is unverified
- Evidence found
- Evidence not found
- High-priority gaps
- Recommended next steps
- Notes for the next coding session

## Failure Handling

If the Self-Check Kit cannot run, record:

```text
BLOCKED: Self-Check Kit could not run.
Reason:
Path checked:
Command attempted:
Missing dependency:
Next fix:
```

Do not continue to new feature work until this is resolved or formally accepted as a blocker.
