# LocationInput

Reusable location field used for both pickup and drop in `SearchCard`. Supports two display modes: icon-per-field (standalone) and icon-hidden (when parent owns a shared timeline column).

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `location` | `object \| null` | — | Full location object `{ display_name, address, lat, lng }`. Null renders placeholder. |
| `placeholder` | `string` | — | Shown when location is null or field is unfocused with no selection |
| `icon` | `"navigation" \| "map"` | `"map"` | `navigation` = emerald (pickup), `map` = rose (drop) |
| `isActive` | `boolean` | — | Controlled focus state from parent |
| `onChangeLocationActiveIndicator` | `(bool) => void` | — | Called with `true` on click-to-focus, `false` on input blur |
| `onFocus` | `() => void` | — | Called when field activates (after indicator fires) |
| `onChange` | `(value: string) => void` | — | Called on every keystroke in the active input |
| `hideIcon` | `boolean` | `false` | Hides the icon — use when parent provides a shared route timeline column |

---

## Behaviour

**Two visual states:**

```
Unfocused: shows location.display_name (gray-900) or placeholder (gray-400), truncated
Focused:   renders <input autoFocus>, selects all text on focus, fires onChange on keystroke
```

**Focus ownership:** `isActive` is controlled externally (by `SearchCard`). The component calls `onChangeLocationActiveIndicator(true)` on click and `onChangeLocationActiveIndicator(false)` on blur — the parent decides whether to accept the state change.

**Background handling:** When `hideIcon = true`, no hover/active/focus background is applied to the input div — the parent row owns the full-width highlight. When `hideIcon = false`, the component manages its own `bg-primary/5` on focus.

---

## Usage

**Standalone (icon visible):**
```jsx
<LocationInput
  location={pickup}
  placeholder="Pickup location"
  icon="navigation"
  isActive={activeField === "pickup"}
  onChangeLocationActiveIndicator={(v) => setActiveField(v ? "pickup" : null)}
  onFocus={() => setPickupQuery("")}
  onChange={(val) => setPickupQuery(val)}
/>
```

**Inside timeline column (icon hidden, parent owns background):**
```jsx
<div className={`flex items-center pr-10 ${isActive ? "bg-primary/5" : "hover:bg-gray-50"}`}>
  {/* dot */}
  <div className="flex-1 min-w-0">
    <LocationInput hideIcon ... />
  </div>
</div>
```
