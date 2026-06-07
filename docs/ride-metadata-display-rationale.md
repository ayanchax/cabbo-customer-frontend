# Ride Metadata Display Rationale

## Overview

Cabbo collects ride metadata during the search flow to improve ride matching and result relevance. This includes fields such as:

- `num_adults`
- `num_children`
- `num_large_suitcases`
- `num_carryons`
- `num_backpacks`
- `num_other_bags`

These fields help the backend rank and filter available ride options so that suitable vehicles appear higher in the search results. They are not intended to be prominent booking facts after the customer has selected a ride.

This rationale applies across all trip types:

- airport transfers
- local hourly rentals
- outstation trips
- future ride-search flows that use passenger or luggage metadata

---

## Product Decision

Ride metadata preferences should be shown during the find-a-ride/search flow, but should not be repeated on:

- the ride-options/search-results page
- the booking confirmation page
- the post-booking details page

The ride-options page should focus on helping the customer compare available rides:

- route
- pickup/drop timing
- included services, if any
- cab details
- rate summary
- total fare
- reserve action
- backend disclaimers or terms

Repeating passenger and luggage metadata after search adds visual clutter without helping the customer make a better booking decision.

---

## Why These Fields Are Not Repeated

Passenger and luggage metadata are search inputs, not primary booking facts.

They influence:

- vehicle suitability
- search ranking
- result filtering
- whether compact vehicles should be deprioritized or excluded

They do not usually influence:

- the displayed fare
- payment calculation
- driver route
- booking terms
- post-booking operational workflow

Because they are not cost-impacting and do not normally require post-booking action, showing them repeatedly creates unnecessary information density.

---

## Industry-standard Alignment

Cab and mobility apps typically keep the search-results and booking-confirmation screens focused on the information that affects user commitment:

- where the ride is going
- when the ride happens
- which vehicle/service is selected
- what the customer pays
- what is included in the fare
- what terms or constraints apply

Inputs used only for matching or ranking are usually not promoted as recurring summary fields. They are or may be retained internally and passed to backend systems, but the customer-facing pages stay focused on fare, vehicle, route, and booking state.

This keeps the experience:

- cleaner
- easier to scan
- more premium
- less repetitive
- less likely to make the user feel they are reviewing a long form instead of booking a ride

---

## Cost-impacting Exceptions

Some preferences are not merely metadata. They change service scope or fare calculation.

Examples:

- `toll_road_preferred`
- `placard_required`

These should be treated differently from passenger and luggage metadata.

If selected, they may be shown as compact included-service indicators on the ride-options page, for example:

- `Includes tolls`
- `Includes name board pickup`

They should also be clearly reflected in the booking/payment step, because the fare may include additional charges and the services may become locked after confirmation. This should also be present in the booking details page after confirmation.

This distinction matters:

- passenger/luggage metadata improves matching
- toll/placard preferences affect service and pricing

---

## Airport Pickup Operational Exception

Airport pickup has operational details that are not generic ride metadata:

- `flight_number`
- `terminal_number`
- `placard_name`, if placard service is selected

These non-cost impacting fields help the driver and dispatch team complete the pickup correctly. They may be shown or edited in booking details or post-booking management where operationally useful.

This exception applies only to airport pickup because:

- the driver may need flight information to track landing or delays
- the driver needs terminal information to reach the correct arrivals area
- placard name is needed if the name-board service was selected

These details should still not clutter the ride-options comparison screen unless the product specifically needs a correction or confirmation step. Anyway, post confirmation of trip - these details can be modified for trips which are in
confirmed state.

---

## Recommended Display Policy

### Search Form

Show passenger and luggage metadata inputs.

Purpose:

- collect the customer's needs
- improve search relevance
- help backend rank suitable vehicles

### Ride-options Page

Do not show passenger and luggage metadata again.

Show only:

- route
- ride timing
- included-service pills for cost-impacting selections, if applicable
- ride options
- disclaimers

### Booking Confirmation/Review

Do not show passenger and luggage metadata unless future business rules make them fare-impacting or contractually relevant.

Show:

- selected ride/cab
- fare breakdown
- included add-ons
- payment summary
- booking terms
- airport pickup operational details, only when relevant

### Post-booking Details

Do not show passenger and luggage metadata by default.

Show operational details that the driver or customer may need:

- route
- pickup time
- cab/driver details
- payment state
- airport pickup flight number
- airport pickup terminal number
- airport pickup placard name, if applicable

---

## Design Principle

Every field shown after search should answer one of these questions:

- Does this affect the price?
- Does this affect the selected service?
- Does this affect the driver or pickup workflow?
- Does the customer need this to verify or manage the booking?

If the answer is no, the field should remain internal search context rather than visible page content.

Passenger and luggage metadata generally fail this test after search, so they should stay out of ride-options, booking-confirmation, and post-booking detail screens.
