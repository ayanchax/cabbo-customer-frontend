import React from "react";
import { Check } from "lucide-react";

function TogglePreference({
  id,
  checked = false,
  onChange,
  title = "Preference",
  description,
  icon: Icon,
  disabled = false,
  className = "",
  activeLabel = "On",
  inactiveLabel = "Off",
}) {
  const switchId = id || `toggle-preference-${title?.toLowerCase().replace(/\s+/g, "-")}`;
  const statusLabel = checked ? activeLabel : inactiveLabel;

  return (
    <div
      className={`w-full rounded-lg border border-gray-200 bg-gray-50/80 p-2.5 text-sm shadow-sm transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 sm:p-4 ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <div className="flex items-center justify-between gap-2.5 sm:gap-3">
        <label
          htmlFor={switchId}
          className={`flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-primary sm:h-9 sm:w-9">
              <Icon size={17} aria-hidden="true" />
            </span>
          )}

          <span className="min-w-0">
            <span className="block text-[13px] font-semibold leading-5 text-gray-800 sm:text-base">
              {title}
            </span>
            {description && (
              <span className="mt-0.5 block text-[11px] leading-4 text-gray-500 sm:mt-1 sm:text-sm sm:leading-5">
                {description}
              </span>
            )}
          </span>
        </label>

        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={`relative flex h-5.5 w-12.5 shrink-0 items-center rounded-full border p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed sm:h-8 sm:w-14.5 ${
            checked
              ? "border-primary bg-primary"
              : "border-gray-300 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 transition-transform sm:h-7 sm:w-7 ${
              checked
                ? "translate-x-5.5 ring-white/40 sm:translate-x-6"
                : "translate-x-0 text-gray-400 ring-gray-200"
            }`}
          >
            {checked && <Check size={15} aria-hidden="true" />}
          </span>
          <span className="sr-only">{statusLabel}</span>
        </button>
      </div>
    </div>
  );
}

export { TogglePreference };
