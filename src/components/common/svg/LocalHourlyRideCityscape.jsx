import * as React from "react";

/**
 * Cabbo — Local / Hourly Rental Cityscape Illustration
 *
 * - Modern city skyline
 * - Horizontal/curved route (not climbing)
 * - "4h, 8h, ..." chip
 * - Multiple stops chip
 * - Car on city road
 */
const LocalHourlyRideCityscape = ({ className, ...props }) => (
  <svg
    viewBox="0 0 340 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Cabbo local hourly rental cityscape illustration"
    {...props}
  >
    <defs>
      {/* Background glow */}
      <radialGradient id="bgGlow" cx="0" cy="0" r="1">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
      </radialGradient>
      {/* Route gradient */}
      <linearGradient id="routeGradient" x1="40" y1="180" x2="300" y2="180">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      {/* Car shadow */}
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.18" />
      </filter>
      {/* Soft blur */}
      <filter id="blur">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>

    {/* Ambient glow */}
    <circle cx="180" cy="120" r="110" fill="url(#bgGlow)" />

    {/* Modern city skyline */}
    <g opacity="0.13">
      <rect x="30" y="100" width="18" height="60" rx="4" fill="#2563EB" />
      <rect x="54" y="80" width="14" height="80" rx="4" fill="#3B82F6" />
      <rect x="74" y="120" width="12" height="40" rx="4" fill="#60A5FA" />
      <rect x="110" y="90" width="10" height="70" rx="4" fill="#2563EB" />
      <rect x="130" y="110" width="8" height="50" rx="4" fill="#3B82F6" />
      <rect x="210" y="100" width="20" height="60" rx="4" fill="#2563EB" />
      <rect x="238" y="80" width="16" height="80" rx="4" fill="#3B82F6" />
      <rect x="260" y="120" width="12" height="40" rx="4" fill="#60A5FA" />
      <rect x="280" y="90" width="10" height="70" rx="4" fill="#2563EB" />
      <rect x="300" y="110" width="8" height="50" rx="4" fill="#3B82F6" />
    </g>

    {/* Main horizontal/curved route */}
    <path
      d="M60 180 Q120 170 170 180 Q220 190 280 180"
      stroke="url(#routeGradient)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="10 12"
    />
    {/* Route glow */}
    <path
      d="M60 180 Q120 170 170 180 Q220 190 280 180"
      stroke="#93C5FD"
      strokeWidth="14"
      strokeLinecap="round"
      opacity="0.18"
      filter="url(#blur)"
    />
    {/* Route points */}
    <circle cx="110" cy="178" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
    <circle cx="230" cy="182" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
    {/* Destination pulse */}
    <g>
      <circle cx="280" cy="180" r="10" fill="#2563EB" />
      <circle cx="280" cy="180" r="18" stroke="#60A5FA" strokeWidth="2" opacity="0.4" />
    </g>

    {/* Floating UI chips (abstract, playful placement) */}
    {/* Hourly chip - now with clock and peeping hour numbers, playful/abstract */}
    {/* Hourly chip - just clock and 'Hourly' label */}
    <g filter="url(#shadow)" transform="rotate(-7 79 46)">
      <rect x="44" y="32" width="68" height="28" rx="14" fill="white" />
      {/* Clock icon */}
      <g>
        <circle cx="60" cy="46" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="60" y1="46" x2="60" y2="42.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="60" y1="46" x2="63" y2="46" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <text x="70" y="50" fontSize="12" fill="#0F172A" fontFamily="Inter, sans-serif" fontWeight="600">Hourly</text>
    </g>
    {/* Multiple stops chip - offset, slightly rotated, floats lower and right, text always fits */}
    <g filter="url(#shadow)" transform="translate(18,18) rotate(8 266 54)">
      <rect x="220" y="54" width="110" height="28" rx="14" fill="white" />
      <circle cx="236" cy="68" r="4" fill="#2563EB" />
      <text x="248" y="72" fontSize="10.5" fill="#0F172A" fontFamily="Inter, sans-serif" fontWeight="600">Multiple stops</text>
    </g>

    {/* Car on road */}
    <g transform="translate(170 170)" filter="url(#shadow)">
      {/* Car body */}
      <rect x="-42" y="-16" width="84" height="30" rx="12" fill="white" />
      {/* Taxi roof sign */}
      <rect x="-12" y="-24" width="24" height="6" rx="2" fill="#FBBF24" stroke="#F59E1B" strokeWidth="0.5" />
      {/* Flatter, wider upper cabin */}
      <rect x="-22" y="-22" width="44" height="12" rx="4" fill="#93C5FD" />
      {/* Flatter windshield */}
      <rect x="-14" y="-18" width="28" height="7" rx="2.5" fill="#60A5FA" />
      {/* Accent strip - yellow for cab look */}
      <rect x="-42" y="-2" width="84" height="6" rx="3" fill="#FBBF24" opacity="0.95" />
      {/* Wheels */}
      <circle cx="-24" cy="18" r="8" fill="#111827" />
      <circle cx="24" cy="18" r="8" fill="#111827" />
      {/* Wheel hubs */}
      <circle cx="-24" cy="18" r="3" fill="#9CA3AF" />
      <circle cx="24" cy="18" r="3" fill="#9CA3AF" />
      {/* Headlight */}
      <rect x="38" y="-2" width="4" height="8" rx="2" fill="#FDE68A" />
      {/* Tail light - yellow/orange, not red */}
      <rect x="-42" y="-2" width="4" height="8" rx="2" fill="#FBBF24" />
    </g>
    {/* Motion streaks */}
    <g opacity="0.22">
      <rect x="120" y="196" width="24" height="4" rx="2" fill="#60A5FA" />
      <rect x="102" y="204" width="18" height="4" rx="2" fill="#60A5FA" />
    </g>
  </svg>
);

export { LocalHourlyRideCityscape };
