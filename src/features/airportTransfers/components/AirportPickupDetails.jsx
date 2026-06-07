import React, { useEffect, useRef } from "react";
import { IdCard, Plane, Signpost } from "lucide-react";
import { TogglePreference } from "@/components";
import { useUIElement } from "@/hooks";

function AirportPickupDetails({
  id = "airportPickupDetails",
  value = {
    flight_number: "",
    terminal_number: "",
    placard_required: false,
    placard_name: "",
  },
  onChange,
  showHeader = false,
}) {
  const rootRef = useRef(null);
  const placardNameInputRef = useRef(null);
  const { focusOnElement } = useUIElement();
  
  useEffect(() => {
    if (value.placard_required) {
      placardNameInputRef.current?.focus();
    }
  }, [value.placard_required]);

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

  const updateField = (field, fieldValue) => {
    const nextValue = {
      ...value,
      [field]: fieldValue,
    };

    if (field === "placard_required" && !fieldValue) {
      nextValue.placard_name = null;
    }

    onChange?.(nextValue);
  };

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-[0_1px_2px_rgba(16,30,54,0.04)] outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20";
  const requiredInputClass =
    "w-full rounded-md border border-primary/40 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-[0_1px_2px_rgba(16,30,54,0.04)] outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <div
     ref={rootRef}
      id={id}
      tabIndex={0}
      className="w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-sm shadow-sm transition-all focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 sm:p-4"
    >
      {showHeader && (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <Plane size={15} className="text-primary" aria-hidden="true" />
          <span>Arrival details</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
            <Plane size={14} className="text-primary" aria-hidden="true" />
            Flight number
          </span>
          <input
            id={`${id}-flight-number`}
            type="text"
            value={value.flight_number || ""}
            onChange={(event) =>
              updateField("flight_number", event.target.value || null)
            }
            placeholder="e.g. AI 123"
            autoComplete="off"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
            <Signpost size={14} className="text-primary" aria-hidden="true" />
            Terminal
          </span>
          <input
            id={`${id}-terminal-number`}
            type="text"
            value={value.terminal_number || ""}
            onChange={(event) =>
              updateField("terminal_number", event.target.value || null)
            }
            placeholder="e.g. T1"
            autoComplete="off"
            className={inputClass}
          />
        </label>

      </div>
      {/* Helper text for why a flight number and terminal are helpful */}
      <div className="mt-1.5 text-[11px] leading-4 text-gray-500 sm:text-xs">
        Providing your flight number and terminal helps your driver track your arrival to ensure a smooth and on-time pickup experience.
      </div>

      <div className="mt-3 border-t border-gray-200 pt-3">
        <TogglePreference
          id={`${id}-placard-required`}
          title="Meet with a name board"
          description="Your driver can meet you (or your guest) at arrivals with a name board. A nominal placard charge may apply."
          icon={IdCard}
          checked={Boolean(value.placard_required)}
          onChange={(checked) => updateField("placard_required", checked)}
          className="bg-white"
        />

        {value.placard_required && (
          <label className="mt-3 block rounded-md border border-blue-100 bg-blue-50/60 p-3">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
              <IdCard size={14} className="text-primary" aria-hidden="true" />
              Placard name
              <span className="text-primary">*</span>
            </span>
            <input
              ref={placardNameInputRef}
              id={`${id}-placard-name`}
              type="text"
              value={value.placard_name || ""}
              onChange={(event) =>
                updateField("placard_name", event.target.value || null)
              }
              placeholder="Name to show at arrivals"
              autoComplete="name"
              required
              className={requiredInputClass}
            />
            <span className="mt-1.5 block text-[11px] leading-4 text-gray-500 sm:text-xs">
              {value.placard_name && value.placard_name.trim() ? <strong>{value.placard_name}</strong> : "This"} is the name your driver will
              display at arrivals to identify you or your guest.
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

export { AirportPickupDetails };
