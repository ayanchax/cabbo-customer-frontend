import React, { useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { PassengerCounter } from "@/components";
import { useUIElement } from "@/hooks";
import {TRIP_TYPES} from "@/utils"
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
 * - tripType: string (optional, can be used to conditionally show/hide fields or change helper text based on trip type, e.g. airport transfer might show luggage fields by default)
 */
export function RideMetaDataPreferences({
  value = { num_adults: 1, num_children: 0 },
  id,
  onChange,
  showLuggage = false,
  minAdults = 1,
  maxAdults = 6,
  minChildren = 0,
  maxChildren = 4,
  helperText = "Tell us about your group and travel needs to help us match you with the most suitable ride",
  tripType, // can be used to conditionally show/hide certain fields or change helper text based on trip type (e.g., airport transfer might show luggage fields by default)
}) {
  const rootRef = useRef(null);
  const { focusOnElement } = useUIElement();
  const handleChange = (field, delta, min, max) => {
    const newValue = {
      ...value,
      [field]: Math.max(min, Math.min(max, (value[field] || 0) + delta)),
    };
    onChange?.(newValue);
  };
  // Focus root element when label[for=id] is clicked from parent
  useEffect(() => {
    if (!id) return;
    const label = document.querySelector(`label[for='${id}']`);

    if (!label) return;
    // eslint-disable-next-line no-unused-vars
    const handler = (e) => {
      focusOnElement(rootRef);
    };
    label.addEventListener("click", handler);
    return () => {
      label.removeEventListener("click", handler);
    };
  }, [id]);

  return (
    <div
      ref={rootRef}
      id={id}
      tabIndex={0}
      className="flex flex-col gap-2 bg-white rounded-lg border border-gray-100 p-3 shadow-sm w-full border-dashed  transition-shadow focus:outline-none focus:border-solid focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm sm:text-base"
    >
      {helperText && (
        <div className="flex items-center gap-2 mb-1 text-xs sm:text-sm text-gray-500">
          <Info size={20} className="text-blue-400" aria-hidden="true" />
          <span>{helperText}</span>
        </div>
      )}
      <div className="flex flex-row gap-x-8 justify-center items-center mt-2 mb-1">
        <div className="flex-1 flex flex-col items-center">
          <PassengerCounter
            passengerType="adults"
            count={value.num_adults}
            onChange={(newCount) =>
              handleChange(
                "num_adults",
                newCount - value.num_adults,
                minAdults,
                maxAdults,
              )
            }
            minusDisabled={value.num_adults <= minAdults}
            plusDisabled={value.num_adults >= maxAdults}
          />
        </div>
        <div className="flex-1 flex flex-col items-center">
          <PassengerCounter
            passengerType="children"
            count={value.num_children}
            onChange={(newCount) =>
              handleChange(
                "num_children",
                newCount - value.num_children,
                minChildren,
                maxChildren,
              )
            }
            minusDisabled={value.num_children <= minChildren}
            plusDisabled={value.num_children >= maxChildren}
          />
        </div>
      </div>
      {/* Luggage fields (future) */}
      {showLuggage && (
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          {/* Add luggage fields here as needed while doing airport and outstation bookings */}
        </div>
      )}
    </div>
  );
}
