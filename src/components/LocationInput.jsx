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
  hideIcon = false,
}) => {
  const focused = isActive;
  const [query, setQuery] = useState("");

  const Icon = icon === "navigation" ? Navigation : MapPin;

  const displayText = location?.display_name || placeholder;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 min-h-11 transition-colors cursor-pointer ${
        hideIcon
          ? ""
          : focused
          ? "bg-primary/5"
          : "hover:bg-gray-50 active:bg-gray-100"
      }`}
      onClick={() => {
        if (!focused) {
          onChangeLocationActiveIndicator(true);
          setQuery(location?.display_name || ""); // set initial query to current location name
          onFocus?.(location?.display_name || "");
        }
      }}
    >
      {/* Icon — omitted when parent provides a shared timeline column */}
      {!hideIcon && (
        <div className="relative flex items-center justify-center shrink-0">
          {isActive && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-30 animate-ping" />
          )}
          <Icon
            size={18}
            className={`relative transition-colors duration-200 ${
              icon === "navigation" ? "text-emerald-400" : "text-rose-400"
            }`}
          />
        </div>
      )}
      {/* Content */}
      <div className="flex-1 min-w-0">
        {!focused && (
          <span className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-medium truncate ${
            location ? "text-gray-900" : "text-gray-400"
          }`}>
            {displayText}
          </span>
        )}

        {focused && (
          <input
            autoFocus
            value={query}
            onFocus={(e) => e.target.select()}
            onBlur={() => {
              onChangeLocationActiveIndicator(false);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-gray-900 placeholder:text-gray-400 font-medium"
          />
        )}
      </div>
    </div>
  );
};

export default LocationInput;
