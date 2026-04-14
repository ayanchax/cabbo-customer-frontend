import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { useCurrentLocation } from "@/hooks";
import { LocationInput } from "@/components";
import { LocationSuggestions } from "@/components";
const DUMMY_LOCATIONS = [
  {
    display_name: "Kempegowda International Airport",
    address: "Bangalore, Karnataka",
    lat: 13.1986,
    lng: 77.7066,
    place_id: "airport_blr",
  },
  {
    display_name: "Whitefield",
    address: "Bangalore, Karnataka",
    lat: 12.9698,
    lng: 77.7499,
    place_id: "whitefield",
  },
  {
    display_name: "Electronic City",
    address: "Bengaluru, Karnataka",
    lat: 12.8399,
    lng: 77.677,
    place_id: "ecity",
  },
];
const SearchSheet = ({ onClose }) => {
  const { location } = useCurrentLocation();
  const [pickup, setPickup] = useState(null);
  const [pickUpActive, setPickupActive] = useState(false);
  const [pickupQuery, setPickupQuery] = useState("");
  const [showPickupSearch, setShowPickupSearch] = useState(false);

  // Drop attributes
  const [drop, setDrop] = useState(null);
  const [dropActive, setDropActive] = useState(false);
  const [dropQuery, setDropQuery] = useState("");
  const [showDropSearch, setShowDropSearch] = useState(false);

  useEffect(() => {
    if (location) {
      setPickup(location); // set current location as default pickup
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const filteredPickupResults = DUMMY_LOCATIONS.filter(
    (item) =>
      item.display_name.toLowerCase().includes(pickupQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(pickupQuery.toLowerCase()),
  );

  const filteredDropResults = DUMMY_LOCATIONS.filter(
    (item) =>
      item.display_name.toLowerCase().includes(dropQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(dropQuery.toLowerCase()),
  );
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        {/* Bottom Sheet */}
        <div
          className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl rounded-b-3xl shadow-xl px-5 pt-3 pb-4 max-h-[92vh] overflow-y-auto flex flex-col animate-slide-up mb-0 sm:mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handlebar */}
          <div className="w-12 h-1.5 bg-gray-200 opacity-80 rounded-full mx-auto mb-4" />
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Plan your trip
            </h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Pickup */}
          <LocationInput
            location={pickup}
            placeholder="Pickup location"
            icon="navigation"
            // eslint-disable-next-line no-unused-vars
            onFocus={(value) => {
              setShowDropSearch(false); // hide drop suggestions if open
              setDropActive(false);
              setDropQuery(""); // reset drop query
              setShowPickupSearch(true);
              setPickupQuery("");
              
            }}
            onChange={(value) => {
              setPickupQuery(value);
            }}
            isActive={pickUpActive}
            setIsActive={setPickupActive}
          />

          <div className="h-px bg-gray-100 ml-8 mt-2" />
          {showPickupSearch && (
            <div className="relative">
              <div className="mt-1 ml-5 max-h-24 overflow-y-auto pr-2 space-y-1 scrollbar-hide">
                <LocationSuggestions
                  suggestions={
                    pickupQuery.length > 0
                      ? filteredPickupResults
                      : DUMMY_LOCATIONS
                  }
                  onSelect={(item) => {
                    setPickup(item); // update pickup
                    setPickupQuery(""); // reset query
                    setShowPickupSearch(false); // hide suggestions
                    setPickupActive(false); // remove focus state
                  }}
                />
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent" />
            </div>
          )}

          <div className="h-px bg-gray-100 ml-8" />

          {/* Drop */}
          <LocationInput
            location={drop}
            placeholder="Drop location"
            onFocus={(value) => {
              setShowPickupSearch(false); // hide pickup suggestions if open
              setPickupActive(false); // remove pickup focus if active
              setPickupQuery(""); // reset pickup query
              setShowDropSearch(true);
              setDropQuery(value);
            }}
            onChange={(value) => {
              setDropQuery(value);
            }}
            isActive={dropActive}
            setIsActive={setDropActive}
          />
          <div className="h-px bg-gray-100 ml-8 mt-2" />
          {showDropSearch && (
            <div className="relative">
              <div className="mt-1 ml-5 max-h-48 overflow-y-auto pr-2 space-y-1 scrollbar-hide">
                <LocationSuggestions
                  suggestions={
                    dropQuery.length > 0 ? filteredDropResults : DUMMY_LOCATIONS
                  }
                  onSelect={(item) => {
                    setDrop(item); // update drop
                    setDropQuery(""); // reset query
                    setShowDropSearch(false); // hide suggestions
                    setDropActive(false); // remove focus state
                  }}
                />
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent" />
            </div>
          )}

          <div className="h-px bg-gray-100 ml-8" />

          {/* Date Time */}
          <button className="w-full flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-gray-50 transition">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-[15px] font-medium text-gray-800">
              Select date & time
            </span>
          </button>

          {/* Preferences */}
          <div className="mt-3">
            <button className="text-sm text-primary font-medium">
              + Add trip details
            </button>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 bg-white pt-3 pb-5">
            <button className="w-full bg-primary text-white py-3.5 rounded-2xl font-semibold text-[15px] shadow-lg active:scale-[0.98] transition">
              Search cabs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSheet;
