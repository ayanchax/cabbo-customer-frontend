# SearchCard

The main booking entry point. Handles pickup/drop state, Google Maps API session management, location enrichment, and trip classification routing.

---

## State Model

| State | Purpose |
|---|---|
| `pickup` | Explicitly selected pickup (null = untouched, auto-fills from currentLocation) |
| `pickupCleared` | True when user explicitly wiped the field — prevents snap-back to currentLocation |
| `drop` | Selected drop location |
| `pickupEnrichId / dropEnrichId` | `place_id` to fetch full details for — only set for loose search results (no lat/lng) |
| `pickupEnrichToken / dropEnrichToken` | Snapshotted session token at select time — used for Place Details call |
| `sessionToken` | Rotating UUID for Google billing sessions |

**Derived:**
```js
effectivePickup = pickupCleared ? null : (pickup ?? currentLocation)
// Pickup the user sees — auto-filled from GPS when untouched, empty when explicitly cleared
```

---

## Google Maps Billing Session Flow

Google bills Autocomplete per-request (~$2.83/1000) unless a session token groups them with a closing Place Details call (~$0.017 total per session, regardless of keystrokes).

**The lifecycle:**

```
1. User focuses pickup field
   → sessionToken (UUID A) is active

2. User types "Kempegowda..."
   → Autocomplete fires with token A on each debounced keystroke
   → All these calls are "free" as long as session closes with Place Details

3. User selects a result
   → pickupEnrichToken = A  (snapshot before rotation)
   → pickupEnrichId = item.place_id
   → rotateSession()         (sessionToken is now UUID B)

4. Place Details fires with token A
   → Google closes the session: all preceding Autocomplete calls + this Place Details = 1 billing unit

5. User focuses drop field
   → Autocomplete fires with token B (fresh session)
```

**Why client-side rotation:** The session boundary is tied to the user's interaction rhythm (type → select → done), which only the client knows. The backend proxy is transparent — it just forwards the token to Google. The API key stays server-side; the session token is not a secret.

---

## Enrichment Pipeline

Search results from Autocomplete only carry `display_name`, `address`, and `place_id` — no coordinates. Coordinates are needed for trip navigation.

```
onSelect(item)
  └─ item.lat exists?
       ├─ YES → use as-is (e.g. "Use current location" which already has lat/lng)
       └─ NO  → set enrichId + enrichToken → useLocationByPlaceIdQuery fires in background
                 → enriched result (with lat/lng, city, state) replaces raw item for navigation
```

`useLocationByPlaceIdQuery` has `staleTime: Infinity` and `cacheTime: Infinity` — the same `place_id` never re-fetches within the app session.

For navigation, `finalPickup = enrichedPickup ?? pickup` — enrichment is preferred but falls back gracefully to the raw selection if still loading.

---

## Trip Classification

On search, `handleSearch` calls the `classifyTripType` mutation with pickup + drop coordinates. The backend classifies the route and returns one of:

| Result | Route |
|---|---|
| `airport_pickup` / `airport_drop` | `/airport` |
| `outstation` | `/outstation` |
| anything else | `/local` |

No drop → navigates directly to `/local` (rental/local ride).

---

## Swap

`handleSwap` swaps `drop ↔ effectivePickup` (not raw `pickup` — handles the auto-filled currentLocation case), swaps both `enrichId` and `enrichToken` pairs, and resets query/activeField. Disabled when either field is empty.

---

## Props / Usage

```jsx
<SearchCard />
```

No props — self-contained. Reads `coordinates` from `useCustomer()`, GPS from `useCurrentLocation()`.

`currentLocation` is passed down to `LocationSuggestions` as a prop so the "Use current location" button gets the already-resolved value instantly — avoiding a second `useCurrentLocation` call inside the child and eliminating the brief disabled flash it caused.
