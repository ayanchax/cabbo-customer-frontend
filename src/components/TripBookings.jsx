import React, { useState } from "react";
import {
  CalendarClock,
  CarFront,
  ChevronDown,
  ChevronRight,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  DEFAULT_USER_LOCALE,
  DEFAULT_USER_TIMEZONE,
  titleCase,
  TRIP_TYPES,
  TRIP_STATUS,
  TRIP_OCCURENCE_LABELS
} from "@/utils";
import { humanReadableDateTime } from "@/components/common/datetime-picker/utils";
import { useLocale, useTimezone } from "@/hooks";

import { NoRidesAvailable } from "@/components";

const STATUS_STYLES = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  ongoing: "bg-blue-50 text-blue-700 ring-blue-100",
  completed: "bg-gray-100 text-gray-700 ring-gray-200",
  cancelled: "bg-red-50 text-red-700 ring-red-100",
  closed: "bg-gray-100 text-gray-700 ring-gray-200",
  dispute: "bg-amber-50 text-amber-700 ring-amber-100",
  created: "bg-blue-50 text-blue-700 ring-blue-100",
  status_pending: "bg-amber-50 text-amber-700 ring-amber-100",
};

function getStatusClassName(status) {
  return STATUS_STYLES[status] || "bg-gray-100 text-gray-700 ring-gray-200";
}

function getDisplayStatus({ status, label }) {
  const isPastActiveStatus =
    label === TRIP_OCCURENCE_LABELS.PAST && [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(status);

  if (isPastActiveStatus) {
    return {
      key: "status_pending",
      label: "Status pending",
      whyLabel:"This trip has ended, but its payment status has not been updated yet."
    };
  }

  if (status === TRIP_STATUS.DISPUTED) {
    return {
      key: status,
      label: "In review",
      // Any disputed trips will be handled offline by the support
      // after due diligence between the parties
      // In case customer wants to know the reason for dispute, they can contact support
      // In case there is a refund applicable, it will be processed by the backend support team after due diligence.
      // No automation is possible for dispute resolution, hence the customer will have to contact support for more information.
      whyLabel: "This trip is currently under review due to a dispute. Please contact support for more information.",
    };
  }

  if([TRIP_STATUS.COMPLETED, TRIP_STATUS.CLOSED].includes(status)){
    const commonCompletedStatus =TRIP_STATUS.COMPLETED; 
    return {
      key: commonCompletedStatus,
      label: titleCase(commonCompletedStatus),
    };
  }
  // For all other statuses like cancelled, ongoing, return the status as is
  return {
    key: status,
    label: titleCase(status),
  };
}

function getRouteSummary(booking) {
  const { trip_type } = booking.trip_type || null;
  if (trip_type === TRIP_TYPES.LOCAL) {
    // just origin is enough for local trips
    const origin = booking?.origin?.display_name || "Pickup";
    return `${origin}`;
  }
  const origin = booking?.origin?.display_name || "Pickup";
  const destination = booking?.destination?.display_name || "Drop";
  return `${origin} to ${destination}`;
}

function getFleetLabel(booking) {
  const fleet = booking?.fleet || {};
  const carType = fleet.name || fleet.car_type || "Cab";
  const fuelType = fleet.fuel_type ? ` (${fleet.fuel_type})` : "";
  return `${carType}${fuelType}`;
}

function StatusPill({ displayStatus }) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${getStatusClassName(displayStatus.key)}`}
        >
          <span>{displayStatus.label}</span>
        </span>
        {displayStatus.whyLabel && (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-medium text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={(event) => {
              event.stopPropagation();
              setShowWhy((current) => !current);
            }}
            aria-expanded={showWhy}
          >
            Why?
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showWhy ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}
      </span>
      {displayStatus.whyLabel && showWhy && (
        <span className="max-w-sm rounded-md bg-gray-50 px-2 py-1 text-[11px] font-normal leading-4 text-gray-600 ring-1 ring-gray-100">
          {displayStatus.whyLabel}
        </span>
      )}
    </span>
  );
}

function TripBookingCard({
  booking,
  onSelect,
  locale = DEFAULT_USER_LOCALE,
  timezone = DEFAULT_USER_TIMEZONE,
  showLabel=false,
}) {
  const tripLabel = booking?.trip_type?.display_name || null;
  const tripType = booking?.trip_type?.trip_type || null;
  const status = booking?.status || null;
  const label = booking?.label || null;
  const currencySymbol = booking?.currency?.symbol || null;
  const price = booking?.final_price ?? null;
  const fareLabel = price !== null ? `${currencySymbol}${price}` : null;
  const datetime = booking?.start_datetime;
  const normalizedDatetime =
    datetime && !/Z$|[+-]\d{2}:\d{2}$/.test(datetime)
      ? { ...datetime, isoString: datetime + "Z" } // Append 'Z' to indicate UTC if no timezone is present, so conversion functions can handle it correctly
      : datetime;
  if (!normalizedDatetime) {
    console.warn(
      `Booking ${booking?.booking_id} has an invalid or missing start_datetime.`,
    );
    return null; // Skip rendering this booking card if datetime is invalid
  }

  if (!tripType || !tripLabel || !status || !currencySymbol || !price) {
    return null; // Skip rendering this booking card if essential data is missing
  }

  if (
    [
      TRIP_TYPES.AIRPORT_PICKUP,
      TRIP_TYPES.AIRPORT_DROPOFF,
      TRIP_TYPES.LOCAL,
      TRIP_TYPES.OUTSTATION,
    ].indexOf(tripType) === -1
  ) {
    return null; // Skip rendering this booking card if trip type is not recognized
  }

  const displayStatus = getDisplayStatus({ status, label });

  const handleCardKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect?.(booking);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(booking)}
      onKeyDown={handleCardKeyDown}
      className="group w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-950 sm:text-base">
              {tripLabel}
            </span>
            {status && <StatusPill displayStatus={displayStatus} />}
            {fareLabel && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                <span
                  className="h-1 w-1 rounded-full bg-gray-300"
                  aria-hidden="true"
                />
                <span>{fareLabel}</span>
              </span>
            )}
            {showLabel && label && label !== status && (
              <span className="inline-flex rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
                {titleCase(label)}
              </span>
            )}
            {/* For outstation trips have a round trip tag */}
            {tripType === TRIP_TYPES.OUTSTATION && booking?.is_round_trip && (
              <span className="inline-flex rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
                Round Trip
              </span>
            )}
          </div>

          <div className="mt-2 flex min-w-0 items-start gap-2 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-2">{getRouteSummary(booking)}</span>
          </div>
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-primary" />
      </div>

      <div className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-2 sm:items-center">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <CalendarClock className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">
            {humanReadableDateTime(normalizedDatetime, locale, timezone)}
          </span>
        </span>

        <span className="inline-flex min-w-0 items-center gap-1.5">
          <CarFront className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{getFleetLabel(booking)}</span>
        </span>
      </div>

      <div className="mt-3 border-t border-gray-100 pt-2 font-mono text-[11px] text-gray-400">
        Booking ID: {booking?.booking_id || "Unavailable"}
      </div>
    </div>
  );
}

function TripBookings({
  feedData = null,
  onSelectBooking,
  onRefresh,
  onNextPage,
  onPreviousPage,
  isRefreshing = false,
  showPaginationInfo = false,
  emptyTitle = "No trips found",
  emptyMessage = "Your bookings will appear here once they are available.",
}) {
  const { timezone: client_timezone } = useTimezone();
  const { locale } = useLocale();
  const trips = Array.isArray(feedData?.trips)
    ? feedData.trips
    : [];
  const pagination = feedData?.pagination || {};
  const hasPagination =
    Number.isFinite(Number(pagination?.page)) &&
    Number.isFinite(Number(pagination?.total_pages)) &&
    Number(pagination?.total_pages) > 1; // Show pagination controls only if there are multiple pages

  return (
    <div className="mx-auto w-full max-w-4xl">
      {(onRefresh || hasPagination) && (
        <div className="mb-3 flex items-center sm:justify-between justify-end gap-3">
          {hasPagination && showPaginationInfo ? (
            <p className="hidden text-xs text-gray-500 sm:block">
              Showing page {pagination.page} of {pagination.total_pages}
              {Number.isFinite(Number(pagination.total)) &&
                ` • ${pagination.total} trips`}
            </p>
          ) : (
            <span />
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex cursor-pointer h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Refresh trips"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center">
          <NoRidesAvailable title={emptyTitle} message={emptyMessage} />
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {trips.map((booking) => (
            <TripBookingCard
              key={booking?.booking_id}
              booking={booking}
              onSelect={onSelectBooking}
              locale={locale}
              timezone={
                client_timezone?.timezone ||
                booking?.timezone ||
                DEFAULT_USER_TIMEZONE
              }
            />
          ))}

          {hasPagination && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={!pagination?.has_previous}
                className="h-10 cursor-pointer rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onNextPage}
                disabled={!pagination?.has_next}
                className="h-10 cursor-pointer rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { TripBookings };
