import React from "react";
import { CalendarDays } from "lucide-react";

function TotalTripDays({ totalTripDays }) {
  return (
    <div className="mt-2 mb-4 flex items-center gap-1.5 text-sm text-gray-600">
      <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>{totalTripDays}-day round trip</span>
    </div>
  );
}

export { TotalTripDays };
