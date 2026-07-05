# Cabbo V1 Backend Launch TODO

Backend execution checklist for getting Cabbo safely onto dev first, then production.

Customer frontend local QA is effectively clean now, so the next backend goal is:

1. Integrate MSG91 for real OTP/SMS and WhatsApp notifications.
2. Confirm email delivery setup.
3. Deploy backend dev at `https://api.dev.cabbo.co.in`.
4. Smoke with frontend dev at `https://app.dev.cabbo.co.in`.
5. Start the admin ops MVP after backend dev is stable.

## Launch Decisions

- Keep local file logging only in local development.
- Keep dev/prod container logging to stdout/stderr only.
- Use Sentry in dev/prod for exception and error monitoring.
- Use MSG91 as the V1 provider for SMS/OTP and WhatsApp.
- Keep messaging adapter-based, with `mock` restricted to local development only.
- Do not keep Twilio as a V1 fallback path.
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

- [x] Choose MSG91 as the V1 provider for OTP/SMS and WhatsApp.
- [ ] Add an MSG91 provider adapter for OTP/SMS.
- [ ] Add an MSG91 provider adapter for WhatsApp notifications.
- [x] Restrict `mock` messaging to local development; fail fast if dev/prod tries to boot with `SMS_SERVICE_PROVIDER=mock`.
- [ ] Add required MSG91 settings/env vars for dev and prod.
- [ ] Verify sender ID, DLT registration/templates, OTP templates, and template approval flow.
- [ ] Verify WhatsApp Business onboarding, templates, opt-in expectations, and landed per-message cost.
- [ ] Add delivery/error logs using masked phone numbers only.
- [ ] Rate-limit OTP send and resend paths.
- [ ] Confirm frontend/backend UX for OTP provider failure.
- [ ] Add WhatsApp V1 templates only where they matter most:
  - booking confirmation
  - booking cancellation/refund update
  - driver assignment/reassignment
  - trip status update, if useful for ops

## 3. Email

- [ ] Keep Brevo for dev and early prod if it remains reliable.
- [ ] Verify SPF, DKIM, and DMARC for the sending domain.
- [ ] Verify sender identity, reply-to, and no-reply addresses.
- [ ] Verify email verification links use the correct frontend domain:
  - dev: `https://app.dev.cabbo.co.in`
  - prod: `https://app.cabbo.co.in`
- [ ] Keep Resend as a candidate adapter if Brevo deliverability, DX, or limits become painful.
- [ ] Log masked emails only.
- [ ] Test email verification, resend verification, and expired verification flows in dev.

## 4. Dev Deployment

- [ ] Provision dev backend environment variables:
  - database
  - auth/session secrets
  - Razorpay test credentials
  - SMS provider credentials
  - WhatsApp provider credentials
  - email provider credentials
  - Sentry DSN
  - allowed CORS origin: `https://app.dev.cabbo.co.in`
- [ ] Run database migrations on dev.
- [ ] Run Cabbo seed/config data on dev after schema setup and before starting the backend container.
- [ ] Verify seeded pricing, policy, package, region, state, and common trip configuration before opening the dev app for QA.
- [ ] Verify API base path and versioning.
- [ ] Verify health endpoint.
- [ ] Verify stdout/stderr log streaming.
- [ ] Verify no local log directory is created in the dev container.
- [ ] Deploy backend at `https://api.dev.cabbo.co.in`.
- [ ] Deploy customer frontend at `https://app.dev.cabbo.co.in` with `VITE_API_BASE_URL=https://api.dev.cabbo.co.in`.
- [ ] Smoke test auth OTP login.
- [ ] Smoke test trip search for airport transfer, local hourly rental, and outstation.
- [ ] Smoke test booking creation and Razorpay test payment verification.
- [ ] Smoke test customer profile, email verification, My Trips feed, booking detail, cancellation, and special request update.
- [ ] Verify backend errors appear in Sentry dev with sanitized context.

## 5. Security And Privacy Gate

- [ ] Verify CORS allows only intended dev/prod frontend origins.
- [ ] Verify auth/session expiry and logout behavior.
- [ ] Verify booking detail authorization; customers must not access other customers' bookings.
- [ ] Verify mutation authorization for cancellation, special request update, and profile/email changes.
- [ ] Verify OTP send/resend rate limits.
- [ ] Verify search and booking mutation rate limits.
- [ ] Verify no secrets are exposed in frontend env or bundles.
- [ ] Verify Razorpay payment verification and webhook signature validation.
- [ ] Verify Sentry/log redaction for PII, auth data, OTPs, and payment identifiers.

## 6. Admin V1 Backend/API Readiness

Admin V1 should be boring and operational. No configuration management yet.

- [ ] Confirm admin authentication and authorization mechanism.
- [ ] Add/admin-enable trip list endpoint with filters:
  - status
  - trip type
  - date range
  - booking ID
  - customer phone/email, if already safe and supported
- [ ] Add/admin-enable trip detail endpoint with internal ops fields separated from customer-facing DTOs.
- [ ] Add driver assignment mutation.
- [ ] Add driver reassignment mutation.
- [ ] Add guarded status transition mutation.
- [ ] Enforce V1 state transitions:
  - `confirmed -> ongoing`
  - `confirmed -> cancelled`
  - `ongoing -> completed`
  - `ongoing -> dispute`
- [ ] Return clear backend validation errors for invalid transitions.
- [ ] Show customer notes/special requests to admin where operationally relevant.
- [ ] Include payment/refund summary fields needed by ops.
- [ ] Add audit logging for admin actions:
  - actor
  - booking ID
  - old value
  - new value
  - timestamp
  - reason/note, if supplied
- [ ] Defer all config CRUD:
  - pricing
  - city/region/state configuration
  - packages
  - fleet categories
  - cancellation policy config
  - legal/support content

## 7. Production Readiness

- [ ] Prepare prod environment variables separately from dev.
- [ ] Verify production domains and TLS.
- [ ] Verify database backup schedule.
- [ ] Run one restore drill before launch.
- [ ] Rehearse migrations against a prod-like database.
- [ ] Rehearse the one-off seed/config script against a prod-like database.
- [ ] Verify prod seed/config data before starting the production backend container.
- [ ] Confirm rollback plan for backend deployment.
- [ ] Configure production Sentry alerts.
- [ ] Configure uptime/health monitoring.
- [ ] Run production smoke checklist.
- [ ] Run one controlled real payment before public launch.
- [ ] Verify production webhook delivery and signatures.

## 8. Deferred Beyond V1

Deferred product work is maintained
centrally in [backlogs.md](./backlogs.md). These items are not launch blockers
unless they are explicitly promoted back into the V1 checklist.
