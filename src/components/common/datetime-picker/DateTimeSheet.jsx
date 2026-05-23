import { useState, useRef } from "react";
import { Clock3 } from "lucide-react";
import { CalendarGrid, TimeSlots } from "@/components/common/datetime-picker";

function DateTimeSheet({ open, onClose, value, onConfirm, minDateTime, type="pickup" }) {
  const [draftDateTime, setDraftDateTime] = useState(value || null);
  const [timeSlotSelected, setTimeSlotSelected] = useState(false);
  const [showScrollToSelection, setShowScrollToSelection] = useState(false);
  const timeSlotsRef = useRef(null);
  if (!open) return null;

  const handleTimeSlotVisibility = () => {
    if (timeSlotsRef.current) {
      const userHasScrolled = timeSlotsRef.current.getUserHasScrolled();
      const inView = timeSlotsRef.current.isSelectedSlotInView();
      if (!inView && userHasScrolled) {
        setShowScrollToSelection(true);
      } else if (!inView && !userHasScrolled) {
        // Auto-scroll if user hasn't scrolled
        timeSlotsRef.current.scrollToSelectedSlot();
        setShowScrollToSelection(false);
      } else {
        setShowScrollToSelection(false);
      }
    }
  };
  const handleSelectedDateChange = (date) => {
    if (!date) return;
    const next = new Date(draftDateTime || date);
    next.setFullYear(date.getFullYear());
    next.setMonth(date.getMonth());
    next.setDate(date.getDate());
    setDraftDateTime(next);
    // After date change, check if selected slot is in view and if user has scrolled
    setTimeout(() => {
      handleTimeSlotVisibility();
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-slide-up transition ease-in-out duration-400">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/*
        Mobile: full width, bottom drawer (default)
        Desktop (lg+): fixed bottom, centered, max-w-2xl, rounded top, shadow, bottom drawer look
      */}
      <div
        className="relative w-full rounded-t-2xl bg-white shadow-xl drop-shadow-2xl pt-2 px-4 max-h-screen flex flex-col animate-slide-up
        xl:max-w-2xl xl:fixed xl:left-1/2 xl:bottom-0 xl:top-auto xl:translate-x-[-50%] xl:rounded-b-none xl:rounded-t-3xl xl:shadow-2xl xl:drop-shadow-2xl xl:mx-auto xl:mb-0"
      >
        {/* Sticky drag handle and header */}
        <div className="pt-1 pb-2 flex flex-col items-center shrink-0 bg-white z-10">
          <div className="h-1 w-10 rounded-full bg-neutral-300 mb-2" />
          <div className="text-base sm:text-lg font-semibold mb-1">
            Choose date & time
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 flex flex-col relative">
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-4 lg:items-start overflow-auto max-h-[50vh] lg:max-h-[60vh] scrollbar-hide relative z-10">
            <div className="w-full flex justify-center lg:w-1/2">
              <div className="w-full">
                <CalendarGrid
                  selectedDate={draftDateTime}
                  onSelect={handleSelectedDateChange}
                  minDateTime={minDateTime}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              {showScrollToSelection && (
                <button
                  type="button"
                  title="Scroll to recently selected time"
                  aria-label="Scroll to recently selected time"
                  className="cursor-pointer fixed z-50 bottom-24 right-6 lg:bottom-16 lg:right-16 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/60"
                  onClick={() => {
                    if (timeSlotsRef.current) {
                      timeSlotsRef.current.scrollToSelectedSlot();
                      setShowScrollToSelection(false);
                    }
                  }}
                >
                  <Clock3 size={24} />
                </button>
              )}
              <TimeSlots
                ref={timeSlotsRef}
                selectedDate={draftDateTime}
                selectedTime={draftDateTime}
                onSelect={(time) => {
                  setDraftDateTime(time);
                  setShowScrollToSelection(false); // Hide button on new selection
                }}
                minDateTime={minDateTime}
                onSlotActiveChange={setTimeSlotSelected}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer button */}
        <div className="pt-2 pb-1 bg-white z-10 shrink-0">
          <button
            type="button"
            disabled={!draftDateTime || !timeSlotSelected}
            onClick={() => {
              onConfirm(draftDateTime);
              onClose();
            }}
            className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition disabled:opacity-50 cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/75 focus:ring-opacity-30 disabled:cursor-not-allowed"
          >
            Confirm your choice
          </button>
        </div>
      </div>
    </div>
  );
}

export { DateTimeSheet };
