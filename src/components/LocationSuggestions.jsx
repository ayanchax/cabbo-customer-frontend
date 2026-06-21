import { LoaderCircle, MapPin, Target } from "lucide-react";
import { ListLoaderSkeleton } from "@/components";

const LocationSuggestions = ({
  suggestions = [],
  onSelect,
  isPickup = false,
  isLoading = false,
  isRefreshing = false,
  isPickupSet = false,
  onUseCurrentLocation,
  isLocating = false,
  currentLocationError = null,
}) => {
  const showCurrentLocationAction = isPickup && !isPickupSet;

  return (
    <>
      {showCurrentLocationAction && (
        <>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70"
          >
            {isLocating ? (
              <LoaderCircle
                size={16}
                className="animate-spin text-primary"
                aria-hidden="true"
              />
            ) : (
              <Target size={16} className="text-primary" aria-hidden="true" />
            )}
            <div className="text-left">
              <p className="text-[12px] font-medium leading-snug text-gray-700">
                {isLocating
                  ? "Finding your location..."
                  : "Use current location"}
              </p>
            </div>
          </button>

          {currentLocationError && (
            <p
              className="px-3 pb-2 pl-10 text-xs leading-snug text-red-600"
              role="status"
            >
              {currentLocationError}
            </p>
          )}
        </>
      )}

      {showCurrentLocationAction && suggestions.length > 0 && (
        <div className="my-1 ml-8 h-px bg-gray-100" />
      )}

      {isRefreshing && (
        <div className="flex items-center justify-end gap-1.5 px-3 py-1 text-[11px] text-gray-400">
          <LoaderCircle
            className="h-3 w-3 animate-spin"
            aria-hidden="true"
          />
          Updating
        </div>
      )}

      {isLoading && suggestions.length === 0 && <ListLoaderSkeleton />}

      {suggestions.map((item) => (
        <button
          type="button"
          key={
            item.place_id ||
            `${item.lat || item.latitude}-${item.lng || item.longitude}-${item.display_name}`
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect?.(item)}
          className="flex min-h-11 w-full cursor-pointer animate-fade-in items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <MapPin size={16} className="text-gray-400" aria-hidden="true" />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-[12px] font-medium leading-snug text-gray-800">
              {item.display_name}
            </p>
            <p className="text-xs leading-tight text-gray-500">
              {item.address}
            </p>
          </div>
        </button>
      ))}
    </>
  );
};

export default LocationSuggestions;
