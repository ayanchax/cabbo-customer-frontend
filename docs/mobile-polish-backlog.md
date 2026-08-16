# Mobile Polish Backlog

These notes come from reviewing real Samsung Galaxy A-series screenshots from
`https://app.dev.cabbo.co.in`. The mobile responsiveness is V1-ready; this file
tracks small polish refinements that can make the app feel more native and
premium as Cabbo iterates after launch.

## Priority Polish

- [x] Align profile detail row icons consistently.
  - In the Profile screen, the phone and email row icons should share the same
    left edge, size, and vertical rhythm.
  - The email row currently appears slightly shifted compared with the phone row,
    which makes the otherwise polished profile page feel less intentional.

- [x] Keep current mobile tap focus boxes for expandable controls.
  - Seen around expandable/action headers such as support, cancellation, and
    payment explanation controls.
  - Decision: keep this behavior because it helps users see which in-place
    section they opened after tapping.
  - This is not a bug and does not need a V1 frontend change.

- [x] Fix clipped login phone input placeholder.
  - The current placeholder can be cut off on narrow mobile widths.
  - Prefer shorter copy such as `Phone number` or `Enter phone number`.

- [x] Stabilize booking-detail header status placement on mobile.
  - Long titles such as `Your Airport pickup booking` can push the occurrence
    label to a second line.
  - Do not force the title and label onto one line on narrow screens if that
    risks cramped text or overflow.
  - Use a compact mobile badge inside the title cluster, while keeping the
    regular inline pill on `sm+` screens.
  - Keep mobile booking IDs on one line with truncation so narrow devices do not
    wrap a final character onto a new line.

- [x] Clean customer-facing copy spacing in backend-driven lists.
  - Examples: `Tolls(if applicable)` and `Paid parking(if applicable)`.
  - Preferred: `Tolls (if applicable)` and `Paid parking (if applicable)`.

## Nice-To-Have Visual Refinements

- [.] Revisit page-level top spacing only if a specific screen feels cramped.
  - Keep `AppLayout` without a global top inset for V1 so booking and trip
    utility pages can stay dense and first-viewport useful.
  - The current close-to-top content rhythm is acceptable for app-like mobile
    pages.
  - If a screen needs more breathing room later, adjust that page locally instead
    of adding global padding.

- [x] Tighten the My Trips refresh action placement.
  - The refresh icon currently feels slightly detached from the tab/list area.
  - Consider placing it closer to the feed header or visually grouping it with
    the list controls.

- [.] Keep the current date/time picker surface for V1.
  - The dotted date/time picker boundary is usable, readable, and clearly marks
    the active picker area on mobile.
  - Do not change this before launch unless a real usability issue appears in
    smoke testing.
  - If revisited later, prefer a mobile-only visual treatment while preserving
    the current `md+` behavior and picker mechanics.

- [x] Center the selected hourly-rental package card on mobile.
  - In `PackageCards`, a partially visible card can be tapped and selected, but
    the horizontal scroll position does not move to reveal the selected card.
  - After selection, scroll the selected package card into view horizontally,
    preferably with smooth centering.
  - Keep desktop/tablet behavior unchanged unless the same interaction issue is
    observed there.

- [x] Verify sticky payment CTA bottom spacing.
  - Checked mobile booking-confirmation screens.
  - The sticky `Pay & Confirm Booking` bar does not block final disclaimer, fare, or policy content.
  - No V1 change needed.

## Current Assessment

- Mobile layout, tap targets, ride cards, profile, booking details, support,
  cancellation, fare summary, and legal-link placement are launch-worthy.
- The remaining items above are polish, not V1 blockers.
- The app already feels like a credible mobile cab-booking experience rather
  than a desktop UI squeezed onto a phone.
