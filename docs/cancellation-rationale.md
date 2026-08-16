# Customer Cancellation Rationale

This document explains how Cabbo should support customer-initiated trip
cancellation in the customer frontend.

## Decision

Customers should be able to cancel eligible upcoming bookings from the booking
detail page.

The customer frontend should call the backend cancellation endpoint:

```txt
PATCH /trips/bookings/{booking_id}/cancel
```

The request payload should be limited to customer-safe cancellation fields:

```json
{
  "reason": "Customer provided reason",
  "cancelation_detail": {
    "cancellation_sub_status": "customer_cancelled",
    "reason": "Customer provided reason"
  }
}
```

The backend remains responsible for deciding whether the booking can be
cancelled, applying the correct cancellation policy, initiating any refund, and
returning the updated booking/refund state.

## Eligibility

V1 should show customer cancellation only for upcoming bookings where the trip
has not started and the booking is in a customer-cancellable status such as:

- `confirmed`
- `created`, if a created booking can exist after payment/session recovery

Do not show cancellation actions for:

- ongoing trips
- completed or closed trips
- cancelled trips
- disputed trips
- stale past-active records

These cases require support or operations handling instead of customer
self-service cancellation.

## Why Booking Detail Page

Cancellation should live on the booking detail page, not on My Trips cards.

The detail page has the full context: route, timing, fare, refund/cancellation
policy, and booking ID. This reduces accidental cancellations and makes the
decision feel deliberate.

This matches common cab-app UX: customers select a booking first, review the
details, then cancel from the booking detail view.

## UX Rules

The cancellation action should be visually secondary, not a primary CTA.

Recommended flow:

1. Customer taps `Cancel trip`.
2. Show a confirmation panel or modal with the cancellation consequence.
3. Allow optional reason entry.
4. Submit the cancellation request.
5. On success, refresh or update the booking detail state to cancelled.
6. Show the cancelled-trip refund summary when refund details are available.

The UI should not calculate refund percentages independently. The backend owns
policy evaluation and refund processing.

## Payload Boundary

Customers cannot raise disputes from the customer frontend. Disputes are raised by the backend
team against a trip when either of customer 
or driver party reaches out with a complaint
like driver fled midway, customer fled without paying etc. Cabbo owns the complete discretion
to mark a status as dispute or not.

Customers also cannot send operational fields such as:

- `dispute_detail`
- `extra_payment_to_driver`
- actual `start_datetime`
- actual `end_datetime`

Those are operations/admin-owned fields.

For customer cancellation, the only relevant payload fields are:

- `reason`
- `cancelation_detail.reason`
- `cancelation_detail.cancellation_sub_status = customer_cancelled`

## Industry Alignment

Cab apps generally allow cancellation before the trip begins, then move the
booking into a cancelled detail state where refund status and cancellation
policy are shown. They do not let customers edit operational trip state or raise
formal disputes from the normal cancellation action.

Cabbo follows the same model:

- customer owns the cancellation request
- backend owns policy/refund truth
- operations owns disputes and exceptional status changes
