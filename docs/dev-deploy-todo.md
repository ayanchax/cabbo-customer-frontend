# Cabbo Dev Deploy TODO

Temporary checklist for the first dev deployment only.

This file can be deleted after `https://api.dev.cabbo.co.in` and `https://app.dev.cabbo.co.in` are deployed, connected, and smoke-tested.

## Target Dev Stack

| Component | Provider | Target |
| --- | --- | --- |
| Customer frontend dev | Render Static Site | `https://app.dev.cabbo.co.in` |
| Backend dev | Railway | `https://api.dev.cabbo.co.in` |
| MySQL dev | Aiven Managed MySQL | dev database/cluster |
| Profile pictures | AWS S3 | existing bucket/integration |
| DNS/TLS | Cloudflare | `cabbo.co.in` zone |

## 1. Aiven Dev Database - Free Tier

- [x] Create dev Managed MySQL database/cluster.
- [x] Create app database user with only required permissions.
- [x] Run backend migrations against dev database.
- [x] Run Cabbo seed/config script after schema setup.
- [x] Verify seeded pricing, region/state, package, platform fee, permit fee, night pricing, and cancellation policy data.
- [x] Take one manual backup/export after seed data is verified.

## 2. Railway Backend Dev

- [ ] Upgrade/fund Twilio account with the smallest practical balance for OTP testing.
- [ ] Confirm Twilio SMS sending works after upgrade.
- [ ] Set Twilio usage/spend alerts if available.
- [x] Add OTP send/resend rate limiting while Twilio is the temporary provider:
  - per phone number send limit
  - per IP send limit
  - resend cooldown
  - daily cap for repeated attempts
  - clear frontend/backend error response when the limit is hit
- [x] Document that OTP rate limits can be loosened later after moving to DLT-backed SMS.
- [x] Increase customer bearer/session token lifetime from 5 days to 30 days to reduce repeat OTP requests, while preserving logout/session invalidation behavior.
- [x] Create Railway dev project/service for the backend.
- [x] Configure backend build/start command or Dockerfile deployment.
- [x] Add proper dev environment variables:
  - `ENV=dev`
  - `DATABASE_URL`
  - auth/session secrets
  - Razorpay test credentials
  - Twilio OTP credentials
  - Brevo/email credentials
  - AWS S3 credentials/bucket settings
  - Sentry DSN/environment/release settings
  - allowed CORS origin: `https://app.dev.cabbo.co.in`
  - app/frontend base URL: `https://app.dev.cabbo.co.in`
- [x] Ensure `SMS_SERVICE_PROVIDER` is not `mock` in dev.
- [x] Ensure dev/prod logging uses stdout/stderr only; no container log files.
- [x] Deploy backend dev.
- [x] Attach custom domain `api.dev.cabbo.co.in`.
- [x] Verify backend health endpoint over HTTPS. https://api.dev.cabbo.co.in/health
- [x] Verify Sentry receives one dev backend event with redacted context.
- [x] Verify backend can connect to Aiven MySQL.

## 3. Frontend Dev in Render

- [x] Create Render project for customer frontend dev.
- [x] Configure dev build command.
- [x] Configure dev output directory.
- [x] Set `VITE_API_BASE_URL=https://api.dev.cabbo.co.in`.
- [x] Add custom domain `app.dev.cabbo.co.in`.
- [x] Verify Render DNS/TLS is active.
- [x] Deploy customer frontend dev.
- [x] Verify frontend loads over HTTPS.
- [x] Verify frontend calls backend dev, not local or prod API.
- [x] Configure SPA deep-link refresh rewrite:
  - source: `/*`
  - destination: `/index.html`
  - action: `Rewrite`
- [x] Verify `/login` and booking-detail style direct URLs refresh without a blank page.

## 4. Dev Smoke Test

- [ ] Open `https://app.dev.cabbo.co.in`.
- [ ] Verify OTP login with Twilio.
- [ ] Verify OTP resend cooldown/rate-limit behavior.
- [ ] Verify profile load and update.
- [ ] Verify email add/verification flow.
- [ ] Verify airport transfer search.
- [ ] Verify local hourly rental search.
- [ ] Verify outstation search.
- [ ] Verify ride options load correctly.
- [ ] Verify booking creation in Razorpay test mode.
- [ ] Verify payment verification redirects to booking detail.
- [ ] Verify newly confirmed booking appears in My Trips.
- [ ] Verify booking detail page loads from direct URL.
- [ ] Verify special request update persists after navigating away/back.
- [ ] Verify cancellation flow in dev.
- [ ] Verify legal/static backend pages load if used by frontend.
- [ ] Verify expected backend errors show in Sentry dev with sanitized data.

## 5. Dev Launch Exit Criteria

- [x] Frontend dev is live at `https://app.dev.cabbo.co.in`.
- [x] Backend dev is live at `https://api.dev.cabbo.co.in`.
- [x] Frontend dev talks only to backend dev.
- [x] Backend dev talks to Aiven dev MySQL.
- [x] Render static-site SPA rewrite is configured with destination `/index.html`.
- [ ] OTP login works with the temporary Twilio bridge.
- [ ] Razorpay test payment flow works end-to-end.
- [x] Sentry dev receives sanitized backend errors/events.
- [x] No local-only mock provider is enabled in dev.
- [x] No local container log files are created in dev.
- [ ] Core customer flow is smoke-tested: login, search, booking, payment, My Trips, booking detail, cancellation.
