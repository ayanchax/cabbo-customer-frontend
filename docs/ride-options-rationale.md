# Ride Options UI Rationale

## 1. Minimal, Focused Ride Options List

- **Show only what matters for decision-making:**
  - Final price
  - Per-minute or per-kilometer rate, depending on trip type
  - Cab type, such as Sedan, Sedan XL, SUV, or SUV+
  - Recommendation badge when the option is the best fit
- **Do not show in the initial options list:**
  - Fuel type
  - Full capacity details unless they materially affect the choice
  - Long descriptions, inventory names, or specific car models
  - Overage or extra charges

**Result:** users can quickly compare options without cognitive overload.

---

## 2. Show Details at the Right Time

- **Ride Options Screen:**
  - Keep choices scannable.
  - Show common fare/service pills near the trip context, not repeated on every card.
- **Booking Confirmation Screen:**
  - Show fine print and full details: overage rates, inclusions/exclusions, amenities, capacity, possible car models, cancellation terms, and payment breakdown.
  - This is the right moment for transparency before payment.

---

## 3. Mobile Layout Strategy

Ride options should use a sheet-style presentation on mobile, but the sheet behavior differs by domain based on the amount and variability of context above the options.

### Airport Transfers

- Use an in-flow mobile sheet.
- The context is compact and predictable: route, pickup time, and fare-included pills.
- The user should see the context fully, then a small gap, then the ride options sheet.
- This avoids hiding important context behind a fixed overlay.

### Local Hourly Rental

- Use an in-flow mobile sheet.
- The context is compact and predictable: route, pickup time, selected package, and package description.
- The options can start naturally after the context on most mobile screens.
- This keeps the page readable without sacrificing option visibility.

### Outstation

- Use a fixed bottom mobile sheet.
- Outstation context is variable and can grow significantly: route, return-to-origin, stops/hops, departure, return, package, included kilometers, fare-included services, and disclaimers.
- With multiple hops, an in-flow sheet can be pushed too far down the page.
- A fixed sheet keeps ride options reachable while the route/context remains scrollable behind it.
- Add enough bottom padding to the page content so the user can still scroll and read the context behind the fixed sheet.

---

## 4. Scroll And Affordance Cues

- **Desktop:** after results mount, scroll to the full results page or contextual result area so route, date, package, and options are discoverable together.
- **Airport/local mobile:** in-flow sheets naturally communicate page order. A subtle bottom fade inside the sheet indicates more options or disclaimers below.
- **Outstation mobile:** because the options sheet is fixed, use a subtle top fade/scrim above the sheet to show that content behind it can scroll. Keep it visual-only; avoid instructional text unless user testing shows confusion.
- **All mobile sheets:** use a non-interactive bottom fade inside the scrollable sheet to indicate more options below.

These cues should be visual and quiet. The goal is to suggest scrollability without adding clutter.

---

## 5. Common Amenities And Disclaimers

- Show amenities, fare inclusions, and disclaimers as common summary sections, not repeated per option.
- Use compact pills for cost-impacting or trip-shaping services, such as airport toll, driver allowance, package kilometers, or round-trip duration.
- Keep detailed policy text for confirmation or lower-priority sections.

---

## 6. Summary Table

| Screen or Step | Show Capacity? | Show Overage? | Show Amenities? | Show Car Models? | Show Price/Rate? |
| --- | :---: | :---: | :---: | :---: | :---: |
| Ride Options List | No | No | Common only | No | Yes |
| Booking Confirmation | If useful | Yes | Yes | If useful | Yes |

---

## 7. Rationale

- Users want speed and clarity when choosing a ride.
- Initial selection should prioritize price, cab type, recommendation, and rate.
- Details and transparency are best provided at confirmation, where the user is closer to payment.
- Mobile ride-option presentation should adapt to context length:
  - compact context: in-flow sheet
  - variable/long context: fixed bottom sheet
- This matches patterns in mature ride-hailing and travel apps: route context remains available, while ride choices stay easy to compare.

---

**Conclusion:** keep the ride options list minimal, preserve contextual trip information, and choose mobile sheet behavior based on how much context the trip type requires. This creates a premium, predictable, and ride-app-standard experience.
