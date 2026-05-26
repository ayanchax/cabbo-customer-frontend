import * as React from "react";

// Simple SUV Plus cab SVG illustration (customize as needed)
const SuvPlusCabIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="SUV Plus Cab">
    <rect x="3" y="18" width="42" height="16" rx="6" fill="#FFD600" stroke="#222" strokeWidth="2"/>
    <rect x="9" y="10" width="30" height="14" rx="5" fill="#FFF" stroke="#222" strokeWidth="2"/>
    <circle cx="14" cy="38" r="4.5" fill="#222"/>
    <circle cx="34" cy="38" r="4.5" fill="#222"/>
    <rect x="20" y="16" width="8" height="7" rx="2.5" fill="#B3E5FC"/>
    <rect x="36" y="28" width="5" height="5" rx="1.5" fill="#FFD600" stroke="#222" strokeWidth="1"/>
  </svg>
);

export  {SuvPlusCabIcon};
