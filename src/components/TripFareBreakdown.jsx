import React from "react";
import { Info } from "lucide-react";
import { formatCurrency } from "@/utils";

function TripFareBreakdown({
  priceBreakdown,
  currencySymbol,
  lockedAddOnKeys = [],
  addOnDisclaimer = "Add-on charges are included in this fare and cannot be removed after booking is confirmed.",
  className = "",
}) {
  const lockedAddOnKeySet = new Set(lockedAddOnKeys);
  const hasLockedAddOns = Object.keys(priceBreakdown || {}).some((key) =>
    lockedAddOnKeySet.has(key),
  );

  return (
    <div className={`w-full ${className}`}>
      <ul className="text-sm text-gray-700 space-y-1">
        {Object.entries(priceBreakdown)
          // eslint-disable-next-line no-unused-vars
          .filter(([_, val]) => (typeof val === "number" ? val !== 0 : true))
          .map(([key, val]) => (
            <li key={key} className="flex justify-between">
              <span className="flex items-center gap-2 capitalize">
                {key.replace(/_/g, " ")}
                {lockedAddOnKeySet.has(key) && (
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Add-on
                  </span>
                )}
              </span>
              <span>{formatCurrency(val, currencySymbol)}</span>
            </li>
          ))}
      </ul>
      {hasLockedAddOns && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs leading-5 text-gray-600">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>{addOnDisclaimer}</span>
        </div>
      )}
    </div>
  );
}

export { TripFareBreakdown };
