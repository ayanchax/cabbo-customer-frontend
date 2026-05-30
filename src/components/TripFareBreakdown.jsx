import React from "react";
import { DEFAULT_CURRENCY_SYMBOL, formatCurrency } from "@/utils";

function TripFareBreakdown({ priceBreakdown, currencySymbol, className = "" }) {
  
    
  return (
    <div className={`w-full ${className}`}>
      <ul className="text-sm text-gray-700 space-y-1">
        {Object.entries(priceBreakdown)
          // eslint-disable-next-line no-unused-vars
          .filter(([_, val]) => (typeof val === "number" ? val !== 0 : true))
          .map(([key, val]) => (
            <li key={key} className="flex justify-between">
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
              <span>{formatCurrency(val, currencySymbol)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export { TripFareBreakdown };
