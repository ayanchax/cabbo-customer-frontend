# Cabbo V1 Launch TODO

This is the working checklist for shipping Cabbo V1. Keep detailed reasoning and product decisions in [cabbo-v1-launch-roadmap.md](./cabbo-v1-launch-roadmap.md); use this file for daily execution and progress tracking.

## Focus Rules

- Work from top to bottom unless a task is blocked.
- Finish and verify one vertical slice before starting another.
- A feature is complete only after its happy path, error states, responsive behavior, and API integration are tested.
- Do not add V2 work while a required V1 item remains incomplete.
- Record a short blocker beneath any item that cannot progress.

## Next Coding Priority

The next customer-frontend coding task is **My Trips**. It gives customers a
single place to find bookings after payment, supports the duplicate-booking
recovery action, and becomes the entry point for booking-detail support,
driver, refund, and special-request workflows.

Recommended order:

1. Build `/trips` with Upcoming, Ongoing, and Past tabs.
2. Open the correct booking-detail page from each trip card.
3. Add booking-detail operational sections: driver, support, special request,
   and cancelled-trip refund summary.
4. Build customer profile and logout.

## 1. Customer Frontend Coding - Core Booking Flows

### Shared search and date-time

- [x] Fix SearchCard loading behavior while previous suggestions are visible.
- [x] Prioritize user-selected recent places for an empty query.
- [x] Persist, reorder, and deduplicate recent places by `place_id`.
- [x] Add API failure/offline fallback to recent places.
- [x] Make current-location selection user-triggered, freshness-aware, and resilient to GPS accuracy jitter.
  - Cache the canonical reverse-geocoded place separately from the raw browser position reading.
  - Reuse the cached address only when Haversine distance remains within an accuracy-aware 25-75 metre threshold.
- [x] Make `InlineDateTimePicker` controlled and restorable.
- [x] Prevent restored date/time values from being overwritten by defaults.
- [x] Verify earliest-start and empty-slot-day behavior.
- [x] Display trip dates in the booked trip timezone across UI and emails.
  - Frontend `RideTimings` now prefers the booking/search timezone over the viewer's current timezone.
  - Backend email timezone rendering was verified separately.

### Outstation booking

- [x] Load and enforce state-specific outstation constraints.
- [x] Implement V1 round-trip-only route behavior.
- [x] Add up to the configured maximum number of ordered hops.
- [x] Support adding, editing, removing, and reordering hops.
- [x] Collect departure and return date/time within configured limits.
- [x] Complete passenger and luggage preferences.
- [x] Complete origin, destination, date/time, passenger, and luggage flows.
- [x] Complete ride search, option comparison, and no-results handling.
  - Includes no-suitable-rides recovery, backend-driven best-match labeling, and roof-carrier differentiation on option cards.
- [x] Display fare breakdown, inclusions, exclusions, and overage rules.
- [x] Integrate payment and booking confirmation.
- [x] Complete outstation booking-detail display.

## 2. Customer Frontend Coding - Shared Customer Experience

### My Trips

- [x] Build Upcoming, Ongoing, and Past tabs.
- [x] Show trip type, route summary, start time, status, fleet, and booking ID.
- [x] Add loading, empty, error, refresh, and pagination states.
- [x] Open the correct booking-detail page from each trip.
- [x] Preserve the selected tab during navigation where practical.
- [x] Route every trip card to the canonical booking-detail page regardless of status.
  - Booking-detail pages own status-specific presentation for active, cancelled, disputed, and stale-past bookings.
- [x] Use bucket-specific paginated trip feeds for Upcoming, Ongoing, and Past.
- [x] Treat backend `TRIP_NOT_FOUND` responses as empty trip states instead of hard errors.
- [x] Show subtle final fare context on trip cards without making My Trips feel like a payment page.
- [x] Explain non-obvious trip statuses such as disputed trips and past trips whose operational status is still pending.
- [x] Sort trip cards by start time so the latest relevant bookings appear first.

### Booking details

- [x] Add backend-provided occurrence labels to booking-detail headers.
  - Supports Upcoming, Ongoing, Completed, Cancelled, and Past presentation.
  - Uses semantic color mapping while keeping readable text labels.
- [x] Adapt booking-detail copy for active versus past trips across supported features.
  - Uses future-facing pickup and amenity copy for upcoming confirmed trips.
  - Uses neutral historical copy for past, completed, and cancelled trips.
- [x] Add shared status-aware driver-payment display across booking details.
    - Shows `Pay to driver` only for active trips with an outstanding balance.
    - Shows `Paid to driver` only for completed/closed trips with a settled balance.
    - Shows `Balance status pending` for stale or inconsistent past-trip records.
    - Shows `Payment under review` for disputed trips and no driver-payment prompt for cancelled trips.
- [x] Show a pending balance marker for past-active trips whose operational status was not closed correctly by Cabbo operations team.
  - Keeps stale records transparent without changing the booking navigation flow.
- [x] Add status-aware read-only fare-summary sections across booking details.
  - Always retains fare breakdown, inclusions/exclusions, and backend fare disclaimers as the booking record.
  - Hides overage rates for cancelled trips.
  - Shows refund/cancellation policies for upcoming, ongoing, cancelled, and disputed trips.
  - Hides refund/cancellation policies for completed/closed and generic past trips.
- [x] Add a cancelled-trip refund summary to booking-detail pages.
  - Render it only when the trip is cancelled and backend refund details are available.
  - Show refund amount, refund status, refund method/source, initiation date, and expected settlement timeline when provided.
  - Handle pending, processed, failed, not-applicable, and missing-refund-detail states.
  - Keep the fare breakdown as the original booking record while making the refund summary the primary financial status for cancelled trips.
  - Support actions for delayed or failed refunds are tracked under booking-detail operational sections.
- [x] Add a disputed-trip blocked state to booking-detail pages.
  - Show a clear feedback panel explaining that disputed trips are handled offline by Cabbo support.
  - Hide customer self-service edit, refund, and payment actions while the dispute is active.
  - Keep the booking-detail header and booking ID visible for reference while replacing normal detail sections with the blocked state.
- [x] Add customer-initiated cancellation for eligible upcoming booking details.
  - Show cancellation only for customer-cancellable upcoming bookings.
  - Submit only customer-safe cancellation fields: reason and `customer_cancelled` cancellation sub-status.
  - Refresh or update the booking detail into cancelled state after success.
  - Let backend own policy evaluation, refund eligibility, and refund processing.
- [ ] Add customer trip rating for successfully completed trips.
  - Render only for completed/closed bookings that are eligible for review.
  - Submit rating through `/trips/reviews/{booking_id}/submit-review`.
  - Capture required 1-5 overall rating and optional feedback.
  - Keep detailed experience fields optional for V1 to avoid making review submission feel heavy.
  - Consider a Google Business review link only after the internal trip rating is captured.

### Booking-detail operational sections

- [x] Backend returns the customer-safe driver DTO.
- [x] Render the safe driver profile, contact action, cab details, and rating.
- [x] Gracefully handle missing optional driver fields and an unassigned driver.
- [x] Add Call Cabbo and WhatsApp support actions.
- [x] Prefill support messages with only the booking ID and necessary context.
- [x] Resolve customer support contacts from backend routing instead of hardcoding support numbers.
- [x] Place Help consistently across booking details, with status-aware placement for normal, cancelled, and disputed trips.
- [x] Implement add-once, read-only special requests.
- [x] Enforce special-request status, length, sanitization, and add-once rules in the backend.
- [x] Update `edit-trip-rationale.md` after special-request behavior is implemented.
- [x] Verify these operational sections across airport, hourly rental, and outstation booking-detail pages.


### Customer account

- [ ] Build the customer profile page.
- [ ] Show verified account details and support/legal links.
- [ ] Add logout confirmation.
- [ ] Clear customer authentication and customer-specific cached data on logout.
- [ ] Invalidate the backend session where supported.
- [ ] Replace navigation history when returning to login.

## 3. Payment and Booking Integrity - Integration And Backend Verification

- [x] Keep fare and payment calculations backend-authoritative.
- [x] Verify payments on the backend.
- [x] Make duplicate payment and confirmation requests idempotent.
- [x] Preserve confirmed booking state across refresh and navigation.
- [x] Keep failed payments retryable from the pre-confirmation page.
- [x] Clean temporary trips through the failure API and scheduled cleanup.
- [ ] Re-test success, failure, retry, duplicate callback, refresh, and abandoned-payment scenarios in staging.
- [ ] Verify production payment webhook configuration and signatures.
- [x] Confirm refund and cancellation behavior matches customer-facing policy text.

## 4. Admin Frontend And Operations Coding

- [ ] Provide authenticated admin access.
- [ ] Build a filterable trip list and trip-detail view.
- [ ] Separate customer-safe and internal data views.
- [ ] Support driver assignment and reassignment.
- [ ] Support operational trip-status updates.
- [ ] Display payment state, customer contact, and special requests.
- [ ] Support internal operational notes.
- [ ] Document the driver-assignment process.
- [ ] Document cancellation and refund operations.
- [ ] Define the support escalation process and owner.
- [ ] Define the production incident-response owner.

## 5. Legal, Privacy, And Support - Non-Coding Launch Work

- [ ] Publish reviewed Terms of Service.
- [ ] Publish a reviewed Privacy Notice.
- [ ] Publish Cancellation and Refund Policy.
- [ ] Publish Fare, Payment, Toll, Parking, and Additional-charge Policy.
- [ ] Publish Grievance Redressal and Contact Information.
- [ ] Publish Safety and Acceptable-use Guidelines.
- [ ] Add a Cookie Notice only if non-essential tracking is used.
- [ ] Include legal entity, contact, version, and effective-date information.
- [ ] Store legal documents as immutable, versioned content.
- [ ] Record accepted terms/privacy versions on the backend.
- [ ] Confirm applicable aggregator and state requirements with counsel.
- [ ] Verify customer-care phone and WhatsApp channels are operational.
- [ ] Define and test the data-retention and deletion workflow.

## 6. Security And Privacy Gate - Engineering Review

- [x] Use a customer-safe driver response model.
- [ ] Audit all customer-facing API responses for internal or sensitive fields.
- [x] Verify authorization on every booking detail and mutation endpoint.
- [ ] Verify OTP, search, support, and mutation rate limits.
- [ ] Verify backend input validation and frontend output encoding.
- [x] Remove secrets from frontend environment variables and bundles.
- [x] Verify authentication, session expiry, and logout behavior.
- [ ] Redact personal, authentication, and payment data from logs.
- [x] Remove development logs containing personal or payment data.

## 7. Release Testing - QA Checklist

Run the complete matrix for local hourly rental, airport pickup, airport drop-off, and outstation.

- [ ] Search, classification, and preference persistence.
- [ ] No-results and API-error behavior.
- [ ] Ride selection and fare presentation.
- [ ] Payment success, failure, and retry.
- [ ] Booking confirmation, refresh, and deep links.
- [ ] Upcoming, ongoing, completed, and cancelled trip presentation.
- [ ] Driver assignment and unassigned-driver states.
- [ ] Support actions and special-request submission.
- [ ] Cancellation and refund presentation.
- [ ] Mobile, tablet, and desktop layouts.
- [ ] Keyboard navigation and visible focus.
- [ ] Accessible names, readable errors, adequate contrast, and no text overflow.
- [ ] Loading, empty, offline, and degraded-network states.
- [ ] Cross-browser smoke test on supported browsers.

## 8. Production Readiness - DevOps And Operations

- [ ] Configure the production domain and TLS.
- [ ] Verify production frontend and backend environment configuration.
- [ ] Verify database backups and perform a restore drill.
- [ ] Enable production error monitoring and alerts.
- [ ] Verify API error logging with sensitive-data redaction.
- [ ] Verify route refresh and deep-link hosting configuration.
- [ ] Run database migrations against a production-like environment.
- [ ] Complete a staging launch rehearsal using production-like configuration.
- [ ] Prepare a rollback plan for frontend, backend, and database changes.
- [ ] Prepare launch-day support coverage and escalation contacts.

## 9. Launch Approval - Business Go/No-Go

- [ ] All required V1 items above are complete or explicitly accepted as launch risks.
- [ ] No open P0 defects.
- [ ] P1 defects have an owner and documented launch decision.
- [ ] Legal and operational owners have approved launch readiness.
- [ ] Payment, booking, support, driver assignment, cancellation, and refund flows pass staging checks.
- [ ] Production smoke test checklist is ready.
- [ ] Go/no-go decision is recorded.

## 10. Launch Day - Deployment And Monitoring

- [ ] Deploy backend and run required migrations.
- [ ] Deploy frontend.
- [ ] Run production smoke tests for every trip type.
- [ ] Complete one controlled end-to-end real payment and booking test.
- [ ] Verify confirmation email content, dates, timezone, and links.
- [ ] Verify admin visibility and driver assignment.
- [ ] Verify support phone and WhatsApp actions.
- [ ] Monitor errors, payment webhooks, bookings, and latency.
- [ ] Record and triage launch issues.

## Deferred Beyond V1

Deferred product work, including **Book a ride for someone else**, is maintained
centrally in [backlogs.md](./backlogs.md). These items are not launch blockers
unless they are explicitly promoted back into the V1 checklist.
