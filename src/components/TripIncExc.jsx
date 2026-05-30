import React from "react";
import { Check, X } from "lucide-react";

function TripIncExc({ inclusions = [], exclusions = [], className = "" }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 w-full ${className}`}>
      {/* Inclusions */}
      {inclusions.length > 0 && (
        <div className="flex-1">
          <ul className="space-y-1">
            {inclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm sm:text-base text-gray-600"
              >
                <Check
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Divider for mobile if both inclusions and exclusions exist */}
      {inclusions.length > 0 && exclusions.length > 0 && (
        <div className="block sm:hidden my-1">
          <hr className="border-t border-gray-200" />
        </div>
      )}
      {/* Exclusions */}
      {exclusions.length > 0 && (
        <div className="flex-1">
          <ul className="space-y-1">
            {exclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm sm:text-base text-gray-600"
              >
                <X
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 shrink-0"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { TripIncExc };
