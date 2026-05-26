import * as React from "react";

// Simple hatchback cab SVG illustration (customize as needed)
const HatchbackCabIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="Hatchback Cab">
    <rect x="8" y="26" width="32" height="8" rx="3" fill="#FFD600" stroke="#222" strokeWidth="2"/>
    <rect x="14" y="20" width="20" height="8" rx="2" fill="#FFF" stroke="#222" strokeWidth="2"/>
    <circle cx="16" cy="36" r="2.5" fill="#222"/>
    <circle cx="32" cy="36" r="2.5" fill="#222"/>
    <rect x="20" y="24" width="8" height="3" rx="1" fill="#B3E5FC"/>
  </svg>
);

export  {HatchbackCabIcon};
