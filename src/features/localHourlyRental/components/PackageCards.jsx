import React, {useEffect, useRef} from "react";
import { GridLoaderSkeleton } from "@/components";
import { useScrollCue , useUIElement} from "@/hooks";
function PackageCards({
  id,
  packages,
  selectedPackageId,
  onSelect,
  loading,
  layout = "horizontal",
}) {
  const rootRef = useRef(null);
  const packageButtonRefs = useRef({});
  const { focusOnElement } = useUIElement();

  // Use useScrollCue for horizontal scroll cues
  const [atPackageStart, atPackageEnd, packageListRef, handlePackageScroll] =
    useScrollCue({
      direction: "horizontal",
      deps: [packages, layout],
    });

   // Focus root element when label[for=id] is clicked from parent
    useEffect(() => {
      if (!id) return;
      const label = document.querySelector(`label[for='${id}']`);
  
      if (!label) return;
      // eslint-disable-next-line no-unused-vars
      const handler = (e) => {
        focusOnElement(rootRef);
      };
      label.addEventListener("click", handler);
      return () => {
        label.removeEventListener("click", handler);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

  useEffect(() => {
    if (layout !== "horizontal" || !selectedPackageId) return;
    if (typeof window === "undefined") return;

    const isMobile = !window.matchMedia("(min-width: 768px)").matches;
    if (!isMobile) return;

    packageButtonRefs.current[selectedPackageId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [layout, selectedPackageId]);

  if (loading) {
    return <GridLoaderSkeleton rows={2} cols={2} />;
  }

  if (!packages || packages.length === 0) {
    throw new Error("No packages available for the selected date/time");
    // Error boundary will catch this and show fallback UI with option to change date/time
  }



  
  return (
    <div id={id} className="relative bg-white rounded-lg border border-gray-100 p-3 shadow-sm w-full border-dashed  transition-shadow focus:outline-none focus:border-solid lg:focus:border-primary lg:focus:ring-2 lg:focus:ring-primary/40 text-sm sm:text-base " ref={rootRef} tabIndex={-1}>
      {/* Gradients for scroll cue */}
      {!atPackageStart && layout === "horizontal" && (
                      <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-linear-to-r from-white to-transparent z-10 lg:hidden" />

      )}
      {!atPackageEnd && layout === "horizontal" && (
              <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-linear-to-l from-white to-transparent z-10 lg:hidden" />
        
      )}
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-2 gap-3 w-full py-2 "
            : "flex gap-3 w-full py-2 overflow-x-auto scrollbar-hide overflow-scrolling-touch"
        }
        ref={packageListRef}
        onScroll={handlePackageScroll}
      >
        {packages.map((pkg) => {
          const selected = pkg.id === selectedPackageId;
          return (
            <button
              key={pkg.id}
              ref={(element) => {
                if (element) {
                  packageButtonRefs.current[pkg.id] = element;
                } else {
                  delete packageButtonRefs.current[pkg.id];
                }
              }}
              type="button"
              className={`max-h-40 md:max-h-48 lg:max-h-40 flex flex-col  justify-start items-start p-4 rounded-lg border transition shadow-sm text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/80  ${
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-gray-300 bg-white hover:border-primary/60"
              }`}
              aria-pressed={selected}
              onClick={() => onSelect(pkg.id)}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {pkg.included_hours}h
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  /{pkg.included_km}km
                </span>
              </div>
              {/* Description for md+ screens: show for all cards */}
              <div className="text-xs sm:text-sm text-gray-500 mt-2 hidden md:block line-clamp-4">
                {pkg.best_intended_for}
              </div>
              
            </button>
          );
        })}
      </div>
       {/* Description for small screens: show below the scroll area */}
       {selectedPackageId && (<div className="text-xs sm:text-sm text-gray-500 mt-2 block md:hidden">
         {packages.find((pkg) => pkg.id === selectedPackageId)?.best_intended_for}
       </div>)}
    </div>
  );
}

export { PackageCards };
