import * as React from "react";
import {APP} from "@/utils"
const CabboSplashIllustration = ({ className }) => {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="bgGlow" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="routeGradient" x1="40" y1="210" x2="280" y2="90">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <filter
          id="shadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="14"
            floodOpacity="0.12"
          />
        </filter>

        <filter id="blur">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle
        cx="160"
        cy="120"
        r="120"
        fill="url(#bgGlow)"
      />

      {/* City backdrop */}
      <g opacity="0.08">
        <rect x="24" y="96" width="18" height="70" rx="4" fill="#2563EB" />
        <rect x="52" y="70" width="16" height="96" rx="4" fill="#3B82F6" />
        <rect x="78" y="110" width="12" height="56" rx="4" fill="#60A5FA" />

        <rect x="238" y="92" width="22" height="74" rx="4" fill="#2563EB" />
        <rect x="270" y="60" width="18" height="106" rx="4" fill="#3B82F6" />
      </g>

      {/* Navigation route */}
      <path
        d="M44 202C90 220 148 150 202 152C240 154 262 126 286 92"
        stroke="url(#routeGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="12 14"
      />

      {/* Route glow */}
      <path
        d="M44 202C90 220 148 150 202 152C240 154 262 126 286 92"
        stroke="#93C5FD"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.18"
        filter="url(#blur)"
      />

      {/* Route points */}
      <circle
        cx="102"
        cy="194"
        r="7"
        fill="#DBEAFE"
        stroke="#2563EB"
        strokeWidth="2"
      />

      <circle
        cx="184"
        cy="154"
        r="7"
        fill="#DBEAFE"
        stroke="#2563EB"
        strokeWidth="2"
      />

      {/* Destination pulse */}
      <g>
        <circle cx="286" cy="92" r="11" fill="#2563EB" />

        <circle
          cx="286"
          cy="92"
          r="20"
          stroke="#60A5FA"
          strokeWidth="2"
          opacity="0.45"
        />
      </g>

      {/* Cab */}
      <g
        transform="translate(156 146) rotate(-8)"
        filter="url(#shadow)"
      >
        {/* Body */}
        <rect
          x="-48"
          y="-18"
          width="96"
          height="34"
          rx="16"
          fill="white"
        />

        {/* Cabin */}
        <path
          d="M-20 -30H20C28 -30 36 -24 40 -14L42 -8H-42L-40 -14C-36 -24 -28 -30 -20 -30Z"
          fill="#E0F2FE"
        />

        {/* Windshield */}
        <path
          d="M-10 -24H10C18 -24 24 -20 28 -12H-28C-24 -20 -18 -24 -10 -24Z"
          fill="#BFDBFE"
        />

        {/* Accent strip */}
        <rect
          x="-48"
          y="-2"
          width="96"
          height="7"
          rx="4"
          fill="#2563EB"
        />

        {/* Wheels */}
        <circle cx="-28" cy="20" r="9" fill="#111827" />
        <circle cx="28" cy="20" r="9" fill="#111827" />

        {/* Wheel hubs */}
        <circle cx="-28" cy="20" r="3" fill="#9CA3AF" />
        <circle cx="28" cy="20" r="3" fill="#9CA3AF" />

        {/* Headlight */}
        <rect
          x="44"
          y="-2"
          width="4"
          height="9"
          rx="2"
          fill="#FDE68A"
        />
      </g>

      {/* Motion streaks */}
      <g opacity="0.18">
        <rect
          x="96"
          y="172"
          width="30"
          height="5"
          rx="3"
          fill="#60A5FA"
        />

        <rect
          x="78"
          y="182"
          width="22"
          height="5"
          rx="3"
          fill="#60A5FA"
        />
      </g>

      {/* CABBO wordmark */}
      <text
        x="160"
        y="248"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        letterSpacing="0.08em"
        fill="#111827"
        fontFamily="Satoshi, Inter, sans-serif"
      >
        {APP.name}
      </text>
    </svg>
  );
};

export { CabboSplashIllustration };