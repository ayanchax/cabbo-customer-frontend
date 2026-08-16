import React from "react";
import {humanReadableDateTime} from "@/components/common/datetime-picker/utils";
import { useLocale, useTimezone } from "@/hooks";
import { DEFAULT_USER_LOCALE,DEFAULT_USER_TIMEZONE } from "@/utils";

function RenderDatetime({ label, datetime, className, locale, timezone }) {
  if (!datetime) return null;
  // Server sends UTC datetimes without a timezone designator (e.g. "2026-07-01T03:30:00").
  // new Date() treats those as local time, so we append "Z" when no offset is present.
  const iso = datetime?.isoString;
  const normalizedDatetime = iso && !/Z$|[+-]\d{2}:\d{2}$/.test(iso)
    ? { ...datetime, isoString: iso + "Z" }
    : datetime;
  return (
    <div className={` ${className}`}>
      {label && (
        <h3 className="text-gray-500 text-sm md:text-base lg:text-md mb-1">{label}</h3>
      )}
      <p className="text-gray-900 font-medium text-base sm:text-lg md:text-xl lg:text-xl">
        {humanReadableDateTime(normalizedDatetime, locale, timezone)}
      </p>
    </div>
  );
}

function RideTimings({
  startDatetime = null,
  endDatetime = null,
  className = "",
  pickupLabel = "Pickup",
  dropoffLabel = "Dropoff",
  locale = undefined, // expected to be in IETF BCP 47 language tag format, e.g. "en-US". If not provided, will attempt to use client's locale or default to "en-US".
  timezone = undefined, // expected to be in tz database format, e.g. "Asia/Kolkata". If not provided, will attempt to use client's timezone or default to UTC.
}) {
  const { locale: userLocale } = useLocale();
  const effectiveLocale = locale || userLocale || DEFAULT_USER_LOCALE;

  const { timezone: tz_info } = useTimezone();
  const effectiveTimezone = timezone || (tz_info ? tz_info?.timezone : DEFAULT_USER_TIMEZONE);
  return (
    <>
      <RenderDatetime
        label={pickupLabel}
        datetime={startDatetime}
        className={className}
        locale={effectiveLocale}
        timezone={effectiveTimezone}
      />
      <RenderDatetime
        label={dropoffLabel}
        datetime={endDatetime}
        className={className}
        locale={effectiveLocale}
        timezone={effectiveTimezone}
      />
    </>
  );
}

export { RideTimings };
