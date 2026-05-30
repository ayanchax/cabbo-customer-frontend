# Fare Summary Component Design

## Purpose

The `TripPaymentSummary` component provides a modern, reusable, and responsive fare/payment summary for all trip types (local, outstation, airport, etc.). It consolidates all fare-related information, payment instructions, and call-to-action in a single, user-friendly section.

---

## Key Features

- **Reusable:** Designed to work across all trip types by accepting standardized props (`orderData`, `fareData`).
- **Responsive:** Mobile-first layout, adapts to all screen sizes.
- **Clear Payment Flow:** Clearly shows the advance payment required, total fare, and remaining amount to pay to the driver.
- **Breakdown Support:** Displays fare breakdown, overages, inclusions, and exclusions.
- **Actionable:** Includes a prominent button for advance payment, with status awareness.
- **Extensible:** Can be enhanced with additional fare details or payment methods as needed.

---

## Data Model

### Props

- `orderData`: Object containing order/booking/payment info (amount, currency, status, messages, etc.).
- `fareData`: Object containing fare breakdown and details:
  - `total_price`: Total fare for the trip.
  - `price_breakdown`: Object with keys like `base_fare`, `platform_fee`, etc.
  - `overages`: Object with overage rates and disclaimers.
  - `inclusions`: Array of included services/features.
  - `exclusions`: Array of not-included items.

---

## UI Structure

1. **Total Fare & Advance Payment**
   - Shows the advance amount to pay now (from `orderData.amount`).
   - Shows the total fare (from `fareData.total_price`).
   - Calculates and displays the remaining amount to pay to the driver.

2. **Fare Breakdown**
   - Shows base fare, platform fee, etc., if available.

3. **Overages**
   - Shows per km/hour overage rates, if applicable.

4. **Inclusions & Exclusions**
   - Lists what’s included and not included in the fare.

5. **Payment Action**
   - Prominent button to pay the advance and confirm booking.
   - Button is disabled if payment is already complete.

6. **Instructions & Reason**
   - Shows payment instructions and reason for advance payment.

---

## Example Layout

```
Total Fare: ₹1319
Advance to Pay Now: ₹119
Pay to Driver: ₹1200

Fare Breakdown:
- Base Fare: ₹1200
- Platform Fee: ₹119

Overages:
- ₹16/km, ₹300/hour (if you exceed included limits)

Inclusions:
✓ Base fare
✓ Premium AC cab with professional driver
...

Exclusions:
✗ Tolls (if applicable)
✗ Paid parking (if applicable)
...

[Pay & Confirm Booking]
```

---

## Usage

- Import and use in any booking/review page.
- Pass `orderData` and `fareData` as props.
- Place inclusions/exclusions and disclaimers near the fare summary for clarity.

---

## Industry Alignment

- Follows best practices from leading ride-hailing and travel apps.
- Ensures transparency, reduces confusion, and improves conversion.
