import { useState } from "react";
import { LocationInput, LocationSuggestions } from "@/components";
import { useNavigate } from "react-router-dom";
import {
  useClassifyTripTypeMutation as useClassifyTripType,
  useLocationSearchQuery,
  useCustomer,
} from "@/hooks";

const SearchCard = () => {
  const navigate = useNavigate();
  const { coordinates } = useCustomer();
  const classifyTripType = useClassifyTripType();

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);

  const [pickupQuery, setPickupQuery] = useState("");
  const [dropQuery, setDropQuery] = useState("");

  const [activeField, setActiveField] = useState(null); // "pickup" | "drop"

  const activeQuery = activeField === "pickup" ? pickupQuery : dropQuery;

  const { data: apiSuggestions = [], isLoading } =
    useLocationSearchQuery(activeQuery, coordinates);

  

  const handleSearch = async () => {
    if (!pickup) return;

    // Case 1: No drop → local
    if (!drop) {
      navigate("/local", { state: { pickup } });
      return;
    }

    try {
      const tripType = await classifyTripType.mutateAsync({
        pickup,
        dropoff: drop,
         
      });

      switch (tripType) {
        case "airport_pickup":
        case "airport_drop":
          navigate("/airport", { state: { pickup, drop } });
          break;

        case "outstation":
          navigate("/outstation", { state: { pickup, drop } });
          break;

        default:
          navigate("/local", { state: { pickup, drop } });
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
          location={pickup}
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
              suggestions={activeQuery.length >= 2 ? apiSuggestions : []}
              isLoading={isLoading}
              onSelect={(item) => {
                if (activeField === "pickup") {
                  setPickup((prev) => {
                    // if already selected pickup is same as the new one, do not update (to prevent unnecessary re-renders)
                    if (prev?.place_id === item.place_id) {
                      return prev;
                    }
                    return item;
                  });
                  setPickupQuery("");
                } else {
                  setDrop((prev) => {
                    if (prev?.place_id === item.place_id) {
                      return prev;
                    }
                    return item;
                  });
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
            disabled={!pickup}
            onClick={handleSearch}
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition cursor-pointer
              ${
                pickup
                  ? "bg-primary text-white active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {!pickup
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
