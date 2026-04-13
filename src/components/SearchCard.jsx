import { MapPin, Navigation, Calendar, ChevronRight } from "lucide-react";

const SearchCard = () => {
  return (
    <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Pickup */}
        <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50">
          <div className="flex items-center gap-3">
            <Navigation size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700">
              Pickup location
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <div className="h-px bg-gray-100 ml-11" />

        {/* Drop */}
        <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700">
              Where to?
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <div className="h-px bg-gray-100 ml-11" />

        {/* Date Time */}
        <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              Select date & time
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        {/* Optional Preferences */}
        <div className="px-4 pb-2 pt-1">
          <button className="text-sm text-primary font-medium">
            + Add trip details
          </button>
        </div>

        {/* CTA */}
        <div className="p-4 pt-2">
          <button className="w-full bg-primary text-white py-3 rounded-xl font-medium active:scale-[0.98] transition-transform">
            Search cabs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;