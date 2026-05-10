import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
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
  const { coordinates } = useCustomer();
  const classifyTripType = useClassifyTripType();

  // null = untouched (auto-fill from currentLocation)
  const [pickup, setPickup] = useState(null); // raw selection (display only)
  const [pickupCleared, setPickupCleared] = useState(false);
  const [drop, setDrop] = useState(null); // raw selection (display only)

  // Local session token — rotates after each select to correctly bound Google billing sessions.
  // Autocomplete + Place Details must share the same token; rotating after each select
  // groups them into one billing unit (~$0.017) instead of per-request Autocomplete charges.
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID());
  const rotateSession = () => setSessionToken(crypto.randomUUID());

  // Enrich tokens: snapshot of sessionToken at select time, so Place Details fires
  // with the same token as the preceding Autocomplete calls.
  const [pickupEnrichToken, setPickupEnrichToken] = useState(null);
  const [dropEnrichToken, setDropEnrichToken] = useState(null);

  // place_id to enrich — only set when the selected item came from search (no lat/lng)
  const [pickupEnrichId, setPickupEnrichId] = useState(null);
  const [dropEnrichId, setDropEnrichId] = useState(null);

  // Background enrichment: search results only carry display_name/address/place_id;
  // fetch full details (lat, lng, country, state…) silently after selection.
  const { data: enrichedPickup } = useLocationByPlaceIdQuery(
    pickupEnrichId,
    pickupEnrichToken,
  );
  const { data: enrichedDrop } = useLocationByPlaceIdQuery(
    dropEnrichId,
    dropEnrichToken,
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

  const handleSwap = () => {
    setPickup(drop);
    setDrop(effectivePickup);
    setPickupEnrichId(dropEnrichId);
    setDropEnrichId(pickupEnrichId);
    setPickupEnrichToken(dropEnrichToken);
    setDropEnrichToken(pickupEnrichToken);
    setPickupCleared(false);
    setPickupQuery("");
    setDropQuery("");
    setActiveField(null);
  };

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
        {/* Input section — relative so swap button can be absolutely centered */}
        <div className="relative">

          {/* Pickup row */}
          <div className={`flex items-center pr-10 transition-colors ${activeField === "pickup" ? "bg-primary/5" : "hover:bg-gray-50"}`}>
            <div className="pl-3 pr-2 flex items-center self-stretch shrink-0">
              <div className="relative w-3 h-3 flex items-center justify-center">
                {activeField === "pickup" && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
                )}
                <div className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <LocationInput
                location={effectivePickup}
                placeholder="Pickup location"
                icon="navigation"
                hideIcon
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
                    setPickupCleared(true);
                  } else {
                    setPickupCleared(false);
                  }
                }}
              />
            </div>
          </div>

          {/* Connector: vertical dashed line aligned with dots */}
          <div className="flex">
            <div className="pl-3 pr-2 flex justify-center shrink-0">
              <div className="w-3 flex justify-center">
                <div className="h-3 border-l-2 border-dashed border-gray-200" />
              </div>
            </div>
          </div>

          {/* Drop row */}
          <div className={`flex items-center pr-10 transition-colors ${activeField === "drop" ? "bg-primary/5" : "hover:bg-gray-50"}`}>
            <div className="pl-3 pr-2 flex items-center self-stretch shrink-0">
              <div className="relative w-3 h-3 flex items-center justify-center">
                {activeField === "drop" && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40 animate-ping" />
                )}
                <div className="relative w-2.5 h-2.5 rounded-full bg-rose-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <LocationInput
                location={drop}
                placeholder="Where to? (optional)"
                hideIcon
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
            </div>
          </div>

          {/* Swap — absolutely centered vertically between pickup and drop */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSwap}
              disabled={!effectivePickup || !drop}
              aria-label="Swap pickup and drop"
              className="w-7 h-7 cursor-pointer rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 shadow-xs"
            >
              <ArrowUpDown size={12} className="text-gray-400" />
            </button>
          </div>

        </div>

        {/* Suggestions */}
        {activeField && (
          <div className="px-2 pb-2">
            <LocationSuggestions
              currentLocation={currentLocation}
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
                  // Snapshot current token for Place Details, then rotate for next cycle
                  setPickupEnrichToken(sessionToken);
                  setPickupEnrichId(item.lat ? null : (item.place_id ?? null));
                  setPickupQuery("");
                } else {
                  setDrop((prev) => {
                    if (prev?.place_id === item.place_id) return prev;
                    return item;
                  });
                  setDropEnrichToken(sessionToken);
                  setDropEnrichId(item.lat ? null : (item.place_id ?? null));
                  setDropQuery("");
                }
                rotateSession();
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
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition
              ${
                effectivePickup
                  ? "bg-primary text-white active:scale-[0.98] cursor-pointer"
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
