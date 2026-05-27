import {
  addMinutes,
  format,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';
import { TIME_SLOT_START_HOUR, TIME_SLOT_END_HOUR, DEFAULT_MINUTE_STEP } from '@/components/common/datetime-picker';
import { isDevMode } from "@/api";


export function roundToNextStep(date, step = DEFAULT_MINUTE_STEP) {
  const d = new Date(date);
  d.setSeconds(0, 0); // Always reset seconds and ms
  const minutes = d.getMinutes();
  const remainder = minutes % step;
  if (remainder === 0) return d;
  return addMinutes(d, step - remainder);
}

export function formatDisplayDate(date) {
  if (!date) return '';

  return format(date, 'EEE, d MMM • hh:mm a');
}

export function generateTimeSlots({
  selectedDate,
  earliestStartDate,
  step = DEFAULT_MINUTE_STEP,
}) {
  if (!selectedDate) return [];

  const slots = [];

  const now = new Date();

  let startHour = TIME_SLOT_START_HOUR;

  for (let hour = startHour; hour <= TIME_SLOT_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      let slot = setHours(startOfDay(selectedDate), hour);
      slot = setMinutes(slot, minute);

      if (earliestStartDate && isBefore(slot, earliestStartDate)) {
        // If slot is before the minimum date time, skip it
        continue;
      }

      if (isBefore(slot, now)) {
        // Is slot in the past? If so, skip it
        continue;
      }

      slots.push(slot);
    }
  }
  return slots;
}


// Find index of slot matching lastSelectedTime (hour/minute), fallback to 0
export const findSlotIdxByTime = (slotsArr, time) => {
  if (!time) return 0;
  const h = time.getHours();
  const m = time.getMinutes();
  const idx = slotsArr.findIndex(
    (s) => s.getHours() === h && s.getMinutes() === m
  );
  return idx !== -1 ? idx : 0;
}

/**
 * Returns a local-time ISO-like string (YYYY-MM-DDTHH:mm:ss) for a JS Date object.
 *
 * This does NOT convert to UTC or append a timezone. It simply formats the date/time
 * as it appears in the local system clock, matching common backend expectations for
 * naive datetimes (e.g., '2026-05-25T06:00:00').
 *
 * Use this when your backend expects local time and will handle timezone conversion.
 *
 * @param {Date} datetime - A JavaScript Date object (local time).
 * @returns {string|null} ISO-like string in local time, or null if input is invalid.
 */
export const getIsoDateTime = (datetime) => {
  try {
    if (!datetime) return null;
    const pad = n => n.toString().padStart(2, '0');
    return (
      datetime.getFullYear() +
      '-' + pad(datetime.getMonth() + 1) +
      '-' + pad(datetime.getDate()) +
      'T' + pad(datetime.getHours()) +
      ':' + pad(datetime.getMinutes()) +
      ':' + pad(datetime.getSeconds())
    );
  } catch (e) {
    if (isDevMode) {
      console.error("Error converting datetime to ISO string:", e);
    }
    return null;
  }
}

export const humanReadableDateTime = (datetime, locale = undefined , timezone = undefined) => {
  if (!datetime?.isoString) return "";
  return new Date(datetime.isoString).toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}