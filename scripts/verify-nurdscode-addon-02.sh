#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "docs/agents/NURDSCODE-vNext-Dev-Cycle-Directive-Add-On-02.md"
  "docs/changelog/NURDSCODE-vNext-Add-On-02-Changelog.md"
  "docs/warehouse/tool-cards/google-ai-backbone-tools.yaml"
  "docs/bridge/openklass-google-ai-bridge-fields.json"
  "docs/ship/NURDSCODE-vNext-Add-On-02-Ship-Receipt.md"
)

missing=0
for f in "${required_files[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "MISSING: $f"
    missing=1
  else
    echo "PASS: $f"
  fi
done

if [[ "$missing" -ne 0 ]]; then
  echo "FAIL: NURDSCODE Add-On 02 package is incomplete."
  exit 1
fi

if ! grep -q "Google AI Backbone" docs/agents/NURDSCODE-vNext-Dev-Cycle-Directive-Add-On-02.md; then
  echo "FAIL: Directive does not contain Google AI Backbone language."
  exit 1
fi

if ! grep -q "gemini_cli" docs/warehouse/tool-cards/google-ai-backbone-tools.yaml; then
  echo "FAIL: Tool card file does not include Gemini CLI."
  exit 1
fi

if ! grep -q "private_paid" docs/bridge/openklass-google-ai-bridge-fields.json; then
  echo "FAIL: OpenKlass bridge file does not include privacy mode."
  exit 1
fi

echo "PASS: NURDSCODE vNext Add-On 02 directive package verified."
echo "NEXT: Run the existing Self-Check Kit before feature expansion."
