import React from "react";
import { ArrowLeft, AlertCircle, Info } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import { Cab } from "@/components";

const MAX_CAB_MODELS_TO_SHOW = 3; // Maximum number of cab models to show in the details, if there are more we will show "+X more" text
function TripCabDetails({
  cabDetails = null,
  fallbackCurrencySymbol = DEFAULT_CURRENCY_SYMBOL,
  className = "",
   
}) {
  const option = cabDetails || {};
  const getCabTypeLabel = (carType) => {
    if (carType === CAB_TYPES.SEDAN_PLUS) {
      return "Sedan XL";
    }
    return carType;
  };
  return (
    <div className={`flex items-center gap-5 sm:gap-6 w-full ${className}`}>
      <div className="relative shrink-0 w-16 h-16 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow border border-blue-100">
        <Cab
          cabType={option.car_type}
          className="w-14 h-14 drop-shadow-md -translate-y-2"
        />
        {/* Fuel type pill for mobile, inside cab div */}
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 sm:hidden bg-gray-100 border border-gray-200 rounded-full px-2 py-0 text-[10px] text-gray-600 font-medium min-w-11 text-center shadow">
          {option.fuel_type}
        </span>
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-1 min-w-0 flex-wrap">
            <span className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 truncate min-w-0">
              {getCabTypeLabel(option.car_type)}
            </span>
            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 font-normal">
              ({option?.fuel_type})
            </span>
            {option?.capacity && (
              <span className="ml-2 text-xs sm:text-sm text-gray-700 font-medium bg-gray-100 rounded-full px-2 py-0.5">
                 {option?.capacity}
              </span>
            )}
          </div>
          {option?.description && (
            <span className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              {option?.description}
            </span>
          )}
          {option?.inventory_cab_names && Array.isArray(option.inventory_cab_names) && option?.inventory_cab_names.length > 0 && (
            <span className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              You may get: {option?.inventory_cab_names.slice(0, MAX_CAB_MODELS_TO_SHOW).join(", ")}
              {option?.inventory_cab_names.length > MAX_CAB_MODELS_TO_SHOW && ` +${option.inventory_cab_names.length - MAX_CAB_MODELS_TO_SHOW} more`}
            </span>
          )}
        </div>

        {option?.rate_per_min && (
          <div className="flex gap-4 mt-2 text-xs sm:text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1">
              <ArrowLeft
                className="w-3 h-3 text-gray-400 rotate-180"
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-900">
                {option?.currency?.symbol || fallbackCurrencySymbol}
                {option?.rate_per_min ? option.rate_per_min : "-"}
              </span>
              <span className="text-gray-500 font-normal">/min</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { TripCabDetails };
