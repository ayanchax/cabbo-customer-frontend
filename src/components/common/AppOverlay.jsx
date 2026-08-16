import React from "react";

/**
 * Generic, reusable app screen transition overlay.
 * Props:
 * - message: string (main message, e.g. "Taking you to Cabbo hourly rentals...")
 * - illustration: ReactNode (optional, JSX, vector or SVG illustration)
 * - subtext: string (optional, smaller text below main message)
 * - visible: boolean (controls display)
 * - className: string (optional, for custom styling)
 */
const AppOverlay = ({visible=false, message='Navigating...', illustration, subtext, className = "" }) => {
  if (!visible) return null;
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity animate-fade-in ${className}`}>
      {illustration && (
        <div className="mb-6 flex items-center justify-center">{illustration}</div>
      )}
      <div className="text-xl font-semibold text-primary mb-2 text-center">{message}</div>
      {subtext && <div className="text-gray-500 text-sm text-center">{subtext}</div>}
      {/* Optionally, add a spinner or animated icon here */}
    </div>
  );
};

 

export  {AppOverlay};
