import * as React from "react";

// Simple sedan cab SVG illustration (customize as needed)
const SedanCabIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="Sedan Cab">
    <rect x="6" y="24" width="36" height="10" rx="3" fill="#FFD600" stroke="#222" strokeWidth="2"/>
    <rect x="12" y="18" width="24" height="10" rx="2" fill="#FFF" stroke="#222" strokeWidth="2"/>
    <circle cx="14" cy="38" r="3" fill="#222"/>
    <circle cx="34" cy="38" r="3" fill="#222"/>
    <rect x="20" y="22" width="8" height="4" rx="1" fill="#B3E5FC"/>
  </svg>
);

export  {SedanCabIcon};
