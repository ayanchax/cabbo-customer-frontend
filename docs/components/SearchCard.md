# SearchCard

The main booking entry point. It owns pickup/drop selection, location search,
Google session tokens, current-location requests, place enrichment, recent
suggestions, and trip-classification routing.

## Selection Model

| State | Purpose |
|---|---|
| `pickup` | Explicit pickup selection; remains empty until the user selects one |
| `pickupCleared` | Distinguishes an explicitly cleared pickup |
| `drop` | Explicit drop selection |
| `activeField` | Currently active pickup or drop input |
| `shouldLocatePickup` | Enables one user-requested current-location lookup |
| `pickupEnrichId` / `dropEnrichId` | Selected `place_id` awaiting details |
| `pickupEnrichToken` / `dropEnrichToken` | Session token captured at selection |
| `sessionToken` | Rotating Google Autocomplete billing-session UUID |

`SearchCard` does not force-fill pickup or request location permission on
mount. The user can select **Use current location** from pickup suggestions.

## Current Location Flow

`SearchCard` owns `useCurrentLocation`; `LocationSuggestions` only emits the
user's intent.

```text
User clicks Use current location
  -> shouldLocatePickup = true
  -> useCurrentLocation requests a fresh browser position
  -> cached browser fix is compared with the fresh fix
  -> cached address is reused for insignificant movement
  -> otherwise full-precision coordinates are reverse-geocoded
  -> resolved place becomes pickup
  -> shouldLocatePickup = false
```

The hook exposes `loading`, `error`, and `requestCompleted`. `SearchCard` waits
for `requestCompleted` before applying the location, preventing an existing
cached value from being selected before the fresh-coordinate check finishes.

Selecting a normal suggestion while geolocation is running cancels the pending
selection at the parent level, so a late result cannot replace the user's newer
choice.

## Location Cache Contract

Two local-storage entries intentionally represent different data:

### `currentLocation`

The canonical place returned by reverse geocoding. This is displayed to the
customer and used by trip APIs.

```js
{
  display_name,
  address,
  place_id,
  lat,
  lng,
  country,
  state,
  region,
  postal_code
}
```

Google may return a building or place pin whose coordinates differ from the
raw browser measurement. This is expected.

### `currentLocationFix`

The raw browser geolocation reading used only for freshness and movement
comparison.

```js
{
  lat,
  lng,
  accuracy,
  capturedAt
}
```

Keeping these values separate avoids comparing a later device reading with a
Google building pin.

Movement is calculated in metres with the Haversine formula. The reuse
threshold combines the previous and current accuracy values and is bounded
between 25 and 75 metres. Coordinates are not rounded; full precision is sent
for reverse geocoding when meaningful movement is detected.

Existing installations without `currentLocationFix` may perform one additional
reverse-geocoding call to establish this metadata.

## Search Suggestions

- Empty queries show explicit recent selections, newest first.
- Recent places are persisted and deduplicated by `place_id`, coordinates, or
  display identity.
- API results replace recent suggestions for a successful active query.
- Recent suggestions remain available as an offline, failed-request, or empty
  API fallback.
- A skeleton appears only when no suggestion rows exist.
- Existing rows remain visible with a small updating indicator during refresh.

## Google Session And Enrichment

Autocomplete requests and the selected Place Details request share one session
token. Selection snapshots that token and rotates the active token for the next
interaction.

Autocomplete rows without coordinates are enriched in the background through
`useLocationByPlaceIdQuery`. Rows already containing coordinates are used
directly.

```js
const finalPickup = pickupEnrichId
  ? (enrichedPickup ?? pickup)
  : pickup;
```

## Trip Classification

Search submits the final pickup and optional drop to the classification API.
The returned trip type routes the customer to airport transfer, local hourly
rental, or outstation flow.

## Usage

```jsx
<SearchCard />
```

The component is self-contained and accepts no props.
