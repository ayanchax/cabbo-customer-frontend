# Product Backlog: Cabbo Customer App

This document is the central source of truth for work intentionally deferred
beyond V1. The V1 launch checklist should link here instead of maintaining a
second deferred-feature list.

## Book A Ride For Someone Else (v2)

- **Feature:** Let a customer book for themselves or select another passenger.
- **V1 behavior:** The frontend omits `passenger`; the backend safely defaults
  the search to `"self"`.
- **Why deferred:** It is a useful convenience feature, but it is not required
  to validate Cabbo's core search, pricing, payment, and fulfilment flows.
- **Search-flow placement:** Add passenger selection on the trip-specific
  details screen before the customer requests ride options.
- **Interaction:**
  - Default to **Myself**.
  - Offer **Someone else** as an explicit alternative.
  - Show previously saved passengers for quick selection.
  - Open a focused panel for adding a passenger with required name and phone
    number fields.
  - Save the passenger through the existing backend endpoint and attach the
    returned passenger ID to the search request.
- **Limits:** Respect the backend-configured maximum of five saved passengers.
- **Immutability:** Passenger selection cannot be changed after booking
  confirmation. Changing the rider requires a new booking or an explicit
  future support workflow.
- **Backend safety:**
  - Validate that the passenger exists, belongs to the requesting customer, and
    is active.
  - Revalidate at booking creation or preserve a trusted passenger snapshot
    from the staged search so deletion in another tab cannot create an invalid
    confirmed booking.
  - Prefer an ownership-scoped lookup that does not reveal whether another
    customer's passenger ID exists.
- **Special requests:** Free-text special requests are not a substitute for
  passenger selection. Driver contact and rider identity must remain structured
  and validated.
- **Priority:** V2; not required for launch.

## Booking-Specific Alternate Contact Number (v2)

- **Feature:** Let a customer provide an alternate phone number for a specific
  confirmed booking.
- **V1 behavior:** Drivers and Cabbo operations use the customer's verified
  primary phone number. Exceptional contact changes are handled through
  support.
- **Why deferred:** The field requires validation, consent and ownership
  considerations, clear driver-facing contact priority, and protection against
  accidental or malicious third-party phone-number entry.
- **Future behavior:**
  - Label the number clearly as an alternate contact for this booking.
  - Validate its country code and format.
  - Prefer OTP verification before exposing it to a driver.
  - Define whether the primary or alternate number should be contacted first.
  - Record when and by whom the number was added.
  - Prevent arbitrary changes once the trip reaches an operational cutoff.
  - Include the number only in customer-safe and driver-safe booking responses
    that genuinely require it.
- **Relationship to passenger booking:** When booking for someone else, the
  selected passenger's validated phone number should normally serve as the
  rider contact. Avoid maintaining two competing contact concepts without a
  clear precedence rule.
- **Special requests:** Do not accept phone numbers through the free-text
  special-request field.
- **Priority:** V2; not required for launch.

## Detailed Trip Experience Review (v2)

- **Feature:** Extend the post-trip review beyond the V1 star rating and
  optional feedback.
- **V1 behavior:** The customer sees a compact rating form with a required
  1-5 star rating and optional short feedback only.
- **Why deferred:** Detailed questions such as cab cleanliness, AC condition,
  driving behavior, punctuality, and overall cab condition make the review feel
  heavier. V1 should capture the main quality signal without slowing the
  customer down after a trip.
- **Future behavior:**
  - Show detailed fields behind a small `Tell us more` action.
  - Prefer showing the expanded questions after low ratings, where operational
    diagnosis matters most.
  - Submit the backend-supported `overall_experience` payload with:
    cab cleanliness, AC working condition, driving behavior, punctuality,
    overall cab condition, and optional extra comments.
  - Use the structured data in admin dashboards for driver, fleet, and service
    quality monitoring.
- **Priority:** V2; not required for launch.

## Other Deferred Product Work

- Discount and coupon engine.
- Campaign or marketing CMS.
- Fully dynamic, region-personalized homepage.
- Real-time traffic-based pricing.
- Advanced live driver/customer tracking.
- Full support ticketing or in-app chat.
- Rich trip-status timeline.
- Promotional homepage sections that could delay core booking readiness.

## Consent-Based Device Switching (v2+)
- **Feature:** Allow users to switch their active session to a new device with explicit consent, logging out the previous device.
- **Context:** Currently, only one device can be logged in at a time for security. In v2, prompt the user: "You are logged in elsewhere. Continue here and log out other devices?"
- **Rationale:** This is an industry standard for transactional apps (ride-hailing, OTT, banking, etc.) to balance security and user convenience.
- **Implementation:**
  - Show a modal/dialog when backend returns ALREADY_LOGGED_IN.
  - On user consent, invalidate the old session and continue login on the new device.
  - Ensure backend idempotency and security.
- **Priority:** v2 or later (not required for launch).

---

*Add future deferred features here rather than duplicating them in the V1
launch checklist.*
