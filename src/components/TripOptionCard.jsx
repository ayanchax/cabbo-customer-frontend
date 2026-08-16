import React from "react";
import { DEFAULT_CURRENCY_CODE, formatMoney } from "@/utils";
import {  TripCabDetails } from "@/components";
function TripOptionCard({
  option = null,
  onSelect,
  fallbackCurrencySymbol = DEFAULT_CURRENCY_CODE,
  showRatePerKm = false,
  showRatePerMin = false,
  // eslint-disable-next-line no-unused-vars
  className = "",
}) {
  if (!option) return null;
  const isRecommended = Boolean(option?.car_capacity?.recommended);

  return (
    <button
      key={option.hash}
      className={`group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border bg-white px-4 py-4 text-left shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary sm:gap-7 ${
        isRecommended
          ? "border-emerald-200 shadow-[0_10px_30px_rgba(16,185,129,0.10)] ring-1 ring-emerald-100"
          : "border-gray-100"
      }`}
      onClick={onSelect ? () => onSelect(option) : undefined}
      style={{ minHeight: 88 }}
    >
      {isRecommended && (
        <span
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-primary to-blue-500"
          aria-hidden="true"
        />
      )}
      <TripCabDetails cabDetails={option} showRecommendation showRatePerKm={showRatePerKm} showRatePerMin={showRatePerMin} />
      
      {/* Price */}
      <div className="flex flex-col items-end ml-6 min-w-18">
        <span className="font-bold text-xl sm:text-2xl text-blue-600">
          {formatMoney(option.total_price, option?.currency?.code || fallbackCurrencySymbol)}
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
