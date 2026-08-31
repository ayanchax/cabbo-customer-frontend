import React from "react";
import { Info } from "lucide-react";
import { formatMoney, ROUTES } from "@/utils";

const INTERNAL_PRICE_BREAKDOWN_KEYS = new Set([
  "platform_fee_base",
  "platform_fee_tax",
  "platform_fee_tax_rate_percent",
  "platform_fee_tax_type",
]);

function TripFareBreakdown({
  priceBreakdown,
  currencySymbol,
  lockedAddOnKeys = [],
  addOnDisclaimer = null,
  inclusiveOfAllTaxes = false,
  className = "",
}) {
  const lockedAddOnKeySet = new Set(lockedAddOnKeys);
  const hasLockedAddOns = Object.keys(priceBreakdown || {}).some((key) =>
    lockedAddOnKeySet.has(key),
  );
  const visibleEntries = Object.entries(priceBreakdown || {}).filter(
    ([key, value]) =>
      !(inclusiveOfAllTaxes && INTERNAL_PRICE_BREAKDOWN_KEYS.has(key)) &&
      (typeof value === "number" ? value !== 0 : true),
  );
  const sortByAmountDescending = ([, firstValue], [, secondValue]) => {
    if (
      typeof firstValue !== "number" ||
      typeof secondValue !== "number"
    ) {
      return 0;
    }

    return secondValue - firstValue;
  };
  const sortedEntries = [
    ...visibleEntries
      .filter(([key]) => !lockedAddOnKeySet.has(key))
      .sort(sortByAmountDescending),
    ...visibleEntries
      .filter(([key]) => lockedAddOnKeySet.has(key))
      .sort(sortByAmountDescending),
  ];

  return (
    <div className={`w-full ${className}`}>
      <ul className="text-sm text-gray-700 space-y-1">
        {sortedEntries.map(([key, val]) => (
          <li key={key} className="flex justify-between">
            <span className="flex items-center gap-2 capitalize">
              {key.replace(/_/g, " ")}
              {lockedAddOnKeySet.has(key) && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Add-on
                </span>
              )}
            </span>
            <span>{formatMoney(val, currencySymbol)}</span>
          </li>
        ))}
      </ul>
      

      {addOnDisclaimer && hasLockedAddOns && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs leading-5 text-gray-600">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          {addOnDisclaimer && <span>{addOnDisclaimer}</span>}
        </div>
      )}

      {inclusiveOfAllTaxes && (
        <p className="mt-1.5 text-xs leading-5 text-gray-500">
          Fares shown are inclusive of applicable GST.
        </p>
      )}

      <div className="mt-3 text-xs text-gray-500">
        To know more about how we calculate the fare, please refer to our{" "}
        <a
          href={`${ROUTES.LEGAL}/fare-charges-policy`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          fare charges policy
        </a>
        .
      </div>
    </div>
  );
}

export { TripFareBreakdown };
