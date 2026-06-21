import { createElement } from "react";
import { PageHeader } from "@/components";
import { TRIP_OCCURENCE_LABELS } from "@/utils";
import { isDevMode } from "@/api";

const OCCURRENCE_CLASS_MAP = {
  [TRIP_OCCURENCE_LABELS.UPCOMING]:
    "border-blue-200 bg-blue-50 text-blue-700",
  [TRIP_OCCURENCE_LABELS.ONGOING]:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  [TRIP_OCCURENCE_LABELS.COMPLETED]:
    "border-gray-200 bg-gray-50 text-gray-700",
  [TRIP_OCCURENCE_LABELS.CANCELLED]:
    "border-red-200 bg-red-50 text-red-700",
  [TRIP_OCCURENCE_LABELS.PAST]:
    "border-gray-200 bg-gray-50 text-gray-700",
};

const VALID_OCCURRENCE_LABELS = Object.values(TRIP_OCCURENCE_LABELS);

function BookingDetailPageHeader({
  icon,
  tripLabel,
  bookingId,
  occurenceLabel, // upcoming, ongoing, completed, cancelled, past etc.
  onBack = () => {},
}) {
  const normalizedLabel =
    occurenceLabel && typeof occurenceLabel === "string" ? occurenceLabel.toLowerCase() : "";
  const hasValidLabel = VALID_OCCURRENCE_LABELS.includes(normalizedLabel);

  if (occurenceLabel && !hasValidLabel && isDevMode) {
    console.warn(
      `Invalid occurenceLabel "${occurenceLabel}" provided to BookingDetailPageHeader. Expected one of: ${VALID_OCCURRENCE_LABELS.join(", ")}.`,
    );
  }

  const statusTag = hasValidLabel ? (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${OCCURRENCE_CLASS_MAP[normalizedLabel]}`}
    >
      {normalizedLabel}
    </span>
  ) : null;

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
      tag={statusTag}
      subtitleClassName="break-all font-mono text-xs"
      className="px-0 mb-4"
    />
  );
}

export { BookingDetailPageHeader };
