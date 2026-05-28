import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import { Cab } from "@/components";
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
      className={`w-full cursor-pointer text-left rounded-2xl border border-gray-100 bg-white shadow-sm px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-y-4 sm:gap-y-0 gap-x-7 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition group ${option.overages.indicative_overage_warning ? "border-rose-300" : ""}`}
      onClick={onSelect ? () => onSelect(option) : undefined}
      style={{ minHeight: 88 }}
    >
      {/* Icon */}
      <div className="mx-auto sm:mx-0 shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow border border-blue-100">
        <Cab cabType={option.car_type} className="w-14 h-14 drop-shadow-md" />
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left justify-center">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="font-semibold text-lg sm:text-xl text-gray-900 truncate">
            {option.car_type}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-normal">
            ({option.fuel_type})
          </span>
        </div>

        {option?.per_min && (
          <>
            <div className="flex gap-2 justify-center sm:justify-start mt-1 text-xs sm:text-sm text-gray-600 font-medium">
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
            {(option.overages?.overage_amount_per_km || option.overages?.overage_amount_per_hour) && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 text-xs sm:text-sm text-gray-500 font-medium">
                {option.overages?.overage_amount_per_km && (
                  <span className="bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    + {option?.currency?.symbol || fallbackCurrencySymbol}{option.overages.overage_amount_per_km} <span className="text-gray-400">/extra km</span>
                  </span>
                )}
                {option.overages?.overage_amount_per_hour && (
                  <span className="bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    + {option?.currency?.symbol || fallbackCurrencySymbol}{option.overages.overage_amount_per_hour} <span className="text-gray-400">/extra hr</span>
                  </span>
                )}
              </div>
            )}
          </>
        )}
        {option.overages.indicative_overage_warning && (
          <div className="flex items-center gap-1 bg-rose-50/80 border border-rose-200 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold text-rose-600 mt-2 shadow-sm w-fit mx-auto sm:mx-0">
            <AlertCircle
              className="w-4 h-4 text-rose-400 mr-1"
              aria-hidden="true"
            />
            <span>May exceed included limits</span>
          </div>
        )}
      </div>
      {/* Price */}
      <div className="mt-2 sm:mt-0 flex flex-col items-center sm:items-end ml-0 sm:ml-6 min-w-18">
        <span className="font-bold text-xl sm:text-2xl text-blue-600">
          {option?.currency?.symbol || fallbackCurrencySymbol}
          {option.total_price}
        </span>
      </div>
    </button>
  );
}

export { TripOptionCard };
