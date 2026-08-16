# Local/Hourly Rental Service Component — Core Working

## Overview
This document describes the core logic, required fields, and backend integration for the Local/Hourly Rental context in Cabbo. It clarifies which fields are mandatory, which are optional, and how defaults are handled, ensuring the frontend and backend remain in sync.

---

## Required Fields (Frontend → /search API)
- **trip_type:** Always set to "local" for this context.
- **origin:** Pickup location (LocationInfo object: display_name, lat, lng, place_id, address, region_code).
- **start_date:** ISO datetime string (when the trip starts; must be at least 6 hours from now).
- **package_id:** Selected from available hourly packages (e.g., 4h/40km, 6h/60km, etc.).

## Optional Fields
- **destination:** Optional for local rentals. User may specify a drop-off location, but can leave it blank (open-ended rental).
- **num_adults, num_children:** Optional. If not provided, backend will set sensible defaults. These are the only passenger fields shown for local/hourly rental, as luggage fields are not relevant for short in-city trips.
- **preferred_car_type, preferred_fuel_type:** Optional. Backend defaults to Sedan/Diesel if not provided. (Not shown in UI for now.)
- **passenger:** For now, always self (current user). "Book for someone else" will be added later.

## Not Used in Local/Hourly Rental
- **hops:** Not supported for local rentals (only for outstation in future).
- **Luggage fields:** (num_large_suitcases, num_carryons, num_backpacks, num_other_bags) are not shown for local/hourly rental. These are only relevant for airport and outstation trips.

---

## Backend Defaulting Logic
The backend ensures all required preferences have sensible defaults if not provided by the frontend:

```python
def _set_default_preferences(search_in: TripSearchRequest):
    """
    Ensures all required trip search preferences have sensible defaults.
    - Sets 'preferred_car_type' to CarTypeEnum.sedan if not provided.
    - Sets 'preferred_fuel_type' to CarTypeEnum.diesel if not provided.
    - Ensures at least one adult is present (defaults to 1 if missing or < 1).
    - Ensures number of children is not negative (defaults to 0 if missing or < 0).
    """
    if not search_in.preferred_car_type:
        search_in.preferred_car_type = CarTypeEnum.sedan
    if not search_in.preferred_fuel_type:
        search_in.preferred_fuel_type = CarTypeEnum.diesel
    if search_in.num_adults < 1 or search_in.num_adults is None:
        search_in.num_adults = 1
    if search_in.num_children < 0 or search_in.num_children is None:
        search_in.num_children = 0
```

This means the frontend can safely omit these fields if the user does not provide them; the backend will ensure valid defaults.

---

## Summary Table
| Field                | Required | Notes                                                      |
|----------------------|----------|------------------------------------------------------------|
| trip_type            | Yes      | Always "local"                                             |
| origin               | Yes      | Pickup location                                            |
| start_date           | Yes      | Must be at least 6 hours from now                          |
| package_id           | Yes      | Selected from available hourly packages                    |
| destination          | Optional | User may specify, but can leave blank                      |
| num_adults           | Optional | Defaults to 1 if not provided; only passenger field shown  |
| num_children         | Optional | Defaults to 0 if not provided; only passenger field shown  |
| preferred_car_type   | Optional | Defaults to Sedan if not provided (not shown in UI)        |
| preferred_fuel_type  | Optional | Defaults to Diesel if not provided (not shown in UI)       |
| passenger            | Optional | Always self for now; "Book for someone else" coming later  |
| hops                 | Not used | Only for outstation trips                                  |
| Luggage fields       | Not used | Only for airport/outstation trips                          |

---


## Implementation Plan (2026)

### 1. Required API Calls
- **Fetch available hourly packages:**  
    Use `useTripPackagesQuery(trip_type, region_code)` to get the list of packages for the user to select from.
- **Fetch prior booking window:**  
    Use `useTripPriorBookingWindowQuery(trip_type, jurisdiction_code)` to get the minimum hours in advance the trip can be scheduled (used to validate `start_date`).


### 2. UI & State
- **Origin:** Display only. The pickup location (origin) is passed via navigation state from the previous step and shown to the user for confirmation. No search/location input in this step.
- **Destination:** Not shown. For local/hourly rentals, destination is not collected (similar to Uber Reserve and other industry standards).
- **Start date/time picker:** With validation (must be at least [prior booking window] hours from now).
- **Package selection:** Dropdown/cards, populated from packages API.
- **Book/Search button:** For swift, easy booking flow.

**Goal:** Minimize friction—user only confirms pickup, selects time and package, and books. No destination or location search in this context.

### 3. Optional Fields for Curated Results:
For local/hourly rental, users can optionally specify number of adults and children to help the system recommend the best car/package. Luggage fields are not shown in this context, as they are not relevant for short in-city trips. If omitted, the backend will use sensible defaults.

### 4. Submission
- On submit, send required fields to `/search` API:
    - `trip_type`: "local"
    - `origin`: LocationInfo object
    - `start_date`: ISO string, validated
    - `package_id`: selected package
- Optional fields (destination, preferences, bags) can be omitted; backend will default as per spec.

### 5. Validation
- Ensure `start_date` is at least `[prior booking window]` hours from now (from API).
- All other required fields must be filled.

### 6. Next Steps
- Build UI skeleton with above fields.
- Integrate both APIs for packages and prior booking window.
- Add validation logic for start date.
- Connect to `/search` API on submit.

---

---

_Last updated: May 2026_

---

## Implementation Status — Completed June 2026

The full Local/Hourly Rental flow is live end-to-end. All implementation plan items above are done.

### Completed Flow

```
Home (SearchCard)
  → classify trip type (/trips/trip-type-classification/classify)
  → LocalHourlyRentalPage  (/local-hourly-rental)
      Packages API + Prior Booking Window API
      Origin display, datetime picker (validated), package selection
      → /search API → TripOptionsList
  → BookingPage  (/booking)
      useInitiateTripBookingMutation → /trips/initiate-booking
      LocalHourlyRentalBooking (review screen)
        TripCabDetails, RouteTimeline, RideTimings, SelectedPackage,
        InCarAmenities, TripPaymentSummary
        → Razorpay Checkout (useRazorPay)
        → /trips/confirm-booking (signature verification)
        → SuccessOverlay (animated ThumbsUp, countdown redirect)
  → BookingDetailPage  (/booking/:bookingId)
      useBookingDetailQuery → GET /trips/:bookingId
      LocalHourlyRentalBookingDetail (read-only)
        TripCabDetails, RouteTimeline, RideTimings, SelectedPackage,
        InCarAmenities, TripFareSummary
```

### Key Implementation Notes

- **UTC datetime normalisation:** Server returns naive datetimes (no `Z`). `RideTimings` normalises by appending `Z` before passing to `humanReadableDateTime`, so all times display correctly in the client's local timezone.
- **Payment overlay:** `showOverlay`/`hideOverlay` live inside `useRazorPay` (not in the component). The overlay is dismissed _before_ the promise resolves, so `SuccessOverlay` renders into a clean screen with no flicker.
- **TripFareSummary vs TripPaymentSummary:** `TripPaymentSummary` is interactive (pre-payment, has Pay button). `TripFareSummary` is read-only (post-payment detail page). Both reuse the same sub-components (`TripFareBreakdown`, `TripIncExc`, `RefundsAndCancellationPolicies`, `CollapsibleSection`).
- **Routing:** `/booking` uses `location.state` for the initiate-booking flow. `/booking/:bookingId` (separate route, `ROUTES.BOOKING_DETAIL`) fetches fresh data from the API — bookmarkable and deeplink-safe.

### Files Introduced / Modified

| File | Role |
|---|---|
| `src/features/localHourlyRental/LocalHourlyRental.jsx` | Search/details input page |
| `src/features/localHourlyRental/LocalHourlyRentalBooking.jsx` | Pre-payment review + Razorpay trigger |
| `src/features/localHourlyRental/LocalHourlyRentalBookingDetail.jsx` | Post-payment read-only detail view |
| `src/features/localHourlyRental/components/PackageCards.jsx` | Hourly package selection UI |
| `src/features/localHourlyRental/components/SelectedPackage.jsx` | Selected package display chip |
| `src/features/localHourlyRental/hooks/mutation/useLocalTripSearch.js` | `/search` mutation |
| `src/hooks/useRazorPay.jsx` | Razorpay checkout + overlay + verify + cleanup |
| `src/components/TripFareSummary.jsx` | Read-only fare summary (detail page) |
| `src/components/TripPaymentSummary.jsx` | Interactive fare + Pay button (booking page) |
| `src/components/common/SuccessOverlay.jsx` | Animated ThumbsUp success screen with countdown redirect |
| `src/pages/BookingDetailPage.jsx` | Route shell for `/booking/:bookingId` |
| `src/routes/AppRouter.jsx` | Added `ROUTES.BOOKING_DETAIL` route |
| `src/utils/constants.js` | Added `ROUTES.BOOKING_DETAIL` |

_Last updated: June 2026_
