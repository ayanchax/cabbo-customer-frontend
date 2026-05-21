import { useScrollCue } from "@/hooks";
import { format } from "date-fns";
import { generateTimeSlots } from "@/components/common/datetime-picker/utils";

function TimeSlots({ selectedDate, selectedTime, onSelect, minDateTime }) {
  // For vertical scroll cue (desktop and larger screens)
  const [atTop, atBottom, vertScrollRef, handleVertScroll] = useScrollCue({
    direction: "vertical",
    deps: [selectedDate, minDateTime],
  });
  // For horizontal scroll cue (mobile/tablet)
  const [atStart, atEnd, horizScrollRef, handleHorizScroll] = useScrollCue({
    direction: "horizontal",
    deps: [selectedDate, minDateTime],
  });
  // Generate a 24 hour time slots for the selected date.
  // This shows time slots from 12:00 AM to 11:45 PM with a step of 15 minutes, if selected date is after the minDateTime. Otherwise, it shows time slots starting from the next available slot after minDateTime.
  const slots = generateTimeSlots({
    selectedDate,
    minDateTime,
  });

 

  return (
    <div className="mt-6">
      {slots.length > 0 && (
        <>
          <div className="text-sm font-medium mb-3">Available times</div>
          <div className="relative">
            {/* Gradient overlays for scroll cue */}
            {/* Horizontal gradient for mobile/tablet */}
            {!atStart && (
              <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-linear-to-r from-white to-transparent lg:hidden z-10" />
            )}
            {!atEnd && (
              <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-linear-to-l from-white to-transparent lg:hidden z-10" />
            )}
            {/* Vertical gradient for laptop/desktop */}
            {!atTop && (
              <div className="pointer-events-none absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-white to-transparent hidden lg:block z-20" />
            )}
            {!atBottom && (
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent hidden lg:block z-20" />
            )}

            {/* Responsive slot scroller: horizontal on mobile/tablet, hidden on lg+ */}
            <div
              ref={horizScrollRef}
              onScroll={handleHorizScroll}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth lg:hidden overflow-scrolling-touch"
            >
              {slots.map((slot) => {
                const active = selectedTime?.getTime() === slot.getTime();
                return (
                  <button
                    key={slot.toISOString()}
                    type="button"
                    onClick={() => onSelect(slot)}
                    className={`font-mono shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "bg-black text-white border-black"
                        : "bg-white border-neutral-200"
                    }`}
                  >
                    {format(slot, "hh:mm a")}
                  </button>
                );
              })}
            </div>

            {/* Laptop/Desktop/Larger displays slot scroller: vertical on lg+, hidden on smaller screens */}
            <div className="hidden lg:block relative w-full">
                {/* Circular border for roundy effect */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-neutral-300 opacity-30 z-0" />
              <div
                ref={vertScrollRef}
                onScroll={handleVertScroll}
                className="flex flex-col items-center max-h-72 overflow-y-auto scrollbar-hide scroll-smooth py-0 w-full relative z-10 overflow-scrolling-touch"
              >
                {slots.map((slot) => {
                  const active = selectedTime?.getTime() === slot.getTime();
                  return (
                    <button
                      key={slot.toISOString()}
                      type="button"
                      onClick={() => onSelect(slot)}
                      className={`font-mono rounded-full border px-8 py-3 text-base transition duration-200 w-48 mx-auto shadow-sm my-1.5 cursor-pointer ${
                        active ? "scale-110 bg-black text-white border-black shadow-lg z-10" : "bg-white border-neutral-200"
                      }`}
                    >
                      {format(slot, "hh:mm a")}
                    </button>
                  );
                })}
              </div>
                {/* Top fade gradient (absolute to slot area) */}
                {!atTop && (
                  <div className="pointer-events-none absolute top-0 left-0 w-full h-10 bg-linear-to-b from-white to-transparent z-20" />
                )}
                {/* Bottom fade gradient (absolute to slot area) */}
                {!atBottom && (
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-linear-to-t from-white to-transparent z-20" />
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { TimeSlots };
