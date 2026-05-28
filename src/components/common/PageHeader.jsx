import React from 'react'
import { ArrowLeft } from "lucide-react";

function PageHeader({
    onBack, // Optional callback for back button; if not provided, back button won't render
    title = "Unknown", // Default title if not provided
    className = "", // Additional class names for styling
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
        <h2 className="text-xl font-bold ml-2">
            {title}
          
        </h2>
      </div>
  )
}

export  {PageHeader}