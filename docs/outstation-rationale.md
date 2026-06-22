# Outstation Flow Rationale

This document records the V1 product and implementation decisions for Cabbo
outstation trips.

## V1 Service Model

Cabbo V1 supports round-trip outstation bookings only.

One-way trips are deferred because the vehicle and driver still need a
commercially viable return journey. Supporting customer one-way pricing before
Cabbo has sufficient route density could make trips unprofitable or require an
unattractive fare.

This is a backend-controlled capability rather than a frontend assumption. The
server returns `round_trip_only` and remains authoritative when validating and
pricing the trip.

One-way travel can be introduced later when route density, partnerships, or
investment make it operationally viable.

## Server-Driven Constraints

Outstation rules can differ by operating state. The routed Outstation page
fetches constraints using the classified trip type and origin state.

```json
{
  "max_hops": 3,
  "min_trip_days": 2,
  "max_trip_days": 7,
  "round_trip_only": true
}
```

The frontend uses these values to configure controls and provide immediate
feedback. The backend validates the same limits during ride search.

If constraints cannot be loaded, Cabbo shows an unavailable state instead of
silently applying potentially outdated business rules.

## Route Model

The V1 itinerary is:

```text
Origin -> optional hops -> destination -> origin
```

Origin and destination are selected in `SearchCard` before the customer enters
the Outstation page. They remain read-only there, with back navigation available
when the customer needs to change the route.

The repeated origin must be visible as the final point so the round-trip nature
is clear before search and pricing.

## Optional Hops

Hops are optional intermediate stops on the outward route between origin and
destination. They improve distance estimation and help the backend provide
more accurate pricing and overage information.

The hop editor should support:

- adding locations through shared address search;
- editing and removing a hop;
- reordering hops;
- preventing duplicate origin, destination, and hop locations;
- enforcing the server-provided `max_hops`;
- retaining full enriched location objects for search.

`OutstationHopManager` implements this as a controlled feature component.
`Outstation.jsx` owns the final ordered hop array and passes it to the route
timeline and trip-search payload.

On the editable planning screen, the route timeline remains the live visual
summary and includes committed hops. To avoid permanently repeating the same
locations, the hop manager collapses its detailed rows behind a `Manage`
control. Adding a stop remains immediately available, while edit, reorder, and
remove controls appear only when the customer opens management mode.

Stop ordering uses a dedicated drag handle for mouse, touch, and pen input.
When the handle is keyboard-focused, the up and down arrow keys provide the
same reordering behavior without adding visible caret buttons to every row.

Inline stop editing is supported by the component but hidden in V1. Customers
can remove an incorrect stop and add the correct one, which keeps the compact
mobile controls focused on ordering and removal.

The component reuses the shared location-search API, recent-place fallback, and
Google session-token behavior. Autocomplete selections are enriched before
being committed, so each hop uses the same complete location contract as the
origin and destination.

Origin, destination, and existing hops are excluded from selection. Row actions
are temporarily locked while a stop is being edited to prevent index changes
from replacing the wrong stop.

The return leg goes from the destination back to the origin. Separate return
hops and per-stop schedules are deferred beyond V1.

## Departure And Return

Cabbo collects exact departure and return date/time values rather than only a
number of days.

Exact datetimes avoid ambiguity around partial days and return time, match the
backend `start_date` and `end_date` contract, and support driver planning and
booking-detail display.

For the current contract:

```text
earliest return = departure + min_trip_days
latest return   = departure + max_trip_days
```

The return picker prevents selections outside this interval.
`Outstation.jsx` validates the same interval before ride search. Backend
validation remains required because frontend checks can be bypassed.

Changing the departure causes an invalid restored return value to recover to
the first valid slot through the controlled `InlineDateTimePicker`.

## Ride Options And Booking Record

Ride-option results should display:

- the complete round-trip route, including hops;
- departure and return timings;
- cab type and fare;
- included kilometres and extra-kilometre rate where applicable;
- backend inclusions, exclusions, and disclaimers.

The confirmed booking record preserves the same route order, timings, hops,
pricing basis, and round-trip status.

## Deferred Beyond V1

- one-way outstation pricing;
- dynamic traffic-based pricing.
