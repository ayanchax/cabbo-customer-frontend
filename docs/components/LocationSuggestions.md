# LocationSuggestions

Presentational suggestion list shown beneath an active location input. It
renders the current-location action, loading and error states, recent/API
suggestions, and refresh feedback.

It does not call geolocation or own pickup state.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `suggestions` | `array` | `[]` | Recent or API location rows |
| `onSelect` | `(item) => void` | - | Selects a normal suggestion |
| `isPickup` | `boolean` | `false` | Enables the current-location action |
| `isPickupSet` | `boolean` | `false` | Hides the action when current location is selected |
| `onUseCurrentLocation` | `() => void` | - | Requests current location through the parent |
| `isLocating` | `boolean` | `false` | Disables the action and shows locating feedback |
| `currentLocationError` | `string \| null` | `null` | Inline actionable location error |
| `isLoading` | `boolean` | `false` | Shows the list skeleton when no rows exist |
| `isRefreshing` | `boolean` | `false` | Shows non-blocking update feedback |

## Current Location Action

The action appears only for pickup when the selected pickup is not already the
current location.

```js
const showCurrentLocationAction = isPickup && !isPickupSet;
```

Clicking it calls `onUseCurrentLocation`. While the parent hook is working, the
row shows **Finding your location...** and cannot be clicked repeatedly.
Permission, timeout, unavailable-position, unsupported-browser, and
reverse-geocoding errors appear directly beneath the action.

Keeping the hook in `SearchCard` gives the parent ownership of permission,
selection, cancellation, caching, and API-search proximity bias. This component
stays reusable and purely presentational.

## Suggestion Loading

- `isLoading` renders `ListLoaderSkeleton` only when no rows exist.
- `isRefreshing` keeps existing suggestions visible and adds an updating
  indicator.
- Recent suggestions can therefore remain usable while an API request runs or
  fails.

## Selection Interaction

Buttons prevent the input's default `mousedown` focus change. This stops input
blur from closing the list before the click is processed.

## Item Shape

```js
{
  place_id,
  display_name,
  address,
  lat, // optional before enrichment
  lng  // optional before enrichment
}
```

`SearchCard` enriches selected rows without coordinates using
`useLocationByPlaceIdQuery` once an option is selected.
