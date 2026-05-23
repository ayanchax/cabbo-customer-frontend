import React, {
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { useScrollCue, useUIElement } from "@/hooks";
import { format } from "date-fns";
import { generateTimeSlots } from "@/components/common/datetime-picker/utils";

const TimeSlots = forwardRef(function TimeSlots(
  {
    selectedDate,
    selectedTime,
    onSelect,
    minDateTime,
    onSlotActiveChange,
  },
  ref,
) {
  // Track if user has scrolled after date change
  const [userHasScrolled, setUserHasScrolled] = useState(false);
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

  const { isElementInView } = useUIElement();

  // Generate a 24 hour time slots for the selected date.
  // This shows time slots from 12:00 AM to 11:45 PM with a step of 15 minutes, if selected date is after the minDateTime. Otherwise, it shows time slots starting from the next available slot after minDateTime.

  const slots = useMemo(() => {
    const timeSlots = generateTimeSlots({
      selectedDate,
      minDateTime,
    });

    if (!timeSlots || timeSlots.length === 0) {
      throw new Error("No available time slots for the selected date.");
      // This will be caught by the ErrorBoundary of the App, we do not need to handle it here since if there are no available time slots, it is an exceptional case and we want to show the error fallback UI to the user.
    }
    return timeSlots;
  }, [selectedDate, minDateTime]);

  // Refs for scrolling selected slot into view
  const slotRefs = useRef({});

  const signalSlotActiveChange = (isActive) => {
    if (onSlotActiveChange && typeof onSlotActiveChange === "function") {
      onSlotActiveChange(isActive);
    }
  };
  // Only auto-scroll to selected slot on initial mount
  const didMount = useRef(false);
  useEffect(() => {
    const isActive =
      !!selectedTime &&
      slots.some((slot) => slot.getTime() === selectedTime.getTime());
    signalSlotActiveChange(isActive);

    // Auto-scroll only on initial mount if selectedTime exists
    if (!didMount.current && selectedTime) {
      scrollToSelectedSlot();
      didMount.current = true;
    }
    // Reset userHasScrolled on slot list regeneration (date change)
    setUserHasScrolled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime, onSlotActiveChange, slots]);

  const handleSelect = (slot, isSelected) => {
    if (isSelected) {
      // Already selected, do nothing
      return;
    }
    onSelect(slot);
    signalSlotActiveChange(true); //This will signal to parent that a slot is now active/selected
    // Wait for React state update + re-render
    scrollToSelectedSlot(true, slot); // Pass the newly selected slot to scroll to it after state updates and re-render occurs
    setUserHasScrolled(false); // Reset scroll intent on selection
  };
  // Expose scrollToSelectedSlot and isSelectedSlotInView to parent
  useImperativeHandle(ref, () => ({
    scrollToSelectedSlot,
    isSelectedSlotInView,
    resetUserHasScrolled: () => setUserHasScrolled(false),
    setUserHasScrolledTrue: () => setUserHasScrolled(true),
    getUserHasScrolled: () => userHasScrolled,
  }));

  // Check if selected slot is in view (either mobile or desktop)
  const isSelectedSlotInView = () => {
    if (!selectedTime) return true;
    const slotKeyMobile = `responsive-slot-${selectedTime.getTime()}`;
    const slotKeyDesktop = `vertical-slot-${selectedTime.getTime()}`;
    const slotElMobile = slotRefs.current[slotKeyMobile];
    const slotElDesktop = slotRefs.current[slotKeyDesktop];
    let inView = true;
    if (slotElMobile && horizScrollRef.current) {
      inView = inView && isElementInView(slotElMobile, horizScrollRef.current);
    }
    if (slotElDesktop && vertScrollRef.current) {
      inView = inView && isElementInView(slotElDesktop, vertScrollRef.current);
    }
    return inView;
  };

  const scrollToSelectedSlot = (withAnimationFrame = false, slot = null) => {
    try {
      if (withAnimationFrame && slot) {
        requestAnimationFrame(() => {
          const slotKeyMobile = `responsive-slot-${slot.getTime()}`;
          const slotKeyDesktop = `vertical-slot-${slot.getTime()}`;
          const slotElMobile = slotRefs.current[slotKeyMobile];
          const slotElDesktop = slotRefs.current[slotKeyDesktop];
          if (
            slotElMobile &&
            horizScrollRef.current &&
            !isElementInView(slotElMobile, horizScrollRef.current)
          ) {
            slotElMobile.scrollIntoView({
              behavior: "auto",
              block: "center",
              inline: "center",
            });
          }
          if (
            slotElDesktop &&
            vertScrollRef.current &&
            !isElementInView(slotElDesktop, vertScrollRef.current)
          ) {
            slotElDesktop.scrollIntoView({
              behavior: "auto",
              block: "center",
              inline: "center",
            });
          }
        });
      } else {
        if (!selectedTime) return;
        const slotKeyMobile = `responsive-slot-${selectedTime.getTime()}`;
        const slotKeyDesktop = `vertical-slot-${selectedTime.getTime()}`;
        const slotElMobile = slotRefs.current[slotKeyMobile];
        const slotElDesktop = slotRefs.current[slotKeyDesktop];
        if (
          slotElMobile &&
          horizScrollRef.current &&
          !isElementInView(slotElMobile, horizScrollRef.current)
        ) {
          slotElMobile.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
        if (
          slotElDesktop &&
          vertScrollRef.current &&
          !isElementInView(slotElDesktop, vertScrollRef.current)
        ) {
          slotElDesktop.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }
    } catch (e) {
      console.error("Error scrolling to selected slot:", e);
    }
  };

  return (
    <div className="mt-0  lg:mt-4">
      {slots.length > 0 && (
        <>
          <div className="text-sm font-medium mb-3 px-4">{`Available time slots`}</div>
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
              <div className="pointer-events-none absolute top-0 left-0 w-full h-10 bg-linear-to-b from-white to-transparent hidden lg:block z-20" />
            )}
            {!atBottom && (
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-linear-to-t from-white to-transparent hidden lg:block z-20" />
            )}

            {/* Responsive slot scroller: horizontal on mobile/tablet, hidden on lg+ */}
            <div
              ref={horizScrollRef}
              onScroll={(e) => {
                handleHorizScroll(e);
                setUserHasScrolled(true);
              }}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth lg:hidden overflow-scrolling-touch"
            >
              {slots.map((slot) => {
                const selected = selectedTime?.getTime() === slot.getTime();
                return (
                  <button
                    key={slot.getTime()}
                    type="button"
                    ref={(el) => {
                      slotRefs.current[`responsive-slot-${slot.getTime()}`] =
                        el;
                    }}
                    onClick={() => handleSelect(slot, selected)}
                    className={`font-mono shrink-0 rounded-full border px-4 py-2 text-sm transition ease-in-out duration-200 ${
                      selected
                        ? "  bg-primary text-white border-primary"
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
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-neutral-400 opacity-30 z-0" />
              <div
                ref={vertScrollRef}
                onScroll={(e) => {
                  handleVertScroll(e);
                  setUserHasScrolled(true);
                }}
                className="flex flex-col items-center max-h-72 overflow-y-auto scrollbar-hide scroll-smooth py-0 w-full relative z-10 overflow-scrolling-touch"
              >
                {slots.map((slot) => {
                  const active = selectedTime?.getTime() === slot.getTime();
                  return (
                    <button
                      key={slot.getTime()}
                      type="button"
                      ref={(el) => {
                        slotRefs.current[`vertical-slot-${slot.getTime()}`] =
                          el;
                      }}
                      onClick={() => handleSelect(slot, active)}
                      className={`font-mono rounded-full border px-8 py-3 text-base transition duration-200 w-48 mx-auto shadow-sm my-1.5 cursor-pointer ease-in-out ${
                        active
                          ? "bg-primary text-white border-primary shadow-lg z-10"
                          : "bg-white border-neutral-200"
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
});

export { TimeSlots };
