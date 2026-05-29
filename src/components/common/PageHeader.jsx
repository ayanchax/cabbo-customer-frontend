import React from "react";
import { ArrowLeft } from "lucide-react";

function PageHeader({
  onBack, // Optional callback for back button; if not provided, back button won't render
  title = "Unknown", // Default title if not provided
  className = "", // Additional class names for styling
  label = "", // Optional label to display next to the title, e.g. for status or category
}) {
  return (
    <div className={`flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 ${className}`}>
      <div className="flex flex-row items-center">
        {onBack && (
          <button
            className="flex items-center text-primary hover:underline text-sm font-medium cursor-pointer"
            onClick={onBack}
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
          </button>
        )}
        <h2 className="text-xl font-bold ml-2">{title}</h2>
        {/* On large screens, label is inline */}
        {label && (
          <span className="hidden sm:inline sm:ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            {label}
          </span>
        )}
      </div>
      {/* On mobile, label is below */}
      {label && (
        <span className="sm:hidden ml-6 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          {label}
        </span>
      )}
    </div>
  );
}

export { PageHeader };
