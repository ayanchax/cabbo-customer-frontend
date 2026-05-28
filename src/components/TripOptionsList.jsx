import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { NoRidesAvailable, TripOptionCard } from "@/components";
import { useLocalStorage } from "@/hooks";
import {
  LOCAL_STORAGE_KEYS,
  CAB_TYPES,
  DEFAULT_CURRENCY_SYMBOL,
} from "@/utils";

/**
 * TripOptionsList
 *
 * Minimal, modern, and fully responsive results UI for cab/package options.
 * - Shows all key info: car type, fuel, price, included hours/km, overage, and warnings.
 * - Polished, mobile-first, and industry-standard layout.
 * - Designed for use across all flows: rental, outstation, airport, etc. (just pass different options data).
 *
 * Props:
 * - options: Array of trip option objects (from backend)
 * - onBack: Function to go back to search form
 * - onSelect: Function(option) when user selects an option (optional)
 * - className: Additional class names for the container (optional)
 * - header: Header text for the list (optional)
 */
function TripOptionsList({
  options = [],
  onBack,
  onSelect,
  className = "",
  header = null,
}) {
  const { getItem } = useLocalStorage();
  const fallbackCurrencySymbol =
    getItem(LOCAL_STORAGE_KEYS.serverGeography)?.data?.currency_symbol ||
    DEFAULT_CURRENCY_SYMBOL; // Default to INR symbol if geography or currency symbol is not available per backend response structure in the options.
    
    return (
    <div
      className={`animate-slide-up duration-300 transition-all ${className}`}
    >
      <div className="flex items-center mb-4">
        {/* Back button */}
        {onBack && (
          <button
            className="flex items-center gap-1 text-primary font-medium text-sm px-3 py-1 rounded hover:bg-primary/10 focus:outline-none focus:ring"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          </button>
        )}
        {header && (
          <h2 className="flex-1 text-center text-lg sm:text-xl font-semibold text-gray-900">
            {header}
          </h2>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        {options?.length === 0 ? (
          <div className="px-4 mt-4 max-w-2xl mx-auto">
            <NoRidesAvailable
              title="No rides available"
              message="We couldn't find any rides for you at the moment."
            />
          </div>
        ) : (
          options?.map((opt) => (
            <TripOptionCard
              key={opt.hash}
              option={opt}
              onSelect={onSelect ? () => onSelect(opt) : undefined}
              fallbackCurrencySymbol={fallbackCurrencySymbol}
            />
          ))
        )}
      </div>
    </div>
  );
}

export { TripOptionsList };
