import React, { useEffect, useId, useRef, useState } from "react";
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
  backgroundClassName = "bg-green-700",
  children,
  route=null,
  routeState=null,
  showCountdown = false,
  countdownLabel = "Redirecting in",
  
}) {
  const navigate = useNavigate();
  const screenRef = useRef(null);
  const messageId = useId();
  const canShowCountdown = Boolean(route) || showCountdown;
  const [countdown, setCountdown] = useState(() => Math.ceil(duration / 1000));
  const canReplace = routeState?.replace ? true : false; // If routeState has replace=true, we will replace the history entry instead of pushing a new one.
  useEffect(() => {
    if (!visible) return;
    const screen = screenRef.current;
    const previousFocus = document.activeElement;
    screen?.focus({ preventScroll: true });
    return () => {
      if (document.activeElement !== screen && document.activeElement !== document.body) return;
      const target = previousFocus instanceof HTMLElement && previousFocus.isConnected
        ? previousFocus : document.querySelector("main h1, h1, main");
      if (!(target instanceof HTMLElement)) return;
      const hadTabIndex = target.hasAttribute("tabindex");
      if (!hadTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (!hadTabIndex) target.removeAttribute("tabindex");
    };
  }, [visible]);
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
      ref={screenRef}
      tabIndex={-1}
      role="region"
      aria-labelledby={messageId}
      className={`fixed inset-0 z-50 flex overflow-y-auto overscroll-contain px-6 py-12 text-white outline-none ${backgroundClassName}`}
    >
      <div className="m-auto flex w-full max-w-lg flex-col items-center text-center">
        <div aria-hidden="true" className="mb-6 motion-safe:animate-[icon-pop-settle_0.55s_ease-out_both]">
          {icon || (
            <ThumbsUp
              size={iconSize}
              className="text-white"
              strokeWidth={2.5}
            />
          )}
        </div>
        <div id={messageId} role="status" aria-live="polite" aria-atomic="true" className="text-2xl font-bold text-white mb-2 text-center">
          {message}
        </div>
        {children && (
          <div className="mt-2 w-full flex flex-col items-center">
            {children}
          </div>
        )}

        {canShowCountdown && (
          <div aria-hidden="true" className="text-white text-base text-center mt-1">
            {countdownLabel} {countdown} second{countdown !== 1 ? "s" : ""}...
          </div>
        )}
      </div>
    </div>
  );
}

export { SuccessOverlay };
