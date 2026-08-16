import React from "react";
import { Info } from "lucide-react";
import { ROUTES } from "@/utils";
function RefundsAndCancellationPolicies({
  policies = [],
  className = "",
  header = null,
}) {
  if (!policies || policies.length === 0) return null; // Don't render if no policies provided
  return (
    <div className={`${className}`}>
      {header && (
        <div className="flex items-center mb-2">
          <Info className="w-5 h-5 text-blue-400 mr-2" aria-hidden="true" />

          <span className="font-semibold text-gray-700 text-base sm:text-lg md:text-xl">
            {header}
          </span>
        </div>
      )}
      <ul className="list-disc pl-6 text-gray-600 text-xs sm:text-sm space-y-1">
        {policies.map((text, idx) => (
          <li className="mb-1.5" key={idx}>
            {text}
          </li>
        ))}
      </ul>

      <div className="mt-3 text-xs text-gray-500">
        To know more about how we handle cancellations and refunds, please refer
        to our{" "}
        <a
          href={`${ROUTES.LEGAL}/cancellation-refund-policy`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          cancellation and refund policy
        </a>
        .
      </div>
    </div>
  );
}

export { RefundsAndCancellationPolicies };
