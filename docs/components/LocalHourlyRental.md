# Local/Hourly Rental Service Component — Core Working

## Overview
This document describes the core logic, required fields, and backend integration for the Local/Hourly Rental context in Cabbo. It clarifies which fields are mandatory, which are optional, and how defaults are handled, ensuring the frontend and backend remain in sync.

---

## Required Fields (Frontend → /search API)
- **trip_type:** Always set to "local" for this context.
- **origin:** Pickup location (LocationInfo object: display_name, lat, lng, place_id, address, region_code).
- **start_date:** ISO datetime string (when the trip starts; must be at least 6 hours from now).
- **package_id:** Selected from available hourly packages (e.g., 4h/40km, 6h/60km, etc.).

## Optional Fields
- **destination:** Optional for local rentals. User may specify a drop-off location, but can leave it blank (open-ended rental).
- **num_adults, num_children, num_large_suitcases, num_carryons, num_backpacks, num_other_bags:** All optional. If not provided, backend will set sensible defaults.
- **preferred_car_type, preferred_fuel_type:** Optional. Backend defaults to Sedan/Diesel if not provided.
- **passenger:** For now, always self (current user). "Book for someone else" will be added later.

## Not Used in Local/Hourly Rental
- **hops:** Not supported for local rentals (only for outstation in future).

---

## Backend Defaulting Logic
The backend ensures all required preferences have sensible defaults if not provided by the frontend:

```python
def _set_default_preferences(search_in: TripSearchRequest):
    """
    Ensures all required trip search preferences have sensible defaults.
    - Sets 'preferred_car_type' to CarTypeEnum.sedan if not provided.
    - Sets 'preferred_fuel_type' to CarTypeEnum.diesel if not provided.
    - Ensures at least one adult is present (defaults to 1 if missing or < 1).
    - Ensures number of children is not negative (defaults to 0 if missing or < 0).
    """
    if not search_in.preferred_car_type:
        search_in.preferred_car_type = CarTypeEnum.sedan
    if not search_in.preferred_fuel_type:
        search_in.preferred_fuel_type = CarTypeEnum.diesel
    if search_in.num_adults < 1 or search_in.num_adults is None:
        search_in.num_adults = 1
    if search_in.num_children < 0 or search_in.num_children is None:
        search_in.num_children = 0
```

This means the frontend can safely omit these fields if the user does not provide them; the backend will ensure valid defaults.

---

## Summary Table
| Field                | Required | Notes                                                      |
|----------------------|----------|------------------------------------------------------------|
| trip_type            | Yes      | Always "local"                                             |
| origin               | Yes      | Pickup location                                            |
| start_date           | Yes      | Must be at least 6 hours from now                          |
| package_id           | Yes      | Selected from available hourly packages                    |
| destination          | Optional | User may specify, but can leave blank                      |
| num_adults           | Optional | Defaults to 1 if not provided                              |
| num_children         | Optional | Defaults to 0 if not provided                              |
| num_large_suitcases  | Optional | Defaults to 0 if not provided                              |
| num_carryons         | Optional | Defaults to 0 if not provided                              |
| num_backpacks        | Optional | Defaults to 0 if not provided                              |
| num_other_bags       | Optional | Defaults to 0 if not provided                              |
| preferred_car_type   | Optional | Defaults to Sedan if not provided                          |
| preferred_fuel_type  | Optional | Defaults to Diesel if not provided                         |
| passenger            | Optional | Always self for now; "Book for someone else" coming later  |
| hops                 | Not used | Only for outstation trips                                  |

---

## Next Steps
- Build the Local/Hourly Rental context screen UI with the above fields and logic.
- Integrate hourly package selection API.
- Add validation for start_date (at least 6 hours from now).
- Default passenger to self; add passenger management later.

---

_Last updated: May 2026_
