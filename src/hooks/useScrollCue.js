import { useRef, useState, useEffect, useCallback } from "react";

/**
 * useScrollCue - A hook for scroll cue gradients (vertical or horizontal)
 * @param {Object} options
 * @param {"vertical"|"horizontal"} options.direction - Scroll direction
 * @param {Array} options.deps - Dependency array for recalculating cues
 * @returns [atStart, atEnd, scrollRef, handleScroll]
 */
export function useScrollCue({ direction = "vertical", deps = [] } = {}) {
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef(null);
  const EPSILON = 2; // px

  // Helper to check scroll position
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (direction === "vertical") {
      if (el.scrollHeight <= el.clientHeight) {
        setAtStart(true);
        setAtEnd(true);
      } else {
        setAtStart(el.scrollTop === 0);
        setAtEnd(Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < EPSILON);
      }
    } else {
      // horizontal
      if (el.scrollWidth <= el.clientWidth) {
        setAtStart(true);
        setAtEnd(true);
      } else {
        setAtStart(el.scrollLeft === 0);
        setAtEnd(Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < EPSILON);
      }
    }
  }, [direction]);

  // Effect to check on mount and when deps change
  useEffect(() => {
    checkScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Handler for scroll event
  const handleScroll = useCallback(() => {
    checkScroll();
  }, [checkScroll]);

  return [atStart, atEnd, scrollRef, handleScroll];
}
