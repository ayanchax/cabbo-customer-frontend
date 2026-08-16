# Cabbo Typography System Rationale

## Overview

Cabbo’s typography system is designed to create a calm, trustworthy, modern, and India-friendly product experience.

The goal is to avoid the overly aggressive or cluttered visual style commonly found in mobility and booking apps, while still maintaining clarity, professionalism, and strong mobile readability.

The selected font pairing is:

- **Satoshi** → Primary UI font
- **Geist Mono** → Numeric and system information font

---

# Primary Font — Satoshi

## Why Satoshi

Satoshi was selected as the main font because it provides the right balance between:

- modern startup aesthetics
- warmth and human feel
- clean mobile readability
- calm visual tone
- premium but approachable appearance

Compared to many popular UI fonts, Satoshi feels less corporate and less mechanical.

It fits Cabbo’s product vision:
- transparent pricing
- customer trust
- human support
- travel comfort
- clean user experience

---

## Characteristics of Satoshi

### Warm Geometry
Satoshi has softer shapes compared to fonts like Inter or Poppins.

This creates:
- less visual fatigue
- more friendliness
- better emotional comfort during long usage

---

### Mobile Readability
The font performs extremely well on:
- Android devices
- smaller screens
- dense UI layouts
- cards and forms

Important for Cabbo because most users will access the platform through mobile devices.

---

### Calm Product Feel
The font helps the app feel:
- calmer
- cleaner
- less “salesy”
- more trustworthy

This is especially important for:
- pricing transparency
- booking confidence
- itinerary experiences
- invoice and communication screens

---


# Secondary Font — Geist Mono

## Why Geist Mono

Geist Mono is used selectively for:
- numbers
- fares
- OTPs
- timestamps
- trip IDs
- distance metrics
- invoices
- machine/system-generated information

This creates a subtle visual distinction between:
- human-readable content
- system-verified data

---

## Why Only the Latin Subset is Used

Cabbo self-hosts only the Latin subset of Geist Mono ("geist-mono-latin-***" files). This is because:

- All numerals (0–9), decimal points, and basic symbols used in pricing, OTPs, IDs, and metrics are included in the Latin glyph set.
- Loading only the Latin subset keeps the app fast and the bundle size minimal.
- We do not display Cyrillic, Vietnamese, or other scripts in numeric/system fields.
- If we ever expand to support additional scripts, we can add those subsets as needed.

This approach is optimal for performance and covers all numeric and technical UI needs for our audience.

---

## Benefits of Using Mono for Numeric Information

### Increased Trust
Monospaced fonts often create a perception of:
- precision
- accuracy
- reliability

This is valuable for:
- fare visibility
- trip tracking
- payment details

---

### Better Numeric Alignment
Geist Mono improves readability for:
- prices
- tables
- metrics
- breakdowns

Especially useful in:
- invoices
- trip summaries
- admin panels
- analytics

---

### Modern Technical Feel
Used sparingly, Geist Mono adds:
- a subtle modern-tech identity
- premium UI character
- uniqueness without overwhelming the interface

---

# Typography Strategy

## Satoshi Usage

Use Satoshi for:
- headings
- body text
- buttons
- forms
- cards
- descriptions
- navigation
- itinerary content
- emails
- PDFs


### Recommended Weights
- 400
- 500
- 700

### Italics
Cabbo does not use italics in its UI or system displays. Italic styles are not loaded or referenced, as they are not required for our product’s tone, numeric/system information, or brand communication. This keeps the font bundle smaller and the UI visually consistent.

Avoid excessive weight usage to maintain consistency and calmness.

---

## Geist Mono Usage


Use Geist Mono ONLY for:
- prices
- OTPs
- timestamps
- trip IDs
- metrics
- invoice values
- fare calculations
- distance information

### Italics
Geist Mono italic styles are not loaded or used. All numeric/system information is set in regular (upright) styles for clarity and trust. If future design needs require italics, add the relevant font files and update the font-family stack accordingly.

Examples:
- ₹2,480
- BLR-TRIP-9821
- 42.6 km
- 09:45 PM

---

# Important Design Principle

## Do Not Overuse Geist Mono

Overusing monospaced typography can make the product feel:
- cold
- overly technical
- developer-tool oriented

Mono typography should feel like:
> verified system information

NOT:
> the core visual personality of the app

The warmth and accessibility of the product must continue to come primarily from Satoshi.

---

# Tailwind Configuration

```js
// Tailwind v4 ignores fontFamily config for utility classes, so font stacks are set in CSS:
// In index.css:
//
// body {
//   font-family:
//     'Satoshi-Variable',
//     'Satoshi-Regular',
//     'Satoshi-Medium',
//     'Satoshi-Bold',
//     'Satoshi-Black',
//     ...system stack
// }
//
// .font-mono {
//   font-family: 'GeistMono-Regular', ...system mono stack
// }
//
// Only valid font-family names as defined in the @font-face rules are used. Do not use generic 'Satoshi' or 'GeistMono' names unless you have a matching @font-face defined in your font family .css file.
```