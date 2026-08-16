import React, { useRef, useEffect } from "react";
import { Briefcase, Info, Users } from "lucide-react";
import { PassengerCounter, LuggageCounter } from "@/components";
import { useUIElement } from "@/hooks";
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
 * - showTollRoadPreference: boolean (default: false) - whether to show toll road preference toggle, can be used for airport rides where this is more relevant
 * - minAdults: number (default: 1)
 * - maxAdults: number (default: 6)
 * - minChildren: number (default: 0)
 * - maxChildren: number (default: 4)
 * - minLargeSuitcases: number (default: 0)
 * - maxLargeSuitcases: number (default: 4)
 * - minCarryOns: number (default: 0)
 * - maxCarryOns: number (default: 4)
 * - minBackpacks: number (default: 0)
 * - maxBackpacks: number (default: 4)
 * - minOtherBags: number (default: 0)
 * - maxOtherBags: number (default: 4)
 * - helperText: string (optional, user-friendly message)
 * - tripType: string (optional, can be used to conditionally show/hide fields or change helper text based on trip type, e.g. airport transfer might show luggage fields by default)
 */
export function RideMetaDataPreferences({
  value = {
    num_adults: 1,
    num_children: 0,
    num_large_suitcases: 0,
    num_carryons: 0,
    num_backpacks: 0,
    num_other_bags: 0,
  },
  id,
  onChange,
  showLuggage = false,
  minAdults = 1,
  maxAdults = 6,
  minChildren = 0,
  maxChildren = 4,
  minLargeSuitcases = 0,
  maxLargeSuitcases = 5,
  minCarryOns = 0,
  maxCarryOns = 4,
  minBackpacks = 0,
  maxBackpacks = 3,
  minOtherBags = 0,
  maxOtherBags = 2,
  helperText = "Tell us about your group and travel needs to help us match you with the most suitable ride",
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
    const handler = () => {
      focusOnElement(rootRef);
    };
    label.addEventListener("click", handler);
    return () => {
      label.removeEventListener("click", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const preferenceItemClass =
    "min-w-0 rounded-md border border-gray-100 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(16,30,54,0.04)]";
  const counterContentClass = "mx-auto w-fit";

  return (
    <div
      ref={rootRef}
      id={id}
      tabIndex={0}
      className="w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-sm shadow-sm transition-all focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:p-4"
    >
      {helperText && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs leading-5 text-gray-600 sm:text-sm">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-blue-500"
            aria-hidden="true"
          />
          <span>{helperText}</span>
        </div>
      )}

      <div className="space-y-4">
        <section aria-labelledby={`${id || "ride-preferences"}-passengers`}>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <Users size={15} className="text-primary" aria-hidden="true" />
            <span id={`${id || "ride-preferences"}-passengers`}>
              People
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
            <div className={preferenceItemClass}>
              <div className={counterContentClass}>
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
            </div>
            <div className={preferenceItemClass}>
              <div className={counterContentClass}>
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
          </div>
        </section>

        {showLuggage && (
          <section aria-labelledby={`${id || "ride-preferences"}-luggage`}>
            <div className="mb-2 flex items-center gap-2 border-t border-gray-200 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <Briefcase
                size={15}
                className="text-primary"
                aria-hidden="true"
              />
              <span id={`${id || "ride-preferences"}-luggage`}>Luggage</span>
            </div>

            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 lg:grid-cols-4">
              <div className={preferenceItemClass}>
                <div className={counterContentClass}>
                  <LuggageCounter
                    luggageType="large suitcases"
                    count={value.num_large_suitcases}
                    onChange={(newCount) =>
                      handleChange(
                        "num_large_suitcases",
                        newCount - value.num_large_suitcases,
                        minLargeSuitcases,
                        maxLargeSuitcases,
                      )
                    }
                    minusDisabled={
                      value.num_large_suitcases <= minLargeSuitcases
                    }
                    plusDisabled={
                      value.num_large_suitcases >= maxLargeSuitcases
                    }
                  />
                </div>
              </div>
              <div className={preferenceItemClass}>
                <div className={counterContentClass}>
                  <LuggageCounter
                    luggageType="carry-ons"
                    count={value.num_carryons}
                    onChange={(newCount) =>
                      handleChange(
                        "num_carryons",
                        newCount - value.num_carryons,
                        minCarryOns,
                        maxCarryOns,
                      )
                    }
                    minusDisabled={value.num_carryons <= minCarryOns}
                    plusDisabled={value.num_carryons >= maxCarryOns}
                  />
                </div>
              </div>
              <div className={preferenceItemClass}>
                <div className={counterContentClass}>
                  <LuggageCounter
                    luggageType="backpacks"
                    count={value.num_backpacks}
                    onChange={(newCount) =>
                      handleChange(
                        "num_backpacks",
                        newCount - value.num_backpacks,
                        minBackpacks,
                        maxBackpacks,
                      )
                    }
                    minusDisabled={value.num_backpacks <= minBackpacks}
                    plusDisabled={value.num_backpacks >= maxBackpacks}
                  />
                </div>
              </div>
              <div className={preferenceItemClass}>
                <div className={counterContentClass}>
                  <LuggageCounter
                    luggageType="other bags"
                    count={value.num_other_bags}
                    onChange={(newCount) =>
                      handleChange(
                        "num_other_bags",
                        newCount - value.num_other_bags,
                        minOtherBags,
                        maxOtherBags,
                      )
                    }
                    minusDisabled={value.num_other_bags <= minOtherBags}
                    plusDisabled={value.num_other_bags >= maxOtherBags}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
