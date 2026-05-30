import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { CAB_TYPES, DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import {  TripCabDetails } from "@/components";
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
      className={`w-full cursor-pointer text-left rounded-2xl border border-gray-100 bg-white shadow-sm px-4 py-4 flex items-center gap-4 sm:gap-7 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition group ${option.overages.indicative_overage_warning ? "border-rose-300" : ""}`}
      onClick={onSelect ? () => onSelect(option) : undefined}
      style={{ minHeight: 88 }}
    >
      <TripCabDetails cabDetails={option}/>
      
      {/* Price */}
      <div className="flex flex-col items-end ml-6 min-w-18">
        <span className="font-bold text-xl sm:text-2xl text-blue-600">
          {option?.currency?.symbol || fallbackCurrencySymbol}
          {option.total_price}
        </span>
        
        {/* Book button */}
        <div role="button" aria-label="Reserve"
          className="mt-3 px-3 py-1 cursor-pointer bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 focus:outline-none focus:ring"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            if (onSelect) onSelect(option);
          }}
        >
          Reserve
          </div>
      </div>
    </button>
  );
}

export { TripOptionCard };
