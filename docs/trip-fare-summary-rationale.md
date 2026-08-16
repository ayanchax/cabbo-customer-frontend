# Trip Fare Summary Rationale

## Overview

`TripFareSummary` is Cabbo's shared read-only fare model that render via committed booking-detail pages. It is used after the interactive payment step and must remain accurate across:

- upcoming trips
- ongoing trips
- completed or closed trips
- cancelled trips
- disputed trips
- temporally past trips whose backend status may be stale

The component receives backend fare data together with:

- `trip_status`
- `occurrence_label`

The backend status remains authoritative for business state. The occurrence label describes where the trip sits in time and helps the UI detect inconsistent records.

---

## Core Principle

The booking-detail page is both:

- a live trip reference for upcoming and ongoing trips
- a historical booking and fare record for completed, cancelled, and past trips

The UI must not infer payment settlement merely because the scheduled trip time has passed.

In particular:

- `past` does not mean the driver was paid
- `completed` or `closed` with a settled balance can show payment as paid
- a past trip with stale status or a nonzero balance must show an unresolved state

This prevents the customer application from making financial claims that the backend data does not support.

---

## Driver-payment Display

### Active[Upcoming, Ongoing] Trip with Outstanding Balance

Show:

```text
Pay to driver
```

Also show the payment instruction:

```text
Pay the rest to the driver (UPI/cash)
```

This applies when the trip remains active(upcoming or ongoing) and `balance_payment` is greater than zero.

### Completed or Closed Trip with Settled Balance

Show:

```text
Paid to driver
```

This requires a terminal backend status and a settled/zero balance. The occurrence label alone is insufficient.

### Stale or Inconsistent Past Record

Example:

- status remains `confirmed`
- occurrence label is `past`
- balance remains nonzero

Show:

```text
Payment status pending
```

Include a neutral warning that the trip has ended but the payment status has not yet been updated.

Do not show an instruction telling the customer to pay the driver after the trip has already passed.

### Disputed Trip

Show:

```text
Payment under review
```

Do not present the balance as settled or currently payable while the dispute is unresolved.

### Cancelled Trip

Do not show a driver-payment prompt. Cancellation and refund information is more relevant.

---

## Section Visibility Matrix

| Section | Upcoming | Ongoing | Completed/Closed | Cancelled | Past/Stale | Disputed |
|---|---:|---:|---:|---:|---:|---:|
| Total fare and payment split | Yes | Yes | Yes | Yes | Yes | Yes |
| Fare breakdown | Yes | Yes | Yes | Yes | Yes | Yes |
| Inclusions/exclusions | Yes | Yes | Yes | Yes | Yes | Yes |
| Overage rates | Yes | Yes | Yes | No | Yes | Yes |
| Refund/cancellation policies | Yes | Yes | No | Yes | No | Yes |
| Backend fare disclaimer | Yes | Yes | Yes | Yes | Yes | Yes |

---

## Fare Breakdown

The fare breakdown is retained for every status because it is the financial record of the booking.

It explains:

- base fare
- platform fee
- tolls
- parking
- selected add-ons
- other backend-calculated charges

For airport transfers, selected and locked cost-impacting services may receive an `Add-on` tag. Mandatory charges such as airport pickup parking remain normal fare lines.

---

## Inclusions and Exclusions

Inclusions and exclusions remain visible for every status.

Before and during the trip, they explain the agreed service scope. After the trip, they preserve what the customer booked and what was not covered.

This is useful for support, disputes, and historical review.

---

## Overage Rates

Overage rates remain visible for upcoming, ongoing, completed, past, and disputed trips because they record the rates that applied to additional kilometres or time.

They are hidden for cancelled trips because no trip usage occurred and presenting usage-based rates adds little value.

---

## Refund and Cancellation Policies

Show refund/cancellation policies for:

- upcoming trips
- ongoing trips
- cancelled trips
- disputed trips

For ongoing trips, the policy may still matter for:

- operational failure
- vehicle breakdown
- trip interruption
- service disputes
- refund eligibility

Hide the policy for normally completed/closed and generic past trips because it is no longer actionable and adds unnecessary page length.

---

## Backend Fare Disclaimers

Backend-generated fare disclaimers remain visible across all statuses.

Example:

> Fare applies to the selected airport transfer route. This fare includes selected toll-road tolls, airport parking and placard charges. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare.

This content is not merely a future warning. It records:

- the scope of the fare
- included charges
- conditions that could create extra charges

It therefore remains useful for completed, cancelled, past, and disputed bookings as part of the historical booking record.

---

## Why This Matches Industry Practice

Travel and mobility products commonly preserve financial and contractual details after a booking is completed while removing instructions that are no longer actionable.

The Cabbo approach follows that pattern:

- retain receipt-like fare information
- retain agreed service scope
- retain booking-specific terms and disclaimers
- hide irrelevant usage instructions for cancelled trips
- hide non-actionable cancellation policy after normal completion
- never infer payment settlement from time alone
- clearly flag stale or disputed financial state

This keeps booking details useful without misleading customers or overwhelming past-trip pages with obsolete actions.

---

## Backend Responsibility

The frontend logic is defensive presentation, not financial reconciliation.

The backend should eventually expose explicit fields such as:

- driver payment status
- amount paid to driver
- outstanding balance
- payment settlement timestamp

Until such fields are available, `TripFareSummary` uses backend trip status, occurrence label, and balance together to avoid false claims.

