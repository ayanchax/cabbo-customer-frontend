import React from "react";
import { Info } from "lucide-react";

function PayRestToDriver({ includeHorizontalRule = false, className = "", label = "Pay the rest to the driver (UPI/cash)" }) {
  return (
    <>
      {includeHorizontalRule && <hr className="my-1 border-gray-200 w-full" />}
      <div
        className={`text-xs sm:text-sm text-gray-600 text-center flex items-center justify-center gap-1 px-2 sm:px-0 ${className}`}
        aria-live="polite"
      >
        <Info
          className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 mr-1"
          aria-hidden="true"
        />
        <span>{label}</span>
      </div>
    </>
  );
}

export { PayRestToDriver };
