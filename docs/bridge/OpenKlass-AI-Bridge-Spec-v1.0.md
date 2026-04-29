# OpenKlass AI Bridge Spec v1.0

## Purpose

The OpenKlass AI bridge connects NURDSCODE build outputs to OK.FOAI.cloud as learning, lab, assessment, and evidence artifacts.

OpenKlass AI must receive approved objects, not raw internal tool activity.

## Bridge Rule

```text
NURDSCODE Project
-> Build Control Pack
-> Tool Manifest
-> Evidence Receipt
-> Learning Object
-> OpenKlass AI
```

## Object Types

| Artifact Type | Description |
|---|---|
| build_control_pack | Product brief, roles, data map, architecture, threat model, vertical slice, definition of done |
| tool_manifest | Tools selected for a project, status, risk level, evidence level |
| course_lab | Learning lab generated from a build or workflow |
| assessment | Quiz, test, rubric, or skill check generated from project work |
| evidence_receipt | Self-Check or Ship Gate receipt |
| media_asset | Approved video, audio, image, or interactive learning asset |

## API Endpoint

```text
POST /api/bridge/openklass/ingest
```

## Payload

```json
{
  "source_platform": "nurdscode",
  "target_platform": "openklass_ai",
  "artifact_type": "tool_manifest | build_control_pack | course_lab | assessment | evidence_receipt | media_asset",
  "project_id": "uuid-or-project-key",
  "organization_id": "uuid-or-org-key",
  "warehouse_tool_ids": [],
  "readiness_status": "raw_material | candidate | sandbox_verified | approved_adapter | release_eligible",
  "evidence_level": "none | metadata | install_test | smoke_test | integration_test | release_evidence",
  "security_status": "not_reviewed | needs_review | approved | blocked",
  "human_review_required": true,
  "public_summary": "",
  "internal_receipt_url": "",
  "metadata": {},
  "created_at": "ISO-8601"
}
```

## Acceptance Rules

OpenKlass AI may accept:

- Approved learning objects
- Build Control Packs
- Tool explanations
- Course/lab drafts
- Assessments
- Receipts
- Public summaries

OpenKlass AI must not receive:

- Raw secrets
- Internal cost records
- Private route scoring
- Unreviewed security findings as public content
- Unverified release claims
- Internal-only usage credits

## Required Bridge Receipt

Each bridge event must create an evidence record:

```text
Bridge event ID
Source project
Artifact type
Tool IDs used
Readiness status
Security status
Human review flag
Timestamp
Result: PASS / FAIL / BLOCKED
```
