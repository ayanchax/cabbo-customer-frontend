import {
  addMinutes,
  format,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';
import { TIME_SLOT_START_HOUR, TIME_SLOT_END_HOUR, DEFAULT_MINUTE_STEP } from '@/components/common/datetime-picker';

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
  minDateTime,
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

      if (minDateTime && isBefore(slot, minDateTime)) {
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