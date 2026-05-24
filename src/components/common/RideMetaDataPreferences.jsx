
import React from "react";
import { Info } from "lucide-react";
import { PassengerCounter } from "@/components";

/**
 * RideMetaDataPreferences
 *
 * A reusable, modern, responsive input block for ride search/booking metadata.
 * Handles number of adults, children, and (optionally) luggage fields.
 *
 * Props:
 * - value: { num_adults, num_children, ... }
 * - onChange: (newValue) => void
 * - showLuggage: boolean (default: false)
 * - minAdults: number (default: 1)
 * - maxAdults: number (default: 6)
 * - minChildren: number (default: 0)
 * - maxChildren: number (default: 4)
 * - helperText: string (optional, user-friendly message)
 */
export function RideMetaDataPreferences({
  value = { num_adults: 1, num_children: 0 },
  onChange,
  showLuggage = false,
  minAdults = 1,
  maxAdults = 6,
  minChildren = 0,
  maxChildren = 4,
  helperText='Tell us about your group and travel needs to help us match you with the most suitable ride',
}) {
  const handleChange = (field, delta, min, max) => {
    const newValue = {
      ...value,
      [field]: Math.max(min, Math.min(max, (value[field] || 0) + delta)),
    };
    onChange?.(newValue);
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-lg border border-gray-100 p-3 shadow-sm max-w-md w-full">
      {helperText && (
        <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
          <Info size={16} className="text-blue-400" aria-hidden="true" />
          <span>{helperText}</span>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <PassengerCounter
          passengerType="adults"
          count={value.num_adults}
          onChange={newCount => handleChange("num_adults", newCount - value.num_adults, minAdults, maxAdults)}
          minusDisabled={value.num_adults <= minAdults} // Prevent reducing adults if it would also reduce children below minimum
          plusDisabled={value.num_adults >= maxAdults } // Prevent increasing adults if at max or if it would allow reducing adults below minimum while having children
        />
        <PassengerCounter
          passengerType="children"
          count={value.num_children}
          onChange={newCount => handleChange("num_children", newCount - value.num_children, minChildren, maxChildren)}
          minusDisabled={value.num_children <= minChildren} // Prevent reducing children below minimum
          plusDisabled={value.num_children >= maxChildren} // Prevent increasing children above maximum
        />
      </div>
      {/* Luggage fields (future) */}
      {showLuggage && (
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          {/* Add luggage fields here as needed */}
        </div>
      )}
    </div>
  );
}
