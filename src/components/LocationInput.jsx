import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

const LocationInput = ({
  location, // full object
  placeholder,
  icon = "map",
  onFocus,
  onChange,
  isActive,
  setIsActive
}) => {

  const focused = isActive;
  const [query, setQuery] = useState("");

  const Icon = icon === "navigation" ? Navigation : MapPin;
  
  const displayText = location?.display_name || placeholder;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-4 rounded-xl transition ${
        focused ? "bg-gray-50" : ""
      }`}
      onClick={() => {
  if (!focused) {
    setIsActive(true);;
    setQuery(location?.display_name || ""); // set initial query to current location name
    onFocus?.(location?.display_name || "");
  }
}}
       
      
    >
      {/* Icon stays ALWAYS */}
      <Icon size={18} className="text-gray-500" />

      {/* Content */}
      <div className="flex-1">
        {!focused && (
          <span className="text-[15px] font-medium text-gray-800">
            {displayText}
          </span>
        )}

        {focused && (
          <input
            autoFocus
            value={query}
            onBlur={() => {
    setTimeout(() => setIsActive(false), 150);
  }}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-[15px]"
          />
        )}
      </div>
    </div>
  );
};

export default LocationInput;