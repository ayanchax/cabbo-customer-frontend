# Cabbo Customer Frontend PostHog Analytics Strategy

## Purpose

PostHog is used for product and web analytics in the customer frontend. Sentry remains the source of truth for error monitoring and backend/frontend exceptions. PostHog should answer product questions such as where users drop off, which trip types convert, where support is used, and which post-booking actions create friction.

Session replay is intentionally out of scope for v1 launch.

## Environment Policy

PostHog should run for production traffic by default. Local or dev testing may be enabled only when explicitly requested with a local environment flag.

Expected frontend behavior:

- Production build: analytics enabled when the PostHog token is present.
- Local/dev build: analytics disabled unless `VITE_POSTHOG_ENABLED=true`.
- Missing token or host: analytics calls should become no-ops.

## Privacy Rules

Do not capture personal or sensitive data in frontend analytics.

Never send:

- Full pickup/drop addresses
- Customer name, phone number, email, OTP, or profile fields
- Customer profile IDs, unless the backend later exposes a dedicated opaque analytics ID
- Flight number
- Placard name
- Special request text
- Review feedback text
- Cancellation free-text reason
- Raw API payloads or full booking objects

Allowed:

- Boolean flags such as `has_pickup`, `has_dropoff`, `has_flight_number`, `placard_required`
- Trip metadata such as `trip_type`, `status`, `occurrence_label`, `car_type`, `fuel_type`
- Counts such as passenger/luggage counts, hops count, options count
- Internal IDs such as `booking_id`, `trip_id`, and order/payment state when needed for funnel debugging
- Price totals and currency for conversion analysis

## Customer Identity

Cabbo customer profile responses intentionally do not expose a customer ID to the frontend. For v1, do not call `posthog.identify()` from the customer profile and do not derive an ID from email, phone number, or name.

PostHog can still analyze anonymous frontend sessions, funnels, and lifecycle events using its anonymous distinct ID. If Cabbo later needs cross-device customer analytics, the backend should provide a dedicated opaque `analytics_id` that is not the database primary key and is not derived client-side from PII.

## Performance And Non-Blocking Behavior

Analytics must never block a customer from searching, booking, paying, cancelling, or contacting support.

For v1, PostHog event capture is treated as fire-and-forget:

```jsx
track(ANALYTICS_EVENTS.RIDE_SEARCH_SUBMITTED, properties);
```

Do not `await` analytics calls. Do not make navigation, payment, booking, support, or cancellation logic depend on a successful analytics response. If PostHog is slow, blocked by the browser, or temporarily unavailable, the Cabbo product flow must continue normally.

Current safeguards:

- Events are centralized through `useAnalytics()`.
- Analytics calls become no-ops when PostHog is disabled or missing config.
- Session recording is disabled.
- Autocapture is disabled.
- Automatic pageview capture is disabled; route pageviews are captured manually by attaching the RouteAnalyticsTracker on AppRouter.
- Event payloads are small and contain lifecycle metadata instead of full objects.
- Sensitive fields and free-text user input are excluded.

Avoid:

- Capturing events on every keystroke, hover, render, or scroll.
- Sending full API payloads or large nested objects.
- Calling analytics before critical validation in a way that can throw.
- Awaiting analytics before route changes or API mutations.

If needed, the analytics wrapper may add a defensive `try/catch` around `posthog.capture()` so SDK runtime issues can never bubble into the UI. That is a resilience improvement only; analytics must remain non-critical infrastructure.

## Event Naming

Use lower snake case and past-tense lifecycle names where possible.

Examples:

- `ride_search_submitted`
- `ride_options_loaded`
- `ride_option_selected`
- `booking_initiated`
- `payment_started`
- `booking_confirmed`
- `support_opened`
- `cancellation_started`
- `review_submitted`

Avoid vague names like `button_clicked` except for throwaway diagnostics.

## V1 Launch Funnel

Primary funnel:

1. `app_page_viewed`
2. `home_search_submitted`
3. `trip_type_classified`
4. `ride_search_submitted`
5. `ride_options_loaded`
6. `ride_option_selected`
7. `booking_initiated`
8. `booking_initiation_succeeded`
9. `payment_started`
10. `booking_confirmed`

Failure and drop-off events:

- `home_search_failed`
- `ride_search_validation_failed`
- `ride_search_failed`
- `ride_options_empty`
- `booking_initiation_failed`
- `payment_failed`
- `payment_pending_confirmation`
- `payment_cancelled`

Post-booking events:

- `booking_detail_viewed`
- `my_trips_tab_selected`
- `support_opened`
- `support_contact_loaded`
- `support_call_clicked`
- `support_whatsapp_clicked`
- `cancellation_started`
- `cancellation_reason_selected`
- `cancellation_confirmed`
- `cancellation_failed`
- `review_submitted`
- `review_failed`

Airport pickup events:

- `airport_arrival_details_edit_started`
- `airport_arrival_details_saved`
- `airport_arrival_details_save_failed`

## Recommended Properties

Common properties:

- `trip_type`
- `booking_id`
- `status`
- `occurrence_label`
- `car_type`
- `fuel_type`
- `currency`
- `total_price`

Search properties:

- `has_pickup`
- `has_dropoff`
- `passenger_count`
- `luggage_count`
- `package_id`
- `is_round_trip`
- `hops_count`
- `options_count`
- `has_toll_preference`
- `has_flight_number`
- `has_terminal`
- `placard_required`

Support/cancellation/review properties:

- `reason`
- `support_channel`
- `rating`
- `has_feedback`
- `cancellation_reason_type`

For cancellation, only send predefined reason labels. For free-text "Other", send `cancellation_reason_type: "other"` and not the user's text.

## Implementation Pattern

Use the app analytics wrapper instead of direct PostHog calls:

```jsx
const { track } = useAnalytics();

track(ANALYTICS_EVENTS.RIDE_SEARCH_SUBMITTED, {
  trip_type,
  has_pickup: Boolean(origin),
  has_dropoff: Boolean(dropOff),
});
```

The wrapper is responsible for:

- Environment gating
- No-op behavior when disabled
- Removing null/undefined values
- Keeping event names consistent

## What Not To Track In V1

Do not track every UI toggle, every input focus, or every small button. V1 analytics should focus on lifecycle transitions and decisions that improve conversion, support, cancellation, and trust.

Autocapture/session replay can be evaluated later after launch if the team needs deeper UX debugging.
