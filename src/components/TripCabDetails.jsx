import React from "react";
import { ArrowLeft, BaggageClaim, Sparkles } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import { Cab } from "@/components";

const MAX_CAB_MODELS_TO_SHOW = 3; // Maximum number of cab models to show in the details, if there are more we will show "+X more" text
function TripCabDetails({
  cabDetails = null,
  showDescription = true,
  showRatePerKm = false,
  showRatePerMin = false,
  showInventoryCabNames = true,
  showRecommendation = false,
  fallbackCurrencySymbol = DEFAULT_CURRENCY_SYMBOL,
  className = "",
}) {
  const option = cabDetails || {};
  const isRecommended =
    showRecommendation && Boolean(option?.car_capacity?.recommended);
  const hasRoofCarrier = Boolean(option?.car_capacity?.roof_carrier);

  const getCabTypeLabel = (carType) => {
    if (carType === CAB_TYPES.SEDAN_PLUS) {
      return "Sedan XL";
    }
    return carType;
  };
  return (
    <div className={`flex items-center gap-3 sm:gap-6 w-full ${className}`}>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-blue-100 shadow">
          <Cab
            cabType={option.car_type}
            className="h-14 w-14 -translate-y-2 drop-shadow-md"
          />
          {/* Fuel type pill for mobile, inside cab div */}
          <span className="absolute -top-3 left-1/2 min-w-11 -translate-x-1/2 rounded-full border border-gray-200 bg-gray-100 px-2 py-0 text-center text-[10px] font-medium text-gray-600 shadow md:hidden">
            {option.fuel_type}
          </span>
          {hasRoofCarrier && (
            <span
              className="absolute -bottom-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700 shadow md:hidden"
              title="This cab comes with a roof carrier for additional luggage space"
              aria-label="Roof carrier available"
            >
              <BaggageClaim className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
        {isRecommended && (
          <span
            className="inline-flex w-fit max-w-20 mt-0.5 items-center justify-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 md:hidden"
            title="Recommended for your passenger and luggage details"
          >
            <Sparkles className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Best match</span>
          </span>
        )}
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-1 min-w-0 flex-wrap">
            <span className="flex min-w-0 items-baseline gap-1">
              <span className="truncate text-base font-semibold text-gray-900 sm:text-lg md:text-xl">
                {getCabTypeLabel(option.car_type)}
              </span>
              <span className="hidden shrink-0 text-xs font-normal text-gray-500 sm:inline sm:text-sm">
                ({option?.fuel_type})
              </span>
            </span>

            {isRecommended && (
              <span className="hidden basis-full sm:basis-auto md:flex">
                <span
                  className="mt-0.5 inline-flex w-fit max-w-max shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 sm:mt-0 sm:text-xs"
                  title="Recommended for your passenger and luggage details"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span>Best match</span>
                </span>
              </span>
            )}
            {option?.capacity && (
              <span className="ml-2 text-xs sm:text-sm text-gray-700 font-medium bg-gray-100 rounded-full px-2 py-0.5">
                {option?.capacity}
              </span>
            )}
          </div>

          {showDescription && option?.description && (
            <span className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              {option?.description}
            </span>
          )}
          {showInventoryCabNames &&
            option?.inventory_cab_names &&
            Array.isArray(option.inventory_cab_names) &&
            option?.inventory_cab_names.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                You may get:{" "}
                {option?.inventory_cab_names
                  .slice(0, MAX_CAB_MODELS_TO_SHOW)
                  .join(", ")}
                {option?.inventory_cab_names.length > MAX_CAB_MODELS_TO_SHOW &&
                  ` +${option.inventory_cab_names.length - MAX_CAB_MODELS_TO_SHOW} more`}
              </span>
            )}
        </div>

        {showRatePerMin && option?.rate_per_min && (
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

        {showRatePerKm && option?.rate_per_km && (
          <div className="flex gap-4 mt-2 text-xs sm:text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1">
              <ArrowLeft
                className="w-3 h-3 text-gray-400 rotate-180"
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-900">
                {option?.currency?.symbol || fallbackCurrencySymbol}
                {option?.rate_per_km ? option.rate_per_km : "-"}
              </span>
              <span className="text-gray-500 font-normal">/km</span>
            </span>
          </div>
        )}

        {hasRoofCarrier && (
          <div className="mt-1 hidden md:flex">
            <span
              className="inline-flex w-fit max-w-max shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700"
              title="This cab comes with a roof carrier for additional luggage space"
            >
              <BaggageClaim className="h-3 w-3" aria-hidden="true" />
              <span>Roof carrier</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { TripCabDetails };
