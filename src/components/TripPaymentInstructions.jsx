import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function TripPaymentInstructions({
  instruction,
  reason,
  className = "",
  whyAdvancePaymentLabel = "Why?",
}) {
  const [showReason, setShowReason] = useState(false);

  return (
    <div className={`w-full flex flex-col items-center gap-1 ${className}`}>
      <div className="text-center text-sm text-gray-600">
        <span>{instruction}</span>
        {reason && whyAdvancePaymentLabel && (
          <button
            type="button"
            className="ml-1.5 inline-flex items-center gap-0.5 align-baseline text-xs font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setShowReason((current) => !current)}
            aria-expanded={showReason}
          >
            {whyAdvancePaymentLabel}
            <ChevronDown
              size={14}
              className={`transition-transform ${showReason ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {reason && whyAdvancePaymentLabel && showReason && (
        <div className="max-w-2xl text-center text-xs leading-5 text-gray-500">
          {reason}
        </div>
      )}
    </div>
  );
}

export { TripPaymentInstructions };
