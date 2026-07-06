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

## Terms And Privacy Acceptance Version Tracking (v2)

- **Feature:** Record the Terms of Service and Privacy Policy versions accepted
  by each customer.
- **V1 behavior:** The customer frontend links to backend-published,
  versioned legal pages. The backend owns the active legal files and exposes
  their version and effective date.
- **Why deferred:** V1 does not yet need a full legal acceptance ledger because
  legal pages are backend-versioned and Cabbo is not running frequent
  re-consent workflows. Building acceptance history now would add backend data
  model and UX surface area without blocking core booking validation.
- **Future behavior:**
  - Store customer ID, document slug, version, accepted timestamp, and source
    surface.
  - Require acceptance during onboarding and re-acceptance after material
    Terms/Privacy changes.
  - Preserve historical document versions for audit and support.
  - Expose admin/internal views for acceptance status if needed.
- **Priority:** V2 unless counsel requires it before launch.

## Counsel-Led Aggregator And State Requirement Review (v2)

- **Feature:** Have counsel review Cabbo's customer policies, state-specific
  operating requirements, aggregator obligations, grievance wording, and
  customer-facing legal flows.
- **V1 behavior:** Cabbo publishes practical, generic cab-app policies that
  match the current product behavior, backend fare/refund logic, and support
  process.
- **Why deferred:** V1 needs speed and operational validation. The current
  legal pages are versioned and visible to customers, but a deeper
  counsel-led jurisdictional review can happen after the core launch unless a
  specific regulatory requirement is identified before go-live.
- **Future behavior:**
  - Review Terms, Privacy, Cancellation/Refund, Fare/Charges, Safety, Contact,
    and Grievance pages.
  - Add state-specific wording if Cabbo expands operations or regulatory
    exposure.
  - Review whether explicit acceptance-version tracking should become
    mandatory.
  - Maintain reviewed versions in backend legal content with effective dates.
- **Priority:** V2/legal hardening; promote earlier if a launch jurisdiction
  or partner requires it.

## Self-Serve Account Deletion And Data Export (v2)

- **Feature:** Let customers request account deletion, deactivation,
  reactivation, and/or data export through a structured in-app or web flow.
- **V1 behavior:** Account deactivation, suspension, and deletion requests are
  handled through Cabbo support/admin operations. Cabbo can soft-delete or
  deactivate an account, block login for inactive/suspended users, and retain
  booking, payment, refund, dispute, safety, and legally/operationally required
  records.
- **Why deferred:** Cab bookings involve payments, refunds, driver safety,
  disputes, fraud prevention, and operational records. A self-serve deletion
  workflow needs careful identity verification, retention rules, audit trails,
  and reactivation handling.
- **Future behavior:**
  - Add a customer-facing request flow for account deletion/deactivation.
  - Verify identity before accepting the request.
  - Separate removable profile data from records that must be retained.
  - Anonymize optional fields where feasible.
  - Preserve required booking/payment/refund/dispute records.
  - Track request status and completion.
  - Provide exportable customer data if required by policy or law.
- **Priority:** V2/legal hardening; not required for V1 launch.

## Other Deferred Product Work

- Discount and coupon engine.
- Campaign or marketing CMS.
- Fully dynamic, region-personalized homepage.
- Real-time traffic-based pricing (on investment and if we go instant booking mode)
- Advanced live driver/customer tracking (on investment and if we go instant booking mode)
- Full support ticketing or in-app chat.
- Rich trip-status timeline.
- Promotional homepage sections that could delay core booking readiness.

## MSG91 SMS And WhatsApp Automation (post-launch)

- **Feature:** Move Cabbo messaging from the temporary Twilio OTP bridge to a
  lower-cost India-first messaging setup with MSG91 for SMS/OTP and WhatsApp.
- **V1 behavior:** Use Twilio only for OTP delivery with strict rate limits and
  spend monitoring. Do not block launch on WhatsApp automation. Driver
  assignment remains visible in app and can be supported by email/manual ops
  during early launch.
- **Why deferred:** MSG91 SMS and WhatsApp setup currently requires DLT,
  template, company incorporation, and Meta/Facebook verification work. Company
  incorporation is still in progress, so this should not block dev or V1
  launch.
- **Future behavior:**
  - Complete DLT registration and sender/template approvals.
  - Complete WhatsApp Business onboarding and Meta verification.
  - Add MSG91 OTP/SMS provider adapter.
  - Add MSG91 WhatsApp provider adapter.
  - Use WhatsApp first for high-trust operational notifications such as driver
    assignment/reassignment.
  - Keep OTP delivery rate-limited and monitored.
  - Log masked phone numbers only.
  - Track provider delivery failures for ops visibility.
- **Priority:** Post-launch cost/trust improvement; not required for V1
  launch.

## Consent-Based Device Switching (v2+)
- **Feature:** Allow users to switch their active session to a new device with explicit consent, logging out the previous device.
- **Context:** Currently, only one device can be logged in at a time for security. In v2, prompt the user: "You are logged in elsewhere. Continue here and log out other devices?"
- **Rationale:** This is an industry standard for transactional apps (ride-hailing, OTT, banking, etc.) to balance security and user convenience.
- **Implementation:**
  - Show a modal/dialog when backend returns ALREADY_LOGGED_IN.
  - On user consent, invalidate the old session and continue login on the new device.
  - Ensure backend idempotency and security.
- **Priority:** v2 or later (not required for launch).

## Admin Backend Endpoints: 

- [ ] Admin configuration management endpoints with `super_admin` or `finance_admin` access only.
- [ ] Airport pricing endpoints by cab type, fuel type, and region.
- [ ] Local pricing endpoints by cab type, fuel type, and region.
- [ ] Outstation pricing endpoints by cab type, fuel type, and state.
- [ ] Fixed platform fee endpoint by country.
- [ ] Night pricing endpoint by region or state.
- [ ] Permit fee endpoint by cab type, fuel type, and state.
- [ ] Local trip package config endpoint by `region_id`; backend model/script exists in `local_trip_package.py`.
- [ ] Trip common pricing endpoint by `trip_type_id` and region/state.
- [ ] Cancellation policy endpoint by `region_id` and trip type ID.
- [ ] Cancellation policy endpoint by `state_id` and trip type ID.
- [ ] Admin CRUD for packages and fleet/category setup.
- [ ] Admin CRUD for region/state availability.
- [ ] Admin content management for legal/support pages.
- [ ] Rich admin dashboards and analytics.
- [ ] Advanced notification preference center.
- [ ] Provider cost optimization after real usage data.


---

*Add future deferred features here rather than duplicating them in the V1
launch checklist.*
