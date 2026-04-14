import { MapPin } from "lucide-react";

const LocationSuggestions = ({ suggestions = [], onSelect }) => {
  return (
    <>
      {suggestions.map((item) => (
        <button
          key={item.place_id}
          onClick={() => onSelect?.(item)}
          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer animate-fade-in"
        >
          <MapPin size={16} className="text-gray-400 mt-1" />
          <div className="text-left">
            <p className="text-[13px] font-medium text-gray-800">
              {item.display_name}
            </p>
            <p className="text-xs text-gray-500">{item.address}</p>
          </div>
        </button>
      ))}
    </>
  );
};

export default LocationSuggestions;
