# Trip Rating Rationale

This document explains why Cabbo should collect in-app trip ratings and how the
V1 rating experience should be scoped.

## Decision

Cabbo should support customer trip ratings for successfully completed trips in
V1.

Ratings should be submitted through:

```txt
POST /trips/reviews/{booking_id}/submit-review
```

The minimum customer-facing input should be:

- overall rating from 1 to 5
- optional short feedback

Detailed experience fields are supported by the backend, but they should not be
part of the V1 customer UI.

## Why In-App Rating Instead Of Only Google Reviews

Google reviews help public discovery and trust, but they do not give Cabbo
structured operational data tied to a trip.

Cabbo needs in-app trip ratings because they can be associated with:

- booking ID
- trip type
- driver
- cab
- route/geography
- operational timing
- cancellation/refund/support history where applicable

This makes the feedback useful for service quality, driver performance, fleet
quality, and future admin dashboards.

Google review prompts can be added later as a secondary growth/trust layer,
ideally after a positive in-app rating has already been submitted.

## Eligibility

Show the rating action for:

- trips that are successfully completed or closed with all dues cleared by the
  customer, meaning `balance_payment == 0`
- cancelled trips where a driver was already assigned, because the customer may
  have had a real coordination or service interaction before cancellation

Do not show rating for:

- upcoming trips
- ongoing trips
- cancelled trips where no driver was assigned
- disputed trips
- stale past-active trips whose operational status was not closed correctly

This keeps feedback tied to trips that were actually fulfilled.

## V1 UX Scope

V1 should avoid a heavy survey.

Recommended flow:

1. Show a compact `Rate your trip` section on completed booking details.
2. Customer selects 1-5 stars.
3. Customer may add optional feedback.
4. Submit the review.
5. After success, show the submitted rating in read-only form.

Detailed `overall_experience` fields should be deferred from the V1 UI:

- cab cleanliness
- AC working
- driving behavior
- punctuality
- overall cab condition
- other comments

The backend can already accept these fields, but asking for them in V1 would
make the review feel like a service audit. For launch, Cabbo should keep the
review interaction to a required star rating and optional short feedback.

These fields can return later as a progressive `Tell us more` step, especially
after a low rating, when the extra detail is more useful and less intrusive.

## Placement

The trip rating component should be a separate booking-detail section, not part
of the driver card.

The driver card is for identity, contact, cab, and trust information. A trip
review is broader: it can cover the driver, cab cleanliness, AC, punctuality,
and the overall Cabbo experience. Keeping it separate avoids making the driver
profile feel like an action form and keeps the booking detail page easier to
scan.

For V1, place `TripReview` after the driver/cab section on completed or closed
booking details, before support, fare, and historical policy sections. This
keeps the rating contextual without burying it under financial information.

## Backend Ownership

The backend should validate:

- rating is between 1 and 5
- optional feedback length
- whether the booking is review-eligible
- whether the customer owns the booking
- whether a review has already been submitted, if reviews are add-once

The frontend should not decide final review eligibility beyond basic UI gating.
It should handle backend rejection gracefully.

## Industry Alignment

Cab apps commonly ask for a quick rating after completed rides. The interaction
is short, contextual, and tied to the completed booking. This creates a direct
quality loop without forcing the customer into a public review flow.

Cabbo follows the same principle:

- collect structured internal feedback first
- keep the rating experience lightweight
- use public review prompts later as a secondary channel, post V1.
