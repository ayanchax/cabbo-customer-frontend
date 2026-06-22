# Cabbo V1 Launch TODO

This is the working checklist for shipping Cabbo V1. Keep detailed reasoning and product decisions in [cabbo-v1-launch-roadmap.md](./cabbo-v1-launch-roadmap.md); use this file for daily execution and progress tracking.

## Focus Rules

- Work from top to bottom unless a task is blocked.
- Finish and verify one vertical slice before starting another.
- A feature is complete only after its happy path, error states, responsive behavior, and API integration are tested.
- Do not add V2 work while a required V1 item remains incomplete.
- Record a short blocker beneath any item that cannot progress.

## 1. Immediate Product Work

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

- [ ] Load and enforce state-specific outstation constraints.
- [x] Implement V1 round-trip-only route behavior.
- [ ] Add up to the configured maximum number of ordered hops.
- [ ] Support adding, editing, removing, and reordering hops.
- [x] Collect departure and return date/time within configured limits.
- [ ] Derive and display the trip duration from those dates.
- [ ] Complete passenger and luggage preferences.
- [ ] Complete origin, destination, date/time, passenger, and luggage flows.
- [ ] Complete ride search, option comparison, and no-results handling.
- [ ] Display fare breakdown, inclusions, exclusions, and overage rules.
- [ ] Integrate payment and booking confirmation.
- [ ] Complete outstation booking-detail display.
- [ ] Verify cancellation/refund, support, special-request, and driver sections.

## 2. Shared Customer Experience

### My Trips

- [ ] Build Upcoming, Ongoing, and Past tabs.
- [ ] Show trip type, route summary, start time, status, fleet, and booking ID.
- [ ] Add loading, empty, error, refresh, and pagination states.
- [ ] Open the correct booking-detail page from each trip.
- [ ] Preserve the selected tab during navigation where practical.

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
- [x] Add status-aware read-only fare-summary sections across booking details.
  - Always retains fare breakdown, inclusions/exclusions, and backend fare disclaimers as the booking record.
  - Hides overage rates for cancelled trips.
  - Shows refund/cancellation policies for upcoming, ongoing, cancelled, and disputed trips.
  - Hides refund/cancellation policies for completed/closed and generic past trips.
- [ ] Add a cancelled-trip refund summary to booking-detail pages.
  - Render it only when the trip is cancelled and backend refund details are available.
  - Show refund amount, refund status, refund method/source, initiation date, and expected settlement timeline when provided.
  - Handle pending, processed, failed, not-applicable, and missing-refund-detail states.
  - Keep the fare breakdown as the original booking record while making the refund summary the primary financial status for cancelled trips.
  - Provide the support action when a refund is delayed or failed.
- [x] Backend returns the customer-safe driver DTO.
- [ ] Render the safe driver profile, contact action, cab details, and rating.
- [ ] Gracefully handle missing optional driver fields and an unassigned driver.
- [ ] Add Call Cabbo and WhatsApp support actions.
- [ ] Prefill support messages with only the booking ID and necessary context.
- [ ] Implement add-once, read-only special requests.
- [ ] Enforce special-request status, length, sanitization, and add-once rules in the backend.
- [ ] Update `edit-trip-rationale.md` after special-request behavior is implemented.


### Customer account

- [ ] Build the customer profile page.
- [ ] Show verified account details and support/legal links.
- [ ] Add logout confirmation.
- [ ] Clear customer authentication and customer-specific cached data on logout.
- [ ] Invalidate the backend session where supported.
- [ ] Replace navigation history when returning to login.

## 3. Payment and Booking Integrity

- [x] Keep fare and payment calculations backend-authoritative.
- [x] Verify payments on the backend.
- [x] Make duplicate payment and confirmation requests idempotent.
- [x] Preserve confirmed booking state across refresh and navigation.
- [x] Keep failed payments retryable from the pre-confirmation page.
- [x] Clean temporary trips through the failure API and scheduled cleanup.
- [ ] Re-test success, failure, retry, duplicate callback, refresh, and abandoned-payment scenarios in staging.
- [ ] Verify production payment webhook configuration and signatures.
- [ ] Confirm refund and cancellation behavior matches customer-facing policy text.

## 4. Minimum Admin and Operations

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

## 5. Legal, Privacy, and Support

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

## 6. Security and Privacy Gate

- [x] Use a customer-safe driver response model.
- [ ] Audit all customer-facing API responses for internal or sensitive fields.
- [ ] Verify authorization on every booking detail and mutation endpoint.
- [ ] Verify OTP, search, support, and mutation rate limits.
- [ ] Verify backend input validation and frontend output encoding.
- [x] Remove secrets from frontend environment variables and bundles.
- [x] Verify authentication, session expiry, and logout behavior.
- [ ] Redact personal, authentication, and payment data from logs.
- [ ] Remove development logs containing personal or payment data.

## 7. Release Testing

Run the complete matrix for local hourly, airport pickup, airport drop-off, and outstation.

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

## 8. Production Readiness

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

## 9. Launch Approval

- [ ] All required V1 items above are complete or explicitly accepted as launch risks.
- [ ] No open P0 defects.
- [ ] P1 defects have an owner and documented launch decision.
- [ ] Legal and operational owners have approved launch readiness.
- [ ] Payment, booking, support, driver assignment, cancellation, and refund flows pass staging checks.
- [ ] Production smoke test checklist is ready.
- [ ] Go/no-go decision is recorded.

## 10. Launch Day

- [ ] Deploy backend and run required migrations.
- [ ] Deploy frontend.
- [ ] Run production smoke tests for every trip type.
- [ ] Complete one controlled end-to-end payment and booking test.
- [ ] Verify confirmation email content, dates, timezone, and links.
- [ ] Verify admin visibility and driver assignment.
- [ ] Verify support phone and WhatsApp actions.
- [ ] Monitor errors, payment webhooks, bookings, and latency.
- [ ] Record and triage launch issues.

## Explicitly Deferred Until After V1(On securing funds/investment)

- Discount and coupon engine.
- Campaign or marketing CMS.
- Fully dynamic region-personalized homepage.
- Real-time traffic-based pricing(only on getting investment)
- Advanced live driver/customer tracking(only on getting investment)
- Full support ticketing or chat system (only on getting investment)
- Rich status timeline.
- Promotional sections that could delay core booking readiness.
