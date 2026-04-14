import { MapPin, Navigation, Calendar, X } from "lucide-react";

const SearchSheet = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Background Overlay */}
      <div
    className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-fade-in"
    onClick={onClose}>
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
          <button className="w-full flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-gray-50 transition">
            <Navigation size={18} className="text-gray-500" />
            <span className="text-[15px] font-medium text-gray-800">Current location</span>
          </button>

          <div className="h-px bg-gray-100 ml-8" />

          {/* Drop */}
          <button className="w-full flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-gray-50 transition">
            <MapPin size={18} className="text-gray-500" />
            <span className="text-[15px] font-medium text-gray-800">Where to?</span>
          </button>

          <div className="h-px bg-gray-100 ml-8" />

          {/* Date Time */}
          <button className="w-full flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-gray-50 transition">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-[15px] font-medium text-gray-800">Select date & time</span>
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
