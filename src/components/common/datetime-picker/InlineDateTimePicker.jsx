import React, { useState, useMemo, useEffect , useRef} from "react";
import { format, addDays, isToday } from "date-fns";
import { generateTimeSlots, findSlotIdxByTime, getIsoDateTime } from "@/components/common/datetime-picker/utils";
import { useScrollCue } from "@/hooks";

const GENERATE_DAYS_COUNT = 90;
function InlineDateTimePicker({ id, earliestRentalStartDate, onConfirm }) {
  if(!earliestRentalStartDate) {
    throw new Error("Earliest rental start date is required to show date/time picker.");
    // Error Boundary can catch this and show user-friendly fallback UI
  }
  // Height for the picker (show 3 items, center is selected)
  const pickerHeight = 60; // px
  
  // Each item has fixed height to simplify scroll calculations
  const itemHeight = 20; // px

  // Ref for the root element for focus
  const rootRef = useRef(null);

  // Generate next 90 days from earliestRentalStartDate
  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < GENERATE_DAYS_COUNT; i++) {
      arr.push(addDays(earliestRentalStartDate || new Date(), i));
    }
    return arr;
  }, [earliestRentalStartDate]);
  

  // State for selected date index and selected date
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const selectedDate = days[selectedDateIdx];

  // Track last selected time (hour/minute) to preserve across date changes
  const [lastSelectedTime, setLastSelectedTime] = useState(null);

  // Generate slots for selected date
  const slots = useMemo(() => {
    const timeSlots = generateTimeSlots({ selectedDate, earliestStartDate: earliestRentalStartDate });
    if (!timeSlots || timeSlots.length === 0) {
      throw new Error("No available time slots for the selected date.");
      // Error Boundary can catch this and show user-friendly fallback UI
    }
    return timeSlots;
  }, [selectedDate, earliestRentalStartDate]);
   

  
  // State for selected time index
  const [selectedTimeIdx, setSelectedTimeIdx] = useState(0);

  // Scroll selected time into view after slot regeneration
  const timeListRefObj = useRef();

  // Use useScrollCue for vertical scroll cues
  const [atStartDate, atEndDate, dateListRef, handleDateScroll] = useScrollCue({
    direction: "vertical",
    deps: [selectedDateIdx],
  });
  const [atStartTime, atEndTime, timeListRef, handleTimeScroll] = useScrollCue({
    direction: "vertical",
    deps: [selectedTimeIdx, slots.length],
  });

  // Keep timeListRef in sync for scrolling
  useEffect(() => {
    if (typeof timeListRef === "function") {
      timeListRefObj.current = { current: null };
      // fallback if useScrollCue returns a callback ref
    } else {
      timeListRefObj.current = timeListRef;
    }
  }, [timeListRef]);

  // When selectedDateIdx changes, try to preserve selected time
  useEffect(() => {
    // Only run on date change
    // eslint-disable-next-line no-unused-vars
    setSelectedTimeIdx((prevIdx) => {
      const idx = findSlotIdxByTime(slots, lastSelectedTime);
      return idx;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateIdx, slots.length]);

  // When selectedTimeIdx changes, update lastSelectedTime
  useEffect(() => {
    setLastSelectedTime(slots[selectedTimeIdx]);
  }, [selectedTimeIdx, slots]);

  // Call onConfirm whenever date or time changes
  useEffect(() => {
    if (typeof onConfirm === "function") {
      // Only the date part (00:00:00) for 'date', full Date for 'datetime', and ISO string for API payload
      const dateOnly = format(selectedDate, "EEE, dd MMM, yyyy");
      const datetime = slots[selectedTimeIdx];
      // Compose ISO string: combine dateOnly and time from datetime
      let isoString = null;
      if (datetime) {
        isoString = getIsoDateTime(datetime);
      }
      onConfirm({ date: dateOnly, datetime, isoString });
    }
  }, [selectedDate, selectedTimeIdx, slots, onConfirm]);

  // Scroll selected time into view after slot regeneration or time change
  useEffect(() => {
    const ref = timeListRefObj.current;
    if (ref && ref.current) {
      const btns = ref.current.querySelectorAll("button");
      if (btns[selectedTimeIdx]) {
        btns[selectedTimeIdx].scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [selectedTimeIdx, selectedDateIdx, slots.length]);

  // Scroll selected date into view when selectedDateIdx changes
  useEffect(() => {
    if (dateListRef && dateListRef.current) {
      const btns = dateListRef.current.querySelectorAll("button");
      if (btns[selectedDateIdx]) {
        btns[selectedDateIdx].scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateIdx, selectedTimeIdx, days.length]);

  // Focus root element when label[for=id] is clicked from parent
  useEffect(() => {
    if (!id) return;
    const label = document.querySelector(`label[for='${id}']`);
    
    if (!label) return;
    // eslint-disable-next-line no-unused-vars
    const handler = (e) => {
      if (rootRef.current) {
        rootRef.current.focus();
      }
    };
    handler() // Focus on mount in case label was clicked before component rendered
    label.addEventListener('click', handler);
    return () => {
      label.removeEventListener('click', handler);
    };
  }, [id]);

  return (
    <div
      id={id}
      ref={rootRef}
      tabIndex={0}
      className="flex flex-row gap-6 items-center w-full justify-center border border-dashed border-gray-400 rounded-md p-3 transition-shadow focus:outline-none focus:border-solid focus:border-primary focus:ring-2 focus:ring-primary/40"
    >
      {/* Date Picker */}
      <div className="relative w-32" >
        {/* Gradients for scroll cue */}
        {!atStartDate && (
          <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-linear-to-b from-white/90 to-transparent z-10" />
        )}
        {!atEndDate && (
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-linear-to-t from-white/90 to-transparent z-10" />
        )}
        <div
          ref={dateListRef}
          onScroll={handleDateScroll}
          className="flex flex-col overflow-y-auto scrollbar-hide items-center w-full"
          style={{ height: pickerHeight }}
        >
          {days.map((date, idx) => (
            <button
              key={date.toISOString()}
              className={`w-full h-10 flex items-center justify-center transition rounded-full border text-sm my-0.5
                ${idx === selectedDateIdx ? "bg-primary text-white border-primary font-bold" : "bg-white border-neutral-200 text-gray-500"}
              `}
              style={{ minHeight: itemHeight, maxHeight: itemHeight }}
              onClick={() => setSelectedDateIdx(idx)}
            >
              {isToday(date) ? "Today" : format(date, "EEE, dd MMM")}
            </button>
          ))}
        </div>
      </div>
      {/* Time Picker */}
      <div className="relative w-32">
        {!atStartTime && (
          <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-linear-to-b from-white/90 to-transparent z-10" />
        )}
        {!atEndTime && (
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-linear-to-t from-white/90 to-transparent z-10" />
        )}
        <div
          ref={timeListRef}
          onScroll={handleTimeScroll}
          className="flex flex-col overflow-y-auto scrollbar-hide items-center w-full"
          style={{ height: pickerHeight }}
        >
          {slots.map((slot, idx) => (
            <button
              key={slot.toISOString()}
              className={`w-full h-10 flex items-center justify-center transition rounded-full border font-mono text-sm my-0.5
                ${idx === selectedTimeIdx ? "bg-primary text-white border-primary font-bold" : "bg-white border-neutral-200 text-gray-500"}
              `}
              style={{ minHeight: itemHeight, maxHeight: itemHeight }}
              onClick={() => setSelectedTimeIdx(idx)}
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
