import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";

function TripOptionCard({
  option = null,
  onSelect,
  fallbackCurrencySymbol = DEFAULT_CURRENCY_SYMBOL,
  // eslint-disable-next-line no-unused-vars
  className = "",
}) {
    if (!option) return null;
  return (
    <button
      key={option.hash}
      className={`w-full cursor-pointer text-left rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition group ${option.overages.indicative_overage_warning ? "border-rose-300" : ""}`}
      onClick={onSelect ? () => onSelect(option) : undefined}
    >
      {/* Car type and fuel */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="inline-block w-10 h-10 rounded-full bg-gray-50 border border-gray-200 items-center justify-center mr-2">
          {/* Emoji or icon for car type */}
          {option.car_type === CAB_TYPES.SUV ||
          option.car_type === CAB_TYPES.SUV_PLUS
            ? "🚙"
            : option.car_type === CAB_TYPES.HATCHBACK
              ? "🚗"
              : "🚘"}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-base sm:text-lg text-gray-900 truncate">
            {option.car_type}{" "}
            <span className="text-xs font-normal text-gray-500">
              ({option.fuel_type})
            </span>
          </div>
           
        </div>
      </div>
      {/* Price and included */}
      <div className="flex flex-col items-end min-w-25">
        <div className="text-primary font-bold text-lg sm:text-xl">
          {option?.currency?.symbol || fallbackCurrencySymbol}
          {option.total_price}
        </div>

        <div className="flex flex-row items-center gap-2 mt-1 bg-gray-50/80 border border-gray-100 rounded-full px-3 py-1 shadow-sm">
          <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 font-medium">
            <ArrowLeft
              className="w-3 h-3 text-gray-400 rotate-180"
              aria-hidden="true"
            />
            <span className="font-semibold text-gray-900">
              {option?.currency?.symbol || fallbackCurrencySymbol}
              {Math.round(option.overages.overage_amount_per_hour / 60)}
            </span>
            <span className="text-gray-500 font-normal">/extra min</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 font-medium">
            <ArrowLeft
              className="w-3 h-3 text-gray-400 rotate-90"
              aria-hidden="true"
            />
            <span className="font-semibold text-gray-900">
              {option?.currency?.symbol || fallbackCurrencySymbol}
              {option.overages.overage_amount_per_km}
            </span>
            <span className="text-gray-500 font-normal">/extra km</span>
          </span>
        </div>
      </div>
      {/* Overage warning */}
      {option.overages.indicative_overage_warning && (
        <div className="flex items-center gap-1 sm:gap-2 bg-rose-50/80 border border-rose-200 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold text-rose-600 mt-1 sm:mt-0 sm:ml-2 shadow-sm">
          <AlertCircle
            className="w-4 h-4 text-rose-400 mr-1"
            aria-hidden="true"
          />
          <span>May exceed included limits</span>
        </div>
      )}
    </button>
  );
}

export { TripOptionCard };
