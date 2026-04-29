#!/usr/bin/env bash
set -euo pipefail

SELF_CHECK_DIR="ai-managed-solutions-self-check"
OPERATOR_FILE="operator.yaml"
RECEIPT_DIR="docs/ship/receipts"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$RECEIPT_DIR"

echo "[NURDSCODE] vNext Self-Check run starting"
echo "[NURDSCODE] Repo: $(pwd)"
echo "[NURDSCODE] Timestamp: $TIMESTAMP"

if [ ! -d "docs" ]; then
  echo "BLOCKED: docs package is missing. Add vNext docs package before running Self-Check."
  exit 1
fi

if [ ! -f "docs/agents/Coding-Agent-Execution-Brief.md" ]; then
  echo "BLOCKED: vNext directive package appears incomplete. Missing docs/agents/Coding-Agent-Execution-Brief.md"
  exit 1
fi

if [ ! -d "$SELF_CHECK_DIR" ]; then
  echo "BLOCKED: Self-Check Kit directory not found at $SELF_CHECK_DIR"
  echo "Action: update SELF_CHECK_DIR in scripts/run-self-check.sh or copy the kit into the repo."
  exit 1
fi

if [ ! -f "$SELF_CHECK_DIR/audit.py" ]; then
  echo "BLOCKED: audit.py not found in $SELF_CHECK_DIR"
  exit 1
fi

if [ ! -f "$OPERATOR_FILE" ]; then
  echo "NOTICE: $OPERATOR_FILE not found. The coding agent must generate it from repo evidence before audit can complete."
  echo "BLOCKED: operator.yaml missing. Generate operator.yaml from repo evidence, then rerun this script."
  exit 1
fi

echo "[NURDSCODE] Running Self-Check audit"
python "$SELF_CHECK_DIR/audit.py" "./$OPERATOR_FILE" | tee "$RECEIPT_DIR/self-check-$TIMESTAMP.log"

echo "[NURDSCODE] Self-Check log written to $RECEIPT_DIR/self-check-$TIMESTAMP.log"
echo "[NURDSCODE] Update docs/ship/NURDSCODE-Ship-Gate-Map.md with evidence-backed status only."
