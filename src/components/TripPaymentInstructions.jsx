import React from "react";

function TripPaymentInstructions({ instruction, reason, className = "" }) {
  return (
    <div className={`w-full flex flex-col gap-1  ${className}`}>
      <div className="text-sm text-gray-600 text-center">{instruction}</div>
      <div className="hidden text-xs text-gray-500 text-center">{reason}</div>
    </div>
  );
}

export { TripPaymentInstructions };
