# A.I.M.S. Carrier Interface Spec v1.0

## Purpose

The A.I.M.S. Carrier Interface gives NURDSCODE a distinct command experience instead of a generic chat UI.

It supports voice, text, agent transmissions, build status, and tool visibility through a radio/pager-inspired interface.

## Carrier Label

```text
A.I.M.S.
```

Example status display:

```text
A.I.M.S. SIGNAL: SECURE
CHANNEL: NURDSCODE
MODE: FLIP | PAGER | DESKTOP | SWARM | BUILDER | TOOL HOUSE
```

## Modes

| Mode | Purpose |
|---|---|
| Flip Phone Mode | Voice-first push-to-talk command mode |
| Two-Way Pager Mode | Text-first prompt and response mode |
| Swarm Console Mode | Agent activity and status visibility |
| Builder Mode | Build Control Pack, stack selection, preview, logs, ship gate status |
| Tool House Mode | Warehouse shelf browser, tool cards, risk queue, adapter status |

## Send Interaction

```text
User presses SEND
-> chirp sound
-> transmission packet appears
-> Spinner classifies request
-> Primary Orchestrator acknowledges mission
-> Tool Selector selects tools
-> Stepper starts recipe
-> agents report visible status
-> receipt appears
```

## Agent Status Cards

Do not show private reasoning. Show operational status only.

Each status card should include:

```text
Agent / Role
Current action
Tool used
Status
Evidence link when available
Next action
```

## Pager Animation

When a streamed response is being prepared, the interface may show pager buttons pressing in sequence. This is a visual metaphor for transmission and should not imply that the system is manually typing hidden reasoning.

## Voice Behavior

- Speech-to-text records the user command.
- Chirp confirms send.
- Response may return as text, voice, or both.
- User can switch between voice and pager modes.
- All transcript records must be handled under the data map and privacy settings.

## Required UX States

Each mode must include:

- Loading state
- Empty state
- Error state
- Success state
- Timeout state
- Retry state
- Human review required state
- Blocked by policy/security state

## Failure Conditions

The interface fails the mission if:

- It looks like a normal chatbot with no routing/build context.
- It hides all build progress from the user.
- It exposes private chain-of-thought.
- It implies work is done without receipt evidence.
- It lets users run unknown tools directly against live projects.
