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
- **No placard info** — there is no arrivals meeting scenario- driver drops the passenger from their home.
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
- Keeps pickup-only fields in a dedicated `airportPickupPreferences` state object and includes them in the search payload only for `airport_pickup`
- Renders `toll_road_preferred` for both sub-types using a reusable common preference toggle
- Keeps passenger/luggage metadata separate from route/service preferences:
  - `RideMetaDataPreferences` handles capacity matching (`num_adults`, `num_children`, luggage counts)
  - `TogglePreference` handles generic yes/no preferences such as toll roads
  - `AirportPickupDetails` handles airport-pickup operational details
- Uses different page header copy per sub-type:
  - Pickup: title `"Airport pickup"`, label `"Schedule a ride from the airport to anywhere"`
  - Drop-off: title `"Airport drop-off"`, label `"Schedule a ride to the airport from anywhere"`

---

## Cost-impacting Add-ons

Some airport transfer preferences can affect the final fare:

- **`toll_road_preferred`** - allows the backend to include applicable toll-road charges when toll routes are preferred.
- **`placard_required`** - enables name-board pickup at arrivals. A nominal placard charge may apply because the driver/operator prepares the name board and waits at arrivals.

The exact charge should not be fetched or displayed before the customer searches for rides. The actual toll and placard charges are calculated by the backend during search based on airport, route, region, and applicable pricing rules.

Frontend disclosure should be staged:

- On the search form, use lightweight helper copy such as "Toll charges may apply" or "A nominal placard charge may apply."
- On the ride-options screen, show compact included-service pills only when relevant, for example `Includes tolls` and `Includes name board pickup`.
- On the booking/payment confirmation step, rely on the fare breakdown as the source of truth for actual charges. Do not repeat included-service pills if the fare breakdown already shows toll, parking, placard, or similar add-on charges.
- On the booking/payment confirmation step, show a stronger disclaimer that selected add-on services are included in the fare and cannot be removed after booking confirmation without repricing or support intervention.

Once the booking is confirmed and the advance amount is paid, cost-impacting services should be treated as locked:

- `toll_road_preferred` cannot be opted out from the confirmed booking.
- `placard_required` cannot be removed from the confirmed booking.
- `placard_name` may remain editable if placard service was already selected, because changing the displayed name does not change price.

Non-cost-impacting operational fields may remain editable after booking confirmation where operationally safe:

- `flight_number`
- `terminal_number`
- special requests

---

## Ride Options Display

The ride-options screen should stay focused on comparing available rides rather than repeating every search preference. Passenger count, luggage count, flight number, terminal number, toll preference, and placard preference are search inputs used to tune matching, pricing, and ranking.

Recommended display order after search:

1. `PageHeader`
2. `RouteTimeline`
3. `RideTimings`
4. Included-service pills, only if applicable
5. `TripOptionsList`
6. `TripDisclaimer`

Included-service pills should be shown once near the search context, not repeated heavily on every option card, when the services apply to all returned options. Example pills:

- `Includes tolls`
- `Includes name board pickup`

`TripOptionCard` should remain focused on the ride option itself:

- cab type and cab details
- fuel type or relevant vehicle metadata
- rate summary
- total fare
- reserve button

Airport operational details such as flight number, terminal number, and placard name should not be shown on the ride-options screen. They should also be omitted from the pre-confirmation booking/payment page so that the customer can stay focused on the selected cab, route, fare, terms, and payment action.

These operational details become relevant after the booking is confirmed, when they help the customer, driver, and dispatch team manage the airport pickup.

---

## Booking/Payment Display

The booking/payment confirmation page has more pricing detail than the ride-options page. Once a customer selects a ride option, the fare breakdown should become the primary place where cost-impacting services are shown.

For this reason, `IncludedServicePills` should not be shown on the payment confirmation page when the fare breakdown already lists the relevant charges, such as:

- `Toll`
- `Parking`
- `Placard Charge`

Repeating the same services as pills on the payment page creates decorative duplication and makes the page feel busier without adding clarity. The fare breakdown should remain the source of truth for actual charge names and amounts.

Since selected add-ons are locked after confirmation, use a concise disclaimer near the payment action or fare breakdown instead of repeating pills:

> The add-ons you selected are included in your total fare and cannot be removed after you confirm the booking.

Within the fare breakdown, user-selected and cost-impacting items such as `toll` and `placard_charge` may receive a small `Add-on` tag. This connects the charge to the customer's earlier selection without repeating a separate included-services section.

Airport parking should not receive an `Add-on` tag. Parking is a standard mandatory charge for airport pickup where the driver must enter or wait at arrivals; it is not an optional service selected by the customer. Its amount remains visible as a normal fare line, while the backend-generated important-information disclaimer explains its inclusion and other fare conditions.

The backend-generated disclaimer and frontend add-on lock-in message serve different purposes:

- the backend disclaimer explains fare scope, included charges, and situations where extra charges may apply
- the frontend add-on message explains that customer-selected, cost-impacting services cannot be removed after confirmation

Both may be shown without being redundant.

The pre-confirmation page should not display airport pickup operational metadata such as:

- `flight_number`
- `terminal_number`
- `placard_name`

These fields do not help the customer review price or complete payment. Showing them here would add form-like detail to a screen whose main task is fare review and confirmation.

This keeps the product flow clean:

- ride-options page: lightweight included-service pills for quick fare context
- payment confirmation page: fare breakdown for exact charges, add-on tags for selected locked services, and a lock-in disclaimer
- post-booking details page: fare breakdown and airport operational details, not decorative service pills by default

---

## Post-booking Operational Details

Airport pickup operational metadata should first be presented after successful booking confirmation. At that point it becomes actionable booking information rather than search-form input.

The confirmed booking details page may show:

- flight number
- terminal number
- placard name, when placard service was selected

Where operationally safe, these non-cost-impacting values may be editable for a confirmed trip:

- `flight_number`
- `terminal_number`
- `placard_name`, only when `placard_required` was already purchased

Changing these values does not remove or reprice the selected service. Cost-impacting choices remain locked:

- toll-road preference cannot be removed
- placard service cannot be removed
- parking remains part of the airport pickup fare where applicable

This timing follows a focused booking flow:

- before confirmation, show only information needed to review and pay
- after confirmation, show operational information needed to manage and fulfil the trip

---

## Included Airport Service Mapping

Included airport service pills are a frontend display model derived from airport transfer preferences and backend pricing facts. They are not returned as React-ready UI from the backend because the backend should not know about frontend icons, component names, visual labels, or responsive layout decisions.

The backend remains responsible for returning factual data such as:

- `trip_type`
- `toll_road_preferred`
- `placard_required`
- pricing breakdown values such as toll, parking, and placard charges
- metadata inclusions/exclusions

The frontend is responsible for translating those facts into display-ready service items such as:

- `Tolls`
- `Parking`
- `Placard`

This mapping should live in the airport transfer feature layer, for example in `src/features/airportTransfers/hooks/useAirportTransferServices.js`, because:

- the service labels and icons are airport-transfer-specific UI concerns
- the same service pills may be needed in multiple airport transfer surfaces:
  - ride-options page
- centralizing the mapping prevents duplicate conditional logic across these screens
- memoizing the mapping keeps derived UI service definitions stable across renders
- the logic can evolve with airport-specific rules without polluting common components

`IncludedServicePills` should stay a presentational component for the ride-options page. It should render whatever display-ready services it receives, while `useAirportTransferServices` decides which airport services apply for a given preferences object.

The same feature-level mapping may separately derive locked fare-breakdown keys for the payment page. This is UI classification based on authoritative backend preferences and calculated price-breakdown values; it does not replace backend pricing or business-rule enforcement.

This keeps responsibilities clean:

- backend: pricing facts and persisted preferences
- airport feature hook: derive airport service display items
- UI component: render compact pills

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
