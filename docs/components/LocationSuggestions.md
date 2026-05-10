# LocationSuggestions

Dropdown list rendered below the inputs when a field is active. Shows "Use current location" for pickup, a skeleton loader while fetching, and search result rows.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `suggestions` | `array` | `[]` | Search result items from Autocomplete API |
| `onSelect` | `(item) => void` | — | Called when user picks any item (current location or search result) |
| `isPickup` | `boolean` | `false` | Enables "Use current location" button |
| `isLoading` | `boolean` | `false` | Shows `ListLoaderSkeleton` instead of results |
| `isPickupSet` | `boolean` | `false` | Hides "Use current location" when pickup already IS current location |
| `currentLocation` | `object \| null` | `null` | GPS location passed from parent — used directly for "Use current location" button |


---

## "Use current location" visibility logic

The button is shown only when **all three** are true:
1. `isPickup` — only relevant for pickup field
2. `!isPickupSet` — effective pickup is not already the GPS location
3. `currentLocation` is non-null (disabled + dimmed otherwise)

`isPickupSet` is passed as `isPickupCurrentLocation` from `SearchCard`:
```js
isPickupCurrentLocation =
  !!effectivePickup &&
  !!currentLocation &&
  effectivePickup.lat === currentLocation.lat &&
  effectivePickup.lng === currentLocation.lng
```
This means: hide the button only when the user is *already at* current location — not merely when some pickup is set.

**Why prop instead of internal hook:** `SearchCard` already calls `useCurrentLocation` for its own pickup auto-fill logic. Passing `currentLocation` down as a prop avoids a second GPS call and eliminates the brief `disabled` flash that occurred when the component had to wait for its own hook to resolve.

---

## Blur / mousedown conflict

Suggestion buttons use `onMouseDown` with `e.preventDefault()` in addition to `onClick`. This prevents the input's `onBlur` from firing before the click registers — without it, the suggestion list disappears before the selection can be captured.

---

## Skeleton loader

Uses the shared `<ListLoaderSkeleton />` component from `components/common`. Renders 3 rows by default. Pass `rows` prop for a different count:
```jsx
<ListLoaderSkeleton rows={5} />
```

---

## Item shape

Each `item` in `suggestions` is expected to have:
```ts
{
  place_id: string        // used as key and for enrichment
  display_name: string    // primary label
  address: string         // secondary label
  lat?: number            // present if item already has coordinates (e.g. current location)
  lng?: number
}
```

If `lat`/`lng` are absent, `SearchCard` will trigger the enrichment pipeline (`useLocationByPlaceIdQuery`) after selection.
