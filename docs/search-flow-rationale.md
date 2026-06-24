# Cabbo Trip Search Flow Rationale

## Overview
Cabbo's trip search flow is designed to balance user experience, trust, and operational accuracy for scheduled bookings. This document explains the reasoning behind our current approach, alternatives considered, and the business logic for trip type handling.

---

## Current Approach: Two-Button Flow (Chosen)

### Flow Steps
1. **Classify Trip Type:**
   - User enters pickup/drop locations.
   - Backend classifies the trip type (local/hourly rental, airport transfer, outstation) based on intent.
   - User is routed to the relevant trip context screen.
2. **User Provides Details:**
   - User fills in required details (start date/time, end date/time or number of days, etc.) as per trip type.
   - User clicks a second button to trigger the `/search` API and view cab options of the classified trip type.

### Rationale
- **Trust & Accuracy:** Ensures all search results are based on user-validated, concrete information (not assumptions).
- **Reduced Friction Later:** Less need for users to correct or update details after seeing options.
- **Industry Precedent:** Major platforms (e.g., Uber Intercity) use a similar two-step approach for scheduled bookings.
- **Transparency:** Users know exactly what information is being used to generate results.
- **Scalability:** Backend is designed to support more advanced flows in the future if needed.

### Downsides
- Slightly slower to see options (one extra click).
- Requires user to provide all required info before seeing cabs.

---

## Alternative: One-Button (Search-Lite) Flow (Not Chosen)

### Flow Steps
1. **Classify Trip Type & Search-Lite:**
   - User enters locations and clicks a single button.
   - Backend classifies trip type and immediately performs a liberal search with default/assumed values (e.g., soonest valid date/time).
   - User sees options instantly, but must fill/confirm details after selecting a cab.

### Rationale
- **Speed:** User sees options with minimal input and clicks.
- **Modern Feel:** Feels fast and responsive.

### Downsides
- **Assumptions:** Search results may not match user's real intent (defaulted date/time, etc.).
- **Extra Step Later:** User must still fill/adjust details after selecting a cab.
- **Potential for Mismatched Results:** Can lead to confusion or mistrust if options change after user provides real details.

---

## Business Logic for Trip Types
- **Airport Transfers:** Must be booked at least 3 hours from now.
- **Local/Hourly Rental:** Must be booked at least 6 hours from now.
- **Outstation:** Must be booked at least 2 days from now (requires start and end date/time or number of days).

---

## Passenger Selection

### V1 Decision

Cabbo V1 supports self-booking in the customer frontend. The frontend does not
send the optional `passenger` field, and the backend defaults the request to
`"self"`.

Booking for another person is intentionally deferred because it adds passenger
creation, saved-passenger selection, contact validation, ownership checks, and
post-confirmation operational rules without being necessary for the core V1
booking journey.

Special requests do not replace this capability. Rider identity and contact
details must be structured and validated rather than passed as free text.

### Future Flow

The future **Someone else** option belongs on the trip-specific details screen
before ride search. The customer will select a saved passenger or add one using
required name and phone fields. The resulting passenger ID will be attached to
the search payload and validated by the backend.

Passenger selection will be fixed after booking confirmation. Full scope and
implementation notes are tracked in [backlogs.md](./backlogs.md).

---

## Ride Option Recommendation Signal

### Current Approach

Cabbo may show a small **Best choice** tag on a ride option when the backend
marks that option as recommended for the user's passenger and luggage details.

The signal is shown only on the ride options screen because this is the point
where the customer is comparing cabs and deciding what to reserve. It helps
the customer understand which option best fits the search context without
forcing them into a single choice.

### Why It Is Not Shown Downstream

After a ride is selected, confirmation and booking detail pages should focus on
facts: selected cab, fare, inclusions, add-ons, payment, cancellation terms, and
operational trip details. Repeating recommendation language after selection can
feel redundant and may distract from the confirmed booking state.

This matches common cab-app behavior: recommendation cues are useful during
choice, while post-selection screens become transactional and informational.

### Backend Responsibility

The backend remains responsible for capacity-aware eligibility, ranking, and
recommendation metadata. The frontend only renders the recommendation signal
from trusted search-result data, such as `car_capacity.recommended`.

### Capacity And Differentiator Display

Cabbo does not show passenger and luggage capacity text on every ride option in
V1. Search results are already backend-filtered and ranked against the user's
passenger and luggage details, so repeating "fits up to X passengers / Y bags"
on each card would add clutter without improving the core decision.

Capacity data remains important backend metadata for eligibility, sorting, and
recommendation. The frontend only surfaces compact differentiators when they
help compare otherwise valid options. For example, `car_capacity.roof_carrier`
is shown as a small roof-carrier signal because it is a visible service
difference, especially for outstation luggage-heavy trips.

---

## Decision
**Cabbo is committed to the two-button approach for trip search.**
- This prioritizes trust, accuracy, and a transparent booking experience.
- We are comfortable with one extra click to ensure genuine, user-validated results.
- The backend is flexible and can support a search-lite flow in the future if business needs change.

---

## Future Considerations
- If user expectations or business needs shift toward instant booking, we can revisit the search-lite approach.
- The current backend/classify endpoint is designed to support both flows for easy experimentation or A/B testing.

---

## Summary Table
| Approach         | Steps | Pros                                 | Cons                                 | Status   |
|------------------|-------|--------------------------------------|--------------------------------------|----------|
| Two-Button (Chosen) | 2     | Trust, accuracy, less friction later | Slower to see options                | Adopted  |
| One-Button (Search-Lite) | 1     | Fast, modern, instant options        | May mismatch user intent, more corrections later | Not adopted |

---

_Last updated: June 2026_
