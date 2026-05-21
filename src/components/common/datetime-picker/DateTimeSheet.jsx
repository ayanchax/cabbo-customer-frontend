import { useState, useRef } from "react";
import { useScrollCue } from "@/hooks";
import { CalendarGrid, TimeSlots } from "@/components/common/datetime-picker";

 

function DateTimeSheet({ open, onClose, value, onConfirm, minDateTime }) {
  const [draftDateTime, setDraftDateTime] = useState(value || null);
  const [atTop, atBottom, scrollRef, handleScroll] = useScrollCue({
    direction: "vertical",
    deps: [open, draftDateTime, minDateTime],
  });
  
  const timeSlotsRef = useRef(null);
  if (!open) return null;

  const handleSelectedDateChange = (date) => {
    if (!date) return;
    const next = new Date(draftDateTime || date);
    next.setFullYear(date.getFullYear());
    next.setMonth(date.getMonth());
    next.setDate(date.getDate());
    setDraftDateTime(next);
    // Auto-scroll to time slots if not already visible
    setTimeout(() => {
      if ( timeSlotsRef.current) {
        timeSlotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

   
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-slide-up transition ease-in-out duration-400">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-3xl rounded-t-2xl bg-white shadow-xl drop-shadow-2xl pt-2 px-2 sm:px-4 max-h-screen flex flex-col animate-slide-up"
      >
        {/* Sticky drag handle and header */}
        <div className="pt-1 pb-2 flex flex-col items-center shrink-0 bg-white z-10">
          <div className="h-1 w-10 rounded-full bg-neutral-300 mb-2" />
          <div className="text-base sm:text-lg font-semibold mb-1">Select pickup time</div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 flex flex-col relative">
          {/* Gradient overlays for scroll cue */}
          {!atTop && (
            <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white to-transparent z-20" />
          )}
          {!atBottom && (
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent z-20" />
          )}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-col gap-2 lg:flex-row lg:gap-4 lg:items-start overflow-auto max-h-[50vh] lg:max-h-[60vh] scrollbar-hide relative z-10"
          >
            <div className="w-full flex justify-center lg:w-1/2">
              <div className="w-full">
                <CalendarGrid
                  selectedDate={draftDateTime}
                  onSelect={handleSelectedDateChange}
                  minDateTime={minDateTime}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2" ref={timeSlotsRef}>
              <TimeSlots
                selectedDate={draftDateTime}
                selectedTime={draftDateTime}
                onSelect={(time) => {
                  setDraftDateTime(time);
                }}
                minDateTime={minDateTime}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer button */}
        <div className="pt-2 pb-1 bg-white z-10 shrink-0">
          <button
            type="button"
            disabled={!draftDateTime}
            onClick={() => {
              onConfirm(draftDateTime);
              onClose();
            }}
            className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition disabled:opacity-50 cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/75 focus:ring-opacity-30"
          >
            Confirm Pickup Time
          </button>
        </div>
      </div>
    </div>
  );
}

export { DateTimeSheet };
