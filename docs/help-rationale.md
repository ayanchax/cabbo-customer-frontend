# Cabbo Help And Support Rationale

This document explains how customer help actions should appear in the Cabbo
customer frontend and why support contact details are resolved from the backend.

## Decision

Cabbo should show trip support as a booking-detail action across all trip types:

- local hourly rental
- airport pickup
- airport drop-off
- outstation

The support contact should be resolved from the backend `/trips/support`
endpoint using the booking's trip type and origin geography.

## Why Support Comes From Backend

Support ownership can change by geography and trip type. Local and airport
trips may be routed to a region-level support contact, while outstation trips
may be routed at state level. A backend-driven support lookup lets Cabbo change
support ownership without rebuilding the customer frontend.

The frontend should not hardcode support phone numbers or WhatsApp numbers
inside booking-detail components. The frontend should only decide how to
display and launch customer actions after the backend returns the appropriate
customer-safe support contact.

## Placement

### My Trips List

Do not show Help actions on trip-list cards.

The My Trips list is for scanning bookings and opening the right trip. Adding
call or WhatsApp actions directly on every card would make the list noisy,
increase accidental taps, and duplicate actions without enough context.

This follows common cab-app behavior: customers first choose the relevant trip,
then get help from the trip detail page where route, timing, status, fare, and
booking ID are visible together.

### Normal Active Trips

Show Help after the main trip context and before dense financial/legal details.
The practical placement is:

1. Header
2. Cab, route, timing, and trip-specific operational details
3. Help / support actions
4. Amenities
5. Fare summary and policies

This keeps Help easy to find without making it the main focus for a healthy
booking.

### Cancelled Trips

Show Help near the refund summary because the customer's most likely question
is refund related.

Recommended order:

1. Header
2. Trip context
3. Refund summary
4. Help / support actions
5. Fare summary and cancellation policy record

The refund summary remains the primary financial status. Help is a fallback
for delayed, failed, unclear, or missing refund details.

### Disputed Trips

Disputed trips are handled offline by Cabbo support. For these trips, the
booking-detail page should show the normal header and then a blocked-state
panel. Help should be visible inside or directly below that blocked state.

Normal self-service sections such as edit actions, payment prompts, refund
actions, and operational changes should stay non-rendered while the dispute is active.

### Past Completed Trips

Show Help as a secondary action. It should be available for reference or
post-trip issues, but it should not compete with the fare record.

## Action Types

V1 should support:

- Call Cabbo
- WhatsApp Cabbo

## Interaction Pattern

Use a compact inline support card that expands on tap or click.

The card should be visible enough to find, but collapsed by default on healthy
booking-detail pages so it does not compete with trip information. When opened,
it resolves the backend support contact and shows Call and WhatsApp actions.

Avoid tooltip-only help because it is weak on mobile. Avoid a modal as the
default pattern because contacting support is a quick action, not a separate
workflow. Avoid always-open support actions on every normal booking page because
it adds visual noise and makes the page feel like an issue has already occurred.

Cancelled and disputed pages may render the same support card opened by default
or placed closer to the refund/dispute state, because support is more likely to
be the customer's next action in those states.

WhatsApp should use a prefilled message with only necessary context:

- booking ID
- short trip type label
- broad reason if the current page state is known, such as cancelled trip,
  disputed trip, or general booking help

The frontend should avoid sending customer personal data, internal IDs other
than booking ID, exact refund internals, or operational notes in the prefilled
message.

## Industry Alignment

Cab apps usually keep booking details as the single place to get help for a
specific trip. They do not expose routing or operational ownership to the
customer. The customer sees a simple help action, while the platform routes the
request internally based on trip context.

This matches Cabbo's approach:

- backend owns support routing
- frontend owns simple customer actions
- booking detail remains the canonical support entry point
