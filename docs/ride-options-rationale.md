# Ride Options UI Rationale

## 1. Minimal, Focused Ride Options List
- **Show only what matters for decision-making:**
	- Final price
	- Per-minute rate
	- Cab type (e.g., Sedan, SUV, etc.)
	- Fuel type (if relevant)
- **Do NOT show:**
	- Capacity (users generally know this for common types)
	- Description, inventory, or specific car models (e.g., “Dzire”)—not decision drivers at this stage
	- Overage/extra charges (show these at booking confirmation, not selection)

**Result:**
The user can quickly compare and choose without cognitive overload.

---

## 2. Show Details at the Right Time
- **Booking Confirmation Screen:**
	- Show all “fine print” and details: overage rates, inclusions/exclusions, amenities, capacity, and possible car models.
	- This is the moment for transparency and to set expectations before payment.

---

## 3. Common Amenities/Disclaimers
- **Show as a single, common section** (e.g., “All rides include: AC, music, water, tissues, etc.”) below the options list or as a sticky info bar.
- **Do NOT repeat per option**—this keeps the UI clean and premium.

---

## 4. Metadata Handling
- **Inclusions/Exclusions/Amenities:**
	- Show as a summary or expandable section, not per option.
	- Only highlight if something is unique or a strong differentiator.

---

## 5. Summary Table

| Screen/Step                | Show Capacity? | Show Overage? | Show Amenities? | Show Car Models? | Show Price/Rate? |
|----------------------------|:-------------:|:-------------:|:---------------:|:----------------:|:----------------:|
| Ride Options List          |       ❌       |      ❌       |   Common Only   |        ❌        |       ✅         |
| Booking Confirmation       |      ✅*       |      ✅       |       ✅        |       ✅*        |       ✅         |

*Show only if it adds value or is required for transparency.

---

## 6. Rationale
- Users want speed and clarity when choosing a ride.
- Details and transparency are best provided at the confirmation step, not during initial selection.
- This approach matches best practices in top ride-hailing and travel apps.

---

**Conclusion:**
Keep the ride options list minimal and focused. Move all “extra” info to the confirmation step. This results in a premium, user-friendly, and modern experience.
