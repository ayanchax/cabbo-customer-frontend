import * as React from "react";

// Simple sedan plus cab SVG illustration (customize as needed)
const SedanPlusCabIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="Sedan Plus Cab">
    <rect x="5" y="22" width="38" height="12" rx="4" fill="#FFD600" stroke="#222" strokeWidth="2"/>
    <rect x="11" y="16" width="26" height="12" rx="3" fill="#FFF" stroke="#222" strokeWidth="2"/>
    <circle cx="14" cy="38" r="3.5" fill="#222"/>
    <circle cx="34" cy="38" r="3.5" fill="#222"/>
    <rect x="20" y="20" width="8" height="5" rx="1.5" fill="#B3E5FC"/>
    <rect x="36" y="28" width="4" height="4" rx="1" fill="#FFD600" stroke="#222" strokeWidth="1"/>
  </svg>
);

export  {SedanPlusCabIcon};
