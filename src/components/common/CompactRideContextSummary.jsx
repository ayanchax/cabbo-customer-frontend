import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  RotateCcw,
  Route,
  X,
} from "lucide-react";

const getHopLocation = (hop) => hop?.location ?? hop;

const getLocationLabel = (location) =>
  location?.display_name || location?.address || "Selected location";

const normalizeDatetime = (datetime) => {
  const iso = datetime?.isoString || datetime;

  if (!iso) return null;

  return !/Z$|[+-]\d{2}:\d{2}$/.test(iso) ? `${iso}Z` : iso;
};

const formatCompactDate = (datetime, timezone) => {
  const iso = normalizeDatetime(datetime);

  if (!iso) return null;

  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
};

const META_ITEM_ICONS = {
  distance: Route,
  roundTrip: RotateCcw,
  service: CheckCircle2,
  time: Clock,
};

const normalizeMetaItem = (item) => {
  if (!item) return null;

  if (typeof item === "string") {
    return {
      icon: MapPin,
      label: item,
    };
  }

  return {
    icon: item.icon || META_ITEM_ICONS[item.iconType] || MapPin,
    label: item.label,
  };
};

const buildRouteParts = ({
  pickupLocation,
  dropoffLocation,
  hops = [],
  showReturn = false,
}) => {
  const validHops = Array.isArray(hops)
    ? hops.map(getHopLocation).filter((location) => location?.display_name)
    : [];
  const originLabel = getLocationLabel(pickupLocation);
  const destinationLabel = getLocationLabel(dropoffLocation);
  const hasDestination = Boolean(dropoffLocation?.display_name || dropoffLocation?.address);

  if (!hasDestination) {
    return {
      parts: [originLabel],
      stopCount: validHops.length,
    };
  }

  if (validHops.length === 0 || !showReturn) {
    return {
      parts: [originLabel, destinationLabel].filter(Boolean),
      stopCount: 0,
    };
  }

  return {
    parts: [originLabel, destinationLabel].filter(Boolean),
    stopCount: validHops.length,
  };
};

function CompactRideContextSummary({
  pickupLocation = null,
  dropoffLocation = null,
  hops = [],
  showReturn = false,
  startDatetime = null,
  endDatetime = null,
  timezone = undefined,
  metaItems = [],
  note = null,
  children = null,
  className = "",
}) {
  const [showDetails, setShowDetails] = useState(false);
  const routeSummary = useMemo(
    () =>
      buildRouteParts({
        pickupLocation,
        dropoffLocation,
        hops,
        showReturn,
      }),
    [dropoffLocation, hops, pickupLocation, showReturn],
  );
  const routeParts = routeSummary.parts;
  const stopCount = routeSummary.stopCount;
  const startDateLabel = formatCompactDate(startDatetime, timezone);
  const endDateLabel = formatCompactDate(endDatetime, timezone);
  const dateLabel = [startDateLabel, endDateLabel].filter(Boolean).join(" - ");
  const visibleMetaItems = metaItems.map(normalizeMetaItem).filter((item) => item?.label);

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm ${className}`}
      aria-label="Trip summary"
    >
      

      <div className="flex min-w-0 items-center gap-2.5">
        <Route className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-sm font-semibold leading-5 text-gray-950">
          {routeParts.map((part, index) => (
            <React.Fragment key={`${part}-${index}`}>
              {index > 0 && (
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <span className="min-w-0 shrink truncate">{part}</span>
            </React.Fragment>
          ))}
        </div>

      </div>
      {stopCount > 0 && (
        <div className="mb-0.5 ml-6 truncate text-[12px] font-medium leading-4 text-gray-400">
          via {stopCount} {stopCount === 1 ? "stop" : "stops"}
        </div>
      )}

      <div className="mt-1.5 flex min-w-0 items-center gap-1 text-xs leading-4 text-gray-500">
        {dateLabel && (
          <>
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{dateLabel}</span>
          </>
        )}
      </div>

      {visibleMetaItems.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-4">
          {visibleMetaItems.map((item) => {
            const Icon = item.icon;

            return (
            <span
              key={item.label}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary/5 py-0.5 font-medium text-primary ring-1 ring-primary/10"
            >
              <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </span>
            );
          })}
        </div>
      )}

      {children && (
        <div className="mt-1.5">
          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary"
            aria-expanded={showDetails}
          >
            Trip details
          </button>
          {showDetails && (
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
              <div
                className="absolute inset-0 bg-slate-950/35"
                onClick={() => setShowDetails(false)}
                aria-hidden="true"
              />
              <div className="relative flex max-h-[82vh] w-full max-w-screen-sm flex-col rounded-t-3xl bg-white shadow-2xl animate-slide-up">
                <div className="shrink-0 rounded-t-3xl border-b border-gray-100 bg-white px-4 pt-3 pb-3">
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-gray-950">
                      Trip details
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowDetails(false)}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-50"
                      aria-label="Close trip details"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto px-4 py-4 scrollbar-hide">
                  {note && (
                    <p className="mb-4 flex gap-1.5 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs leading-5 text-gray-600">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <span>{note}</span>
                    </p>
                  )}
                  {children}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export { CompactRideContextSummary };
