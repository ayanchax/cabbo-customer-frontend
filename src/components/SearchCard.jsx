import { useState } from "react";
import { LocationInput, LocationSuggestions } from "@/components";
import { useNavigate } from "react-router-dom";
import {
  useClassifyTripTypeMutation as useClassifyTripType,
  useLocationSearchQuery,
  useLocationByPlaceIdQuery,
  useCustomer,
  useCurrentLocation,
} from "@/hooks";

const SearchCard = () => {
  const navigate = useNavigate();
  const { coordinates, sessionToken } = useCustomer();
  const classifyTripType = useClassifyTripType();

  // null = untouched (auto-fill from currentLocation)
  const [pickup, setPickup] = useState(null); // raw selection (display only)
  const [pickupCleared, setPickupCleared] = useState(false);
  const [drop, setDrop] = useState(null); // raw selection (display only)

  // place_id to enrich — only set when the selected item came from search (no lat/lng)
  const [pickupEnrichId, setPickupEnrichId] = useState(null);
  const [dropEnrichId, setDropEnrichId] = useState(null);

  // Background enrichment: search results only carry display_name/address/place_id;
  // fetch full details (lat, lng, country, state…) silently after selection.
  const { data: enrichedPickup } = useLocationByPlaceIdQuery(
    pickupEnrichId,
    sessionToken,
  );
  const { data: enrichedDrop } = useLocationByPlaceIdQuery(
    dropEnrichId,
    sessionToken,
  );

  // For navigation: prefer enriched (fully formed) over raw selection
  const finalPickup = pickupEnrichId ? (enrichedPickup ?? pickup) : pickup;
  const finalDrop = dropEnrichId ? (enrichedDrop ?? drop) : drop;

  const [pickupQuery, setPickupQuery] = useState("");
  const [dropQuery, setDropQuery] = useState("");

  const [activeField, setActiveField] = useState(null); // "pickup" | "drop"

  const { location: currentLocation } = useCurrentLocation(true);

  // When cleared: stay empty (no snap-back). When untouched: auto-fill with currentLocation.
  // For display: use raw pickup (instant feedback); enrichment happens in background.
  const effectivePickup = pickupCleared ? null : (pickup ?? currentLocation);

  // Hide "Use current location" only when the effective pickup already IS current location
  const isPickupCurrentLocation =
    !!effectivePickup &&
    !!currentLocation &&
    effectivePickup.lat === currentLocation.lat &&
    effectivePickup.lng === currentLocation.lng;

  const activeQuery = (
    activeField === "pickup" ? pickupQuery : dropQuery
  ).trim();

  const { data: apiSuggestions = [], isLoading } = useLocationSearchQuery(
    activeQuery,
    coordinates,
    sessionToken,
  );

  const handleSearch = async () => {
    // Use fully enriched location for navigation; fall back to raw if enrichment is still loading
    const pickupForNav = pickupCleared
      ? null
      : (finalPickup ?? currentLocation);
    const dropForNav = finalDrop;

    if (!pickupForNav) return;

    // Case 1: No drop → local
    if (!dropForNav) {
      navigate("/local", { state: { pickup: pickupForNav } });
      return;
    }

    try {
      const tripType = await classifyTripType.mutateAsync({
        pickup: pickupForNav,
        dropoff: dropForNav,
      });

      switch (tripType) {
        case "airport_pickup":
        case "airport_drop":
          navigate("/airport", {
            state: { pickup: pickupForNav, drop: dropForNav },
          });
          break;

        case "outstation":
          navigate("/outstation", {
            state: { pickup: pickupForNav, drop: dropForNav },
          });
          break;

        default:
          navigate("/local", {
            state: { pickup: pickupForNav, drop: dropForNav },
          });
      }
    } catch (e) {
      // fallback UX
      console.error("Trip classification failed", e);
      alert("No rides available for this route");
    }
  };

  return (
    <div className="px-4 mt-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Pickup */}
        <LocationInput
          location={effectivePickup}
          placeholder="Pickup location"
          icon="navigation"
          isActive={activeField === "pickup"}
          onChangeLocationActiveIndicator={(ind) =>
            setActiveField(ind ? "pickup" : null)
          }
          onFocus={() => {
            setActiveField("pickup");
            setPickupQuery("");
          }}
          onChange={(value) => {
            setPickupQuery(value);
            if (value === "") {
              setPickup(null);
              setPickupEnrichId(null);
              setPickupCleared(true); // explicit clear → don't snap back to currentLocation
            } else {
              setPickupCleared(false); // user is typing a new query
            }
          }}
        />

        <div className="h-px bg-gray-200 ml-10" />

        {/* Drop */}
        <LocationInput
          location={drop}
          placeholder="Where to? (optional)"
          isActive={activeField === "drop"}
          onChangeLocationActiveIndicator={(ind) =>
            setActiveField(ind ? "drop" : null)
          }
          onFocus={() => {
            setActiveField("drop");
            setDropQuery("");
          }}
          onChange={(value) => {
            setDropQuery(value);
            if (value === "") {
              setDrop(null);
            }
          }}
        />

        {/* Suggestions */}
        {activeField && (
          <div className="px-2 pb-2">
            <LocationSuggestions
              isPickup={activeField === "pickup"}
              isPickupSet={isPickupCurrentLocation}
              suggestions={activeQuery.length >= 2 ? apiSuggestions : []}
              isLoading={isLoading}
              onSelect={(item) => {
                if (activeField === "pickup") {
                  setPickup((prev) => {
                    if (prev?.place_id === item.place_id) return prev;
                    return item;
                  });
                  setPickupCleared(false);
                  // Enrich only if the item is a loose search result (no lat/lng)
                  setPickupEnrichId(item.lat ? null : (item.place_id ?? null));
                  setPickupQuery("");
                } else {
                  setDrop((prev) => {
                    if (prev?.place_id === item.place_id) return prev;
                    return item;
                  });
                  setDropEnrichId(item.lat ? null : (item.place_id ?? null));
                  setDropQuery("");
                }
                setActiveField(null);
              }}
            />
          </div>
        )}

        {/* CTA */}
        <div className="p-3 border-t border-gray-100">
          <button
            disabled={!effectivePickup}
            onClick={handleSearch}
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition cursor-pointer
              ${
                effectivePickup
                  ? "bg-primary text-white active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {!effectivePickup
              ? "Enter pickup location"
              : !drop
                ? "Explore rentals"
                : "Search cabs"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
