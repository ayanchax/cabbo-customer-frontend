import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import { Cab } from "@/components";

function TripCabDetails({
  cabDetails = null,
  fallbackCurrencySymbol = DEFAULT_CURRENCY_SYMBOL,
  compact = false,
  className=""
}) {
  const option = cabDetails || {};
  const getCabTypeLabel = (carType) => {
    if (carType === CAB_TYPES.SEDAN_PLUS) {
      return "Sedan XL";
    }
    return carType;
  };
  return (
    <div
      className={`flex items-center gap-6 w-full ${className}`}
    >
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
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 truncate min-w-0">
              {getCabTypeLabel(option.car_type)}
            </span>
            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 font-normal">
              ({option.fuel_type})
            </span>
          </div>
        </div>

        {option?.per_min && (
          <>
            <div className="flex gap-4 mt-1 text-xs sm:text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <ArrowLeft
                  className="w-3 h-3 text-gray-400 rotate-180"
                  aria-hidden="true"
                />
                <span className="font-semibold text-gray-900">
                  {option?.currency?.symbol || fallbackCurrencySymbol}
                  {option?.per_min ? option.per_min : "-"}
                </span>
                <span className="text-gray-500 font-normal">/min</span>
              </span>
            </div>
          </>
        )}

        {!compact && (
          <>
            {(option.overages?.overage_amount_per_km ||
              option.overages?.overage_amount_per_hour) && (
              <div className="flex flex-wrap gap-3 mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                {option.overages?.overage_amount_per_km && (
                  <span className="bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    + {option?.currency?.symbol || fallbackCurrencySymbol}
                    {option.overages.overage_amount_per_km}{" "}
                    <span className="text-gray-400">/extra km</span>
                  </span>
                )}
                {option.overages?.overage_amount_per_hour && (
                  <span className="bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    + {option?.currency?.symbol || fallbackCurrencySymbol}
                    {option.overages.overage_amount_per_hour}{" "}
                    <span className="text-gray-400">/extra hr</span>
                  </span>
                )}
              </div>
            )}
          </>
        )}
        {option.overages.indicative_overage_warning && (
          <div className="flex items-center gap-1 bg-rose-50/80 border border-rose-200 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold text-rose-600 mt-2 shadow-sm w-fit">
            <AlertCircle
              className="w-4 h-4 text-rose-400 mr-1"
              aria-hidden="true"
            />
            <span>May exceed included limits</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { TripCabDetails };
