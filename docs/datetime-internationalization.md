# Cabbo Timezone, Localization, and Internationalization (i18n) Design

## Overview
This document describes the end-to-end approach for handling timezones, datetime storage, and internationalization in the Cabbo platform. It covers frontend and backend contracts, storage, display logic, and how the system handles users booking and viewing trips across different regions and timezones.

---

## 1. Datetime Handling: End-to-End Flow

### Booking Flow
- **Frontend:**
  - User selects a date/time for their trip in their local timezone (e.g., BST in the UK).
  - The frontend sends:
    - The selected datetime as a naive ISO string (e.g., `2026-06-01T08:00:00`).
    - The user's timezone string (e.g., `Europe/London`) and UTC offset (in minutes, e.g., `60`).
- **Backend:**
  - Receives the datetime, timezone, and offset.
  - Uses `validate_date_time()` in the backend to attach the correct tzinfo and always converts to UTC for storage.
  - Stores both the UTC datetime and the original timezone/offset in the trip record.

### Storage
- **Database:**
  - All datetime fields are stored in UTC.
  - The original timezone string and UTC offset are stored alongside for each trip for client display.

### Display Flow
- **Frontend:**
  - When listing trips, the API returns UTC datetime, timezone, and offset.
  - The frontend converts the UTC datetime to the client's timezone.
  - The frontend also determines the user's current location/timezone using `useGeographyQuery` (client geography).

---

## 2. Handling Timezone Mismatches

### Happy Path (No Mismatch)
- **Scenario:**
  - User books a trip from the UK (BST), and is still in the UK when viewing their trip.
- **Result:**
  - `clientGeography` is UK.
  - Trip is displayed in BST (original booking timezone).

### Mismatch Path (User Travels)
- **Scenario:**
  - User books a trip from the UK (BST), then travels to India (IST) and views their trip.
- **Result:**
  - `clientGeography` is now IN (India).
  - There is a mismatch between the trip’s timezone and the user’s current timezone.
  - **System behavior:**
    - By default, the system displays the trip time in the client’s current timezone (IST), overriding the original booking timezone.
    - Optionally, a disclaimer or toggle can be shown to let the user view the time in the original booking timezone.

---

## 3. Geography and Scaling
- **Client Geography:**
  - Determined via IP-based geolocation (`useGeographyQuery`).
  - Used for display, currency, and local units.
- **Server Geography:**
  - Used to primarily detect mismatches (e.g., user in UK booking an India trip).
  - Enables ops scaling by deploying region-specific containers (e.g., `.co.in`, `.co.uk`).
  - If client and server geography mismatch, show disclaimers (e.g., “Please use an Indian phone number”), if server response is served from an .co.in(IN) container and client is in some other country(UK) and so on.

---

## 4. Best Practices and Rationale
- Always store datetimes in UTC in the backend.
- Always store the original timezone and offset for each trip.
- Always convert UTC to the correct timezone for display.
- Detect and handle mismatches between booking and viewing locations.
- Use disclaimers or toggles to clarify time display when a mismatch is detected. Always override with the clients' timezone over the booking timezone.
- This approach is scalable, robust, and ready for global expansion.

---

## 5. Example Scenarios

### Example 1: UK Booking, UK Viewing
- Booked in BST, viewed in BST.
- Display: BST (original timezone).

### Example 2: UK Booking, India Viewing
- Booked in BST, viewed in IST.
- Display: IST (client timezone), with option/disclaimer for BST.

### Example 3: India Booking, UK Viewing
- Booked in IST, viewed in BST.
- Display: BST (client timezone), with option/disclaimer for IST.

---

## 6. Implementation References
- `useGeographyQuery` (frontend): Provides client and server geography, detects mismatches.
- `validate_date_time` (backend): Attaches tzinfo, converts to UTC, stores timezone/offset.
- Trip models: Store UTC datetime, timezone, and offset.

---

## 7. Future Considerations (On picking up investment)
- Add user preference to always display trip times in original booking timezone or current timezone.
- Support for additional locales, currencies, and region-specific features as Cabbo expands.

---

## 8. Summary
This design ensures:
- Accurate, unambiguous datetime handling across regions.
- Seamless experience for users booking and viewing trips anywhere in the world.
- Scalable architecture for global operations.

---

*Last updated: 2026-05-25*
