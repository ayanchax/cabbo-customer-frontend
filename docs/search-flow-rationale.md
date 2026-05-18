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

_Last updated: May 2026_
