import React from "react";
import { Minus, Plus } from "lucide-react";

function PassengerCounter({
  plusDisabled = false,
  minusDisabled = false,
  disabled = false,
  passengerType = "adults",
  count = 1,
  onChange,
}) {
  return (
    <div className="flex-1 flex flex-col items-start">
      <label className="text-xs text-gray-600 mb-0.5 font-medium first-letter:uppercase">{passengerType}</label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-base font-bold bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
          onClick={() => onChange?.(Math.max(0, count - 1))}
          disabled={minusDisabled || count <= 0}
          aria-label={`Decrease ${passengerType}`}
        >
          <Minus size={16} />
        </button>
        <span className="w-7 text-center text-sm font-semibold">{count}</span>
        <button
          type="button"
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-base font-bold bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
          onClick={() => onChange?.(count + 1)}
          disabled={plusDisabled || disabled}
          aria-label={`Increase ${passengerType}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export { PassengerCounter };
