# Customer Frontend QA Runbook

This runbook is the V1 customer frontend release test guide for Cabbo.

Use it before production release and again for any major regression pass. The
matrix should be run for:

- local hourly rental
- airport pickup
- airport drop-off
- outstation

Record failures with route, browser, viewport, test data, screenshots, console
errors, network response, and expected versus actual behavior.

## Test Environments

### Local Development

Use local frontend and backend with Razorpay test mode.

Purpose:

- fast regression checks
- UI fixes
- flow verification
- payment test-mode behavior

### Dev Deployment

Use `app.dev.cabbo.co.in` and the corresponding dev backend when available.

Purpose:

- deployment smoke testing
- route refresh testing
- environment variable verification
- API/base URL verification
- Razorpay test-mode smoke

### Production

Use `app.cabbo.co.in`.

Purpose:

- final production smoke only
- one controlled live payment test
- webhook verification
- monitoring verification

Do not use live Razorpay keys in local development.

## Test Data

Prepare these before starting:

- one customer account with verified phone
- one customer account with email verified
- one customer account with email unverified, if possible
- routes for local hourly rental
- routes for airport pickup
- routes for airport drop-off
- one outstation route with no hops
- one outstation route with 1-3 hops
- one no-rides scenario using high passenger/luggage preferences
- bookings in confirmed, ongoing, completed, cancelled, and dispute states
- one booking with assigned driver
- one booking without assigned driver
- one cancelled booking with refund detail
- one stale past-active booking, if available

## Evidence To Capture

For each failed case, capture:

- page URL
- trip type
- booking ID, if applicable
- browser and viewport
- screenshot or short screen recording
- console errors
- network request and response
- expected result
- actual result
- severity: P0, P1, P2, P3

Severity guide:

- P0: blocks booking/payment/login or exposes sensitive data
- P1: blocks a major flow for a trip type or causes wrong money/status display
- P2: visible UX issue with workaround
- P3: copy, polish, or minor layout issue

## 1. Search, Classification, And Preference Persistence

Run for each trip type.

### Search Card

- Open home page.
- Search pickup and drop locations.
- Select recent location suggestions.
- Use current location from the pickup field.
- Clear pickup/drop and reselect.
- Verify old suggestions and skeleton/loading states do not clash.
- Verify recent places are ordered by latest selection.
- Verify offline/recent fallback appears when API is unavailable.

Expected:

- pickup/drop values remain stable after selection
- current location is user-triggered, not forced on mount
- recent suggestions are deduplicated by `place_id`
- stale current-location cache is refreshed only when movement threshold is exceeded

### Classification

- Search local-city style route.
- Search airport pickup route.
- Search airport drop route.
- Search outstation route.

Expected:

- user lands on the correct trip-specific flow
- loading overlay text and illustration match the trip type
- selected origin/destination are preserved

### Preferences

For each flow, set preferences, go to results, then navigate back.

Expected:

- date/time restores
- passenger and luggage preferences restore
- airport pickup operational fields behave as expected
- outstation hops and return date behave as expected
- defaults do not overwrite restored values

## 2. No-Results And API-Error Behavior

Run at least once per trip type.

### No Rides

- Use preferences that exceed available fleet capacity.
- Trigger search.

Expected:

- friendly no-rides message
- no raw backend error
- clear action to go back and try again
- no layout break on mobile

### API Failure

- Simulate or trigger location/search/package API error.

Expected:

- error state is readable
- retry or recovery action appears where useful
- old valid data does not mix confusingly with failed new data
- no uncaught React error boundary unless truly unrecoverable

## 3. Ride Selection And Fare Presentation

Run for each trip type.

Expected:

- options are sorted/ranked correctly
- best-choice tag appears only on ride selection cards where backend marks it
- roof-carrier indicator appears where backend marks it
- fare amount is clear
- rate per km/min appears where relevant
- inclusions/exclusions are readable
- important disclaimers appear
- no add-on tags appear for fixed services
- airport add-on tags appear only for actual selected add-ons
- fare/charges policy link opens correctly in a new tab

Outstation-specific:

- total trip days display correctly
- included kms display without implying unused kms reduce fare
- round-trip message is visible but not noisy
- route timeline includes origin, optional hops, destination, and return to origin

## 4. Payment Success, Failure, And Retry

Use Razorpay test mode except for the final production smoke.

### Success

- Initiate booking.
- Complete payment successfully.

Expected:

- backend verifies payment
- confirmed booking ID appears
- success survives refresh
- booking detail page loads from booking ID
- temporary trip cleanup is not required for successful booking

### Failure

- Initiate booking.
- Fail/cancel payment from Razorpay.

Expected:

- user remains on pre-confirmation/payment page
- retry is possible
- cleanup API is attempted where applicable
- no confirmed booking is created

### Retry

- Fail payment.
- Retry payment.
- Complete payment.

Expected:

- booking confirms once
- duplicate orders/temporary trips do not create duplicate confirmed bookings

### Refresh

- Refresh pre-confirmation page before payment.
- Refresh success/booking detail page after payment.

Expected:

- pre-payment state is recoverable or safely restartable
- confirmed booking state survives refresh

### Abandoned Payment

- Open Razorpay checkout.
- Close tab/window or leave payment incomplete.

Expected:

- no confirmed booking is created
- customer can start again safely
- backend scheduler eventually clears orphaned staged trips

## 5. Booking Confirmation, Refresh, And Deep Links

Run for each trip type.

Expected:

- `/booking/:bookingId` loads directly after refresh
- invalid booking ID shows a friendly error
- unauthorized booking ID is not exposed
- browser back behavior is sensible after payment
- booking detail header shows trip type, booking ID, and occurrence label
- status-specific sections render correctly

## 6. My Trips

Test tabs:

- Upcoming
- Ongoing
- Past

Expected:

- selected tab persists in URL
- loading state appears while fetching
- empty state handles `TRIP_NOT_FOUND`
- pagination works
- next/previous scrolls to top after new page loads
- cards show trip type, route summary, start time, fleet, booking ID, status, and subtle fare
- past active/stale trips show a status-pending explanation
- disputed trips show in-review explanation
- cards route to canonical booking detail page

## 7. Booking Detail Status Matrix

Test these states:

- confirmed/upcoming
- ongoing
- completed/closed
- cancelled
- dispute
- stale past-active

Expected:

- confirmed/upcoming: operational edit surfaces appear where allowed
- ongoing: active support/fare context remains clear
- completed/closed: paid-to-driver/review behavior is correct
- cancelled: refund summary is primary financial status
- dispute: blocked state replaces self-service actions
- stale past-active: balance pending marker appears

## 8. Driver Assignment And Unassigned Driver

Test:

- booking with driver
- booking without driver

Expected:

- assigned driver card shows only customer-safe driver/cab fields
- call action works
- missing optional driver fields do not break layout
- unassigned message is understandable
- no internal driver fields appear

## 9. Support Actions And Special Requests

### Support

- Open support card on each booking detail type.
- Load backend support contact.
- Click call.
- Click WhatsApp.
- Open Help & Support policy link.

Expected:

- support contact is fetched lazily
- WhatsApp message includes booking ID and necessary context only
- no hardcoded support number is used

### Special Request

- Add request on eligible booking.
- Try empty/overlong request.
- Save once.
- Reopen booking detail.

Expected:

- request is add-once
- saved request becomes read-only
- backend validation errors are friendly
- request does not appear on ineligible statuses

## 10. Cancellation And Refund Presentation

### Cancellation

- Open eligible upcoming booking.
- Expand cancellation section.
- Try confirming without reason.
- Select predefined reason.
- Use Other reason.
- Confirm cancellation.

Expected:

- customer sees cancellation warning
- customer can open trip-specific refund/cancellation section before confirming
- backend receives customer-safe cancellation payload
- booking updates to cancelled
- self-service actions disappear after cancellation

### Refund

- Open cancelled booking with refund detail.

Expected:

- refund amount, type, status, and initiated date are shown
- failed/pending/processed states are clear
- full policy link opens in a new tab
- fare breakdown remains the original booking record

## 11. Profile And Legal Pages

### Profile

- Open Profile.
- Update name.
- Add email if missing.
- Resend verification if allowed.
- Upload PNG profile picture under 2 MB.
- Try non-PNG profile picture.
- Try over-2-MB PNG.
- Log out and confirm navigation to login.

Expected:

- profile data updates without full-page confusion
- email verification status is clear
- profile picture uploads/overwrites only
- logout clears auth and customer-specific cache

### Legal Pages

- Open each legal/support link from Profile.
- Open contextual links from login/onboard, fare breakdown, support card, and refund policy block.

Expected:

- legal page scrolls to top on navigation
- title is not duplicated
- version/effective date appear
- URLs and email addresses are clickable
- content renders without raw HTML
- route refresh works for `/legal/:slug`

## 12. Responsive Layouts

Test viewports:

- mobile small
- mobile large
- tablet
- laptop
- desktop/wide monitor

Expected:

- no horizontal scrolling
- important buttons remain reachable
- text does not overflow buttons/cards
- bottom navigation does not hide important actions
- legal/profile links remain visually balanced
- trip cards remain readable
- fare/payment sections do not overlap

## 13. Keyboard, Focus, And Accessibility

Run keyboard-only pass for:

- login/onboard
- search card
- trip preference forms
- ride option selection
- payment page controls
- booking detail actions
- profile edit controls
- legal links

Expected:

- tab order is logical
- visible focus is present
- buttons have accessible names
- icon-only buttons have labels
- links open intentionally
- form errors are readable near the field/action

## 14. Loading, Empty, Offline, And Degraded Network

Test:

- slow location API
- slow trip search
- slow booking detail
- support contact failure
- legal page failure
- profile mutation failure
- no trips in bucket
- no refund detail for cancelled booking

Expected:

- loaders are scoped, not excessive
- empty states are friendly
- retry options appear where useful
- user is not shown raw stack traces or backend internals

## 15. Cross-Browser Smoke

Minimum:

- Chrome latest
- Edge latest
- Safari iOS if available
- Android Chrome if available

Smoke flows:

- login
- search one trip
- view ride options
- open profile
- open legal page
- open booking detail

## Completion Criteria

Customer frontend QA is complete when:

- all trip types pass the matrix
- no P0 issues remain
- P1 issues are fixed or explicitly accepted as launch risks
- screenshots/evidence exist for critical flows
- payment dev-deployment smoke is complete
- legal/profile/support links work after route refresh
- production smoke checklist is ready
