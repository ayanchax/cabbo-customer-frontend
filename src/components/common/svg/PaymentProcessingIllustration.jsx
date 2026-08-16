import React from "react";

// Modern, minimal payment processing illustration: animated rupee coin, progress bar, shield for security
export default function PaymentProcessingIllustration({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background */}
      <rect x="0" y="0" width="320" height="200" rx="24" fill="#F0FDF4" />
      {/* Progress bar */}
      <rect x="40" y="160" width="240" height="12" rx="6" fill="#D1FAE5" />
      <rect x="40" y="160" width="80" height="12" rx="6" fill="#34D399">
        <animate attributeName="width" values="40;240;40" dur="1.8s" repeatCount="indefinite" />
      </rect>
      {/* Animated rupee coin */}
      <g>
        <circle cx="160" cy="90" r="28" fill="#FBBF24" />
        <text x="160" y="100" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#065F46">₹</text>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-10;0,0" dur="1.2s" repeatCount="indefinite" />
      </g>
       
      {/* Subtle shimmer */}
      <rect x="60" y="60" width="200" height="80" rx="20" fill="#fff" opacity="0.08">
        <animate attributeName="x" values="60;180;60" dur="2.2s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
export { PaymentProcessingIllustration };
