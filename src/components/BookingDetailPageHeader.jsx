import { createElement } from "react";
import { PageHeader } from "@/components";

function BookingDetailPageHeader({
  icon,
  tripLabel,
  bookingId,
  onBack = () => {},
}) {
  return (
    <PageHeader
      onBack={onBack}
      title={
        <span className="flex items-center gap-2">
          {icon &&
            createElement(icon, {
              className: "h-5 w-5 text-primary",
              "aria-hidden": true,
            })}
          Your {tripLabel} booking
        </span>
      }
      subtitle={`Booking ID: ${bookingId || "Unavailable"}`}
      subtitleClassName="break-all font-mono text-xs"
      className="px-0 mb-4"
    />
  );
}

export { BookingDetailPageHeader };
