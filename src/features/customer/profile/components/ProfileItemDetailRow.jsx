import React from "react";

function ProfileItemDetailRow({
  icon: IconComponent,
  label,
  value,
  helper = null,
  badge = null,
  className = "",
}) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 ${className}`}>
      <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary ring-1 ring-blue-100">
        {React.createElement(IconComponent, {
          className: "h-4 w-4",
          "aria-hidden": true,
        })}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase text-gray-400">
            {label}
          </p>
          {badge}
        </div>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-950 sm:text-base">
          {value}
        </p>
        {helper && (
          <p className="mt-1 text-xs leading-5 text-gray-500">{helper}</p>
        )}
      </div>
    </div>
  );
}
export { ProfileItemDetailRow };
