import { useEffect, useRef } from "react";

function useSearchResultsAutoScroll(active, { preferResultsAnchor = true } = {}) {
  const resultsAnchorRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      if (preferResultsAnchor && resultsAnchorRef.current) {
        resultsAnchorRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
        return;
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [active, preferResultsAnchor]);

  return resultsAnchorRef;
}

export { useSearchResultsAutoScroll };
