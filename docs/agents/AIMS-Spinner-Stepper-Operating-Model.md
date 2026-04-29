# A.I.M.S. + Spinner + Stepper Operating Model

## Core Rule

A.I.M.S. governs. Spinner routes. Stepper automates.

No component replaces the others.

## Role Definitions

| Component | Role |
|---|---|
| A.I.M.S. | Mission doctrine, state classification, anticipation, validation discipline |
| Spinner / Router | Intent classification and routing to agents, tools, stacks, and workflows |
| Stepper / Automation | Executes approved recipes and repeatable steps |
| Tool Selector | Chooses tools from the warehouse based on capability and risk |
| Evidence Logger | Records receipts, logs, tests, and proof |
| Security Reviewer | Checks risks, secrets, dependencies, policies, and tool boundaries |
| Quality Gatekeeper | Approves, blocks, or escalates work based on evidence |

## Request Flow

```text
User prompt
-> A.I.M.S. mission anchor
-> state classification
-> Spinner route decision
-> Tool Selector checks warehouse
-> Stepper runs approved recipe
-> sandbox/build system executes
-> Evidence Logger records proof
-> Quality Gatekeeper reviews where needed
-> result returns to user with receipt
```

## Spinner Responsibilities

Spinner must determine:

- User intent
- Required output type
- Required stack
- Required agent team
- Tool category
- Risk level
- Whether sandbox is required
- Whether OpenKlass bridge is needed
- Whether human approval is required
- Current ship gate impact

Spinner must not:

- Pretend unverified tools are approved
- Bypass the warehouse
- Execute risky steps without Stepper and sandbox
- Make release claims without evidence

## Stepper Responsibilities

Stepper may execute:

- Create repo/branch
- Copy docs package
- Generate Build Control Pack
- Run install commands
- Provision sandbox
- Run tests
- Run scans
- Create preview deployment
- Generate evidence receipt
- Trigger OpenKlass bridge payload

Stepper must not:

- Decide tool safety alone
- Run unknown tools outside quarantine
- Expose secrets
- Skip evidence records
- Continue after a ship gate failure without logging the failure

## Tool Selector Responsibilities

Tool Selector must:

- Search the warehouse first
- Prefer Governed Core or Approved Adapter tools
- Use Sandbox-Verified tools only inside controlled boundaries
- Create Candidate Tool Cards for missing tools
- Route uncertain tools to quarantine

## Completion Rule

The operating model is complete for a task only when the receipt includes:

- Mission
- Route
- Tools selected
- Recipes executed
- Files changed
- Commands run
- Tests/checks run
- Security review
- Evidence
- Gate status
- Remaining blockers
