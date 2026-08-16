import React from "react";
import { Info } from "lucide-react";
import {APP} from "@/utils"
function RoundTripOnlyDisclaimer({className}) {
  return (
    <div className={`mb-4 flex items-start gap-2 text-sm text-gray-500 ${className}`}>
      <Info
        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p>
        {APP.name} outstation rides are round trips. Your driver will bring you back
        to your pickup location.
      </p>
    </div>
  );
}

export { RoundTripOnlyDisclaimer };
