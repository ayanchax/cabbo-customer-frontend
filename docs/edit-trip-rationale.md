# Edit Trip Rationale

## Overview

Cabbo allows limited post-booking edits so customers can correct operational information without changing the commercial agreement, vehicle match, route, availability, or confirmed fare.

Once a booking is confirmed, the selected trip option represents an agreement based on:

- trip type
- pickup and destination
- date and time
- selected vehicle/fleet
- package or trip duration, where applicable
- passenger and luggage requirements
- selected cost-impacting services
- calculated fare and payment terms

Fields that could require a new availability search, vehicle match, route calculation, or fare calculation are not directly editable after confirmation.

---

## Core Principle

A confirmed trip may be edited only when the change:

- does not affect fare
- does not require another ride search
- does not change route or scheduling
- does not invalidate the selected cab
- does not change a purchased service
- does not create a new operational commitment for the driver

If a requested change fails any of these conditions, it should be handled through cancellation and rebooking or with a future support-assisted change flow with backend validation and repricing.

---

## Editable Fields by Trip Type

| Field | Airport Pickup | Airport Drop-off | Local Hourly Rental | Outstation |
|---|---:|---:|---:|---:|
| Special request | Add once | Add once | Add once | Add once |
| Flight number | Yes | Not applicable | Not applicable | Not applicable |
| Terminal number | Yes | Not applicable | Not applicable | Not applicable |
| Placard name | Yes, only if placard service was purchased | Not applicable | Not applicable | Not applicable |
| Toll-road preference | No | No | Not applicable unless supported | Not applicable unless supported |
| Placard service on/off | No | Not applicable | Not applicable | Not applicable |
| Pickup date/time | No | No | No | No |
| Pickup location | No | No | No | No |
| Destination | No | No | No | No |
| Passenger counts | No | No | No | No |
| Luggage counts | No | No | No | No |
| Cab/fleet type | No | No | No | No |
| Fuel type | No | No | No | No |
| Package/duration | Not applicable | Not applicable | No | No, where applicable |

This matrix describes direct customer self-service editing after confirmation. Backend or support tooling may apply stricter rules based on trip status and operational cut-off times.

---

## Airport Pickup Exceptions

Airport pickup contains operational metadata that can change without changing the purchased trip:

- `flight_number`
- `terminal_number`
- `placard_name`, when `placard_required` is already true
- special requests

These fields help the driver and dispatch team complete the confirmed pickup. Correcting them does not normally change route, fare, vehicle selection, or the purchased service.

Editing the placard name does not remove or add placard service. It only changes the text displayed on a service that was already purchased.

The following remain locked:

- `placard_required`
- `toll_road_preferred`

These choices affect service scope and fare calculation.

---

## Why Date and Time Are Locked

Changing the pickup date or time can affect:

- driver and fleet availability
- prior-booking-window validation
- regional pricing rules
- package eligibility
- traffic or scheduling assumptions
- dispatch planning

A date/time change is therefore closer to a new search than a simple booking edit. Allowing it without revalidation could leave the customer with a confirmed fare but no suitable vehicle or driver.

---

## Why Locations Are Locked

Changing origin or destination can affect:

- route distance and duration
- regional pricing
- tolls and parking
- included kilometres
- overage estimates
- service-region eligibility
- selected fleet availability

Even a nearby address change may cross a pricing or service boundary. Location changes must therefore trigger a fresh search and fare calculation rather than silently modifying the confirmed booking.

---

## Why Passenger and Luggage Metadata Are Locked

Passenger and luggage preferences do not necessarily change fare directly in Cabbo's current pricing model. However, they affect:

- vehicle suitability
- seating capacity
- boot capacity
- search ranking
- fleet matching
- safe and practical trip fulfilment

Increasing passenger or luggage counts after confirmation could make the selected cab unsuitable. Decreasing them is commercially harmless, but allowing partial editing creates an inconsistent rule and can make confirmed search metadata unreliable.

For a predictable policy, passenger and luggage counts remain locked after confirmation. Material changes should use cancellation/rebooking or a future support-assisted vehicle reassignment flow.

These fields are best classified as **booking-critical matching data**, not necessarily cost-impacting data.

---

## Why Cab, Fuel, and Package Choices Are Locked

The selected cab/fleet and fuel type identify the ride option the customer reserved. Changing either may affect:

- fare
- inventory
- capacity
- included amenities
- operating costs
- driver assignment

For local hourly rentals and similar package-based trips, changing package duration or included kilometres directly changes the commercial product and price.

These are new booking selections rather than editable trip notes.

---

## Why Cost-impacting Add-ons Are Locked

Selected add-ons such as toll-road preference and airport placard service are included in the confirmed fare.

After confirmation:

- toll-road preference cannot be removed
- placard service cannot be removed
- new cost-impacting services cannot be added without repricing

The payment page informs the customer before confirmation that selected add-ons are included in the total fare and cannot be removed afterward.

On the post-booking page, add-on tags may remain visible beside relevant fare lines. A repeated lock-in disclaimer is unnecessary because no opt-out controls are presented.

---

## Special Requests

Special requests may be added once across trip types because they are generally informational and do not automatically change fare or booking scope.

For v1:

- show the add action only when no special request exists
- explain that requests are subject to availability and are not guaranteed
- ask for confirmation before submission
- make the request read-only after it is submitted
- do not provide customer self-service editing or deletion

The add-once rule avoids changing driver expectations repeatedly after dispatch planning has begun. The backend should enforce allowed booking statuses, length limits, sanitization, and the one-time submission rule.

If a request would materially affect vehicle, route, price, availability, safety, or driver obligations, support or backend validation may reject it or require a new booking.

---

## Trip Status and Editability

Editable fields should be available only while the booking is in a status where operational updates are still safe, such as `confirmed`.

Editing may be disabled when:

- the trip has started [ongoing]
- the driver has reached the pickup point
- the trip is completed
- the trip is cancelled
- the trip is disputed
- the trip is closed
- an operational cut-off time has passed

The backend must remain authoritative. Hiding or disabling a frontend control is not sufficient enforcement.

---

## Industry-standard Alignment

Mobility and travel products commonly separate:

- **commercial booking details**, which require repricing or rebooking
- **operational details**, which may be corrected after confirmation

This pattern protects both sides:

- customers retain control over information needed to complete the trip
- drivers and operators receive stable route, schedule, capacity, and service commitments
- confirmed fares do not silently become inaccurate
- availability is not assumed after the original search
- payment and refund accounting remain consistent

Restricting self-service edits is not intended to trap the customer. It preserves the validity of the confirmed option. Changes that materially alter the trip should follow an explicit cancellation, rebooking, or support-assisted repricing process.

---

## UI Policy

The post-booking page should:

- show operational details relevant to the trip type
- provide edit controls only for permitted fields
- show locked fare add-ons as read-only tagged line items
- avoid disabled controls for actions that will never be allowed
- explain limitations contextually only when the customer attempts a supported change flow

For airport pickup, the editable section may contain:

- flight number
- terminal number
- placard name, if placard service was purchased
- a one-time Add special request action, only when no request exists

For airport drop-off, local hourly rental, and outstation trips, the operational section should normally contain only the one-time special-request action unless future non-cost-impacting fields are introduced.
