import React from "react";
import { GridLoaderSkeleton } from "@/components";
function PackageCards({ packages, selectedPackageId, onSelect, loading }) {
  if (loading) {
    return <GridLoaderSkeleton rows={2} cols={2} />;
  }
  
  if (!packages || packages.length === 0) {
    throw new Error("No packages available for the selected date/time");
    // Error boundary will catch this and show fallback UI with option to change date/time
  }
  return (
    <div className="grid grid-cols-2 gap-3 w-full py-2">
      {packages.map((pkg) => {
        const selected = pkg.id === selectedPackageId;
        return (
          <button
            key={pkg.id}
            type="button"
            className={`h-28 flex flex-col justify-between items-start p-4 rounded-lg border transition shadow-sm text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/80 ${
              selected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "border-gray-300 bg-white hover:border-primary/60"
            }`}
            aria-pressed={selected}
            onClick={() => onSelect(pkg.id)}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">{pkg.included_hours}h</span>
              <span className="text-base font-semibold text-gray-700">/
                {pkg.included_km}km
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {pkg.best_intended_for}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export  {PackageCards};
