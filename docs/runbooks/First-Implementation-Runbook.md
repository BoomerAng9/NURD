# First Implementation Runbook

## Goal

Add the vNext directive package to the repo, run the Self-Check Kit, and prepare the first complete vertical slice.

## Branch

```bash
git checkout -b nurdscode-aims-vnext
```

## Step 1 - Add Directive Package

```bash
mkdir -p docs/architecture docs/warehouse docs/bridge docs/ux docs/agents docs/ship docs/runbooks scripts
# Copy this package's docs and scripts into the repo root.
chmod +x scripts/run-self-check.sh
```

## Step 2 - Commit Directive Package

```bash
git add docs scripts
git commit -m "Ship NURDSCODE vNext directive package"
```

## Step 3 - Run Self-Check

```bash
./scripts/run-self-check.sh
```

If the script fails because the kit path is different, edit `SELF_CHECK_DIR` in the script and rerun.

## Step 4 - Store Receipt

Store the generated receipt in:

```text
docs/ship/receipts/
```

If the repo already has a receipt path, use the established repo path and add a pointer in `docs/ship/Self-Check-Run-Directive.md`.

## Step 5 - Update Ship Gate Map

Update:

```text
docs/ship/NURDSCODE-Ship-Gate-Map.md
```

Change only items with evidence from UNVERIFIED to PASS or FAIL.

## Step 6 - Name First Vertical Slice

The first vertical slice should be:

```text
User signs in
-> opens A.I.M.S. carrier interface
-> submits prompt
-> Spinner classifies intent
-> Tool Selector checks warehouse
-> Stepper provisions workspace
-> Build Control Pack is generated
-> Self-Check receipt is visible
-> OpenKlass bridge payload is generated if relevant
```

## Step 7 - Do Not Expand Scope

Do not add unrelated tools, pages, agents, media generators, marketplace logic, or billing until the first vertical slice is verified.
