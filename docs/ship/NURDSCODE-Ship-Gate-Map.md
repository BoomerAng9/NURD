# NURDSCODE Ship Gate Map

## Current Status

Project State: Existing Build redirected to vNext
Current Gate: Gate 0 / Pre-Gate 1 Directive and Self-Check
Application Release Status: Not release-eligible until evidence exists

## Gate 0 - Directive Package and Self-Check

| Item | Status | Evidence Required |
|---|---|---|
| vNext docs package added | REQUIRED | Git commit or file list |
| Self-Check Kit located | REQUIRED | Path to kit |
| operator.yaml generated/updated | REQUIRED | File path |
| audit.py or equivalent run | REQUIRED | Command output or receipt |
| Self-Check receipt generated | REQUIRED | Receipt path |
| Current blockers recorded | REQUIRED | Receipt/blocker section |

Gate 0 passes only when the docs package exists and Self-Check has run or a truthful blocker is recorded.

## Gate 1 - Does It Run?

| Item | Status | Evidence Required |
|---|---|---|
| Single command start | UNVERIFIED | Command and output |
| Environment variables documented | UNVERIFIED | `.env.example` review |
| No hardcoded secrets | UNVERIFIED | Secrets scan |
| Database migrations run | UNVERIFIED | Migration command/output |
| Health endpoint works | UNVERIFIED | curl response |
| Error handling exists | UNVERIFIED | Test or manual proof |

## Gate 2 - Can Someone Sign Up?

| Item | Status | Evidence Required |
|---|---|---|
| Landing page loads | UNVERIFIED | URL/screenshot/manual test |
| Sign-up flow works | UNVERIFIED | Test account result |
| Login flow works | UNVERIFIED | Test account result |
| Password reset works | UNVERIFIED | Email/reset proof |
| Session management works | UNVERIFIED | Session test |
| OAuth/SSO works if offered | UNVERIFIED | OAuth test |
| Email verification works | UNVERIFIED | Verification proof |

## Gate 3 - Does the Core Feature Work?

| Item | Status | Evidence Required |
|---|---|---|
| Primary action completes | UNVERIFIED | User path test |
| Output is correct/useful | UNVERIFIED | 10-input test set |
| Loading states exist | UNVERIFIED | UI proof |
| Error states handled | UNVERIFIED | Failure tests |
| Output is exportable/shareable | UNVERIFIED | Export proof |
| History/persistence works | UNVERIFIED | Logout/login persistence test |

## Gate 4 - Can Someone Pay?

Payment gates remain UNVERIFIED until Stripe or billing flow is implemented and tested.

## Gate 5 - Is It Deployed?

Deployment gates remain UNVERIFIED until production/staging URLs, CI/CD, rollback, monitoring, and logging are proven.

## Gate 6 - Is It Secure?

Security gates remain UNVERIFIED until protected routes, authorization, tenant isolation, input validation, rate limiting, dependency audit, and secret management are proven.

## Gate 7 - Will It Survive?

Resilience gates remain UNVERIFIED until backups, degradation, load testing, cost controls, and data export are proven.

## Gate 8 - Can a Stranger Become a Customer?

Onboarding, help/docs, legal pages, and support channels remain UNVERIFIED until tested.

## Release Rule

No gate may be marked PASS without evidence.

UNVERIFIED is operationally equivalent to FAIL for release decisions.
