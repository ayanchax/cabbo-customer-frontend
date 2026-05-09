import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

const LocationInput = ({
  location, // full object
  placeholder,
  icon = "map",
  onFocus,
  onChange,
  isActive,
  onChangeLocationActiveIndicator,
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
          onChangeLocationActiveIndicator(true);
          setQuery(location?.display_name || ""); // set initial query to current location name
          onFocus?.(location?.display_name || "");
        }
      }}
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center">
        {isActive && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-30 animate-ping" />
        )}
        <Icon
          size={18}
          className={`relative text-gray-500 transition-colors duration-200 ${isActive ? "text-primary" : ""}`}
        />
      </div>
      {/* Content */}
      <div className="flex-1">
        {!focused && (
          <span className="block md:text-[14px] text-[12px] font-medium text-gray-600 truncate">
            {displayText}
          </span>
        )}

        {focused && (
          <input
            autoFocus
            value={query}
            onBlur={() => {
              onChangeLocationActiveIndicator(false);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none md:text-[14px] text-[12px] text-gray-800"
          />
        )}
      </div>
    </div>
  );
};

export default LocationInput;
