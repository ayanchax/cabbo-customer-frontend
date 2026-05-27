import React from "react";
import { Info } from "lucide-react";

function TripDisclaimer({
  disclaimers = [],
  className = "",
  header = "Important Information",
}) {
  if (!disclaimers || disclaimers.length === 0) return null; // Don't render if no disclaimers provided
  return (
    <div className={`${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Info className="w-5 h-5 text-blue-400 mr-2" aria-hidden="true" />
          {header && (
            <span className="font-semibold text-gray-700 text-base sm:text-lg md:text-xl">
              {header}
            </span>
          )}
        </div>
        <ul className="list-disc pl-6 text-gray-600 text-sm sm:text-base space-y-1">
          {disclaimers.map((text, idx) => (
            <li key={idx}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { TripDisclaimer };
