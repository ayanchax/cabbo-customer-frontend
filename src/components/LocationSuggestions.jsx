import { LoaderCircle, MapPin, Target } from "lucide-react";
import { ListLoaderSkeleton } from "@/components";

const LocationSuggestions = ({
  suggestions = [],
  onSelect,
  isPickup = false,
  isLoading = false,
  isRefreshing = false,
  isPickupSet = false, // means is pickup already set to something (either current location or a search result)
  currentLocation = null,
}) => {
  return (
    <>
      {/* 📍 Use Current Location (ONLY for pickup, and only when pickup is not already set) */}
      {isPickup && !isPickupSet && (
        <button
          onClick={() => {
            if (currentLocation) onSelect?.(currentLocation, true);
          }}
          onMouseDown={(e) => {
            if (currentLocation) {
              e.preventDefault();
              onSelect?.(currentLocation, true);
            }
          }}
          disabled={!currentLocation}
          className={`w-full flex items-center gap-3 px-3 py-3 min-h-11 rounded-xl hover:bg-gray-50 transition cursor-pointer ${!currentLocation ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}
        >
          <Target size={16} className="text-primary" />
          <div className="text-left">
            <p className="text-[12px] font-medium text-gray-700 leading-snug">
              Use current location
            </p>
          </div>
        </button>
      )}

      {/* Divider (only if both exist) */}
      {isPickup && !isPickupSet && suggestions.length > 0 && (
        <div className="h-px bg-gray-100 my-1 ml-8" />
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

      {suggestions?.map((item) => (
          <button
            key={
              item.place_id ||
              `${item.lat || item.latitude}-${item.lng || item.longitude}-${item.display_name}`
            }
            onClick={() => onSelect?.(item)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect?.(item);
            }}
            className="w-full flex items-start gap-3 px-3 py-2.5 min-h-11 rounded-xl hover:bg-gray-50 transition cursor-pointer animate-fade-in"
          >
            <span className="flex items-center justify-center h-6 w-6 shrink-0">
              <MapPin size={16} className="text-gray-400" />
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[12px] font-medium text-gray-800 leading-snug">
                {item.display_name}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {item.address}
              </p>
            </div>
          </button>
        ))}
    </>
  );
};

export default LocationSuggestions;
