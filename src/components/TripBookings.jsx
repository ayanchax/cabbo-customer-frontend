import React from "react";
import {
  CalendarClock,
  CarFront,
  ChevronRight,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE, titleCase} from "@/utils";
import {humanReadableDateTime} from "@/components/common/datetime-picker/utils";
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
};





function getStatusClassName(status) {
  return STATUS_STYLES[status] || "bg-gray-100 text-gray-700 ring-gray-200";
}

function getRouteSummary(booking) {
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

function TripBookingCard({ booking, onSelect, locale = DEFAULT_USER_LOCALE, timezone = DEFAULT_USER_TIMEZONE }) {
  const tripLabel = booking?.trip_type?.display_name || "Trip";
  const status = booking?.status || "";
  const label = booking?.label || "";
  const currencySymbol = booking?.currency?.symbol || "";
  const price = booking?.final_price ?? null;
  const datetime = booking?.start_datetime;
  const normalizedDatetime = datetime && !/Z$|[+-]\d{2}:\d{2}$/.test(datetime)
    ? { ...datetime, isoString: datetime + "Z" }
    : datetime;
  
  return (
    <button
      type="button"
      onClick={() => onSelect?.(booking)}
      className="group w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-950 sm:text-base">
              {tripLabel}
            </span>
            {status && (
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${getStatusClassName(status)}`}
              >
                {titleCase(status)}
              </span>
            )}
            {label && label !== status && (
              <span className="inline-flex rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
                {titleCase(label)}
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

      <div className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-3 sm:items-center">
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

        <span className="flex items-center justify-between gap-2 sm:justify-end">
          <span className="font-mono text-[11px] text-gray-400 sm:hidden">
            {booking?.booking_id}
          </span>
          {price !== null && (
            <span className="shrink-0 text-sm font-bold text-primary">
              {currencySymbol}
              {price}
            </span>
          )}
        </span>
      </div>

      <div className="mt-3 hidden border-t border-gray-100 pt-2 font-mono text-[11px] text-gray-400 sm:block">
        Booking ID: {booking?.booking_id || "Unavailable"}
      </div>
    </button>
  );
}

function TripBookings({
  feedData = null,
  onSelectBooking,
  onRefresh,
  onNextPage,
  onPreviousPage,
  isRefreshing = false,
  emptyTitle = "No trips found",
  emptyMessage = "Your bookings will appear here once they are available.",
  
}) {
  const { timezone: client_timezone } = useTimezone();
  const { locale } = useLocale();
  const trips = Array.isArray(feedData?.trips) ? feedData.trips : [];
  const pagination = feedData?.pagination || {};
  const hasPagination =
    Number.isFinite(Number(pagination?.page)) &&
    Number.isFinite(Number(pagination?.total_pages))
    && Number(pagination?.total_pages)>1; // Show pagination controls only if there are multiple pages

  return (
    <div className="mx-auto w-full max-w-4xl">
      {(onRefresh || hasPagination) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {hasPagination ? (
            <p className="text-xs text-gray-500">
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
          <NoRidesAvailable
            title={emptyTitle}
            message={emptyMessage}
          />
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
                client_timezone?.timezone || booking?.timezone || DEFAULT_USER_TIMEZONE
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
