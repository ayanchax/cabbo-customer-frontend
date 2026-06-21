# Cabbo V1 Launch Roadmap

## Objective

Launch Cabbo with a complete scheduled-cab booking experience for:

- local hourly rentals
- airport pickup
- airport drop-off
- outstation trips

V1 should prioritize reliable search, transparent pricing, successful payment, operational fulfilment, customer support, and minimum legal/compliance readiness. Marketing automation, discounts, dynamic pricing, and a full content-management system can follow after launch.

---

## Sequencing Decision

Do not complete every remaining cross-trip feature before starting outstation.

Use this order:

1. Fix shared search and date-time foundations.
2. Build the outstation flow using those stable foundations.
3. Finish shared booking-detail capabilities across all trip types.
4. Complete the minimum admin operations needed to fulfil bookings.
5. Complete legal, privacy, security, testing, and production-readiness gates.
6. Add lightweight landing-page discovery content if time remains.

This prevents outstation from reproducing known SearchCard and date-time picker problems while avoiding a long detour into non-essential homepage or CMS work.

---

## P0: Launch Blockers

These items must be complete before accepting real bookings.

### Customer-safe Driver API

- [x] The backend booking-detail API uses a customer-safe driver DTO instead of returning the full internal driver record.
- [x] Sensitive and internal attributes such as date of birth, address, religion, nationality, emergency contacts, bank details, payment details, amenities, and account state are excluded at the API boundary.

Current customer-safe `driver` response contract:

```json
{
  "name": "Babu Driver",
  "email": "babu@example.com",
  "phone": "+91 9812345678",
  "gender": "male",
  "cab_type": "Sedan",
  "fuel_type": "diesel",
  "cab_model_and_make": "Maruti Swift Dzire",
  "cab_registration_number": "KA01AB2316",
  "avg_rating": 4,
  "profile_picture_url": "https://example.com/driver-profile.png"
}
```

The customer frontend should consume only this DTO and must tolerate optional fields such as email, gender, rating, and profile picture being absent.

### Payment and Booking Integrity

- [x] Payment verification is backend-authoritative.
- [x] Duplicate payment and confirmation requests are idempotent.
- [x] Staged-trip cleanup is implemented through the payment-failure API flow and a backend scheduler that clears remaining temporary trips if client/API cleanup fails.
- [x] Booking success survives refresh and navigation.
- [x] Failed payments leave the customer on the pre-confirmation page so payment can be retried safely.
- [x] Fare, advance, balance, add-ons, refunds, and cancellation terms come from the backend as the authoritative source.

Before production launch, verify these completed controls in staging with payment success, payment failure, duplicate callbacks, refresh, retry, and abandoned-payment scenarios.

### Minimum Admin Operations

Real customer bookings cannot launch without an operational control surface.

The admin MVP must support:

- authenticated admin access
- trip list with useful filters
- trip detail
- customer-safe and internal trip data views
- assign/reassign driver
- update operational trip status
- view payment state
- view customer contact and special request
- record operational notes

A polished analytics dashboard is not required for v1.

### Legal and Support Readiness

- reviewed legal documents are published
- support phone and WhatsApp contacts are operational
- grievance/contact details are visible
- cancellation/refund rules match backend behavior
- privacy collection and retention behavior matches the published notice
- applicable aggregator/state licensing and operational requirements are confirmed with counsel

---

## Phase 1: Shared Search Foundations

Complete these before building outstation.

### SearchCard Suggestion Behavior

Fix the following:

- do not show a full skeleton when usable previous suggestions are already visible
- while refreshing, retain old suggestions and show only a subtle loading indicator
- when the query is empty, show user-selected recent places first
- persist selected places with recency metadata
- move a newly selected place to the top
- do not let a recent API query result list outrank the user's actual selections
- use API results for active queries and local recent selections for the empty-query state
- use recent selections as fallback when offline or when the API fails
- deduplicate by stable `place_id`

Recommended display policy:

- empty query: selected recent places, newest first
- query length below search threshold: recent places
- active query: API results
- active query while loading with stale results: retain results, no list skeleton
- API failure/offline: locally stored recent places

### InlineDateTimePicker State Restoration

Convert `InlineDateTimePicker` into a controlled-capable component.

Recommended API:

```jsx
<InlineDateTimePicker
  value={startDate}
  earliestStartDate={earliestStartDate}
  onChange={setStartDate}
/>
```

Requirements:

- parent feature state remains the source of truth
- returning from ride options restores the previously selected date/time
- the picker must not overwrite a restored value with its first default slot
- empty-slot days automatically advance to the next valid day
- restored values must still satisfy the current earliest-start constraint

This component will be reused by airport, hourly rental, and outstation flows, so fixing it before outstation avoids duplicated defects.

---

## Phase 2: Outstation Flow

Build outstation after the shared search and date-time fixes.

Minimum v1 scope:

- one-way and round-trip intent, if supported by backend
- origin and destination
- start date/time
- return date/time or trip duration, where applicable
- passenger and luggage preferences
- package/ride search
- option comparison
- fare breakdown and overage rules
- payment and booking confirmation
- booking detail page
- cancellation/refund display
- support access
- special request
- driver details when assigned

Reuse shared components and policies instead of creating outstation-specific copies unless the domain behavior genuinely differs.

---

## Phase 3: Shared Booking-detail Completion

### My Trips

Build the customer trip-list page linked from the bottom navigation.

Recommended tabs:

- Upcoming
- Ongoing
- Past

The Past tab may contain completed and cancelled trips, with a visible status on each item. If cancelled trips become numerous or need different actions, they can later move to a separate tab/filter.

Each trip-list item should show enough information for quick recognition:

- trip type
- pickup and destination summary
- start date/time
- booking status
- cab/fleet type, when available
- booking ID in secondary text

Behavior requirements:

- select a trip to open its booking-detail page
- support loading, empty, error, refresh, and pagination/infinite-list states
- use backend status/category fields as the source of truth
- preserve the selected tab during navigation where practical
- show a useful empty state for each tab

### Customer Profile and Logout

Build the customer profile page linked from the bottom navigation.

Minimum v1 profile content:

- customer name
- verified phone number
- email, when available
- profile/account identifier only if useful to support
- links to legal and policy pages
- support/contact entry

Place a clear Logout button at the bottom of the profile page, visually separated from ordinary profile actions.

Logout requirements:

- ask for confirmation before logging out
- clear local authentication/session data
- clear or isolate customer-specific cached data
- invalidate the backend session where supported
- navigate to the login page using history replacement
- do not remove non-sensitive preferences that are intentionally device-level unless product policy requires it

### Trip Status Label

Show a compact status indicator near the booking-detail header.

Use the backend status/label as the source of truth rather than calculating status only from local time.

Suggested states:

- Payment pending
- Upcoming
- Ongoing
- Completed
- Cancelled

Use subdued semantic colors and text together; color alone must not carry meaning.

### Driver Details

Render driver details only when the customer-safe `driver` object is present.

Show:

- profile photo
- driver name
- call action
- email, if product design requires it
- cab make/model
- registration number
- cab type and fuel type
- average rating

Do not show internal or sensitive driver attributes.

### Get Help for This Trip

Provide a compact support section on each booking-detail page:

- Call Cabbo
- Message on WhatsApp

Requirements:

- phone/WhatsApp values should come from server geography, app configuration, or a dedicated support endpoint
- do not hardcode regional support contacts in components
- prefill WhatsApp with the booking ID and a short support message
- do not place unnecessary personal or payment data in the WhatsApp message
- show support hours if support is not 24/7

### Special Request

For v1, treat `special_needs_requests` as add-once and then read-only.

Suggested behavior:

- show an Add special request action only when no request exists
- explain that requests are subject to availability and are not guaranteed
- show a short confirmation before submission because editing is not allowed
- submit through `useEditNonCostImpactingTripFields`
- after success, display the saved request read-only
- backend must enforce allowed booking statuses, length limits, sanitization, and add-once behavior

This changes the earlier assumption that special requests remain freely editable. Update `edit-trip-rationale.md` when this behavior is implemented.

### Airport Pickup Operational Details

Keep the current airport policy:

- flight number is editable after confirmation
- terminal number is editable after confirmation
- placard name is editable only when placard service was purchased
- toll preference cannot be removed
- placard service cannot be removed
- passenger/luggage metadata remains locked

---

## Phase 4: Legal and Policy Pages

This section is product planning, not legal advice. Final content and applicability should be reviewed by Indian counsel familiar with mobility aggregators, consumer protection, payments, and data protection.

### Minimum Pages

Add public routes and footer/profile links for:

- Terms of Service / User Agreement
- Privacy Notice
- Cancellation and Refund Policy
- Fare, Payment, Toll, Parking, and Additional-charge Policy
- Grievance Redressal and Contact Information
- Safety and Acceptable-use Guidelines
- Cookie Notice, only if non-essential cookies, analytics, or advertising tracking are used

The pages should identify the legal entity, registered/business contact information, customer-care contact, grievance contact, effective date, and document version where applicable.

### Content Storage for V1

Recommended v1 approach:

- keep reviewed legal content as versioned Markdown, JSON, or JSX content in the repository
- assign each document an immutable version and effective date
- record the accepted terms/privacy version server-side at relevant consent points
- retain old versions for audit purposes

Do not implement an unversioned "always return latest legal text" API.

### Later CMS/API Option

Move legal content to a backend-managed document API when Cabbo needs:

- updates without frontend deployment
- state/region-specific terms
- multiple languages
- multiple active historical versions
- scheduled effective dates

The backend model must be immutable/versioned and expose the exact version accepted by a customer.

### Legal Reference Baseline

Review at minimum:

- Digital Personal Data Protection Act, 2023 and applicable rules/commencement notifications
- Consumer Protection Act, 2019
- Consumer Protection (E-Commerce) Rules, 2020, where applicable
- applicable Motor Vehicle Aggregator Guidelines and state-specific requirements
- payment-provider and refund disclosure obligations

Official reference starting points:

- MeitY data protection framework: https://www.meity.gov.in/data-protection-framework
- Department of Consumer Affairs consumer-protection materials: https://consumeraffairs.nic.in/acts-and-rules/consumer-protection
- Ministry of Road Transport and Highways: https://morth.nic.in/

---

## Phase 5: Landing/Home Experience

Do not build a marketing landing page in place of the working search experience. Search must remain the first and primary screen.

### V1 Recommendation

Below the SearchCard, add a limited set of useful discovery sections:

- Popular outstation routes
- Airport pickup/drop quick actions
- Hourly rental/day-trip quick action
- two or three concise Cabbo benefit cards

Examples for Bengaluru:

- Mysuru
- Ooty
- Coorg
- Airport pickup
- Airport drop-off
- Bengaluru day rental

### Data Source

Do not block v1 on a full promotional-content API.

Fastest v1 options:

1. frontend configuration keyed by region
2. existing backend geography configuration, if easy to extend safely
3. a small read-only recommendations endpoint

A full admin-managed campaign/content system belongs after v1.

### Card Behavior

- route cards should prefill origin/destination or navigate into the relevant trip flow
- quick-action cards should route to airport/hourly flows
- informational benefit cards should remain non-routable
- do not advertise discounts that are not backed by an implemented pricing/discount system
- "Transparent regional pricing" or "Competitive fares" is safer than presenting an unverified strike-through discount

---

## Phase 6: Quality and Release Gates

### Functional Testing

Test all trip types end to end:

- search and classification
- preference persistence
- no-results flow
- ride-option selection
- payment success
- payment failure/retry
- booking confirmation
- refresh/deep-link booking detail
- cancellation/refund presentation
- driver assignment appearance
- support actions
- special request submission

### Responsive and Accessibility Checks

- mobile, tablet, desktop
- keyboard navigation
- visible focus
- readable status and error messages
- no text overflow
- adequate contrast
- icon-only controls have accessible names

### Reliability

- production error monitoring
- API error logging with sensitive-data redaction
- loading and empty states
- idempotent customer actions
- network/offline behavior
- route refresh support
- no development logs containing personal or payment data

### Security and Privacy

- customer-safe API response models
- no secrets in frontend environment variables
- secure authentication/session behavior
- authorization checks on every booking edit/detail endpoint
- rate limiting for OTP, search, support, and mutation endpoints
- input validation and output encoding
- data-retention and deletion workflow

### Production Operations

- production domain and TLS
- environment configuration
- database backups
- payment webhooks
- support escalation process
- driver assignment process
- cancellation/refund operations
- incident response owner

---

## V1 Versus Later

### Required for V1

- SearchCard behavioral fixes
- controlled date-time restoration
- outstation flow
- My Trips page with Upcoming, Ongoing, and Past tabs
- customer profile page with support/legal links and logout
- [x] customer-safe driver DTO
- customer-safe driver display
- booking status display
- call/WhatsApp support
- add-once special request
- minimum admin operations
- legal/policy pages
- end-to-end testing and security review

### Useful if Time Allows

- static/config-driven popular destination cards
- simple Cabbo benefit cards
- richer status timeline
- support-hours messaging

### V2 or Later

- discount/coupon engine
- campaign CMS
- fully dynamic region-personalized homepage
- real-time traffic-based pricing
- advanced driver/customer live tracking - if we get investment
- support ticket/chat system

---

## Recommended Immediate Sprint

Before outstation:

1. Fix SearchCard loading/recent-selection behavior.
2. Make `InlineDateTimePicker` controlled and restorable.
3. [x] Define and implement the customer-safe driver DTO contract.
4. Add the shared trip-status model/component.

Then:

5. Build outstation end to end.
6. Build My Trips with Upcoming, Ongoing, and Past tabs.
7. Complete customer profile, support/legal links, and logout.
8. Add shared booking-detail support, driver, and special-request sections.
9. Build the minimum admin fulfilment frontend.
10. Publish reviewed legal pages and record accepted document versions.
11. Run full release testing.
12. Add lightweight homepage route cards only if they do not delay launch.

---

## Definition of Done for Cabbo V1

Cabbo V1 is ready when a customer can:

- find and book every supported trip type
- view upcoming, ongoing, completed, and cancelled trips
- understand the route, timing, cab, fare, add-ons, and policies
- pay and receive a durable confirmed booking
- see booking status and assigned driver information
- contact support
- submit permitted operational information
- view accurate booking and payment details after refresh
- view their profile and securely log out

And Cabbo operations can:

- see every booking
- assign a driver
- update trip status
- support the customer
- verify payment and fare information
- fulfil or cancel/refund the trip through a documented process
