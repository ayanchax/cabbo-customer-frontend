import React from "react";
import { ArrowLeft } from "lucide-react";
import { NoRidesAvailable } from "@/components";
import { useLocalStorage } from "@/hooks";
import { LOCAL_STORAGE_KEYS, CAB_TYPES } from "@/utils";
import { HatchbackCabIcon, SedanCabIcon, SedanPlusCabIcon, SuvCabIcon, SuvPlusCabIcon } from "../../../components/common/svg/cabs";
/**
 * TripOptionsList
 *
 * Minimal, modern, and fully responsive results UI for cab/package options.
 * - Shows all key info: car type, fuel, price, included hours/km, overage, and warnings.
 * - Polished, mobile-first, and industry-standard layout.
 * - Designed for use in LocalHourlyRental after trip search.
 *
 * Props:
 * - options: Array of trip option objects (from backend)
 * - onBack: Function to go back to search form
 * - onSelect: Function(option) when user selects an option (optional)
 */
function TripOptionsList({ options = [], onBack, onSelect }) {
  const { getItem } = useLocalStorage();
  const fallbackCurrencySymbol =
    getItem(LOCAL_STORAGE_KEYS.serverGeography)?.data?.currency_symbol || "₹"; // Default to INR symbol if geography or currency symbol is not available
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 py-4 animate-slide-up duration-300 transition-all">
      <div className="flex items-center mb-4">
        <button
          className="flex items-center gap-1 text-primary font-medium text-sm px-3 py-1 rounded hover:bg-primary/10 focus:outline-none focus:ring"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
        </button>
        <h2 className="flex-1 text-center text-lg sm:text-xl font-semibold text-gray-900">
          Available Hourly Rentals
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {options?.length === 0 ? (
          <div className="px-4 mt-4 max-w-2xl mx-auto">
            <NoRidesAvailable
              title="No rides available"
              message="We couldn't find any rental options for you at the moment."
            />
          </div>
        ) : (
          options?.map((opt) => (
            <button
              key={opt.hash}
              className={`w-full text-left rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition group ${opt.overages.indicative_overage_warning ? "border-rose-300" : ""}`}
              onClick={onSelect ? () => onSelect(opt) : undefined}
            >
                <SedanCabIcon/>
                <SuvCabIcon/>
                <SuvPlusCabIcon/>
                <SedanPlusCabIcon/>
                <HatchbackCabIcon/>
              {/* Car type and fuel */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="inline-block w-10 h-10 rounded-full bg-gray-50 border border-gray-200 items-center justify-center mr-2">
                  {/* Emoji or icon for car type */}
                  {opt.car_type === CAB_TYPES.SUV ||
                  opt.car_type === CAB_TYPES.SUV_PLUS
                    ? "🚙"
                    : opt.car_type === CAB_TYPES.HATCHBACK
                      ? "🚗"
                      : "🚘"}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                    {opt.car_type}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      ({opt.fuel_type})
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {opt.package_short_label}
                  </div>
                </div>
              </div>
              {/* Price and included */}
              <div className="flex flex-col items-end min-w-25">
                <div className="text-primary font-bold text-lg sm:text-xl">
                  {opt?.currency?.symbol || fallbackCurrencySymbol}
                  {opt.total_price}
                </div>
                <div className="text-xs text-gray-500">
                  {opt.included_hours}h / {opt.included_kms}km
                </div>
              </div>
              {/* Overage warning */}
              {opt.overages.indicative_overage_warning && (
                <div className="text-xs text-rose-500 font-medium mt-1 sm:mt-0 sm:ml-2">
                  ⚠️ May exceed included limits
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export { TripOptionsList };
