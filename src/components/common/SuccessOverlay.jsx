import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

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
 * - showRedirecting: boolean to show "Redirecting..." text (default false)
 * - children: optional React node(s) to show below the message
 * - route: optional string path to navigate to after duration
 * - routeState: optional state object to pass with navigation
 * - showCountdown: boolean to show countdown timer when route is provided (default false)
 */

function SuccessOverlay({
  visible = false,
  message = "Done!",
  duration = 3000, // ms
  onComplete = () => {},
  icon,
  iconSize = 80,
  backgroundClassName = "bg-green-600",
  children,
  route=null,
  routeState=null,
  
}) {
  const navigate = useNavigate();
  const canRedirect = route ? true : false; // If route is provided, we can redirect. Otherwise, rely on redirect prop to decide whether to show "Redirecting..." text.
  const canShowCountdown = route ? true : false; // Only show countdown if we have a route to redirect to. If no route is provided, countdown doesn't make sense, so we ignore showCountdown in that case.
  // NOTE: To reset countdown, use a key prop on SuccessOverlay in the parent:
  // <SuccessOverlay key={visible + '-' + duration + '-' + route} ... />
  const [countdown, setCountdown] = useState(() => Math.ceil(duration / 1000));

  useEffect(() => {
    if (!visible) return;
    let timer;
    let countdownInterval;
    if (route) {
      countdownInterval = setInterval(() => {
        setCountdown((c) => (c > 1 ? c - 1 : 1));
      }, 1000); // Update countdown every second so it behaves like a clock counting down to the redirect
      timer = setTimeout(() => {
        if (routeState) {
          navigate(route, { state: routeState });
        } else {
          navigate(route);
        }
        if (onComplete) onComplete();
      }, duration);
    } else {
      timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
    }
    return () => {
      clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [visible, duration, onComplete, route, routeState, navigate]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${backgroundClassName} bg-opacity-95 transition-opacity duration-300`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col items-center">
        {icon || (
          <CheckCircle
            size={iconSize}
            className="mb-6 text-white"
            strokeWidth={2.5}
          />
        )}
        <div className="text-2xl font-bold text-white mb-2 text-center">
          {message}
        </div>
        {children && (
          <div className="mt-2 w-full flex flex-col items-center">
            {children}
          </div>
        )}

        {canRedirect && (
          <>
            {canShowCountdown && route ? (
              <div className="text-white text-base opacity-80 text-center mt-1">
                Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
              </div>
            ) : (
              <div className="text-white text-base opacity-80 text-center mt-1">
                Redirecting...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { SuccessOverlay };
