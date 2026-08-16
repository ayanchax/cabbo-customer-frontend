import * as React from "react";

/**
 * Cabbo — Local / Hourly Rental Transition Illustration
 *
 * Design Goals:
 * - Modern mobility transition feel
 * - Directional motion
 * - Route/navigation inspired
 * - Premium but calm
 * - Works beautifully inside overlays/loaders
 * - Production-ready SVG
 *
 * Recommended Usage:
 * <LocalHourlyRideIllustration className="w-52 h-52" />
 */

const LocalHourlyRideIllustration = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cabbo local hourly rental illustration"
      {...props}
    >
      <defs>
        {/* Background glow */}
        <radialGradient id="bgGlow" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>

        {/* Route gradient */}
        <linearGradient id="routeGradient" x1="40" y1="170" x2="280" y2="80">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Car shadow */}
        <filter
          id="shadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodOpacity="0.18"
          />
        </filter>

        {/* Soft blur */}
        <filter id="blur">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle
        cx="180"
        cy="110"
        r="110"
        fill="url(#bgGlow)"
      />

      {/* Minimal city backdrop */}
      <g opacity="0.12">
        <rect x="26" y="88" width="18" height="58" rx="4" fill="#2563EB" />
        <rect x="52" y="68" width="14" height="78" rx="4" fill="#3B82F6" />
        <rect x="74" y="100" width="12" height="46" rx="4" fill="#60A5FA" />

        <rect x="238" y="82" width="20" height="64" rx="4" fill="#2563EB" />
        <rect x="266" y="58" width="16" height="88" rx="4" fill="#3B82F6" />
      </g>

      {/* Flyover / road lines */}
      <g opacity="0.08">
        <path
          d="M20 170C80 150 140 150 300 175"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Main navigation route */}
      <path
        d="M48 168C104 188 160 120 214 124C250 126 268 104 286 76"
        stroke="url(#routeGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 12"
      />

      {/* Route glow */}
      <path
        d="M48 168C104 188 160 120 214 124C250 126 268 104 286 76"
        stroke="#93C5FD"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.18"
        filter="url(#blur)"
      />

      {/* Route points */}
      <circle cx="92" cy="171" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
      <circle cx="182" cy="128" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />

      {/* Destination pulse */}
      <g>
        <circle cx="286" cy="76" r="10" fill="#2563EB" />
        <circle
          cx="286"
          cy="76"
          r="18"
          stroke="#60A5FA"
          strokeWidth="2"
          opacity="0.4"
        />
      </g>

      {/* Floating UI chips */}
      <g filter="url(#shadow)">
        {/* 4 hrs chip */}
        <rect
          x="42"
          y="28"
          width="64"
          height="28"
          rx="14"
          fill="white"
        />
        <circle cx="58" cy="42" r="4" fill="#2563EB" />
        <text
          x="70"
          y="46"
          fontSize="12"
          fill="#0F172A"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          4 hrs
        </text>

        {/* Multiple stops chip */}
        <rect
          x="214"
          y="22"
          width="92"
          height="28"
          rx="14"
          fill="white"
        />
        <circle cx="230" cy="36" r="4" fill="#2563EB" />
        <text
          x="242"
          y="40"
          fontSize="11"
          fill="#0F172A"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          Multiple stops
        </text>
      </g>

      {/* Moving sedan */}
      <g
        transform="translate(150 118) rotate(-8)"
        filter="url(#shadow)"
      >
        {/* Car body */}
        <rect
          x="-42"
          y="-16"
          width="84"
          height="30"
          rx="14"
          fill="white"
        />

        {/* Upper cabin */}
        <path
          d="M-18 -26H18C24 -26 30 -20 34 -12L36 -6H-36L-34 -12C-30 -20 -24 -26 -18 -26Z"
          fill="#E0F2FE"
        />

        {/* Windshield */}
        <path
          d="M-10 -22H10C16 -22 20 -18 24 -10H-24C-20 -18 -16 -22 -10 -22Z"
          fill="#BFDBFE"
        />

        {/* Accent strip */}
        <rect
          x="-42"
          y="-2"
          width="84"
          height="6"
          rx="3"
          fill="#2563EB"
          opacity="0.9"
        />

        {/* Wheels */}
        <circle cx="-24" cy="18" r="8" fill="#111827" />
        <circle cx="24" cy="18" r="8" fill="#111827" />

        {/* Wheel hubs */}
        <circle cx="-24" cy="18" r="3" fill="#9CA3AF" />
        <circle cx="24" cy="18" r="3" fill="#9CA3AF" />

        {/* Headlight */}
        <rect
          x="38"
          y="-2"
          width="4"
          height="8"
          rx="2"
          fill="#FDE68A"
        />

        {/* Tail light */}
        <rect
          x="-42"
          y="-2"
          width="4"
          height="8"
          rx="2"
          fill="#FCA5A5"
        />
      </g>

      {/* Motion streaks */}
      <g opacity="0.22">
        <rect
          x="110"
          y="146"
          width="24"
          height="4"
          rx="2"
          fill="#60A5FA"
        />
        <rect
          x="92"
          y="154"
          width="18"
          height="4"
          rx="2"
          fill="#60A5FA"
        />
      </g>
    </svg>
  );
};

export { LocalHourlyRideIllustration };