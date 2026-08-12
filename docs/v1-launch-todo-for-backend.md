# Cabbo V1 Backend Launch TODO

Backend execution checklist for getting Cabbo safely onto dev first, then production.

Customer frontend local QA is effectively clean now, and the dev stack is live:
backend on Railway at `https://api.dev.cabbo.co.in`, customer frontend on Render
at `https://app.dev.cabbo.co.in`, and MySQL on Aiven.

1. Start the admin ops MVP/frontend workstream.
2. Keep admin V1 operational only: trip list/detail, driver assignment, status transitions, and operational context.
3. Confirm email delivery setup.
4. Verify remaining security/privacy gates.

## Launch Decisions

- Keep local file logging only in local development.
- Keep dev/prod container logging to stdout/stderr only.
- Use Sentry in dev/prod for exception and error monitoring.
- Keep messaging adapter-based, with `mock` restricted to local development only.
- Defer MSG91 and WhatsApp automation until company, DLT, and Meta verification friction is cleared.
- Admin V1 is operational only: trip listing, driver assignment/reassignment, and status transitions.
- No pricing, region, state, package, fleet, or configuration CRUD in Admin V1. Seed data and migrations remain the source of truth until there is traction.
- For dev/prod V1, configuration data is loaded by one-off migration/seed scripts after DB schema setup and before the app container is run.

## 1. Observability And Logging

- [x] Add backend setting for `SENTRY_DSN`.
- [x] Attach Sentry in non-local environments.
- [x] Verify backend events/logs are transmitted to Sentry from dev/prod setup.
- [x] Add `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, and optional sample rate settings.
- [x] Guard Sentry initialization so it only runs when `ENV` is `dev` or `prod` and `SENTRY_DSN` is present.
- [x] Keep `TimedRotatingFileHandler` log files local-only.
- [x] Keep dev/prod logs on stdout/stderr only; do not create container log directories.
- [x] Enable Sentry log/event transmission in non-local environments.
- [x] Set `send_default_pii=False`.
- [x] Add a `before_send` scrubber for phone numbers, emails, OTPs, auth tokens, request bodies, Razorpay IDs/signatures, and other payment identifiers.
- [x] Tune Sentry log levels so routine `INFO` logs do not create noisy events or burn quota.
- [x] Start with conservative tracing sample rates; avoid profiling until real traffic justifies it.
- [x] Trigger and verify Sentry delivery in dev/prod setup.

## 2. SMS And WhatsApp
- [x] Restrict `mock` messaging to local development; fail fast if dev/prod tries to boot with `SMS_SERVICE_PROVIDER=mock`.
- [x] Add delivery/error logs using masked phone numbers only.
- [x] Add strict OTP send/resend rate limits by phone number and IP.
- [x] Add OTP spend/volume monitoring or Sentry alerts for unexpected spikes.
- [x] Confirm frontend/backend UX for OTP provider failure.
- [x] Recover login when a stale backend bearer token exists but the client no longer has the matching token.
  - Clear the backend token and continue OTP login for missing/mismatched client tokens.
  - Preserve `ALREADY_LOGGED_IN` for matching active client/server tokens.

## 3. Email

- [x] Keep Brevo for dev and early prod if it remains reliable.
- [x] Verify SPF, DKIM, and DMARC for the sending domain.
- [x] Verify sender identity, reply-to, and no-reply addresses.
- [x] Verify email verification links use the correct frontend domain:
  - dev: `https://app.dev.cabbo.co.in`
  - prod: `https://app.cabbo.co.in`

- [x] Log masked emails only.
- [x] Test email verification, resend verification, and expired verification flows in dev.

## 4. Dev Deployment

- [x] Provision dev backend environment variables:
  - database
  - auth/session secrets
  - Razorpay test credentials
  - SMS provider credentials
  - WhatsApp provider credentials
  - email provider credentials
  - Sentry DSN
  - allowed CORS origin: `https://app.dev.cabbo.co.in`
- [x] Run database migrations on dev.
- [x] Run Cabbo seed/config data on dev after schema setup and before starting the backend container.
- [x] Verify seeded pricing, policy, package, region, state, and common trip configuration before opening the dev app for QA.
- [x] Verify API base path and versioning.
- [x] Verify health endpoint.
- [x] Verify stdout/stderr log streaming.
- [x] Verify no local log directory is created in the dev container.
- [x] Deploy backend at `https://api.dev.cabbo.co.in`.
- [x] Deploy customer frontend at `https://app.dev.cabbo.co.in` with `VITE_API_BASE_URL=https://api.dev.cabbo.co.in`.
- [x] Verify Render static-site rewrite for frontend deep links:
  - source: `/*`
  - destination: `/index.html`
  - action: `Rewrite`
- [ ] Smoke test auth OTP login.
- [ ] Smoke test trip search for airport transfer, local hourly rental, and outstation.
- [ ] Smoke test booking creation and Razorpay test payment verification.
- [ ] Smoke test customer profile, email verification, My Trips feed, booking detail, cancellation, and special request update.
- [ ] Verify backend errors appear in Sentry dev with sanitized context.

## 5. Security And Privacy Gate

- [x] Verify CORS allows only intended dev/prod frontend origins.
- [x] Verify auth/session expiry, stale-session recovery, and logout behavior.
- [x] Verify booking detail authorization; customers must not access other customers' bookings.
- [x] Verify mutation authorization for cancellation, special request update, and profile/email changes.
- [x] Verify OTP send/resend rate limits.
- [x] Verify search and booking mutation rate limits.
- [x] Verify no secrets are exposed in frontend env or bundles.
- [ ] Verify Razorpay payment verification and signature validation.
- [x] Verify Sentry/log redaction for PII, auth data, OTPs, and payment identifiers.

## 6. Admin V1 Backend/API Readiness

Admin V1 should be boring and operational. No configuration management yet.

- [x] Confirm admin authentication and authorization mechanism.
- [x] Add/admin-enable trip list endpoint with filters:
  - status
  - trip type
  - date range
- [x] Add/admin-enable trip detail endpoint with internal ops fields separated from customer-facing DTOs.
- [x] Add driver assignment mutation.
- [x] Add driver reassignment mutation.
- [x] Add guarded status transition mutation.
- [x] Enforce V1 state transitions:
  - `confirmed -> ongoing`
  - `confirmed -> cancelled`
  - `ongoing -> completed`
  - `ongoing -> dispute`
- [x] Return clear backend validation errors for invalid transitions.
- [x] Show customer notes/special requests to admin where operationally relevant.
- [x] Include payment/refund summary fields needed by ops.
- [x] Add audit logging for admin actions:
  - actor
  - booking ID
  - old value
  - new value
  - timestamp
  - reason/note, if supplied
 

## 7. Production Readiness

- [x] Prepare prod environment variables separately from dev.
- [ ] Verify production domains and TLS.
- [x] Verify database backup schedule.
- [ ] Run one restore drill before launch.
- [ ] Restrict production database inbound access to backend outbound IPs only, if the backend host provides stable/static outbound IPs.
  - For Railway, enable Static Outbound IPs before production if needed and add those `/32` IPs to the Aiven allowlist.
  - Keep dev database allowlisting flexible until static backend egress is available; rely on strong credentials, TLS, and least-privilege app users during dev.
- [x] Rehearse migrations against a prod-like database.
- [x] Rehearse the one-off seed/config script against a prod-like database.
- [x] Verify prod seed/config data before starting the production backend container.
- [x] Confirm rollback plan for backend deployment.
- [x] Configure production Sentry alerts.
- [ ] Configure uptime/health monitoring.
- [ ] Run production smoke checklist.
- [ ] Run one controlled real payment before public launch.

## 8. Deferred Beyond V1

Deferred product work is maintained
centrally in [backlogs.md](./backlogs.md). These items are not launch blockers
unless they are explicitly promoted back into the V1 checklist.
