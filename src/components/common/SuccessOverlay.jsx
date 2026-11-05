import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp } from "lucide-react";

/**
 * SuccessOverlay Component
 * Shows a full-page overlay with a tick icon and message, then auto-calls onComplete after duration.
 * Can optionally redirect to a route after duration, with an optional countdown timer.
 *
 * Props:
 * - visible: boolean (show/hide overlay)
 * - message: string (main message)
 * - duration: ms to show (default 3000)
 * - onComplete: callback after duration
 * - icon: optional React node (defaults to tick)
 * - iconSize: size of the icon (default 80)
 * - children: optional React node(s) to show below the message
 * - route: optional string path to navigate to after duration
 * - routeState: optional state object to pass with navigation
 * - showCountdown: show countdown without navigating; routes show it automatically
 * - countdownLabel: text before the countdown (default "Redirecting in")
 */

function SuccessOverlay({
  visible = false,
  message = "Done!",
  duration = 3000, // ms
  onComplete,
  icon,
  iconSize = 80,
  backgroundClassName = "bg-green-600",
  children,
  route=null,
  routeState=null,
  showCountdown = false,
  countdownLabel = "Redirecting in",
  
}) {
  const navigate = useNavigate();
  const canShowCountdown = Boolean(route) || showCountdown;
  const [countdown, setCountdown] = useState(() => Math.ceil(duration / 1000));
  const canReplace = routeState?.replace ? true : false; // If routeState has replace=true, we will replace the history entry instead of pushing a new one.
  useEffect(() => {
    if (!visible) return;
    let countdownInterval;
    if (canShowCountdown) {
      countdownInterval = setInterval(() => {
        setCountdown((c) => (c > 1 ? c - 1 : 1));
      }, 1000);
    }
    const timer = setTimeout(() => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (route) navigate(route, { state: routeState, replace: canReplace });
      onComplete?.();
    }, duration);
    return () => {
      clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [visible, duration, onComplete, route, routeState, navigate, canReplace, canShowCountdown]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${backgroundClassName} bg-opacity-95 transition-opacity duration-300`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col items-center">
        <div className="animate-success mb-6">
          {icon || (
            <ThumbsUp
              size={iconSize}
              className="text-white"
              strokeWidth={2.5}
            />
          )}
        </div>
        <div className="text-2xl font-bold text-white mb-2 text-center">
          {message}
        </div>
        {children && (
          <div className="mt-2 w-full flex flex-col items-center">
            {children}
          </div>
        )}

        {canShowCountdown && (
          <div className="text-white text-base opacity-80 text-center mt-1">
            {countdownLabel} {countdown} second{countdown !== 1 ? "s" : ""}...
          </div>
        )}
      </div>
    </div>
  );
}

export { SuccessOverlay };
