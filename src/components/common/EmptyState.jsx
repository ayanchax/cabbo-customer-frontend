import React from "react";

// A highly reusable empty state component for various empty/error/zero-result scenarios
// Props:
// - illustration: JSX (SVG, Lottie, etc.)
// - title: string
// - message: string
// - action: optional JSX (button, link, etc.)
// - className: optional string for custom styling
const EmptyState = ({
  illustration,
  title,
  message,
  action,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in ${className}`}
    style={{ minHeight: 320 }}
  >
    {illustration && (
      <div className="mb-6 w-32 h-32 flex items-center justify-center">
        {illustration}
      </div>
    )}
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-500 mb-4 max-w-md">{message}</p>
    {action && <div>{action}</div>}
  </div>
);

export  {EmptyState};
