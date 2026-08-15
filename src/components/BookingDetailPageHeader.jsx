import { createElement } from "react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components";
import { TRIP_OCCURENCE_LABELS, TRIP_STATUS } from "@/utils";
import { isDevMode } from "@/api";

const OCCURRENCE_CLASS_MAP = {
  [TRIP_OCCURENCE_LABELS.UPCOMING]: "border-blue-200 bg-blue-50 text-blue-700",
  [TRIP_OCCURENCE_LABELS.ONGOING]:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  [TRIP_OCCURENCE_LABELS.COMPLETED]: "border-teal-200 bg-teal-50 text-teal-700",
  [TRIP_OCCURENCE_LABELS.CANCELLED]: "border-red-200 bg-red-50 text-red-700",
  [TRIP_OCCURENCE_LABELS.PAST]: "border-gray-200 bg-gray-50 text-gray-700",
  [TRIP_STATUS.DISPUTED]: "border-yellow-200 bg-yellow-50 text-yellow-700",
  [TRIP_STATUS.CONFIRMED]: "border-blue-200 bg-blue-50 text-blue-700",
};

const VALID_OCCURRENCE_LABELS = Object.values(TRIP_OCCURENCE_LABELS).concat(
  Object.values(TRIP_STATUS),
);

function BookingDetailPageHeader({
  icon,
  tripLabel,
  bookingId,
  occurenceLabel, // upcoming, ongoing, completed, cancelled, past etc.
  onBack = () => {},
}) {
  const normalizedLabel =
    occurenceLabel && typeof occurenceLabel === "string"
      ? occurenceLabel.toLowerCase()
      : "";

  const getNormalizedLabel = () => {
   
    if (normalizedLabel && normalizedLabel === TRIP_STATUS.DISPUTED) {
      return "in review";
    }
    return normalizedLabel;
  };

  const hasValidLabel = VALID_OCCURRENCE_LABELS.includes(normalizedLabel);

  if (occurenceLabel && !hasValidLabel && isDevMode) {
    console.warn(
      `Invalid occurenceLabel "${occurenceLabel}" provided to BookingDetailPageHeader. Expected one of: ${VALID_OCCURRENCE_LABELS.join(", ")}.`,
    );
  }

  const statusTagClassName = hasValidLabel
    ? `inline-flex items-center rounded-full border font-semibold capitalize ${OCCURRENCE_CLASS_MAP[normalizedLabel]}`
    : "";

  const statusTag = hasValidLabel ? (
    <span className={`${statusTagClassName} px-2 py-0.5 text-xs`}>
      {getNormalizedLabel()}
    </span>
  ) : null;

  const mobileStatusTag = hasValidLabel ? (
    <span
      className={`${statusTagClassName} mt-0.5 shrink-0 px-1.5 py-0 text-[10px] leading-4`}
    >
      {getNormalizedLabel()}
    </span>
  ) : null;

  return (
    <div className="mb-2">
      <div className="sm:hidden">
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-1.5">
          {onBack && (
            <button
              className="mt-1 flex shrink-0 items-center text-primary"
              onClick={onBack}
              type="button"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <h2 className="min-w-0 text-base font-bold leading-tight text-gray-950">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              {icon &&
                createElement(icon, {
                  className: "h-4 w-4 shrink-0 text-primary",
                  "aria-hidden": true,
                })}
              <span>Your {tripLabel} booking</span>
            </span>
          </h2>
          {mobileStatusTag}
        </div>
        <p
          className="ml-5 mt-0.5 min-w-0 truncate font-mono text-xs text-gray-500"
          title={`Booking ID: ${bookingId || "Unavailable"}`}
        >
          Booking ID: {bookingId || "Unavailable"}
        </p>
      </div>

      <div className="hidden sm:block">
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
          className="px-0 mb-0"
        />
      </div>
    </div>
  );
}

export { BookingDetailPageHeader };
