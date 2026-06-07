import React from "react";
import { CheckCircle2 } from "lucide-react";

function IncludedServicePills({
  services = [],
  title = "Fare includes",
  className = "",
}) {
  const visibleServices = services.filter(Boolean);

  if (visibleServices.length === 0) return null;

  return (
    <div
      className={`rounded-md border border-blue-100 bg-blue-50/50 px-2.5 py-2 shadow-[0_1px_2px_rgba(16,30,54,0.04)] sm:px-3 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-[11px] font-semibold uppercase leading-4 tracking-wide text-gray-500 sm:text-xs">
          {title}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {visibleServices.map((service) => {
            const Icon = service.icon || CheckCircle2;

            return (
              <span
                key={service.id || service.label}
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-semibold leading-4 text-primary shadow-sm sm:px-2.5 sm:py-1 sm:text-xs"
              >
                <Icon size={13} aria-hidden="true" />
                {service.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { IncludedServicePills };
