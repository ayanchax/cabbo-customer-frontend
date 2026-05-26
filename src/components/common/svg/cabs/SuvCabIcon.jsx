import * as React from "react";

// Simple SUV cab SVG illustration (customize as needed)
const SuvCabIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="SUV Cab">
    <rect x="4" y="20" width="40" height="14" rx="5" fill="#FFD600" stroke="#222" strokeWidth="2"/>
    <rect x="10" y="14" width="28" height="12" rx="4" fill="#FFF" stroke="#222" strokeWidth="2"/>
    <circle cx="14" cy="38" r="4" fill="#222"/>
    <circle cx="34" cy="38" r="4" fill="#222"/>
    <rect x="20" y="18" width="8" height="6" rx="2" fill="#B3E5FC"/>
  </svg>
);

export  {SuvCabIcon};
