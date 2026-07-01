import React from "react";

function ProfileStat({ icon: IconComponent, label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
      {React.createElement(IconComponent, {
        className: "h-4 w-4 shrink-0 text-primary",
        "aria-hidden": true,
      })}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
export { ProfileStat };