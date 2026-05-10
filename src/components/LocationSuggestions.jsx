import { useCurrentLocation } from "@/hooks";
import { MapPin, Navigation } from "lucide-react";
const LocationSuggestions = ({
  suggestions = [],
  onSelect,
  isPickup = false,
  isLoading = false,
  isPickupSet = false,
}) => {
  const { location } = useCurrentLocation(isPickup);
  return (
    <>
      {/* 📍 Use Current Location (ONLY for pickup, and only when pickup is not already set) */}
      {isPickup && !isPickupSet && (
        <button
          onClick={() => {
            if (location) onSelect?.(location);
          }}
          onMouseDown={(e) => {
            if (location) {
              e.preventDefault();
              onSelect?.(location);
            }
          }}
          disabled={!location}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition cursor-pointer ${!location ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}
        >
          <Navigation size={16} className="text-primary" />
          <div className="text-left">
            <p className="text-[13px] font-medium text-gray-900">
              Use current location
            </p>
          </div>
        </button>
      )}

      {/* Divider (only if both exist) */}
      {isPickup && !isPickupSet && suggestions.length > 0 && (
        <div className="h-px bg-gray-100 my-1 ml-8" />
      )}

      {isLoading && (
        <div className="px-3 py-2 text-xs text-gray-400">Searching...</div>
      )}
      {suggestions && suggestions.length > 0 && suggestions.map((item) => (
        <button
          key={item.place_id}
          onClick={() => onSelect?.(item)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect?.(item);
          }}
          className="w-full flex items-start gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition cursor-pointer animate-fade-in"
        >
          <MapPin size={16} className="text-gray-400 mt-1" />
          <div className="text-left">
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
