import React from "react";
import { CalendarDays, Route } from "lucide-react";

function formatKm(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
  return Math.round(numericValue).toLocaleString("en-IN");
}

function OutstationPackage({ totalTripDays, includedKms = null }) {
  const formattedIncludedKms = formatKm(includedKms);

  return (
    <div className="mt-2 mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:text-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 font-medium ring-1 ring-gray-200">
        <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{totalTripDays}-day round trip</span>
      </span>

      {formattedIncludedKms && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-primary ring-1 ring-blue-100">
          <Route className="h-4 w-4" aria-hidden="true" />
          <span>{formattedIncludedKms} km package</span>
        </span>
      )}
    </div>
  );
}

export { OutstationPackage };
