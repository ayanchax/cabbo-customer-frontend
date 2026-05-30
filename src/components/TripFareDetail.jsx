import React from "react";
import { formatCurrency } from "@/utils";

function TripFareDetail({
  totalFare,
  payInAdvance,
  payToDriver,
  currencySymbol,
  totalFareLabel = "Total Fare",
  payInAdvanceLabel = "Pay in advance",
  payToDriverLabel = "Pay to Driver",
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 items-center w-full ${className}`}>
      <div className="text-xs md:text-sm uppercase tracking-wide text-gray-400 font-medium mb-1">
        {totalFareLabel}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-primary-700 flex items-baseline gap-1">
        {typeof totalFare === "number"
          ? formatCurrency(totalFare, currencySymbol)
          : "-"}
      </div>
      <div className="flex flex-row gap-4 mt-2 w-full justify-center">
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs md:text-sm text-gray-500">
            {payInAdvanceLabel}
          </span>
          <span className="text-lg font-semibold text-primary-600">
            {payInAdvance && typeof payInAdvance === "number"
              ? formatCurrency(payInAdvance, currencySymbol)
              : "-"}
          </span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs md:text-sm text-gray-500">
            {payToDriverLabel}
          </span>
          <span className="text-lg font-semibold text-gray-700">
            {payToDriver && typeof payToDriver === "number"
              ? formatCurrency(payToDriver, currencySymbol)
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

export { TripFareDetail };
