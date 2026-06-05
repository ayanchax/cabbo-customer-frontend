# Airport Transfers Rationale

## Overview

Cabbo handles airport transfers as a single feature (`AirportTransfer.jsx`) parameterized on `trip_type`, which is either `airport_pickup` or `airport_drop`. The two sub-types share the same route (`/airport-transfers`) and component, but differ significantly in what information is required from the customer and what the driver needs to do.

---

## Core Conceptual Distinction

| Concern | Airport Pickup (`airport_pickup`) | Airport Drop-off (`airport_drop`) |
|---|---|---|
| Driver's job | Enter airport, find passenger at arrivals | Pick up passenger at their location, drop at departure entrance |
| Time anchor | Passenger's **flight landing time** | Passenger's desired **pickup time from their location** |
| Flight details needed? | ✅ Yes — driver times arrival around the flight | ❌ No — flight is irrelevant to the driver |
| Terminal needed? | ✅ Yes — driver must go to the correct arrivals zone | ❌ No — passenger knows their own departure terminal |
| Placard needed? | ✅ Optional — meet-and-greet at arrivals | ❌ No — no meet-and-greet scenario |
| Toll preference needed? | ✅ Yes | ✅ Yes — time-sensitive, tradeoff matters |

---

## Airport Pickup — Required Fields

The driver physically enters the airport and waits at arrivals. They need to know:

- **`flight_number`** — to time their arrival and account for delays
- **`terminal_number`** — to go to the correct arrivals gate/zone
- **`placard_required` / `placard_name`** — optional; passenger may request a name board at arrivals (meet-and-greet)
- **`destination`** — where to drop the passenger after pickup
- **`start_date`** — the flight's scheduled landing time (used as reference for driver dispatch)
- **`toll_road_preferred`** — driver may take a toll route to/from airport

**Sample payload:**
```json
{
    "trip_type": "airport_pickup",
    "destination": {
        "display_name": "Indiranagar, Bengaluru, KA",
        "lat": 12.9716,
        "lng": 77.6412,
        "place_id": "ChIJd8BlQ2BfUjoR7yE6k5h1K2I",
        "address": "Indiranagar, Bengaluru, Karnataka, India",
        "region_code": "BEN"
    },
    "start_date": "2026-04-18T22:30:00",
    "num_adults": 2,
    "num_children": 1,
    "num_large_suitcases": 2,
    "num_carryons": 1,
    "preferred_car_type": "Sedan",
    "preferred_fuel_type": "diesel",
    "flight_number": "AI123",
    "terminal_number": "T1",
    "toll_road_preferred": true,
    "placard_required": true,
    "placard_name": "John Doe"
}
```

---

## Airport Drop-off — Required Fields

The driver picks up the passenger at their current location (home, hotel, office) and drops them at the airport's departure entrance. They do **not** enter the terminal.

- **No `flight_number`** — the driver has no use for it; the passenger is at their own door
- **No `terminal_number`** — the passenger knows their departure terminal; the driver just drops at the departure forecourt
- **No placard info** — there is no arrivals meeting scenario
- **`origin`** — where to pick the passenger up
- **`start_date`** — when the driver should be at the passenger's door (passenger decides based on their own flight time + buffer)
- **`toll_road_preferred`** — especially relevant here; passenger is time-constrained (catching a flight) and may prefer to pay a toll to avoid delays

**Sample payload:**
```json
{
    "trip_type": "airport_drop",
    "origin": {
        "display_name": "MG Road, Bengaluru, KA",
        "lat": 12.9740,
        "lng": 77.6122,
        "place_id": "ChIJd8BlQ2BfUjoR7yE6k5h1K2I",
        "address": "MG Road, Bengaluru, Karnataka, India",
        "region_code": "BEN"
    },
    "start_date": "2026-04-11T02:54:00",
    "num_adults": 2,
    "num_children": 1,
    "num_large_suitcases": 2,
    "num_carryons": 1,
    "num_backpacks": 1,
    "num_other_bags": 0,
    "preferred_car_type": "Premium Sedan",
    "preferred_fuel_type": "petrol",
    "toll_road_preferred": true
}
```

---

## Luggage Fields — Why They Matter for Both Sub-types

`num_large_suitcases` , `num_carryons` `num_backpacks` and `num_other_bags` are retained for both pickup and drop-off because they drive vehicle boot/trunk capacity matching on the backend. A family with 3 large suitcases cannot be matched to a compact sedan. This is more critical on drop-off where all luggage loads at origin, but equally relevant on pickup.

---

## Minimum Prior Booking Window

Airport transfers require a minimum of **3 hours** lead time before the requested start time. This is enforced frontend-side by fetching `prior_booking_window_hours` from the backend (defaulting to `3` if unavailable) and blocking past/too-soon datetime selections in the form.

This is deliberately shorter than local hourly rentals (6 hours) because airport trips are point-to-point with no dynamic re-routing complexity.

---

## Component Architecture

A single `AirportTransfer.jsx` component handles both sub-types, parameterized via `location.state.trip_type` passed from `SearchCard` navigation. The component:

- Validates `trip_type` is one of `TRIP_TYPES.AIRPORT_PICKUP` or `TRIP_TYPES.AIRPORT_DROPOFF` on mount; throws on invalid/missing value
- Conditionally renders airport-specific fields (`flight_number`, `terminal_number`, `placard_required`/`placard_name`) only for `airport_pickup`
- Renders `toll_road_preferred` for both sub-types
- Uses different page header copy per sub-type:
  - Pickup: title `"Airport pickup"`, label `"Schedule a ride from the airport to anywhere"`
  - Drop-off: title `"Airport drop-off"`, label `"Schedule a ride to the airport from anywhere"`

---

## Overlay Copy (SearchCard Transition)

When the user is navigated from `SearchCard` to the airport transfers screen, a 1.2s overlay is shown as transitional reassurance. Copy is differentiated by sub-type:

| | `airport_pickup` | `airport_drop` |
|---|---|---|
| `message` | "Taking you to Cabbo airport transfers..." | "Taking you to Cabbo airport transfers..." |
| `subtext` | "Schedule your pickup around your landing" | "Leave home relaxed, reach the airport on time" |
| `nextActionText` | "Next: add your flight details and pickup time" | "Next: add your pickup time and other preferences" |

**Design rationale:**
- `subtext` speaks to the customer's primary anxiety at that moment (pickup = will the car be there when I land; drop-off = will I make my flight)
- `nextActionText` previews exactly what the next screen asks for — flight details for pickup (driver needs them), pickup time for drop-off (flight details not needed)

---

## Illustrations

- **Airport pickup** → `PersonWaitingAtAirportForPickup` — person with luggage at arrivals, sets the scene of waiting to be picked up
- **Airport drop-off** → `CabLeavingFromAirportTerminal` — cab departing with airport terminal in background, conveys the outbound journey

Both are custom SVG JSX components under `src/components/common/svg/`. `PersonWaitingAtAirportForPickup` uses `currentColor` for theming; `CabLeavingFromAirportTerminal` preserves original illustration colors.
