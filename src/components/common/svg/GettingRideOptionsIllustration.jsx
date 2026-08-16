import React from "react";
/**
 * Pulse animation CSS (scoped to this component)
 */
const pulseStyle = `
.cabbo-pulse {
  transform-origin: 160px 186px;
  animation: cabbo-pulse 1.6s cubic-bezier(0.4,0,0.2,1) infinite;
}
@keyframes cabbo-pulse {
  0% { opacity: 0.5; transform: scale(1); }
  70% { opacity: 0; transform: scale(2.2); }
  100% { opacity: 0; transform: scale(2.2); }
}
`;

/**
 * SVG illustration for "Getting Ride Options" overlay.
 * Theme: Cityscape with a cab, location pins, and a search animation.
 * Usage: Show while searching for available rides/packages.
 */

const GettingRideOptionsIllustration = ({ className = "w-48 h-48" }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <style>{pulseStyle}</style>
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Background cityscape */}
      <rect width="320" height="240" rx="24" fill="#FFF" />
      <g opacity="0.7">
        <rect x="30" y="120" width="40" height="60" rx="8" fill="#D1E9FF" />
        <rect x="80" y="100" width="32" height="80" rx="8" fill="#B6D7F7" />
        <rect x="120" y="130" width="24" height="50" rx="6" fill="#A7C7E7" />
        <rect x="160" y="110" width="36" height="70" rx="8" fill="#B6D7F7" />
        <rect x="210" y="125" width="28" height="55" rx="7" fill="#D1E9FF" />
        <rect x="250" y="115" width="24" height="65" rx="6" fill="#A7C7E7" />
      </g>
      {/* Magnifying glass search icon as backdrop */}
      <g opacity="0.18">
        <circle cx="160" cy="120" r="48" stroke="#60A5FA" strokeWidth="8" fill="none" />
        <rect x="200" y="160" width="32" height="8" rx="4" fill="#60A5FA" transform="rotate(40 200 160)" />
      </g>
      {/* Road */}
      <rect x="0" y="200" width="320" height="20" rx="10" fill="#E0E7EF" />
      {/* Pulse animation behind cab */}
      <circle className="cabbo-pulse" cx="160" cy="186" r="18" fill="#60A5FA" opacity="0.18" />
      {/* Car (more car-like) */}
      <g>
        {/* Body */}
        <rect x="120" y="175" width="80" height="22" rx="8" fill="#FFD600" stroke="#222" strokeWidth="2" />
        {/* Roof */}
        <rect x="145" y="167" width="30" height="12" rx="5" fill="#FFF" stroke="#222" strokeWidth="1.5" />
        {/* Windows */}
        <rect x="150" y="170" width="10" height="8" rx="2" fill="#B6D7F7" />
        <rect x="165" y="170" width="10" height="8" rx="2" fill="#B6D7F7" />
        {/* Wheels */}
        <ellipse cx="135" cy="197" rx="7" ry="7" fill="#222" />
        <ellipse cx="185" cy="197" rx="7" ry="7" fill="#222" />
      </g>
      {/* Location pins */}
      <g>
        <circle cx="70" cy="170" r="10" fill="#34D399" />
        <rect x="67" y="170" width="6" height="16" rx="3" fill="#34D399" />
        <circle cx="250" cy="170" r="10" fill="#F87171" />
        <rect x="247" y="170" width="6" height="16" rx="3" fill="#F87171" />
      </g>
    </svg>
  </div>
);

export  {GettingRideOptionsIllustration};
