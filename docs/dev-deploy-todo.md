# Cabbo Dev Deploy TODO

Temporary checklist for the first dev deployment only.

This file can be deleted after `https://api.dev.cabbo.co.in` and `https://app.dev.cabbo.co.in` are deployed, connected, and smoke-tested.

## Target Dev Stack

| Component | Provider | Target |
| --- | --- | --- |
| Customer frontend dev | Cloudflare Pages | `https://app.dev.cabbo.co.in` |
| Backend dev | Railway | `https://api.dev.cabbo.co.in` |
| MySQL dev | DigitalOcean Managed MySQL | dev database/cluster |
| Profile pictures | AWS S3 | existing bucket/integration |
| DNS/TLS | Cloudflare | `cabbo.co.in` zone |

## 1. DigitalOcean Dev Database

- [ ] Create dev Managed MySQL database/cluster.
- [ ] Create app database user with only required permissions.
- [ ] Decide dev database name.
- [ ] Save dev `DATABASE_URL` securely for Railway.
- [ ] Restrict database access to required sources as much as the dev setup allows.
- [ ] Run backend migrations against dev database.
- [ ] Run Cabbo seed/config script after schema setup.
- [ ] Verify seeded pricing, region/state, package, platform fee, permit fee, night pricing, and cancellation policy data.
- [ ] Take one manual backup/export after seed data is verified.

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
- [ ] Create Railway dev project/service for the backend.
- [ ] Configure backend build/start command or Dockerfile deployment.
- [ ] Add dev environment variables:
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
- [ ] Ensure `SMS_SERVICE_PROVIDER` is not `mock` in dev.
- [ ] Ensure dev/prod logging uses stdout/stderr only; no container log files.
- [ ] Deploy backend dev.
- [ ] Attach custom domain `api.dev.cabbo.co.in`.
- [ ] Verify backend health endpoint over HTTPS.
- [ ] Verify Sentry receives one dev backend event with redacted context.
- [ ] Verify backend can connect to DigitalOcean MySQL.

## 3. Cloudflare Pages Frontend Dev

- [ ] Create Cloudflare Pages project for customer frontend dev.
- [ ] Configure dev build command.
- [ ] Configure dev output directory.
- [ ] Set `VITE_API_BASE_URL=https://api.dev.cabbo.co.in`.
- [ ] Add custom domain `app.dev.cabbo.co.in`.
- [ ] Verify Cloudflare DNS/TLS is active.
- [ ] Deploy customer frontend dev.
- [ ] Verify frontend loads over HTTPS.
- [ ] Verify frontend calls backend dev, not local or prod API.

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

- [ ] Frontend dev is live at `https://app.dev.cabbo.co.in`.
- [ ] Backend dev is live at `https://api.dev.cabbo.co.in`.
- [ ] Frontend dev talks only to backend dev.
- [ ] Backend dev talks to DigitalOcean dev MySQL.
- [ ] OTP login works with the temporary Twilio bridge.
- [ ] Razorpay test payment flow works end-to-end.
- [ ] Sentry dev receives sanitized backend errors/events.
- [ ] No local-only mock provider is enabled in dev.
- [ ] No local container log files are created in dev.
- [ ] Core customer flow is smoke-tested: login, search, booking, payment, My Trips, booking detail, cancellation.
