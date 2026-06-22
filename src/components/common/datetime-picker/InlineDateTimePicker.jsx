import React, { useEffect, useMemo, useRef } from "react";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameDay,
  isToday,
  startOfDay,
} from "date-fns";
import {
  findSlotIdxByTime,
  generateTimeSlots,
  getIsoDateTime,
} from "@/components/common/datetime-picker/utils";
import { useScrollCue } from "@/hooks";

const GENERATE_DAYS_COUNT = 90;
const PICKER_HEIGHT = 60;
const ITEM_HEIGHT = 20;

const getValueDate = (value) => {
  if (value instanceof Date) return value;
  if (value?.datetime instanceof Date) return value.datetime;

  const dateValue = value?.isoString || value;
  if (typeof dateValue !== "string") return null;

  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

function InlineDateTimePicker({
  id,
  value = null,
  earliestStartDate,
  latestStartDate = null,
  onChange,
  onConfirm,
}) {
  if (!earliestStartDate) {
    throw new Error("Earliest start date is required to show date/time picker.");
  }

  const rootRef = useRef(null);
  const selectedValueDate = getValueDate(value);
  const emitChange = onChange || onConfirm;

  const generatedDaysCount = latestStartDate
    ? Math.max(
        1,
        Math.min(
          GENERATE_DAYS_COUNT,
          differenceInCalendarDays(
            startOfDay(latestStartDate),
            startOfDay(earliestStartDate),
          ) + 1,
        ),
      )
    : GENERATE_DAYS_COUNT;

  const days = useMemo(
    () =>
      Array.from({ length: generatedDaysCount }, (_, index) =>
        addDays(startOfDay(earliestStartDate), index),
      ),
    [earliestStartDate, generatedDaysCount],
  );

  const slotsByDay = useMemo(
    () =>
      days.map((day) =>
        generateTimeSlots({
          selectedDate: day,
          earliestStartDate,
          latestStartDate,
        }),
      ),
    [days, earliestStartDate, latestStartDate],
  );

  const firstAvailableDateIdx = slotsByDay.findIndex(
    (daySlots) => daySlots.length > 0,
  );
  const restoredDateIdx = selectedValueDate
    ? days.findIndex((day) => isSameDay(day, selectedValueDate))
    : -1;
  const canRestoreSelectedDate =
    restoredDateIdx >= 0 && slotsByDay[restoredDateIdx]?.length > 0;
  const selectedDateIdx = canRestoreSelectedDate
    ? restoredDateIdx
    : Math.max(firstAvailableDateIdx, 0);
  const slots = slotsByDay[selectedDateIdx] || [];
  const selectedTimeIdx = selectedValueDate
    ? findSlotIdxByTime(slots, selectedValueDate)
    : 0;
  const selectedDateTime = slots[selectedTimeIdx] || null;

  const emitSelection = (datetime) => {
    if (!datetime || typeof emitChange !== "function") return;

    emitChange({
      date: format(datetime, "EEE, dd MMM, yyyy"),
      datetime,
      isoString: getIsoDateTime(datetime),
    });
  };

  // Initialize an empty value, or recover an invalid/restored value that no
  // longer satisfies the current earliest-start constraint.
  useEffect(() => {
    if (!selectedDateTime || typeof emitChange !== "function") return;

    const selectedValueTime = selectedValueDate?.getTime();
    if (selectedValueTime !== selectedDateTime.getTime()) {
      emitSelection(selectedDateTime);
    }
    // emitSelection intentionally uses the latest callback supplied by parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateTime?.getTime(), selectedValueDate?.getTime(), emitChange]);

  const [atStartDate, atEndDate, dateListRef, handleDateScroll] = useScrollCue({
    direction: "vertical",
    deps: [selectedDateIdx],
  });
  const [atStartTime, atEndTime, timeListRef, handleTimeScroll] = useScrollCue({
    direction: "vertical",
    deps: [selectedTimeIdx, slots.length],
  });

  useEffect(() => {
    if (!timeListRef?.current) return;
    const buttons = timeListRef.current.querySelectorAll("button");
    buttons[selectedTimeIdx]?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedTimeIdx, selectedDateIdx, slots.length, timeListRef]);

  useEffect(() => {
    if (!dateListRef?.current) return;
    const buttons = dateListRef.current.querySelectorAll("button");
    buttons[selectedDateIdx]?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedDateIdx, days.length, dateListRef]);

  useEffect(() => {
    if (!id) return;
    const label = document.querySelector(`label[for='${id}']`);
    if (!label) return;

    const handler = () => rootRef.current?.focus();
    label.addEventListener("click", handler);
    return () => label.removeEventListener("click", handler);
  }, [id]);

  const handleDateSelect = (dateIdx) => {
    const targetSlots = slotsByDay[dateIdx];
    if (!targetSlots?.length) return;

    const preferredTime = selectedDateTime || selectedValueDate;
    const targetTimeIdx = findSlotIdxByTime(targetSlots, preferredTime);
    emitSelection(targetSlots[targetTimeIdx] || targetSlots[0]);
  };

  return (
    <div
      id={id}
      ref={rootRef}
      tabIndex={0}
      className="flex w-full flex-row items-center justify-center gap-6 rounded-md border border-dashed border-gray-400 p-3 text-xs transition-shadow focus:border-solid focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 xs:text-sm sm:text-base md:text-base lg:text-lg xl:text-xl"
    >
      <div className="relative w-32">
        {!atStartDate && (
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-6 w-full bg-linear-to-b from-white/90 to-transparent" />
        )}
        {!atEndDate && (
          <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-6 w-full bg-linear-to-t from-white/90 to-transparent" />
        )}
        <div
          ref={dateListRef}
          onScroll={handleDateScroll}
          className="scrollbar-hide flex w-full flex-col items-center overflow-y-auto"
          style={{ height: PICKER_HEIGHT }}
        >
          {days.map((date, idx) => {
            const isAvailable = slotsByDay[idx]?.length > 0;

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={!isAvailable}
                className={`my-0.5 flex h-10 w-full items-center justify-center rounded-full border px-2 text-sm transition sm:px-3 sm:text-base ${
                  idx === selectedDateIdx
                    ? "border-primary bg-primary font-bold text-white"
                    : "border-neutral-200 bg-white font-medium text-gray-500"
                } disabled:cursor-not-allowed disabled:opacity-35`}
                style={{ minHeight: ITEM_HEIGHT, maxHeight: ITEM_HEIGHT }}
                onClick={() => handleDateSelect(idx)}
              >
                {isToday(date) ? "Today" : format(date, "EEE, dd MMM")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative w-32">
        {!atStartTime && (
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-6 w-full bg-linear-to-b from-white/90 to-transparent" />
        )}
        {!atEndTime && (
          <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-6 w-full bg-linear-to-t from-white/90 to-transparent" />
        )}
        <div
          ref={timeListRef}
          onScroll={handleTimeScroll}
          className="scrollbar-hide flex w-full flex-col items-center overflow-y-auto"
          style={{ height: PICKER_HEIGHT }}
        >
          {slots.map((slot, idx) => (
            <button
              key={slot.toISOString()}
              type="button"
              className={`my-0.5 flex h-10 w-full cursor-pointer items-center justify-center rounded-full border px-2 font-mono text-sm transition sm:px-3 sm:text-base ${
                idx === selectedTimeIdx
                  ? "border-primary bg-primary font-bold text-white"
                  : "border-neutral-200 bg-white font-medium text-gray-500"
              }`}
              style={{ minHeight: ITEM_HEIGHT, maxHeight: ITEM_HEIGHT }}
              onClick={() => emitSelection(slot)}
            >
              {format(slot, "hh:mm a")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { InlineDateTimePicker };
