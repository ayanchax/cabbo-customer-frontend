import React from "react";

function CabLeavingFromAirportTerminal({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 300"
      role="img"
      aria-label="Cab departing from airport terminal"
      className={className}
    >
      {/* Sky */}
      <rect width="560" height="300" fill="#f0f4f8" />

      {/* Control tower shaft */}
      <rect x="118" y="54" width="20" height="69" fill="#e6e6e6" />
      {/* Tower cab */}
      <rect x="108" y="45" width="40" height="18" rx="3" fill="#d6d6e3" />
      {/* Tower windows */}
      <rect x="114" y="50" width="7" height="5" rx="1" fill="#90aec4" opacity="0.65" />
      <rect x="125" y="50" width="7" height="5" rx="1" fill="#90aec4" opacity="0.65" />
      <rect x="136" y="50" width="7" height="5" rx="1" fill="#90aec4" opacity="0.65" />

      {/* Terminal main building */}
      <rect x="10" y="123" width="162" height="137" rx="3" fill="#f2f2f2" />
      {/* Roof band */}
      <rect x="10" y="123" width="162" height="15" rx="3" fill="#e6e6e6" />
      {/* Departures accent strip */}
      <rect x="10" y="138" width="162" height="10" fill="currentColor" opacity="0.1" />
      {/* Windows row 1 */}
      <rect x="25" y="162" width="22" height="30" rx="2" fill="#b8cfe0" opacity="0.75" />
      <rect x="60" y="162" width="22" height="30" rx="2" fill="#b8cfe0" opacity="0.75" />
      <rect x="95" y="162" width="22" height="30" rx="2" fill="#b8cfe0" opacity="0.75" />
      <rect x="130" y="162" width="22" height="30" rx="2" fill="#b8cfe0" opacity="0.75" />
      {/* Windows row 2 */}
      <rect x="25" y="204" width="22" height="22" rx="2" fill="#b8cfe0" opacity="0.45" />
      <rect x="60" y="204" width="22" height="22" rx="2" fill="#b8cfe0" opacity="0.45" />
      <rect x="95" y="204" width="22" height="22" rx="2" fill="#b8cfe0" opacity="0.45" />
      <rect x="130" y="204" width="22" height="22" rx="2" fill="#b8cfe0" opacity="0.45" />
      {/* Entrance canopy */}
      <rect x="46" y="225" width="80" height="9" rx="2" fill="#e0e4ea" />
      {/* Entrance doors */}
      <rect x="56" y="230" width="60" height="30" rx="2" fill="#d6d6e3" />

      {/* Ground */}
      <rect x="0" y="260" width="560" height="40" fill="#dde3eb" />
      {/* Road surface */}
      <rect x="0" y="260" width="560" height="28" fill="#adb5bd" />
      {/* Road edge */}
      <rect x="0" y="260" width="560" height="2" fill="#bec4cb" />
      {/* Road centre dashes */}
      <rect x="0"   y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="56"  y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="112" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="168" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="224" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="280" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="336" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="392" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="448" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="504" y="272" width="38" height="3" rx="1.5" fill="white" opacity="0.5" />

      {/* Motion / speed lines behind cab */}
      <rect x="192" y="220" width="44" height="3.5" rx="1.75" fill="#c9d0d8" />
      <rect x="200" y="230" width="30" height="2.5" rx="1.25" fill="#c9d0d8" />
      <rect x="195" y="240" width="38" height="2.5" rx="1.25" fill="#c9d0d8" />

      {/* Car shadow */}
      <ellipse cx="358" cy="283" rx="100" ry="6" fill="#090814" opacity="0.07" />

      {/* Wheels — drawn before body so the body overlaps their upper arches */}
      {/* Rear wheel */}
      <circle cx="296" cy="262" r="22" fill="#2d2d35" />
      <circle cx="296" cy="262" r="14" fill="#3e3e47" />
      <circle cx="296" cy="262" r="5"  fill="#c8c8cc" />
      <line x1="296" y1="248" x2="296" y2="276" stroke="#c8c8cc" strokeWidth="1.5" opacity="0.35" />
      <line x1="282" y1="262" x2="310" y2="262" stroke="#c8c8cc" strokeWidth="1.5" opacity="0.35" />
      {/* Front wheel */}
      <circle cx="406" cy="262" r="22" fill="#2d2d35" />
      <circle cx="406" cy="262" r="14" fill="#3e3e47" />
      <circle cx="406" cy="262" r="5"  fill="#c8c8cc" />
      <line x1="406" y1="248" x2="406" y2="276" stroke="#c8c8cc" strokeWidth="1.5" opacity="0.35" />
      <line x1="392" y1="262" x2="420" y2="262" stroke="#c8c8cc" strokeWidth="1.5" opacity="0.35" />

      {/* Car lower body — covers wheel arch area */}
      <rect x="244" y="216" width="196" height="44" rx="10" fill="currentColor" />

      {/* Car cabin / roof (trapezoid, front faces right) */}
      <path d="M282,216 L302,180 L402,180 L424,216 Z" fill="currentColor" />
      {/* Roof highlight */}
      <path d="M289,214 L308,183 L398,183 L418,214 Z" fill="white" opacity="0.06" />

      {/* Rear window */}
      <path d="M303,182 L286,213 L305,213 L319,182 Z" fill="#cfe0ee" opacity="0.88" />

      {/* Main side window */}
      <rect x="322" y="183" width="65" height="27" rx="4" fill="#cfe0ee" opacity="0.88" />
      {/* Window glare */}
      <rect x="324" y="185" width="18" height="23" rx="3" fill="white" opacity="0.18" />

      {/* Front windshield */}
      <path d="M390,183 L422,215 L406,215 L386,185 Z" fill="#cfe0ee" opacity="0.88" />
      {/* Windshield glare */}
      <path d="M392,187 L416,212 L412,212 L389,189 Z" fill="white" opacity="0.18" />

      {/* Door divider line */}
      <rect x="354" y="217" width="2" height="41" rx="1" fill="white" opacity="0.13" />

      {/* Door handles */}
      <rect x="362" y="237" width="16" height="4" rx="2" fill="white" opacity="0.2" />
      <rect x="296" y="237" width="16" height="4" rx="2" fill="white" opacity="0.2" />

      {/* Headlight (front right) */}
      <rect x="434" y="222" width="8" height="8" rx="2" fill="#fff8e1" />
      {/* Headlight beam */}
      <path d="M442,225 L462,219 L462,231 Z" fill="#fff8e1" opacity="0.1" />

      {/* Tail light (rear left) */}
      <rect x="240" y="222" width="7" height="8" rx="2" fill="#ffb9b9" opacity="0.85" />

      {/* Plane in sky — subtle, departing */}
      <g opacity="0.4">
        <path d="M472,65 L496,61 L496,69 Z" fill="#d6d6e3" />
        <path d="M480,61 L478,55 L488,65 L478,75 Z" fill="#e0e4ea" />
        <rect x="476" y="69" width="8" height="3" rx="1" fill="#d6d6e3" />
      </g>
      {/* Contrail */}
      <line x1="400" y1="65" x2="470" y2="65" stroke="#d6d6e3" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.4" />
    </svg>
  );
}

export { CabLeavingFromAirportTerminal };